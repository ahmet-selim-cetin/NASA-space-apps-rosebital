// Bake a sculpted terrain GLB (e.g. from Nomad Sculpt) into game-ready files:
//   <out>/terrain.json   size, cell, height scale, origin
//   <out>/height.bin     Uint16 heights (row-major, z rows then x), 1 m cells
//   <out>/color.png      surface colour from the model's vertex colours, 0.5 m per pixel
// Tiles that overlap are cross-faded instead of stacked, which removes the seams between them.
// usage: node tools/bake-terrain.mjs <in.glb> <outDir> [cropMetres] [splitX,feather] [onlyNodeName]
// onlyNodeName keeps just the nodes whose name contains that text (e.g. one tile of several).
// Two tiles that overlap and do not agree in height (e.g. the Moon model) can be joined along a line instead:
// splitX is the model x where the left tile hands over to the right one, feather is the half width of the hand-over (metres).
import fs from 'node:fs';
import zlib from 'node:zlib';

const [, , inPath, outDir] = process.argv;
const FINE = 0.5; // bake resolution (m)
const COARSE = 1; // height grid shipped to the game (m)
const FEATHER = 2; // m, cross-fade width inside each tile edge
const LIP = 1.5; // m, strip along each tile edge that is skipped where tiles overlap
const CROP = +process.argv[4] || 3; // m, trimmed off the ragged outer border (optional 3rd argument)
const SPLIT = process.argv[5] && process.argv[5] !== '-' ? process.argv[5].split(',').map(Number) : null; // [splitX, feather] (optional 4th argument)
const ONLY = process.argv[6] || ''; // optional 5th argument

const b = fs.readFileSync(inPath);
const jlen = b.readUInt32LE(12);
const j = JSON.parse(b.subarray(20, 20 + jlen).toString());
const binOff = 20 + jlen + 8;
const dv = new DataView(b.buffer, b.byteOffset, b.length);

function acc(i) {
  const a = j.accessors[i], bv = j.bufferViews[a.bufferView];
  const comps = { SCALAR: 1, VEC3: 3, VEC4: 4 }[a.type];
  const size = { 5125: 4, 5126: 4, 5123: 2, 5121: 1 }[a.componentType];
  const start = binOff + (bv.byteOffset || 0) + (a.byteOffset || 0);
  const stride = bv.byteStride || comps * size;
  const out = new Float32Array(a.count * comps);
  for (let k = 0; k < a.count; k++) for (let c = 0; c < comps; c++) {
    const o = start + k * stride + c * size;
    out[k * comps + c] = a.componentType === 5126 ? dv.getFloat32(o, true)
      : a.componentType === 5125 ? dv.getUint32(o, true)
      : a.componentType === 5123 ? dv.getUint16(o, true) / (a.normalized ? 65535 : 1)
      : dv.getUint8(o) / (a.normalized ? 255 : 1);
  }
  return out;
}

// 1. world-space vertices per tile
const tiles = [];
let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
for (const n of j.nodes) {
  if (n.mesh === undefined || (ONLY && !(n.name || '').includes(ONLY))) continue;
  const m = n.matrix || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ...(n.translation || [0, 0, 0]), 1];
  const prim = j.meshes[n.mesh].primitives[0];
  const P = acc(prim.attributes.POSITION), C = acc(prim.attributes.COLOR_0), I = acc(prim.indices);
  const W = new Float32Array(P.length);
  let tx0 = Infinity, tx1 = -Infinity, tz0 = Infinity, tz1 = -Infinity;
  for (let k = 0; k < P.length; k += 3) {
    const x = P[k], y = P[k + 1], z = P[k + 2];
    W[k] = m[0] * x + m[4] * y + m[8] * z + m[12];
    W[k + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    W[k + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    tx0 = Math.min(tx0, W[k]); tx1 = Math.max(tx1, W[k]); tz0 = Math.min(tz0, W[k + 2]); tz1 = Math.max(tz1, W[k + 2]);
  }
  minX = Math.min(minX, tx0); maxX = Math.max(maxX, tx1); minZ = Math.min(minZ, tz0); maxZ = Math.max(maxZ, tz1);
  tiles.push({ W, C, I, box: [tx0, tx1, tz0, tz1] });
}
const x0 = minX + CROP, z0 = minZ + CROP;
const nx = Math.floor((maxX - CROP - x0) / FINE) + 1, nz = Math.floor((maxZ - CROP - z0) / FINE) + 1;
console.log('tiles', tiles.length, 'area', (nx - 1) * FINE, 'x', (nz - 1) * FINE, 'm');

// 2. rasterise each tile's top surface, then cross-fade tiles with weights that fall to 0 at their edges
const accH = new Float64Array(nx * nz), accW = new Float64Array(nx * nz), accC = new Float64Array(nx * nz * 3);
const rawH = new Float64Array(nx * nz), rawN = new Float64Array(nx * nz), rawC = new Float64Array(nx * nz * 3);
const order = tiles.map((tl, i) => i).sort((a, b) => tiles[a].box[0] - tiles[b].box[0]); // left to right
for (const [ti, { W, C, I, box }] of tiles.entries()) {
  const H = new Float32Array(nx * nz).fill(-Infinity), RGB = new Float32Array(nx * nz * 3);
  for (let t = 0; t < I.length; t += 3) {
    const ia = I[t], ib = I[t + 1], ic = I[t + 2];
    const ax = (W[ia * 3] - x0) / FINE, az = (W[ia * 3 + 2] - z0) / FINE, ay = W[ia * 3 + 1];
    const bx = (W[ib * 3] - x0) / FINE, bz = (W[ib * 3 + 2] - z0) / FINE, by = W[ib * 3 + 1];
    const cx = (W[ic * 3] - x0) / FINE, cz = (W[ic * 3 + 2] - z0) / FINE, cy = W[ic * 3 + 1];
    const den = (bz - cz) * (ax - cx) + (cx - bx) * (az - cz);
    if (Math.abs(den) < 1e-12) continue;
    const gx0 = Math.max(0, Math.ceil(Math.min(ax, bx, cx))), gx1 = Math.min(nx - 1, Math.floor(Math.max(ax, bx, cx)));
    const gz0 = Math.max(0, Math.ceil(Math.min(az, bz, cz))), gz1 = Math.min(nz - 1, Math.floor(Math.max(az, bz, cz)));
    for (let gz = gz0; gz <= gz1; gz++) for (let gx = gx0; gx <= gx1; gx++) {
      const l1 = ((bz - cz) * (gx - cx) + (cx - bx) * (gz - cz)) / den;
      const l2 = ((cz - az) * (gx - cx) + (ax - cx) * (gz - cz)) / den;
      const l3 = 1 - l1 - l2;
      if (l1 < -1e-6 || l2 < -1e-6 || l3 < -1e-6) continue;
      const h = l1 * ay + l2 * by + l3 * cy, i = gz * nx + gx;
      if (h > H[i]) {
        H[i] = h;
        for (let k = 0; k < 3; k++) RGB[i * 3 + k] = l1 * C[ia * 4 + k] + l2 * C[ib * 4 + k] + l3 * C[ic * 4 + k];
      }
    }
  }
  for (let gz = 0; gz < nz; gz++) for (let gx = 0; gx < nx; gx++) {
    const i = gz * nx + gx; if (H[i] === -Infinity) continue;
    const wx = x0 + gx * FINE, wz = z0 + gz * FINE;
    const edge = Math.min(wx - box[0], box[1] - wx, wz - box[2], box[3] - wz);
    // each tile has a raised lip along its own edge: ignore its outer LIP metres where another tile takes over
    let w = Math.max(0, Math.min(1, (edge - LIP) / FEATHER)) ** 2;
    if (SPLIT && tiles.length === 2) { // hand over from the left tile to the right one around SPLIT[0], ignoring the tiles' own ragged edges
      const k = Math.min(1, Math.max(0, (wx + SPLIT[1] - SPLIT[0]) / (2 * SPLIT[1]))), sm = k * k * (3 - 2 * k);
      w = Math.max(1e-4, order[0] === ti ? 1 - sm : sm);
    }
    accH[i] += H[i] * w; accW[i] += w;
    for (let k = 0; k < 3; k++) accC[i * 3 + k] += RGB[i * 3 + k] * w;
    rawH[i] += H[i]; rawN[i]++;
    for (let k = 0; k < 3; k++) rawC[i * 3 + k] += RGB[i * 3 + k];
  }
}
const H = new Float32Array(nx * nz), RGB = new Float32Array(nx * nz * 3);
let holes = 0;
for (let i = 0; i < H.length; i++) {
  if (accW[i] > 0) { H[i] = accH[i] / accW[i]; for (let k = 0; k < 3; k++) RGB[i * 3 + k] = accC[i * 3 + k] / accW[i]; }
  else if (rawN[i] > 0) { H[i] = rawH[i] / rawN[i]; for (let k = 0; k < 3; k++) RGB[i * 3 + k] = rawC[i * 3 + k] / rawN[i]; } // outer border
  else { H[i] = NaN; holes++; }
}
// fill any remaining holes from neighbours
for (let pass = 0; pass < 80 && holes; pass++) {
  holes = 0;
  for (let gz = 0; gz < nz; gz++) for (let gx = 0; gx < nx; gx++) {
    const i = gz * nx + gx; if (!Number.isNaN(H[i])) continue;
    let s = 0, n = 0; const c = [0, 0, 0];
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const X = gx + dx, Z = gz + dz; if (X < 0 || Z < 0 || X >= nx || Z >= nz) continue;
      const k = Z * nx + X; if (Number.isNaN(H[k])) continue;
      s += H[k]; for (let q = 0; q < 3; q++) c[q] += RGB[k * 3 + q]; n++;
    }
    if (n) { H[i] = s / n; for (let q = 0; q < 3; q++) RGB[i * 3 + q] = c[q] / n; } else holes++;
  }
}
console.log('holes left', holes);

// 2b. the tiles do not meet exactly (small steps and lips along their edges): blur a band around each overlap
function blur(src, comps, sigmaCells) {
  const r = Math.ceil(sigmaCells * 2.5), k = [];
  let ks = 0; for (let i = -r; i <= r; i++) { const v = Math.exp(-(i * i) / (2 * sigmaCells * sigmaCells)); k.push(v); ks += v; }
  const tmp = new Float32Array(src.length), out = new Float32Array(src.length);
  for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) for (let c = 0; c < comps; c++) {
    let s = 0; for (let i = -r; i <= r; i++) { const X = Math.min(nx - 1, Math.max(0, x + i)); s += src[(z * nx + X) * comps + c] * k[i + r]; }
    tmp[(z * nx + x) * comps + c] = s / ks;
  }
  for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) for (let c = 0; c < comps; c++) {
    let s = 0; for (let i = -r; i <= r; i++) { const Z = Math.min(nz - 1, Math.max(0, z + i)); s += tmp[(Z * nx + x) * comps + c] * k[i + r]; }
    out[(z * nx + x) * comps + c] = s / ks;
  }
  return out;
}
const SEAM_BAND = 7; // m around each overlap that gets smoothed
const mask = new Float32Array(nx * nz);
for (let a = 0; a < tiles.length; a++) for (let c = a + 1; c < tiles.length; c++) {
  const A = tiles[a].box, B = tiles[c].box;
  const ox0 = Math.max(A[0], B[0]), ox1 = Math.min(A[1], B[1]), oz0 = Math.max(A[2], B[2]), oz1 = Math.min(A[3], B[3]);
  if (ox0 > ox1 || oz0 > oz1) continue; // not touching
  for (let gz = 0; gz < nz; gz++) for (let gx = 0; gx < nx; gx++) {
    const wx = x0 + gx * FINE, wz = z0 + gz * FINE;
    const d = Math.hypot(Math.max(0, ox0 - wx, wx - ox1), Math.max(0, oz0 - wz, wz - oz1));
    const m = 1 - Math.min(1, d / SEAM_BAND);
    const i = gz * nx + gx; mask[i] = Math.max(mask[i], m * m * (3 - 2 * m));
  }
}
const Hs = blur(H, 1, 2.5 / FINE), Cs = blur(RGB, 3, 1.5 / FINE);
for (let i = 0; i < H.length; i++) {
  H[i] += (Hs[i] - H[i]) * mask[i];
  for (let k = 0; k < 3; k++) RGB[i * 3 + k] += (Cs[i * 3 + k] - RGB[i * 3 + k]) * mask[i];
}

// 3. coarse height grid (box filter), centred on the area, median height at y = 0
const step = Math.round(COARSE / FINE);
const cx = Math.floor((nx - 1) / step) + 1, cz = Math.floor((nz - 1) / step) + 1;
const HC = new Float32Array(cx * cz);
for (let z = 0; z < cz; z++) for (let x = 0; x < cx; x++) {
  let s = 0, n = 0;
  for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
    const X = x * step + dx, Z = z * step + dz; if (X < 0 || Z < 0 || X >= nx || Z >= nz) continue;
    const w = (dx === 0 ? 2 : 1) * (dz === 0 ? 2 : 1); s += H[Z * nx + X] * w; n += w;
  }
  HC[z * cx + x] = s / n;
}
const sorted = Array.from(HC).sort((a, b2) => a - b2);
const median = sorted[sorted.length >> 1];
let hmin = Infinity, hmax = -Infinity;
for (let i = 0; i < HC.length; i++) { HC[i] -= median; hmin = Math.min(hmin, HC[i]); hmax = Math.max(hmax, HC[i]); }
const H16 = new Uint16Array(HC.length);
for (let i = 0; i < HC.length; i++) H16[i] = Math.round((HC[i] - hmin) / (hmax - hmin) * 65535);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(`${outDir}/height.bin`, Buffer.from(H16.buffer));
const meta = {
  source: inPath.split(/[\\/]/).pop(),
  width: (cx - 1) * COARSE, depth: (cz - 1) * COARSE, // metres, centred on the origin
  nx: cx, nz: cz, cell: COARSE, hmin: +hmin.toFixed(4), hmax: +hmax.toFixed(4),
  color: { nx, nz, cell: FINE },
};
fs.writeFileSync(`${outDir}/terrain.json`, JSON.stringify(meta, null, 1));

// 4. colour PNG (vertex colours are linear; PNG is sRGB)
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 0xff; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
const raw = Buffer.alloc((nx * 3 + 1) * nz);
for (let z = 0; z < nz; z++) {
  raw[z * (nx * 3 + 1)] = 0;
  for (let x = 0; x < nx; x++) for (let k = 0; k < 3; k++) {
    const v = Math.min(1, Math.max(0, RGB[(z * nx + x) * 3 + k]));
    const s = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
    raw[z * (nx * 3 + 1) + 1 + x * 3 + k] = Math.round(s * 255);
  }
}
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(nx, 0); ihdr.writeUInt32BE(nz, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
fs.writeFileSync(`${outDir}/color.png`, png);
console.log(meta, 'height.bin', H16.byteLength, 'color.png', png.length);
