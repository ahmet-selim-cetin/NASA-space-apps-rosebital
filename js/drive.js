import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ROVER_URL = 'models/nasa_opportunity_rover.glb';
const ROVER_HEIGHT = 1.55; // metres, wheels to top of the camera mast
const WORLD_SIZE = 700; // metres
// The team's sculpted ground ("Mars - Spirit Yolu (part 4)"), baked by tools/bake-terrain.mjs into a height grid + colour map.
const TERRAIN_URL = 'models/terrain/';
const EDGE_MARGIN = 8; // metres; the rover is turned back this far inside the edge of the team's terrain
const EDGE_BLEND = 45; // metres; outside the terrain the ground eases into generated hills for the horizon
const MAX_GRADE = 0.62; // rise/run the rover can climb (~32°); steeper ground stops it

// ---------- Ingenuity: the last flight ----------
const HELI_URL = 'models/ingenuity_mars_helicopter.glb'; // "Ingenuity Mars helicopter" by Cybertron B-127, CC BY 4.0
const HELI_SPAN = 1.21; // metres, blade tip to blade tip
// Timeline in flight-clock seconds, from NASA/JPL's account of flight 72 (January 18, 2024): the navigation system lost the
// surface patterns about 20 s after takeoff, the descent began at 19 s and the helicopter was back on the ground at 32 s.
// The game runs `K` times slower than that clock so there is time to look around. What the player chooses (height, direction)
// changes the view, never the ending.
const FLIGHT = {
  K: 1.5,
  start: { x: -38, z: -34, heading: -2.3 }, // facing the middle of the terrain
  ceiling: 12, floor: 2, // metres above the ground; flight 72 reached 12 m
  maxSpeed: 3, driftSpeed: 1.8, // m/s (game time)
  navFade: [14, 20], descentAt: 19, landAt: 32,
};
const FLIGHT_LOG = [
  { c: 0.4, key: 'fly.log.takeoff' },
  { c: 10, key: 'fly.log.hover' },
  { c: 15.5, key: 'fly.log.nav' },
  { c: FLIGHT.descentAt, key: 'fly.log.descent' },
];
const MAX_SPEED = 1.6; // scene m/s (time-compressed; the real rover's top speed was 5 cm/s)
const REAL_TOP_SPEED_CM = 5;
const TRACK_SPACING = 0.22;
const MAX_TRACKS = 5000;
const CLIMB_LIMIT = 0.3; // rocks up to this size are driven over; bigger ones block the rover
const ROCK_CELL = 4; // metres, spatial grid for rock lookups
const DUST_COUNT = 2600;
const DUST_BOX = 22; // metres, half-size of the blowing-dust volume around the camera

// The storm, in seconds since the drive began. It always ends the same way: this is a memorial, not a challenge.
// Real anchors: orbiter detection on sol 5100 (May 30, 2018), sky opacity (tau) 10.8 and last signal on sol 5111 (June 10, 2018).
const STORM_LOG = [
  { t: 12, key: 'log.detect' },
  { t: 34, key: 'log.rising' },
  { t: 52, key: 'log.panels' },
  { t: 70, key: 'log.low' },
  { t: 90, key: 'log.fault' },
  { t: 103, key: 'log.last' },
];
const STORM_END = 112;
const SOL_START = 5100, SOL_END = 5111;
const ramp = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);

// ---------- Terrain height field ----------
function hash(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, octaves = 4) {
  let sum = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) { sum += amp * vnoise(x * freq, y * freq); amp *= 0.5; freq *= 2.03; }
  return sum; // ~0..1
}

const CRATERS = [
  { x: 55, z: -95, r: 30, depth: 4.5 },
  { x: -125, z: 35, r: 46, depth: 7 },
  { x: 35, z: 150, r: 17, depth: 2.2 },
  { x: -45, z: -175, r: 22, depth: 3 },
  { x: 170, z: 60, r: 26, depth: 3.5 },
  { x: -30, z: -48, r: 6, depth: 0.7 },
  { x: 22, z: -28, r: 3.5, depth: 0.4 },
  { x: -70, z: 120, r: 9, depth: 1.1 },
];

// Height grid of the team's terrain, centred on the origin. null until loaded.
let field = null;

async function loadField() {
  const meta = await (await fetch(`${TERRAIN_URL}terrain.json`)).json();
  const raw = new Uint16Array(await (await fetch(`${TERRAIN_URL}height.bin`)).arrayBuffer());
  const h = new Float32Array(raw.length);
  for (let i = 0; i < raw.length; i++) h[i] = meta.hmin + (raw[i] / 65535) * (meta.hmax - meta.hmin);
  const img = new Image();
  img.src = `${TERRAIN_URL}color.png`;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const color = ctx.getImageData(0, 0, c.width, c.height);
  field = { ...meta, h, color, halfW: meta.width / 2, halfD: meta.depth / 2 };
}

function fieldHeight(x, z) {
  const f = field;
  const gx = THREE.MathUtils.clamp((x + f.halfW) / f.cell, 0, f.nx - 1.0001);
  const gz = THREE.MathUtils.clamp((z + f.halfD) / f.cell, 0, f.nz - 1.0001);
  const ix = Math.floor(gx), iz = Math.floor(gz), u = gx - ix, v = gz - iz;
  const i = iz * f.nx + ix;
  const a = f.h[i], b = f.h[i + 1], c = f.h[i + f.nx], d = f.h[i + f.nx + 1];
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// Surface colour (linear RGB) of the team's terrain at a point.
function fieldColor(x, z, out) {
  const f = field, cc = f.color;
  const gx = THREE.MathUtils.clamp(Math.round(((x + f.halfW) / f.width) * (cc.width - 1)), 0, cc.width - 1);
  const gz = THREE.MathUtils.clamp(Math.round(((z + f.halfD) / f.depth) * (cc.height - 1)), 0, cc.height - 1);
  const i = (gz * cc.width + gx) * 4;
  return out.setRGB(cc.data[i] / 255, cc.data[i + 1] / 255, cc.data[i + 2] / 255, THREE.SRGBColorSpace);
}

// Distance (m) outside the team's terrain; 0 inside.
function outside(x, z) {
  if (!field) return 0;
  const dx = Math.max(0, Math.abs(x) - field.halfW), dz = Math.max(0, Math.abs(z) - field.halfD);
  return Math.hypot(dx, dz);
}

export function terrainHeight(x, z) {
  if (!field) return generatedHeight(x, z);
  const o = outside(x, z);
  if (o <= 0) return fieldHeight(x, z);
  return THREE.MathUtils.lerp(fieldHeight(x, z), generatedHeight(x, z), ramp(0, EDGE_BLEND, o));
}

function generatedHeight(x, z) {
  let h = (fbm(x * 0.004 + 11.3, z * 0.004 + 4.7) - 0.5) * 9; // broad swells
  h += (fbm(x * 0.045, z * 0.045, 3) - 0.5) * 0.5; // lumps
  // wind ripples, stronger in patches
  const patch = Math.max(0, fbm(x * 0.012 + 40, z * 0.012 + 80, 2) - 0.42) * 2.4;
  h += Math.sin((x * 0.92 + z * 0.38) * 1.15 + vnoise(x * 0.05, z * 0.05) * 5) * 0.07 * patch;
  for (const c of CRATERS) {
    const d = Math.hypot(x - c.x, z - c.z) / c.r;
    if (d < 2.2) {
      if (d < 1) h -= c.depth * (1 - d * d) ** 1.4;
      h += c.depth * 0.22 * Math.exp(-(((d - 1) / 0.28) ** 2)); // raised rim
    }
  }
  return h;
}

function makeGroundTexture() {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // pure per-pixel grain so the texture tiles without seams
      const v = 170 + Math.random() * 85;
      const i = (y * size + x) * 4;
      img.data[i] = v; img.data[i + 1] = v * 0.97; img.data[i + 2] = v * 0.93; img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  // pebbles
  for (let i = 0; i < 260; i++) {
    const r = 0.8 + Math.random() * 2.4;
    ctx.fillStyle = `rgba(${60 + Math.random() * 40}, ${50 + Math.random() * 30}, ${48 + Math.random() * 25}, ${0.35 + Math.random() * 0.4})`;
    ctx.beginPath();
    ctx.ellipse(6 + Math.random() * (size - 12), 6 + Math.random() * (size - 12), r, r * (0.6 + Math.random() * 0.4), Math.random() * 3, 0, 7);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(WORLD_SIZE / 5, WORLD_SIZE / 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// ---------- Simulation ----------
export class DriveSim {
  constructor(container, hud) {
    this.container = container;
    this.hud = hud; // { speed, heading, trip, battery, solar, tau, temp, speedBar, batteryBar }
    this.running = false;
    this.loaded = false;
    this.keys = new Set();
    this.touch = { fwd: 0, turn: 0, alt: 0 };
    this.mission = 'opportunity'; // 'opportunity' (drive) | 'ingenuity' (flight)
    this.envBuilt = false;
    this.f = null; // flight state
    this.dustAmount = { value: 0 }; // dust settled on the rover's panels (0..1)
    this.look = { yaw: 0, pitch: 0, dragging: false, idle: 0 };
    this.view = 'first'; // 'first' | 'chase'

    // Rover state. `power` (0..1) scales speed; the storm sequence drives it down.
    this.state = { x: 0, z: 0, heading: 0, speed: 0, trip: 0, power: 1, battery: 100, solar: 100, tau: 0.6, temp: -28, sol: SOL_START };
    this.storm = { t: 0, next: 0, ended: false };
    this.timeScale = 1; // >1 fast-forwards the storm (for testing)
    this.onLog = null; // (i18nKey) => void
    this.onEnd = null; // () => void, fired once when the rover has gone silent
    this.onWind = null; // (level 0..1, master 0..1) => void
    this.lastTrack = new THREE.Vector2(0, 0);
    this.trackCount = 0;
    this.rockGrid = new Map(); // "cx,cz" -> [{ x, z, size }]
    this.roverY = 0;
  }

  // Ground height including small rocks, so the wheels ride up and over them.
  surfaceHeight(x, z) {
    let h = terrainHeight(x, z);
    const cx = Math.floor(x / ROCK_CELL), cz = Math.floor(z / ROCK_CELL);
    let bump = 0;
    for (let i = cx - 1; i <= cx + 1; i++) {
      for (let j = cz - 1; j <= cz + 1; j++) {
        const cell = this.rockGrid.get(`${i},${j}`);
        if (!cell) continue;
        for (const r of cell) {
          if (r.size > CLIMB_LIMIT) continue;
          const d = Math.hypot(x - r.x, z - r.z) / (r.size * 0.95);
          if (d < 1) bump = Math.max(bump, r.size * 0.8 * (1 - d * d) ** 0.6);
        }
      }
    }
    return h + bump;
  }

  // Push the rover back out of any boulder it has driven into. Returns true when blocked.
  #collideBoulders(pos) {
    let hit = false;
    const cx = Math.floor(pos.x / ROCK_CELL), cz = Math.floor(pos.z / ROCK_CELL);
    for (let i = cx - 1; i <= cx + 1; i++) {
      for (let j = cz - 1; j <= cz + 1; j++) {
        const cell = this.rockGrid.get(`${i},${j}`);
        if (!cell) continue;
        for (const r of cell) {
          if (r.size <= CLIMB_LIMIT) continue;
          const min = r.size * 0.85 + 0.8; // boulder radius + rover half-width
          const dx = pos.x - r.x, dz = pos.z - r.z;
          const d = Math.hypot(dx, dz);
          if (d < min && d > 1e-4) { pos.x = r.x + (dx / d) * min; pos.z = r.z + (dz / d) * min; hit = true; }
        }
      }
    }
    return hit;
  }

  // Pick the vehicle before load()/start(): 'opportunity' drives, 'ingenuity' flies.
  setMission(id) { this.mission = id === 'ingenuity' ? 'ingenuity' : 'opportunity'; }

  async load(onProgress) {
    if (!this.envBuilt) {
      this.#initRenderer();
      this.#buildSky();
      this.#buildLights();
      await loadField();
      this.#buildTerrain();
      this.#buildRocks();
      this.#buildTracks();
      this.#buildDust();
      this.#bindInput();
      this.envBuilt = true;
    }
    if (this.mission === 'ingenuity') { if (!this.heli) await this.#loadHeli(onProgress); }
    else if (!this.rover) await this.#loadRover(onProgress);
    this.resize();
    this.loaded = true;
  }

  start() {
    if (this.mission === 'ingenuity') return this.#startFlight();
    if (this.heli) this.heli.visible = false;
    if (this.puffs) this.puffs.points.visible = false;
    this.rover.visible = true;
    this.hud?.fTelemetry && (this.hud.fTelemetry.style.opacity = '1');
    Object.assign(this.state, { x: 0, z: 0, heading: 0, speed: 0, trip: 0 });
    this.storm = { t: 0, next: 0, ended: false };
    this.look.yaw = 0; this.look.pitch = 0;
    this.trackCount = 0;
    this.tracks.count = 0;
    this.lastTrack.set(0, 0);
    this.rover.quaternion.identity();
    this.running = true;
    this.container.classList.add('active');
    this.resize();
    this.#placeRover(null);
    this.#updateStorm(0);
  }

  stop() {
    this.running = false;
    this.keys.clear();
    this.container.classList.remove('active');
  }

  toggleView() {
    this.view = this.view === 'first' ? 'chase' : 'first';
    this.look.yaw = 0; this.look.pitch = 0;
  }

  resize() {
    if (!this.renderer) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  update(dt) {
    if (!this.running) return;
    if (this.mission === 'ingenuity') return this.#updateFlight(dt);
    const s = this.state;

    // --- input ---
    const k = this.keys;
    const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + this.touch.fwd;
    const turn = (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) - (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) + this.touch.turn;

    this.#updateStorm(dt);

    // --- motion ---
    const target = THREE.MathUtils.clamp(fwd, -0.5, 1) * MAX_SPEED * s.power;
    const rate = Math.abs(target) > Math.abs(s.speed) ? 1.4 : 2.6; // slow to spin up, quicker to stop
    s.speed += THREE.MathUtils.clamp(target - s.speed, -rate * dt, rate * dt);
    const turnRate = 0.75 * (0.35 + 0.65 * Math.min(1, Math.abs(s.speed) / MAX_SPEED + 0.3)) * s.power;
    s.heading += turn * turnRate * dt * (s.speed < -0.05 ? -1 : 1);

    const dx = -Math.sin(s.heading) * s.speed * dt;
    const dz = -Math.cos(s.heading) * s.speed * dt;
    let nx = s.x + dx, nz = s.z + dz;
    // stay on the team's terrain
    const lx = field.halfW - EDGE_MARGIN, lz = field.halfD - EDGE_MARGIN;
    if (Math.abs(nx) > lx || Math.abs(nz) > lz) {
      nx = THREE.MathUtils.clamp(nx, -lx, lx); nz = THREE.MathUtils.clamp(nz, -lz, lz); s.speed *= 0.9;
    }
    // too steep to climb (crater walls, the big rock): stop at the foot of the slope
    const step = Math.hypot(dx, dz);
    if (step > 1e-5) {
      const look = 1.2 * Math.sign(s.speed);
      const ax = s.x - Math.sin(s.heading) * look, az = s.z - Math.cos(s.heading) * look;
      if ((terrainHeight(ax, az) - terrainHeight(s.x, s.z)) / 1.2 > MAX_GRADE) { nx = s.x; nz = s.z; s.speed *= 0.5; }
    }
    const p = { x: nx, z: nz };
    if (this.#collideBoulders(p)) { nx = p.x; nz = p.z; s.speed *= 0.6; }
    s.trip += Math.hypot(nx - s.x, nz - s.z);
    s.x = nx; s.z = nz;

    this.#placeRover(dt);
    this.#dropTracks();
    this.#updateCamera(dt);
    this.#updateHud();

    // keep the shadow frustum centred on the rover
    this.sun.position.copy(this.rover.position).addScaledVector(this.sunDir, 60);
    this.sun.target.position.copy(this.rover.position);
    this.sky.position.copy(this.camera.getWorldPosition(this._v1));

    this.renderer.render(this.scene, this.camera);
  }

  // ---------- internals ----------
  #initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.haze = new THREE.Color(0xc9a682);
    this.scene.fog = new THREE.FogExp2(this.haze, 0.0055);
    this.haze = this.scene.fog.color; // FogExp2 copies the colour; keep a handle on the live one
    this.camera = new THREE.PerspectiveCamera(62, 1, 0.05, 1500);
    this._v1 = new THREE.Vector3();
    this._v2 = new THREE.Vector3();
    this._q = new THREE.Quaternion();
    window.addEventListener('resize', () => this.resize());
  }

  #buildSky() {
    this.sunDir = new THREE.Vector3(-0.45, 0.62, -0.64).normalize();
    this.skyUniforms = {
      horizon: { value: this.haze.clone() },
      zenith: { value: new THREE.Color(0x8f6f58) },
      sunDir: { value: this.sunDir },
      sunStrength: { value: 1 },
      front: { value: 0 }, // 0..1 height of the approaching dust wall
      stormDir: { value: new THREE.Vector2(-0.29, -0.96) }, // the storm comes from ahead (north)
      stormCol: { value: new THREE.Color(0x5c3a22) },
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      vertexShader: /* glsl */`
        varying vec3 vDir;
        void main() { vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`
        uniform vec3 horizon; uniform vec3 zenith; uniform vec3 sunDir; uniform float sunStrength;
        uniform float front; uniform vec2 stormDir; uniform vec3 stormCol;
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float t = pow(clamp(d.y, 0.0, 1.0), 0.55);
          vec3 col = mix(horizon, zenith, t);
          float s = max(dot(d, sunDir), 0.0);
          // Martian sun: small disc with a cool, bluish forward-scatter glow
          col += sunStrength * (vec3(0.75, 0.82, 0.95) * pow(s, 24.0) * 0.45 + vec3(1.0, 0.97, 0.9) * smoothstep(0.9993, 0.9997, s) * 2.5);
          // dust wall: rises from the horizon, tallest in the direction the storm comes from
          float toward = 0.5 + 0.5 * dot(normalize(d.xz + vec2(1e-5)), stormDir);
          float top = front * 0.03 + front * front * 1.3 * toward * toward;
          float wall = (1.0 - smoothstep(top * 0.3, top + 0.07, d.y)) * min(1.0, front * 4.0);
          col = mix(col, stormCol, wall);
          col = mix(col, horizon, 1.0 - smoothstep(-0.08, 0.0, d.y));
          gl_FragColor = vec4(col, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), mat);
    this.scene.add(this.sky);
  }

  #buildLights() {
    this.hemi = new THREE.HemisphereLight(0xe6c6a4, 0x6b4630, 1.15);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xfff0dc, 2.4);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    const cam = this.sun.shadow.camera;
    cam.left = -14; cam.right = 14; cam.top = 14; cam.bottom = -14; cam.near = 1; cam.far = 140;
    this.sun.shadow.bias = -0.0006;
    this.sun.shadow.normalBias = 0.04;
    this.scene.add(this.sun, this.sun.target);
  }

  // Two pieces of ground: the team's terrain at 1 m detail, and a coarser ring of generated hills around it
  // that starts at the terrain's edge height and fades to the horizon.
  #buildTerrain() {
    const tex = makeGroundTexture();
    // the grain texture averages ~0.83, so lift the model's colours to keep their brightness
    const lift = 1.15;
    const dark = new THREE.Color(0x6e4329), light = new THREE.Color(0xb98358), c = new THREE.Color(), edge = new THREE.Color();

    const build = (w, d, sx, sz) => {
      // same grain size (one tile per 5 m) on both pieces
      const grain = tex.clone();
      grain.repeat.set(w / 5, d / 5);
      const mat = new THREE.MeshStandardMaterial({ map: grain, bumpMap: grain, bumpScale: 0.6, vertexColors: true, roughness: 1, metalness: 0 });
      const geo = new THREE.PlaneGeometry(w, d, sx, sz);
      geo.rotateX(-Math.PI / 2);
      const pos = geo.attributes.position;
      const colors = new Float32Array(pos.count * 3);
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        pos.setY(i, terrainHeight(x, z));
        const o = outside(x, z);
        fieldColor(x, z, edge).multiplyScalar(lift);
        if (o > 0) {
          const t = THREE.MathUtils.clamp(fbm(x * 0.02 + 7, z * 0.02 + 3, 3) * 1.5 - 0.3, 0, 1);
          c.copy(dark).lerp(light, t).lerp(edge, 1 - ramp(0, EDGE_BLEND, o));
        } else c.copy(edge);
        colors.set([c.r, c.g, c.b], i * 3);
      }
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      return mesh;
    };

    const f = field;
    this.ground = build(f.width, f.depth, f.nx - 1, f.nz - 1);
    const ring = build(WORLD_SIZE, WORLD_SIZE, 320, 320);
    // keep a ring triangle if any corner is outside the terrain (a thin overlap hides the joint)
    const p = ring.geometry.attributes.position;
    const idx = ring.geometry.index.array, out = [];
    for (let t = 0; t < idx.length; t += 3) {
      if ([idx[t], idx[t + 1], idx[t + 2]].some((v) => outside(p.getX(v), p.getZ(v)) > 0)) out.push(idx[t], idx[t + 1], idx[t + 2]);
    }
    ring.geometry.setIndex(out);
    // sit the ring a hair lower so it never pokes through the detailed ground where they overlap
    ring.position.y = -0.03;
    this.groundRing = ring;
  }

  #buildRocks() {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const k = 0.72 + hash(p.getX(i) * 9.1 + p.getZ(i) * 3.3, p.getY(i) * 7.7) * 0.5;
      p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.7, p.getZ(i) * k);
    }
    geo.computeVertexNormals();
    const count = 650;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true });
    this.rocks = new THREE.InstancedMesh(geo, mat, count);
    this.rocks.castShadow = true;
    this.rocks.receiveShadow = true;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), t = new THREE.Vector3(), e = new THREE.Euler();
    const col = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // denser near the start so there is always something to drive past
      const rad = 5 + (hash(i, 1.7) ** 1.5) * (WORLD_SIZE * 0.48);
      const ang = hash(i, 9.2) * Math.PI * 2;
      const x = Math.cos(ang) * rad, z = Math.sin(ang) * rad;
      const big = rad > 30 && hash(i, 5.5) > 0.975;
      const size = big ? 0.35 + hash(i, 3.1) * 0.6 : 0.03 + hash(i, 3.1) ** 2 * 0.2;
      // no rocks hanging on steep walls
      const grade = Math.hypot(terrainHeight(x + 0.5, z) - terrainHeight(x - 0.5, z), terrainHeight(x, z + 0.5) - terrainHeight(x, z - 0.5));
      if (grade > 0.8) { this.rocks.setMatrixAt(i, m.makeScale(0, 0, 0)); continue; }
      t.set(x, terrainHeight(x, z) + size * 0.15, z);
      e.set(hash(i, 2.2) * 6.28, hash(i, 4.4) * 6.28, hash(i, 6.6) * 6.28);
      q.setFromEuler(e);
      s.setScalar(size);
      this.rocks.setMatrixAt(i, m.compose(t, q, s));
      const key = `${Math.floor(x / ROCK_CELL)},${Math.floor(z / ROCK_CELL)}`;
      if (!this.rockGrid.has(key)) this.rockGrid.set(key, []);
      this.rockGrid.get(key).push({ x, z, size });
      col.setHSL(0.05 + hash(i, 8.8) * 0.03, 0.22 + hash(i, 1.1) * 0.15, 0.1 + hash(i, 7.3) * 0.1);
      this.rocks.setColorAt(i, col);
    }
    this.scene.add(this.rocks);
  }

  #buildTracks() {
    const geo = new THREE.PlaneGeometry(0.17, TRACK_SPACING * 1.05);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x2e1a10, transparent: true, opacity: 0.42, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    this.tracks = new THREE.InstancedMesh(geo, mat, MAX_TRACKS);
    this.tracks.count = 0;
    this.tracks.frustumCulled = false;
    this.scene.add(this.tracks);
  }

  async #loadRover(onProgress) {
    const gltf = await new GLTFLoader().loadAsync(ROVER_URL, (e) => { if (e.total) onProgress?.(e.loaded / e.total); });
    const model = gltf.scene;
    let box = new THREE.Box3().setFromObject(model);
    const scale = ROVER_HEIGHT / (box.max.y - box.min.y);
    model.scale.setScalar(scale);
    box = new THREE.Box3().setFromObject(model);
    model.position.y = -box.min.y;
    this.roverMaterials = [];
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      // The export is near-mirror metal, which renders black without an environment map.
      o.material.metalness = Math.min(o.material.metalness, 0.3);
      o.material.roughness = Math.max(o.material.roughness, 0.6);
      o.material.metalnessMap = null;
      o.material.roughnessMap = null;
      this.roverMaterials.push(o.material);
      // Dust settles on upward-facing surfaces as `uDust` rises.
      o.material.onBeforeCompile = (shader) => {
        shader.uniforms.uDust = this.dustAmount;
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', 'varying float vDustUp;\nvarying vec3 vDustPos;\n#include <common>')
          .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvDustUp = normalize(mat3(modelMatrix) * objectNormal).y;\nvDustPos = position;');
        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', 'uniform float uDust;\nvarying float vDustUp;\nvarying vec3 vDustPos;\n#include <common>')
          .replace('#include <map_fragment>', `#include <map_fragment>
            float dustN = 0.5 + 0.25 * sin(vDustPos.x * 1.7 + vDustPos.y * 0.6) + 0.25 * sin(vDustPos.y * 2.3 - vDustPos.x * 0.9);
            float dustA = clamp(uDust * 1.6 - 0.6 * dustN, 0.0, 1.0) * smoothstep(-0.2, 0.7, vDustUp);
            diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.52, 0.31, 0.17), dustA * 0.96);`);
      };
    });

    this.rover = new THREE.Group();
    this.rover.add(model);
    this.scene.add(this.rover);

    // Camera rig sits just above the mast head (the rover's own "eyes") so looking back shows the deck; the model faces -Z.
    this.mast = new THREE.Object3D();
    this.mast.position.set(0, ROVER_HEIGHT + 0.1, -0.25);
    this.rover.add(this.mast);
    this.halfTrack = (box.max.x - box.min.x) * 0.27; // wheels sit well inside the solar-panel span
    this.halfBase = (box.max.z - box.min.z) * 0.33; // front-to-rear wheel distance / 2
  }

  // Pose the rover from the ground height under its four corner wheels, so it pitches and
  // rolls over slopes and rocks. dt === null snaps instantly (used when the drive starts).
  async #loadHeli(onProgress) {
    const gltf = await new GLTFLoader().loadAsync(HELI_URL, (e) => { if (e.total) onProgress?.(e.loaded / e.total); });
    const model = gltf.scene;
    let box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(HELI_SPAN / Math.max(size.x, size.z));
    box = new THREE.Box3().setFromObject(model);
    model.position.y = -box.min.y; // feet on the ground
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      // like the rover: near-mirror metal renders black without an environment map
      o.material.metalness = Math.min(o.material.metalness, 0.3);
      o.material.roughness = Math.max(o.material.roughness, 0.6);
      o.material.metalnessMap = null;
      o.material.roughnessMap = null;
    });

    this.heli = new THREE.Group();
    this.heli.add(model);
    this.scene.add(this.heli);
    this.heli.updateMatrixWorld(true);

    // The two rotors spin about their own hubs: find each one's flat axis and give it a pivot at its centre.
    this.rotors = [];
    const nodes = [];
    model.traverse((o) => { if (/^rotors_0[12]/.test(o.name)) nodes.push(o); });
    nodes.forEach((node, i) => {
      const b = new THREE.Box3().setFromObject(node);
      const sz = b.getSize(new THREE.Vector3()), ctr = b.getCenter(new THREE.Vector3());
      const k = sz.x <= sz.y && sz.x <= sz.z ? 'x' : sz.y <= sz.z ? 'y' : 'z'; // the thin direction is the spin axis
      const parent = node.parent;
      const pivot = new THREE.Object3D();
      pivot.position.copy(parent.worldToLocal(ctr.clone()));
      parent.add(pivot);
      pivot.updateMatrixWorld(true);
      pivot.attach(node);
      const axis = new THREE.Vector3(k === 'x' ? 1 : 0, k === 'y' ? 1 : 0, k === 'z' ? 1 : 0)
        .transformDirection(new THREE.Matrix4().copy(parent.matrixWorld).invert());
      this.rotors.push({ pivot, axis, dir: i % 2 ? -1 : 1 });
    });
  }

  // ---------- Flight 72 ----------
  #startFlight() {
    const F = FLIGHT;
    if (this.rover) this.rover.visible = false;
    this.heli.visible = true;
    this.tracks.count = 0;
    for (const r of this.rotors) { r.pivot.scale.setScalar(1); r.pivot.rotation.set(0, 0, 0); }
    this.f = {
      t: 0, x: F.start.x, z: F.start.z, alt: 0, heading: F.start.heading, speed: 0, target: 8, spin: 0, spinAngle: 0,
      drift: null, descentT0: -1, descentAlt: 0, crashed: false, impactT: 0, commsT: -1, logNext: 0, ended: false, nav: 1,
      tilt: { p: 0, r: 0 }, bounce: 0, vx: 0, vz: 0, slide: null, camTilt: { p: 0, r: 0 }, unstable: 0, wob: { p: 0, r: 0 }, burst: false,
    };
    this.look.yaw = 0; this.look.pitch = 0;
    this.fSpeed = 0;
    this.#resetPuffs();
    // a clear, calm sky: none of the storm
    this.haze.copy(this.hazeClear);
    this.scene.fog.density = 0.0055;
    this.skyUniforms.horizon.value.copy(this.haze);
    this.skyUniforms.zenith.value.copy(this.zenithClear);
    this.skyUniforms.stormCol.value.set(0x5c3a22);
    this.skyUniforms.front.value = 0;
    this.skyUniforms.sunStrength.value = 1;
    this.sun.intensity = 2.4;
    this.hemi.intensity = 1.15;
    this.dust.visible = false;
    this.dustAmount.value = 0;
    this.windLevel = 0.15;
    const h = this.hud;
    if (h?.fxDust) {
      h.fxDust.style.opacity = '0'; h.fxNoise.style.opacity = '0'; h.fxBlack.style.height = '0%';
      h.telemetry.style.opacity = '1';
      if (h.fTelemetry) h.fTelemetry.style.opacity = '1';
    }
    this.running = true;
    this.container.classList.add('active');
    this.resize();
    this.#poseHeli(0);
    this.#updateFlightCamera(0);
  }

  #updateFlight(dt) {
    const F = FLIGHT, f = this.f;
    const gdt = dt * this.timeScale;
    f.t += gdt;
    const c = f.t / F.K; // the flight clock, in the seconds NASA reports

    // --- what the player asks for (only until the descent starts) ---
    const k = this.keys;
    const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + this.touch.fwd;
    const turn = (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) - (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) + this.touch.turn;
    const lift = (k.has('Space') ? 1 : 0) - (k.has('ShiftLeft') || k.has('ShiftRight') ? 1 : 0) + this.touch.alt;
    const control = c < F.descentAt && !f.crashed;

    f.spin = f.crashed ? Math.max(0, f.spin - gdt * 0.9) : Math.min(1, f.t / 2.5);
    f.nav = f.crashed ? 0 : 1 - THREE.MathUtils.smoothstep(c, F.navFade[0], F.navFade[1]);

    // --- altitude ---
    let tau = 0; // 0..1 through the descent
    if (control) {
      f.target = THREE.MathUtils.clamp(f.target + lift * 3 * gdt, F.floor, F.ceiling);
      if (f.t > 2.5) f.alt += THREE.MathUtils.clamp(f.target - f.alt, -1.5 * gdt, 1.5 * gdt);
    } else if (!f.crashed) {
      // no patterns to follow: the descent starts now and ends at the 32 s mark, whatever the height.
      // It starts slowly and speeds up (alt ~ 1 - tau^2.5), so the ground arrives fast.
      if (f.descentT0 < 0) { f.descentT0 = f.t; f.descentAlt = f.alt; }
      tau = THREE.MathUtils.clamp((f.t - f.descentT0) / ((F.landAt - F.descentAt) * F.K), 0, 1);
      f.alt = f.descentAlt * (1 - tau ** 2.5);
      if (f.alt <= 1 && f.commsT < 0) { f.commsT = f.t; this.onLog?.('fly.log.comms'); }
      if (f.alt <= 0) this.#impact();
    }

    // it gets shakier as the navigation loses its patterns, and more so on the way down
    f.unstable = f.crashed ? 0 : Math.min(1, (1 - f.nav) * 0.5 + tau * 0.6);

    // --- horizontal motion ---
    let vx = 0, vz = 0;
    if (control) {
      const target = THREE.MathUtils.clamp(fwd, -0.5, 1) * F.maxSpeed;
      f.speed += THREE.MathUtils.clamp(target - f.speed, -2 * gdt, 2 * gdt);
      f.heading += turn * 0.9 * gdt;
      vx = -Math.sin(f.heading) * f.speed; vz = -Math.cos(f.heading) * f.speed;
    } else if (!f.crashed) {
      // The navigation system has lost its sense of motion. The helicopter keeps going the way it was moving (or the way it
      // faces, if it was hovering) and its speed picks up from where it is now, so nothing jumps.
      if (!f.drift) {
        const sp0 = Math.hypot(f.vx, f.vz);
        const d0x = sp0 > 0.3 ? f.vx / sp0 : -Math.sin(f.heading), d0z = sp0 > 0.3 ? f.vz / sp0 : -Math.cos(f.heading);
        let dx = d0x, dz = d0z, sp = Math.max(sp0, F.driftSpeed);
        // The whole drift covers about 30 times its starting speed (plus what its current speed still carries it).
        // Keep the touchdown inside the terrain, so it never runs into the edge: slow it down, and if the edge is too
        // close, turn it toward the middle.
        const lx = field.halfW - EDGE_MARGIN, lz = field.halfD - EDGE_MARGIN;
        const room = (ux, uz) => Math.min(ux > 0 ? (lx - f.x) / ux : ux < 0 ? (-lx - f.x) / ux : Infinity, uz > 0 ? (lz - f.z) / uz : uz < 0 ? (-lz - f.z) / uz : Infinity);
        const allowed = (ux, uz) => (room(ux, uz) - 4 - (sp0 * sp0) / 2.6) / 30; // fastest start speed that still lands inside
        const m = Math.hypot(f.x, f.z) || 1, cx = -f.x / m, cz = -f.z / m; // toward the middle
        for (let k = 1; k <= 8 && allowed(dx, dz) < 0.8; k++) {
          const w = k / 8;
          dx = d0x * (1 - w) + cx * w; dz = d0z * (1 - w) + cz * w;
          const n = Math.hypot(dx, dz);
          if (n < 0.2) { dx = cx; dz = cz; } else { dx /= n; dz /= n; }
        }
        sp = THREE.MathUtils.clamp(allowed(dx, dz), 0.5, sp);
        f.drift = { x: dx, z: dz, sp };
      }
      const fast = 1 + 0.94 * tau; // the error in its speed estimate grows: ~1.8 m/s becomes ~3.5 m/s at touchdown
      const tx = f.drift.x * f.drift.sp * fast, tz = f.drift.z * f.drift.sp * fast, a = 1.3 * gdt; // m/s per second
      vx = f.vx + THREE.MathUtils.clamp(tx - f.vx, -a, a);
      vz = f.vz + THREE.MathUtils.clamp(tz - f.vz, -a, a);
    } else {
      if (!f.slide) f.slide = { x: f.vx, z: f.vz };
      const slide = Math.max(0, 1 - (f.t - f.impactT) * 0.9); // skids over the sand before it stops
      vx = f.slide.x * slide; vz = f.slide.z * slide;
    }
    f.vx = vx; f.vz = vz;
    f.x += vx * gdt; f.z += vz * gdt;
    const lx = field.halfW - EDGE_MARGIN, lz = field.halfD - EDGE_MARGIN;
    f.x = THREE.MathUtils.clamp(f.x, -lx, lx); f.z = THREE.MathUtils.clamp(f.z, -lz, lz);
    this.fSpeed = Math.hypot(vx, vz);

    // --- the story ---
    while (f.logNext < FLIGHT_LOG.length && c >= FLIGHT_LOG[f.logNext].c) this.onLog?.(FLIGHT_LOG[f.logNext++].key);
    this.#flightFx(f);

    this.#poseHeli(dt);
    this.#updatePuffs(dt);
    this.#updateFlightCamera(dt);
    this.#updateFlightHud(c);

    this.sun.position.copy(this.heli.position).addScaledVector(this.sunDir, 60);
    this.sun.target.position.copy(this.heli.position);
    this.sky.position.copy(this.camera.getWorldPosition(this._v1));
    this.renderer.render(this.scene, this.camera);
  }

  // The hard landing: it hits a sand ripple at speed, pitches and rolls, and the blades break.
  #impact() {
    const f = this.f;
    f.crashed = true;
    f.impactT = f.t;
    f.bounce = 0.6;
    f.tilt.p = 0; f.tilt.r = 0;
    this.onLog?.('fly.log.hard');
    for (const r of this.rotors) { r.pivot.scale.setScalar(0.7); r.pivot.rotation.x += 0.3 * r.dir; r.pivot.rotation.z -= 0.2 * r.dir; }
  }

  // Static, then the picture shuts: contact is lost 1 m above the ground; the end follows a few seconds after the impact.
  #flightFx(f) {
    const h = this.hud, t = f.t;
    const noise = f.commsT >= 0 ? ramp(f.commsT, f.commsT + 3, t) : 0;
    const black = f.crashed ? ramp(f.impactT + 2.5, f.impactT + 4.5, t) : 0;
    if (h?.fxNoise) {
      h.fxNoise.style.opacity = (noise * 0.28).toFixed(3);
      if (noise > 0.01) this.#drawNoise(h.fxNoise);
      h.fxBlack.style.height = `${black * 100}%`;
      const fade = f.commsT >= 0 ? 1 - ramp(f.commsT, f.commsT + 4, t) : 1;
      h.fTelemetry.style.opacity = fade.toFixed(3);
    }
    this.windLevel = 0.15;
    this.onWind?.(0.18, f.crashed ? 1 - ramp(f.impactT + 1, f.impactT + 3.5, t) : 1);
    if (f.crashed && !f.ended && t >= f.impactT + 5) { f.ended = true; this.onEnd?.(); }
  }

  #poseHeli(dt) {
    const f = this.f;
    const ground = terrainHeight(f.x, f.z);
    // slope of the sand under it
    const sx = terrainHeight(f.x + 0.6, f.z) - terrainHeight(f.x - 0.6, f.z);
    const sz = terrainHeight(f.x, f.z + 0.6) - terrainHeight(f.x, f.z - 0.6);
    if (f.crashed) {
      const k = Math.min(1, (f.t - f.impactT) / 0.5);
      const ease = 1 - (1 - k) * (1 - k);
      f.tilt.p = 1.0 * ease; f.tilt.r = 0.7 * ease; // nose down, rolled onto one side
      f.bounce = Math.max(0, f.bounce - (dt || 0) * 0.35);
    }
    const lean = THREE.MathUtils.clamp(this.fSpeed * 0.04, 0, 0.12); // leans into the way it is going
    const amp = 0.3 * f.unstable; // rocking back and forth, growing as it loses its way
    f.wob.p = Math.sin(f.t * 7.1) * amp; f.wob.r = Math.sin(f.t * 5.3 + 1.2) * amp * 1.2;
    const sy = f.crashed ? ground + 0.25 : ground + f.alt;
    this.heli.position.set(f.x, sy + (f.crashed ? f.bounce * Math.max(0, Math.sin((f.t - f.impactT) * 6)) : 0), f.z);
    const e = new THREE.Euler(
      f.crashed ? f.tilt.p - sz * 0.5 : -lean + f.wob.p,
      f.heading,
      f.crashed ? f.tilt.r + sx * 0.5 : f.wob.r,
      'YXZ',
    );
    this.heli.quaternion.setFromEuler(e);
    for (const r of this.rotors) {
      if (!f.crashed) { r.pivot.rotation.set(0, 0, 0); r.pivot.rotateOnAxis(r.axis, f.spinAngle * r.dir); }
    }
    if (dt) f.spinAngle += f.spin * 38 * dt * (1 + 0.3 * f.unstable * Math.sin(f.t * 9)); // spun for show: the real rotors turn 2,400 times a minute
    this.heli.visible = this.view !== 'first'; // seen from outside only
  }

  // ---------- Sand dust: the rotor wash near the ground, and the cloud when it hits ----------
  #buildPuffs() {
    const N = 320;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(N), 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(N), 1));
    const uniforms = { uScale: { value: 600 }, uColor: { value: new THREE.Color(0xcfa27a) } };
    const mat = new THREE.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, fog: false,
      vertexShader: /* glsl */`
        attribute float aSize; attribute float aAlpha; uniform float uScale; varying float vA;
        void main() { vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aSize * uScale / max(-mv.z, 0.1); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: /* glsl */`
        uniform vec3 uColor; varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = smoothstep(1.0, 0.0, d) * vA;
          if (a < 0.003) discard;
          gl_FragColor = vec4(uColor, a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    this.scene.add(points);
    this.puffs = { N, points, uniforms, next: 0, vel: new Float32Array(N * 3), life: new Float32Array(N), max: new Float32Array(N), size0: new Float32Array(N), grow: new Float32Array(N), acc: 0, buf: new THREE.Vector2() };
  }

  #resetPuffs() {
    if (!this.puffs) this.#buildPuffs();
    const P = this.puffs;
    P.life.fill(0); P.next = 0; P.acc = 0;
    P.points.geometry.attributes.aAlpha.array.fill(0);
    P.points.geometry.attributes.aAlpha.needsUpdate = true;
    P.points.visible = true;
  }

  #emitPuff(x, y, z, vx, vy, vz, life, size, grow) {
    const P = this.puffs, i = P.next++ % P.N, pos = P.points.geometry.attributes.position.array;
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    P.vel[i * 3] = vx; P.vel[i * 3 + 1] = vy; P.vel[i * 3 + 2] = vz;
    P.life[i] = P.max[i] = life; P.size0[i] = size; P.grow[i] = grow;
  }

  #updatePuffs(dt) {
    const P = this.puffs, f = this.f;
    if (!P || !dt) return;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const ground = terrainHeight(f.x, f.z);
    // rotor wash: sand is blown outward whenever it is within a few metres of the ground (takeoff and the fall)
    if (!f.crashed && f.spin > 0.5 && f.alt < 3.5) {
      P.acc += 90 * (1 - f.alt / 3.5) * dt;
      while (P.acc >= 1) {
        P.acc -= 1;
        const a = Math.random() * Math.PI * 2, sp = rnd(1.5, 3.5), r = rnd(0.2, 0.5);
        this.#emitPuff(f.x + Math.cos(a) * r, ground + 0.05, f.z + Math.sin(a) * r, Math.cos(a) * sp, rnd(0.3, 0.9), Math.sin(a) * sp, rnd(1, 1.8), rnd(0.35, 0.6), 2);
      }
    }
    // the hit: one big cloud, then a trail of dust while it skids
    if (f.crashed && !f.burst) {
      f.burst = true;
      for (let k = 0; k < 120; k++) {
        const a = Math.random() * Math.PI * 2, sp = rnd(2, 6), r = rnd(0, 0.5);
        this.#emitPuff(f.x + Math.cos(a) * r, ground + 0.1, f.z + Math.sin(a) * r, Math.cos(a) * sp + f.vx * 0.5, rnd(1, 3.5), Math.sin(a) * sp + f.vz * 0.5, rnd(1.8, 3.4), rnd(0.6, 1.1), 2.5);
      }
    } else if (f.crashed && Math.hypot(f.vx, f.vz) > 0.4) {
      P.acc += 40 * dt;
      while (P.acc >= 1) {
        P.acc -= 1;
        this.#emitPuff(f.x + rnd(-0.3, 0.3), ground + 0.1, f.z + rnd(-0.3, 0.3), rnd(-0.8, 0.8) - f.vx * 0.2, rnd(0.3, 1), rnd(-0.8, 0.8) - f.vz * 0.2, rnd(1, 2), rnd(0.4, 0.7), 2);
      }
    }
    // move, spread and fade
    const g = P.points.geometry.attributes, pos = g.position.array, size = g.aSize.array, alpha = g.aAlpha.array;
    for (let i = 0; i < P.N; i++) {
      if (P.life[i] <= 0) { alpha[i] = 0; continue; }
      P.life[i] -= dt;
      const k = Math.max(0, P.life[i] / P.max[i]); // 1 -> 0
      const drag = Math.max(0, 1 - 1.6 * dt);
      P.vel[i * 3] *= drag; P.vel[i * 3 + 1] = P.vel[i * 3 + 1] * drag + 0.15 * dt; P.vel[i * 3 + 2] *= drag;
      pos[i * 3] += P.vel[i * 3] * dt; pos[i * 3 + 1] += P.vel[i * 3 + 1] * dt; pos[i * 3 + 2] += P.vel[i * 3 + 2] * dt;
      size[i] = P.size0[i] * (1 + P.grow[i] * (1 - k));
      alpha[i] = 0.5 * k * Math.min(1, (1 - k) * 8 + 0.2); // quick fade in, slow fade out
    }
    g.position.needsUpdate = true; g.aSize.needsUpdate = true; g.aAlpha.needsUpdate = true;
    P.uniforms.uScale.value = (this.renderer.getDrawingBufferSize(P.buf).y / 2) / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
  }

  #updateFlightCamera(dt) {
    const L = this.look, f = this.f;
    const falling = f.descentT0 >= 0 || f.crashed; // keep the view where the player left it from the descent on
    if (!L.dragging) {
      L.idle += dt;
      if (L.idle > 2.5 && !falling) { const k = Math.min(1, dt * 1.2); L.yaw -= L.yaw * k; L.pitch -= L.pitch * k; }
    }
    // the picture leans into the crash gradually instead of snapping
    const ct = f.camTilt, kc = Math.min(1, (dt || 0) * 4);
    ct.p += ((f.crashed ? f.tilt.p * 0.35 : 0) - ct.p) * kc;
    ct.r += ((f.crashed ? f.tilt.r * 0.4 : 0) - ct.r) * kc;
    const p = this.heli.position;
    if (this.view === 'first') {
      const shake = f.crashed ? Math.max(0, 1 - (f.t - f.impactT) * 0.5) * 0.07 : 0.0015 * f.spin;
      this.camera.position.set(p.x, p.y + 0.25, p.z);
      const e = new THREE.Euler(
        L.pitch - 0.45 + ct.p + f.wob.p * 0.5 + (Math.random() - 0.5) * shake,
        f.heading + L.yaw + (Math.random() - 0.5) * shake,
        ct.r + f.wob.r * 0.5,
        'YXZ',
      );
      this.camera.quaternion.setFromEuler(e);
    } else {
      const yaw = f.heading + L.yaw;
      const pitch = THREE.MathUtils.clamp(0.3 - L.pitch, 0.08, 1.2);
      const dist = 3.4;
      this.camera.position.set(p.x + Math.sin(yaw) * Math.cos(pitch) * dist, p.y + 0.4 + Math.sin(pitch) * dist, p.z + Math.cos(yaw) * Math.cos(pitch) * dist);
      const groundY = terrainHeight(this.camera.position.x, this.camera.position.z) + 0.3;
      if (this.camera.position.y < groundY) this.camera.position.y = groundY;
      this.camera.lookAt(p.x, p.y + 0.2, p.z);
    }
  }

  #updateFlightHud(c) {
    const h = this.hud, f = this.f;
    if (!h?.fClock) return;
    h.fNav.textContent = Math.round(f.nav * 100);
    h.fNavBar.style.width = `${f.nav * 100}%`;
    h.fClock.textContent = Math.min(c, FLIGHT.landAt).toFixed(1);
    h.fAlt.textContent = f.alt.toFixed(1);
    h.fSpeed.textContent = this.fSpeed.toFixed(1);
    const deg = ((THREE.MathUtils.radToDeg(-f.heading) % 360) + 360) % 360;
    h.fHeading.textContent = `${String(Math.round(deg) % 360).padStart(3, '0')}° ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8]}`;
  }

  #placeRover(dt) {
    const s = this.state;
    const fx = -Math.sin(s.heading), fz = -Math.cos(s.heading); // forward
    const rx = Math.cos(s.heading), rz = -Math.sin(s.heading); // right
    const a = this.halfBase, b = this.halfTrack;
    const hFL = this.surfaceHeight(s.x + fx * a - rx * b, s.z + fz * a - rz * b);
    const hFR = this.surfaceHeight(s.x + fx * a + rx * b, s.z + fz * a + rz * b);
    const hRL = this.surfaceHeight(s.x - fx * a - rx * b, s.z - fz * a - rz * b);
    const hRR = this.surfaceHeight(s.x - fx * a + rx * b, s.z - fz * a + rz * b);

    const fwd = this._v2.set(fx * 2 * a, (hFL + hFR - hRL - hRR) / 2, fz * 2 * a).normalize();
    const right = new THREE.Vector3(rx * 2 * b, (hFR + hRR - hFL - hRL) / 2, rz * 2 * b).normalize();
    const up = this._v1.crossVectors(right, fwd).normalize();
    right.crossVectors(fwd, up).normalize();
    this._q.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, fwd.clone().negate()));

    const y = (hFL + hFR + hRL + hRR) / 4;
    if (dt === null) {
      this.roverY = y;
      this.rover.quaternion.copy(this._q);
    } else {
      this.roverY += (y - this.roverY) * Math.min(1, dt * 9);
      this.rover.quaternion.slerp(this._q, Math.min(1, dt * 7));
    }
    this.rover.position.set(s.x, this.roverY, s.z);
  }

  #buildDust() {
    const pos = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * DUST_BOX;
      pos[i * 3 + 1] = Math.random() * 9;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * DUST_BOX;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    // soft round grain instead of the default square point
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    this.dust = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xd9a878, map: new THREE.CanvasTexture(c), size: 0.06, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false }));
    this.dust.frustumCulled = false;
    this.dust.visible = false;
    this.scene.add(this.dust);
    this.windLevel = 0;
    this.hazeClear = new THREE.Color(0xc9a682);
    this.hazeStorm = new THREE.Color(0x8c5a32);
    this.hazeDark = new THREE.Color(0x120a05);
    this.zenithClear = new THREE.Color(0x8f6f58);
  }

  // Drives everything the storm changes: sky, light, fog, blowing dust, dust on the panels, power and telemetry.
  #updateStorm(dt) {
    const st = this.storm, s = this.state;
    st.t += dt * this.timeScale;
    const t = st.t;

    const front = ramp(14, 64, t); // the wall climbs the sky
    const dusty = ramp(32, 80, t); // air fills with dust
    const dark = ramp(54, 102, t); // daylight is lost
    const off = ramp(94, 108, t); // systems shut down
    this.windLevel = dusty;

    // --- telemetry ---
    s.tau = THREE.MathUtils.lerp(0.6, 10.8, ramp(26, 86, t));
    s.solar = THREE.MathUtils.lerp(100, 3, ramp(30, 88, t));
    s.battery = 100 * (1 - ramp(46, 104, t));
    s.power = THREE.MathUtils.lerp(1, 0.2, ramp(50, 92, t)) * (1 - off);
    s.sol = Math.min(SOL_END, SOL_START + Math.floor((SOL_END - SOL_START + 0.99) * ramp(8, 102, t)));

    // --- sky, fog and light ---
    this.haze.copy(this.hazeClear).lerp(this.hazeStorm, dusty).lerp(this.hazeDark, dark * 0.97);
    this.scene.fog.density = 0.0055 + 0.028 * dusty + 0.05 * dark;
    this.skyUniforms.horizon.value.copy(this.haze);
    this.skyUniforms.zenith.value.copy(this.zenithClear).lerp(this.hazeStorm, dusty).lerp(this.hazeDark, dark * 0.97);
    this.skyUniforms.stormCol.value.set(0x5c3a22).lerp(this.hazeDark, dark * 0.97);
    this.skyUniforms.front.value = front;
    this.skyUniforms.sunStrength.value = 1 - ramp(30, 72, t);
    this.sun.intensity = 2.4 * (1 - dusty * 0.8) * (1 - dark * 0.97);
    this.hemi.intensity = 1.15 * (1 - dark * 0.9);

    // --- dust on the rover, dust in the air ---
    this.dustAmount.value = ramp(40, 98, t);
    this.dust.visible = dusty > 0.01;
    this.dust.material.opacity = Math.min(1, dusty * 1.3) * (1 - dark * 0.7);
    if (this.dust.visible && dt > 0) {
      const cam = this.camera.position, p = this.dust.geometry.attributes.position, a = p.array;
      const speed = 5 + 16 * dusty;
      const wx = 0.29 * speed * dt, wz = 0.96 * speed * dt; // blowing out of the storm, toward the south
      for (let i = 0; i < a.length; i += 3) {
        a[i] += wx + (Math.random() - 0.5) * 0.05;
        a[i + 1] += (Math.random() - 0.5) * 0.06;
        a[i + 2] += wz;
        if (a[i] - cam.x > DUST_BOX) a[i] -= 2 * DUST_BOX; else if (a[i] - cam.x < -DUST_BOX) a[i] += 2 * DUST_BOX;
        if (a[i + 2] - cam.z > DUST_BOX) a[i + 2] -= 2 * DUST_BOX; else if (a[i + 2] - cam.z < -DUST_BOX) a[i + 2] += 2 * DUST_BOX;
        const rel = a[i + 1] - cam.y;
        if (rel > 5) a[i + 1] -= 9; else if (rel < -4) a[i + 1] += 9;
      }
      p.needsUpdate = true;
    }

    // --- screen effects: dusty lens, then a noisy, incomplete last image ---
    const h = this.hud;
    if (h?.fxDust) {
      h.fxDust.style.opacity = (dusty * 0.75).toFixed(3);
      h.fxNoise.style.opacity = (off * 0.24).toFixed(3);
      if (off > 0.01) this.#drawNoise(h.fxNoise);
      h.fxBlack.style.height = `${ramp(102, 110, t) * 100}%`;
      h.telemetry.style.opacity = (1 - ramp(100, 108, t)).toFixed(3);
    }

    this.onWind?.(0.12 + 0.88 * dusty, 1 - ramp(100, 110, t));

    while (st.next < STORM_LOG.length && t >= STORM_LOG[st.next].t) this.onLog?.(STORM_LOG[st.next++].key);
    if (!st.ended && t >= STORM_END) { st.ended = true; this.onEnd?.(); }
  }

  #drawNoise(canvas) {
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(canvas.width, canvas.height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.random() * 170;
      d[i] = v; d[i + 1] = v * 0.9; d[i + 2] = v * 0.8; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }

  #dropTracks() {
    const s = this.state;
    if (Math.hypot(s.x - this.lastTrack.x, s.z - this.lastTrack.y) < TRACK_SPACING) return;
    this.lastTrack.set(s.x, s.z);
    const m = new THREE.Matrix4(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    const rx = Math.cos(s.heading), rz = -Math.sin(s.heading);
    for (const side of [-1, 1]) {
      const x = s.x + rx * this.halfTrack * side, z = s.z + rz * this.halfTrack * side;
      p.set(x, terrainHeight(x, z) + 0.012, z);
      this.tracks.setMatrixAt(this.trackCount % MAX_TRACKS, m.compose(p, this.rover.quaternion, one));
      this.trackCount++;
    }
    this.tracks.count = Math.min(this.trackCount, MAX_TRACKS);
    this.tracks.instanceMatrix.needsUpdate = true;
  }

  #updateCamera(dt) {
    const L = this.look;
    // ease the view back to straight ahead once the player lets go and starts driving
    if (!L.dragging) {
      L.idle += dt;
      if (L.idle > 2.5 && Math.abs(this.state.speed) > 0.2) {
        const k = Math.min(1, dt * 1.2);
        L.yaw -= L.yaw * k; L.pitch -= L.pitch * k;
      }
    }
    if (this.view === 'first') {
      const bob = Math.sin(this.state.trip * 5.5) * 0.006 * Math.min(1, Math.abs(this.state.speed));
      this.mast.getWorldPosition(this.camera.position);
      this.camera.position.y += bob;
      const shake = this.windLevel * 0.006;
      const e = new THREE.Euler(L.pitch - 0.2 + (Math.random() - 0.5) * shake, L.yaw + (Math.random() - 0.5) * shake, 0, 'YXZ');
      this.camera.quaternion.copy(this.rover.quaternion).multiply(this._q.setFromEuler(e));
    } else {
      const yaw = this.state.heading + L.yaw;
      const pitch = THREE.MathUtils.clamp(0.3 - L.pitch, 0.08, 1.2);
      const dist = 5.2;
      const p = this.rover.position;
      this.camera.position.set(p.x + Math.sin(yaw) * Math.cos(pitch) * dist, p.y + 0.9 + Math.sin(pitch) * dist, p.z + Math.cos(yaw) * Math.cos(pitch) * dist);
      const groundY = terrainHeight(this.camera.position.x, this.camera.position.z) + 0.3;
      if (this.camera.position.y < groundY) this.camera.position.y = groundY;
      this.camera.lookAt(p.x, p.y + 0.9, p.z);
    }
  }

  #updateHud() {
    const s = this.state, h = this.hud;
    if (!h) return;
    const frac = Math.abs(s.speed) / MAX_SPEED;
    h.speed.textContent = (frac * REAL_TOP_SPEED_CM).toFixed(1);
    h.speedBar.style.width = `${frac * 100}%`;
    const deg = ((THREE.MathUtils.radToDeg(-s.heading) % 360) + 360) % 360;
    h.heading.textContent = `${String(Math.round(deg) % 360).padStart(3, '0')}° ${['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8]}`;
    h.trip.textContent = s.trip.toFixed(1);
    h.battery.textContent = Math.round(s.battery);
    h.batteryBar.style.width = `${s.battery}%`;
    h.batteryBar.style.background = s.battery > 50 ? '#9be37a' : s.battery > 20 ? '#ffb347' : '#ff5a47';
    h.sol.textContent = s.sol;
    h.solar.textContent = Math.round(s.solar);
    h.tau.textContent = s.tau.toFixed(1);
    h.temp.textContent = Math.round(s.temp);
  }

  #bindInput() {
    const driveKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight'];
    window.addEventListener('keydown', (e) => {
      if (!this.running) return;
      if (driveKeys.includes(e.code)) { this.keys.add(e.code); e.preventDefault(); }
      if (e.code === 'KeyC' && !e.repeat) this.toggleView();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());

    const el = this.renderer.domElement;
    let last = null;
    el.addEventListener('pointerdown', (e) => { last = { x: e.clientX, y: e.clientY }; this.look.dragging = true; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => {
      if (!last) return;
      this.look.yaw -= (e.clientX - last.x) * 0.0045;
      this.look.pitch = THREE.MathUtils.clamp(this.look.pitch - (e.clientY - last.y) * 0.0035, -0.9, 0.7);
      last = { x: e.clientX, y: e.clientY };
    });
    const end = () => { last = null; this.look.dragging = false; this.look.idle = 0; };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('dblclick', () => { this.look.yaw = 0; this.look.pitch = 0; });
  }

  // Hook for on-screen buttons: axis is 'fwd' or 'turn', value -1..1
  setTouch(axis, value) { this.touch[axis] = value; }
}
