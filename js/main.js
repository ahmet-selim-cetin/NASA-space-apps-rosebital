import * as THREE from 'three';
import { Globe } from './globe.js';
import { DriveSim } from './drive.js';
import { WindAudio } from './audio.js';
import { ROVERS } from './data.js';
import { STORIES } from './stories.js';
import { SLIDES } from './slides.js';
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
  $('start-moon').disabled = false;
  // Deep link: index.html#opportunity skips the intro and opens that rover; #moon opens the Moon
  const linked = ROVERS.find((r) => r.id === location.hash.slice(1));
  const moonLink = location.hash === '#moon' || linked?.world === 'moon';
  if (location.hash === '#mars' || location.hash === '#drive' || moonLink || linked) enter();
  const ready = moonLink ? setWorld('moon') : Promise.resolve();
  ready.then(() => { if (linked) openRover(linked); });
  if (location.hash === '#drive') startDrive();
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
$('start-moon').addEventListener('click', () => { enter(); setWorld('moon'); });

// ---------- Mars | Moon ----------
let world = 'mars';
function markWorld() {
  document.querySelectorAll('[data-world]').forEach((b) => b.classList.toggle('active', b.dataset.world === world));
  $('credit').dataset.i18n = world === 'moon' ? 'credit.moon' : 'credit';
  $('credit').textContent = t($('credit').dataset.i18n);
}
async function setWorld(next) {
  if (next === world || drive.running) return;
  if (slidesOpen()) { slidesEl.classList.remove('open'); slidesEl.setAttribute('aria-hidden', 'true'); }
  selected = null;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  world = next;
  markWorld();
  await globe.setWorld(next);
}
document.querySelectorAll('[data-world]').forEach((b) => b.addEventListener('click', () => setWorld(b.dataset.world)));
markWorld();

// ---------- Panel ----------
const fmtDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString(getLang() === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const fmtNum = (n) => n.toLocaleString(getLang() === 'tr' ? 'tr-TR' : 'en-US');

function fillPanel(rover) {
  $('p-place').textContent = t(`${rover.id}.place`);
  $('p-name').textContent = rover.name;
  $('p-tagline').textContent = t(`${rover.id}.tagline`);
  $('p-drive').hidden = !rover.playable;
  panel.style.setProperty('--c', rover.color);

  // Sites with their own fact list (the Moon's shared beacon) use it instead of the rover numbers.
  $('p-stats').hidden = !rover.stats;
  $('p-facts').hidden = !rover.facts;
  if (rover.facts) {
    $('p-facts').replaceChildren(...rover.facts[getLang()].map(([label, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));
  }
  if (rover.stats) {
    const s = rover.stats;
    const unit = t(`panel.${s.unit}`);
    $('p-last-label').textContent = t(s.lastLabel || 'panel.lastContact');
    $('p-landed').textContent = fmtDate(s.landed);
    $('p-last').textContent = fmtDate(s.last);
    $('p-planned').textContent = `${fmtNum(s.planned)} ${unit}`;
    $('p-lasted').textContent = `${fmtNum(s.lasted)} ${unit}`;
    $('p-distance').textContent = s.distanceKm < 1 ? `~${Math.round(s.distanceKm * 1000)} m` : `${fmtNum(s.distanceKm)} km`;
  }

  // The long story is optional (not written yet for the Moon).
  $('p-story-box').hidden = !STORIES[rover.id];
  if (!STORIES[rover.id]) return;
  const story = STORIES[rover.id][getLang()];
  const list = $('p-story');
  list.replaceChildren(...story.chapters.map((c) => {
    const li = document.createElement('li');
    const when = document.createElement('time');
    const title = document.createElement('h3');
    when.textContent = c.when; title.textContent = c.title;
    const paras = c.text.split('\n\n').map((s) => { const p = document.createElement('p'); p.textContent = s; return p; });
    li.append(when, title, ...paras);
    return li;
  }));
  $('p-closing').textContent = story.closing;
}

// Clicking a beacon: fly there and tell the story in 3 picture slides first; the panel follows.
function openRover(rover) {
  selected = rover;
  fillPanel(rover);
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  globe.setSelected(rover.id);
  globe.flyTo(rover);
  $('hint').classList.add('hidden');
  openSlides(rover);
}

function showPanel() {
  if (!selected) return;
  panel.scrollTop = 0;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
}

// ---------- Picture slides ----------
const slidesEl = $('slides');
let slideIdx = 0;
const slidesOpen = () => slidesEl.classList.contains('open');

function renderSlide() {
  const list = SLIDES[selected.id];
  const sl = list[slideIdx];
  const txt = sl[getLang()];
  const img = $('sl-img');
  img.src = sl.img; img.alt = txt.cap;
  $('sl-cap').textContent = txt.cap;
  // Credit line links to the image's NASA page: Photojournal for PIA codes, NASA Image Library otherwise.
  const code = sl.credit.split('·').pop().trim();
  const link = document.createElement('a');
  link.href = code.startsWith('PIA') ? `https://photojournal.jpl.nasa.gov/catalog/${code}` : `https://images.nasa.gov/details/${code}`;
  link.target = '_blank'; link.rel = 'noopener';
  link.textContent = `${sl.credit} ↗`;
  $('sl-credit').replaceChildren(link);
  $('sl-name').textContent = selected.name;
  $('sl-count').textContent = `${slideIdx + 1} / ${list.length}`;
  $('sl-when').textContent = txt.when;
  $('sl-title').textContent = txt.title;
  $('sl-text').textContent = txt.text;
  $('sl-dots').replaceChildren(...list.map((_, i) => {
    const d = document.createElement('button');
    d.className = i === slideIdx ? 'on' : '';
    d.setAttribute('aria-label', `${i + 1}`);
    d.addEventListener('click', () => goSlide(i));
    return d;
  }));
  const last = slideIdx === list.length - 1;
  $('sl-prev').hidden = slideIdx === 0;
  $('sl-next').hidden = last;
  $('sl-story').hidden = !last;
  $('sl-story').textContent = t(STORIES[selected.id] ? 'slides.story' : 'slides.info');
  $('sl-drive').hidden = !(last && selected.playable);
  // restart the entrance animation
  for (const el of [img, slidesEl.querySelector('.sl-body')]) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }
}

function goSlide(i) {
  const n = SLIDES[selected.id].length;
  if (i < 0 || i >= n || i === slideIdx) return;
  slideIdx = i;
  renderSlide();
}

function openSlides(rover) {
  slideIdx = 0;
  slidesEl.style.setProperty('--c', rover.color);
  renderSlide();
  slidesEl.classList.add('open');
  slidesEl.setAttribute('aria-hidden', 'false');
  SLIDES[rover.id].forEach((s) => { new Image().src = s.img; }); // preload
}

function closeSlides() {
  slidesEl.classList.remove('open');
  slidesEl.setAttribute('aria-hidden', 'true');
  showPanel();
}

$('sl-next').addEventListener('click', () => goSlide(slideIdx + 1));
$('sl-prev').addEventListener('click', () => goSlide(slideIdx - 1));
$('sl-story').addEventListener('click', closeSlides);
$('sl-close').addEventListener('click', closeSlides);
$('sl-drive').addEventListener('click', () => { closeSlides(); startDrive(); });
slidesEl.addEventListener('click', (e) => { if (e.target === slidesEl) closeSlides(); });
window.addEventListener('keydown', (e) => {
  if (!slidesOpen()) return;
  if (e.key === 'ArrowRight') goSlide(slideIdx + 1);
  else if (e.key === 'ArrowLeft') goSlide(slideIdx - 1);
  else if (e.key === 'Escape') { e.stopImmediatePropagation(); closeSlides(); }
});

function closePanel() {
  selected = null;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  globe.flyHome();
}

$('panel-close').addEventListener('click', closePanel);
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selected && !drive.running) closePanel(); });

onLangChange(() => {
  globe.updateMarkerLabels((r) => t(`${r.id}.place`));
  markWorld();
  if (selected) fillPanel(selected);
  if (selected && slidesOpen()) renderSlide();
});
applyI18n();

// ---------- Drive ----------
const fade = $('fade');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const drive = new DriveSim($('drive'), {
  speed: $('h-speed'), speedBar: $('h-speed-bar'), heading: $('h-heading'), trip: $('h-trip'),
  battery: $('h-battery'), batteryBar: $('h-battery-bar'), solar: $('h-solar'), tau: $('h-tau'), temp: $('h-temp'),
  sol: $('h-sol'), telemetry: $('h-telemetry'), fxDust: $('fx-dust'), fxNoise: $('fx-noise'), fxBlack: $('fx-black'),
});
const wind = new WindAudio();
const ending = $('ending');
const fast = Number(new URLSearchParams(location.search).get('fast'));
if (fast > 0) drive.timeScale = fast; // e.g. ?fast=6 to preview the storm quickly

drive.onWind = (level, master) => wind.set(level, master);
drive.onLog = (key) => {
  const li = document.createElement('li');
  li.dataset.i18n = key;
  li.textContent = t(key);
  $('d-log').append(li);
};
drive.onEnd = () => {
  ending.classList.add('on');
  ending.setAttribute('aria-hidden', 'false');
  document.body.classList.add('remembered');
};
function hideEnding() {
  ending.classList.remove('on');
  ending.setAttribute('aria-hidden', 'true');
}
let switching = false;

async function fadeTo(text) {
  $('fade-text').textContent = text || '';
  fade.classList.add('on');
  await wait(900);
}

async function startDrive() {
  if (switching || drive.running) return;
  switching = true;
  try {
    wind.start(); // inside the click, so the browser allows sound
    await fadeTo(t('drive.loading'));
    await drive.load();
    $('d-log').replaceChildren();
    hideEnding();
    globe.setActive(false);
    document.body.classList.add('driving');
    drive.start();
    if (new URLSearchParams(location.search).get('cam') === 'chase') drive.toggleView();
    $('fade-text').textContent = t('drive.card');
    await wait(2600);
    fade.classList.remove('on');
    $('drive-help').classList.remove('hidden');
    setTimeout(() => $('drive-help').classList.add('hidden'), 9000);
  } catch (err) {
    console.error(err);
    $('fade-text').textContent = 'Rover model failed to load.';
    await wait(2000);
    fade.classList.remove('on');
  } finally {
    switching = false;
  }
}

async function stopDrive() {
  if (switching || !drive.running) return;
  switching = true;
  await fadeTo('');
  drive.stop();
  wind.stop();
  hideEnding();
  document.body.classList.remove('driving');
  globe.setActive(true);
  globe.resize();
  fade.classList.remove('on');
  switching = false;
}

$('p-drive').addEventListener('click', startDrive);
$('d-exit').addEventListener('click', stopDrive);
$('d-view').addEventListener('click', () => drive.toggleView());
$('d-sound').addEventListener('click', () => { $('d-sound-icon').textContent = wind.toggleMute() ? '🔇' : '🔊'; });
$('e-back').addEventListener('click', stopDrive);
$('e-again').addEventListener('click', async () => {
  if (switching) return;
  switching = true;
  await fadeTo('');
  hideEnding();
  $('d-log').replaceChildren();
  wind.start();
  drive.start();
  fade.classList.remove('on');
  switching = false;
});
document.querySelectorAll('.touch-pad button').forEach((b) => {
  const set = (v) => (e) => { e.preventDefault(); drive.setTouch(b.dataset.axis, v); };
  b.addEventListener('pointerdown', set(Number(b.dataset.v)));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => b.addEventListener(ev, set(0)));
});

window.__app = { globe, drive }; // handy in the browser console

// ---------- Loop ----------
const clock = new THREE.Clock();
function loop() {
  const dt = Math.min(clock.getDelta(), 0.05);
  globe.update(dt);
  drive.update(dt);
  requestAnimationFrame(loop);
}
loop();
