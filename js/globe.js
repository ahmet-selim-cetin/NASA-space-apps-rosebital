import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// NASA/USGS Viking MDIM 2.1 colorized global mosaic (equirectangular, -180°..180° east, north up)
const MARS_MAP_URL = 'textures/mars_viking_mdim21_4k.jpg';
// Moon map: texture of the team's Moon model (models/moon (1).glb, "moon" by RenderX, CC-BY 4.0), flipped north-up.
const MOON_MAP_URL = 'textures/moon_4k.jpg';
// Each world: map, light colours/intensities, sun position, orange air glow or not, home view (lat, lon).
const WORLDS = {
  mars: { map: MARS_MAP_URL, ambient: [0xffe4cc, 0.55], sun: [0xfff1e0, 2.6], sunPos: [-4, 2, 5], rim: [0xff8a4a, 0.6], glow: true, home: [12, 330] },
  moon: { map: MOON_MAP_URL, ambient: [0xffffff, 0.45], sun: [0xffffff, 2.4], sunPos: [3, 2, 5], rim: [0x9fb4d8, 0.35], glow: false, home: [6, 340] },
};
const HOME_DISTANCE = 3.4;
const FOCUS_DISTANCE = 2.1;

// Convert latitude / east-longitude to a point on the sphere.
// Matches THREE.SphereGeometry's UVs with a map spanning -180°..180°: longitude 0 is on +X, 90°E on -Z.
export function latLonToVec3(lat, lon, r = 1) {
  const phi = THREE.MathUtils.degToRad(lat);
  const lam = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(r * Math.cos(phi) * Math.cos(lam), r * Math.sin(phi), -r * Math.cos(phi) * Math.sin(lam));
}

export class Globe {
  constructor(container, { onSelect, onProgress } = {}) {
    this.container = container;
    this.onSelect = onSelect;
    this.onProgress = onProgress;
    this.markers = [];
    this.world = 'mars';
    this.maps = {};
    this.active = true;
    this.flight = null;
    this.viewShift = 0; // 0..1, slides the planet left when the side panel is open
    this.viewShiftTarget = 0;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.className = 'label-layer';
    container.appendChild(this.labelRenderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020207);
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.01, 2000);
    this.camera.position.copy(latLonToVec3(12, 330, HOME_DISTANCE));

    this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enablePan = false;
    this.controls.minDistance = 1.45;
    this.controls.maxDistance = 7;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 0.7;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.35;
    this.controls.addEventListener('start', () => { this.controls.autoRotate = false; this.flight = null; });

    this.planet = new THREE.Group();
    this.scene.add(this.planet);

    this.#addLights();
    this.#addStars();
    this.#addAtmosphere();

    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  async load() {
    const map = await new THREE.TextureLoader().loadAsync(MARS_MAP_URL);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.maps.mars = map;
    this.surface = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 64),
      new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0 }),
    );
    this.planet.add(this.surface);
    this.onProgress?.(1);
  }

  // Switch the globe between Mars and the Moon: map, lighting, air glow and which beacons are shown.
  async setWorld(name) {
    const w = WORLDS[name];
    if (!w || name === this.world) return;
    if (!this.maps[name]) {
      const map = await new THREE.TextureLoader().loadAsync(w.map);
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      this.maps[name] = map;
    }
    this.world = name;
    this.surface.material.map = this.maps[name];
    this.surface.material.needsUpdate = true;
    this.ambient.color.set(w.ambient[0]); this.ambient.intensity = w.ambient[1];
    this.sun.color.set(w.sun[0]); this.sun.intensity = w.sun[1]; this.sun.position.set(...w.sunPos);
    this.rim.color.set(w.rim[0]); this.rim.intensity = w.rim[1];
    this.atmosphere.visible = w.glow;
    this.#showMarkers();
    this.setSelected(null);
    this.viewShiftTarget = 0;
    this.#startFlight(latLonToVec3(w.home[0], w.home[1]).normalize(), HOME_DISTANCE);
    this.controls.autoRotate = true;
  }

  #showMarkers() {
    this.markers.forEach((m) => {
      const on = (m.rover.world || 'mars') === this.world;
      m.obj.visible = on; m.pillar.visible = on;
    });
  }

  addMarkers(rovers, labelFor) {
    rovers.forEach((rover) => {
      const el = document.createElement('button');
      el.className = 'beacon';
      el.style.setProperty('--c', rover.color);
      el.innerHTML = `<span class="beacon-dot"></span><span class="beacon-ring"></span><span class="beacon-label"><b>${rover.name}</b><small></small></span>`;
      el.addEventListener('click', (e) => { e.stopPropagation(); this.onSelect?.(rover); });
      el.addEventListener('pointerdown', (e) => e.stopPropagation());

      const obj = new CSS2DObject(el);
      const pos = latLonToVec3(rover.lat, rover.lon, 1.012);
      obj.position.copy(pos);
      this.planet.add(obj);

      // A thin vertical light pillar so beacons read from far away
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0025, 0.0025, 0.09, 6, 1, true),
        new THREE.MeshBasicMaterial({ color: rover.color, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      pillar.position.copy(latLonToVec3(rover.lat, rover.lon, 1.045));
      pillar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      this.planet.add(pillar);

      this.markers.push({ rover, el, obj, pillar, normal: pos.clone().normalize() });
    });
    this.#showMarkers();
    this.updateMarkerLabels(labelFor);
  }

  updateMarkerLabels(labelFor) {
    this.markers.forEach((m) => { m.el.querySelector('small').textContent = labelFor(m.rover); });
  }

  setSelected(id) {
    this.markers.forEach((m) => m.el.classList.toggle('selected', m.rover.id === id));
  }

  flyTo(rover) {
    const dir = latLonToVec3(rover.lat, rover.lon).normalize();
    this.#startFlight(dir, FOCUS_DISTANCE);
    this.controls.autoRotate = false;
    this.viewShiftTarget = 1;
  }

  flyHome() {
    const dir = this.camera.position.clone().normalize();
    this.#startFlight(dir, HOME_DISTANCE);
    this.viewShiftTarget = 0;
    this.setSelected(null);
  }

  #startFlight(dir, distance) {
    this.flight = {
      t: 0,
      duration: 1.6,
      fromDir: this.camera.position.clone().normalize(),
      toDir: dir.clone(),
      fromDist: this.camera.position.length(),
      toDist: distance,
    };
  }

  setActive(on) {
    this.active = on;
    this.renderer.domElement.style.display = on ? '' : 'none';
    this.labelRenderer.domElement.style.display = on ? '' : 'none';
  }

  resize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

  update(dt) {
    if (!this.active) return;

    if (this.flight) {
      const f = this.flight;
      f.t = Math.min(1, f.t + dt / f.duration);
      const k = f.t < 0.5 ? 4 * f.t ** 3 : 1 - (-2 * f.t + 2) ** 3 / 2; // easeInOutCubic
      const q = new THREE.Quaternion().setFromUnitVectors(f.fromDir, f.toDir);
      const partial = new THREE.Quaternion().slerp(q, k);
      const dir = f.fromDir.clone().applyQuaternion(partial);
      this.camera.position.copy(dir.multiplyScalar(THREE.MathUtils.lerp(f.fromDist, f.toDist, k)));
      if (f.t >= 1) this.flight = null;
    }

    // Slide the planet out from under the side panel on wide screens
    const wide = this.container.clientWidth > 860;
    this.viewShift += (this.viewShiftTarget - this.viewShift) * Math.min(1, dt * 4);
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    // Wide: panel is on the right, so shift the planet left. Narrow: panel is a bottom sheet, shift it up.
    if (this.viewShift > 0.001) this.camera.setViewOffset(w, h, wide ? w * 0.2 * this.viewShift : 0, wide ? 0 : h * 0.24 * this.viewShift, w, h);
    else this.camera.clearViewOffset();

    this.controls.update();
    this.stars.rotation.y += dt * 0.004;

    // Hide beacons on the far side of the planet
    const camDir = this.camera.position.clone().normalize();
    const time = performance.now() / 1000;
    this.markers.forEach((m) => {
      if (!m.obj.visible) return;
      const facing = m.normal.dot(camDir);
      m.el.style.opacity = THREE.MathUtils.clamp((facing - 0.05) * 5, 0, 1);
      m.el.style.pointerEvents = facing > 0.15 ? 'auto' : 'none';
    });
    this.atmosphere.material.uniforms.time.value = time;

    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  #addLights() {
    this.ambient = new THREE.AmbientLight(0xffe4cc, 0.55);
    this.scene.add(this.ambient);
    this.sun = new THREE.DirectionalLight(0xfff1e0, 2.6);
    this.sun.position.set(-4, 2, 5);
    this.scene.add(this.sun);
    this.rim = new THREE.DirectionalLight(0xff8a4a, 0.6);
    this.rim.position.set(5, -1, -4);
    this.scene.add(this.rim);
  }

  #addStars() {
    const count = 4000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(300 + Math.random() * 300);
      pos.set([v.x, v.y, v.z], i * 3);
      const tint = 0.7 + Math.random() * 0.3;
      col.set([tint, tint * (0.9 + Math.random() * 0.1), tint * (0.85 + Math.random() * 0.15)], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.stars = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.4, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0.9 }));
    this.scene.add(this.stars);
  }

  #addAtmosphere() {
    const mat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, color: { value: new THREE.Color(0xff8a50) } },
      vertexShader: /* glsl */`
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 color;
        varying vec3 vNormal;
        varying vec3 vView;
        void main() {
          // Back faces: d is ~0 at the outer edge and ~0.4 at the planet's limb
          float d = clamp(-dot(vNormal, vView), 0.0, 1.0);
          float glow = pow(clamp(d / 0.4, 0.0, 1.0), 2.5);
          gl_FragColor = vec4(color, glow * 0.6);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.09, 64, 64), mat);
    this.scene.add(this.atmosphere);
  }
}
