import * as THREE from 'three';
import { Globe } from './globe.js';
import { ROVERS } from './data.js';
import { t, getLang, setLang, onLangChange, applyI18n } from './i18n.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const panel = $('panel');
let selected = null;

// ---------- Language ----------
document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
setLang(getLang());

// ---------- Globe ----------
const globe = new Globe(stage, {
  onSelect: openRover,
  onProgress: (p) => { $('progress-bar').style.width = `${Math.round(p * 100)}%`; },
});

globe.load().then(() => {
  globe.addMarkers(ROVERS, (r) => t(`${r.id}.place`));
  const start = $('start');
  start.disabled = false;
  start.classList.add('ready');
  // Deep link: index.html#opportunity skips the intro and opens that rover
  const linked = ROVERS.find((r) => r.id === location.hash.slice(1));
  if (location.hash === '#mars' || linked) enter();
  if (linked) openRover(linked);
}).catch((err) => {
  console.error(err);
  $('start').querySelector('.loader-text').textContent = 'Model failed to load — run: python server.py';
});

function enter() {
  $('intro').classList.add('gone');
  document.body.classList.add('exploring');
  $('hint').classList.remove('hidden');
  setTimeout(() => $('hint').classList.add('hidden'), 7000);
}
$('start').addEventListener('click', enter);

// ---------- Panel ----------
const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(getLang() === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const fmtNum = (n) => n.toLocaleString(getLang() === 'tr' ? 'tr-TR' : 'en-US');

function fillPanel(rover) {
  const s = rover.stats;
  const unit = t(`panel.${s.unit}`);
  $('p-last-label').textContent = t(s.lastLabel || 'panel.lastContact');
  $('p-place').textContent = t(`${rover.id}.place`);
  $('p-name').textContent = rover.name;
  $('p-tagline').textContent = t(`${rover.id}.tagline`);
  $('p-landed').textContent = fmtDate(s.landed);
  $('p-last').textContent = fmtDate(s.last);
  $('p-planned').textContent = `${fmtNum(s.planned)} ${unit}`;
  $('p-lasted').textContent = `${fmtNum(s.lasted)} ${unit}`;
  $('p-distance').textContent = s.distanceKm < 1 ? `~${Math.round(s.distanceKm * 1000)} m` : `${fmtNum(s.distanceKm)} km`;
  $('p-drive').hidden = !rover.playable;
  panel.style.setProperty('--c', rover.color);
}

function openRover(rover) {
  selected = rover;
  fillPanel(rover);
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  globe.setSelected(rover.id);
  globe.flyTo(rover);
  $('hint').classList.add('hidden');
}

function closePanel() {
  selected = null;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  globe.flyHome();
}

$('panel-close').addEventListener('click', closePanel);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selected) closePanel(); });

onLangChange(() => {
  globe.updateMarkerLabels((r) => t(`${r.id}.place`));
  if (selected) fillPanel(selected);
});
applyI18n();

// ---------- Loop ----------
const clock = new THREE.Clock();
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05);
  globe.update(dt);
  requestAnimationFrame(loop);
}
loop();
