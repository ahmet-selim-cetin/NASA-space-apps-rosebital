import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ROVER_URL = 'models/nasa_opportunity_rover.glb';
const ROVER_HEIGHT = 1.55; // metres, wheels to top of the camera mast
const WORLD_SIZE = 700; // metres
const WORLD_LIMIT = 300; // the rover is turned back beyond this radius
const MAX_SPEED = 1.6; // scene m/s (time-compressed; the real rover's top speed was 5 cm/s)
const REAL_TOP_SPEED_CM = 5;
const TRACK_SPACING = 0.22;
const MAX_TRACKS = 5000;
const CLIMB_LIMIT = 0.3; // rocks up to this size are driven over; bigger ones block the rover
const ROCK_CELL = 4; // metres, spatial grid for rock lookups

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

export function terrainHeight(x, z) {
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
    this.touch = { fwd: 0, turn: 0 };
    this.look = { yaw: 0, pitch: 0, dragging: false, idle: 0 };
    this.view = 'first'; // 'first' | 'chase'

    // Rover state. `power` (0..1) scales speed; the storm sequence drives it down.
    this.state = { x: 0, z: 0, heading: 0, speed: 0, trip: 0, power: 1, battery: 100, solar: 645, tau: 0.6, temp: -28 };
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

  async load(onProgress) {
    if (this.loaded) return;
    this.#initRenderer();
    this.#buildSky();
    this.#buildLights();
    this.#buildTerrain();
    this.#buildRocks();
    this.#buildTracks();
    await this.#loadRover(onProgress);
    this.#bindInput();
    this.resize();
    this.loaded = true;
  }

  start() {
    Object.assign(this.state, { x: 0, z: 0, heading: 0, speed: 0, trip: 0 });
    this.look.yaw = 0; this.look.pitch = 0;
    this.trackCount = 0;
    this.tracks.count = 0;
    this.lastTrack.set(0, 0);
    this.rover.quaternion.identity();
    this.running = true;
    this.container.classList.add('active');
    this.resize();
    this.#placeRover(null);
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
    const s = this.state;

    // --- input ---
    const k = this.keys;
    const fwd = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) + this.touch.fwd;
    const turn = (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0) - (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) + this.touch.turn;

    // --- motion ---
    const target = THREE.MathUtils.clamp(fwd, -0.5, 1) * MAX_SPEED * s.power;
    const rate = Math.abs(target) > Math.abs(s.speed) ? 1.4 : 2.6; // slow to spin up, quicker to stop
    s.speed += THREE.MathUtils.clamp(target - s.speed, -rate * dt, rate * dt);
    const turnRate = 0.75 * (0.35 + 0.65 * Math.min(1, Math.abs(s.speed) / MAX_SPEED + 0.3)) * s.power;
    s.heading += turn * turnRate * dt * (s.speed < -0.05 ? -1 : 1);

    const dx = -Math.sin(s.heading) * s.speed * dt;
    const dz = -Math.cos(s.heading) * s.speed * dt;
    let nx = s.x + dx, nz = s.z + dz;
    const r = Math.hypot(nx, nz);
    if (r > WORLD_LIMIT) { nx *= WORLD_LIMIT / r; nz *= WORLD_LIMIT / r; s.speed *= 0.9; }
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
        varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir);
          float t = pow(clamp(d.y, 0.0, 1.0), 0.55);
          vec3 col = mix(horizon, zenith, t);
          float s = max(dot(d, sunDir), 0.0);
          // Martian sun: small disc with a cool, bluish forward-scatter glow
          col += sunStrength * (vec3(0.75, 0.82, 0.95) * pow(s, 24.0) * 0.45 + vec3(1.0, 0.97, 0.9) * smoothstep(0.9993, 0.9997, s) * 2.5);
          col = mix(col, horizon, smoothstep(0.0, -0.08, d.y));
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

  #buildTerrain() {
    const seg = 320;
    const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const dark = new THREE.Color(0x6e4329), light = new THREE.Color(0xb98358), c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
      const t = THREE.MathUtils.clamp(fbm(x * 0.02 + 7, z * 0.02 + 3, 3) * 1.5 - 0.3, 0, 1);
      c.copy(dark).lerp(light, t);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    const tex = makeGroundTexture();
    this.groundMat = new THREE.MeshStandardMaterial({ map: tex, bumpMap: tex, bumpScale: 0.6, vertexColors: true, roughness: 1, metalness: 0 });
    this.ground = new THREE.Mesh(geo, this.groundMat);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
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
      const e = new THREE.Euler(L.pitch - 0.2, L.yaw, 0, 'YXZ');
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
    h.solar.textContent = Math.round(s.solar);
    h.tau.textContent = s.tau.toFixed(1);
    h.temp.textContent = Math.round(s.temp);
  }

  #bindInput() {
    const driveKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
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
