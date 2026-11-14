import * as THREE from 'three';
import { Globe } from './globe.js';
import { DriveSim } from './drive.js';
import { WindAudio } from './audio.js';
import { ROVERS } from './data.js';
import { STORIES } from './stories.js';
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
  if (location.hash === '#mars' || location.hash === '#drive' || linked) enter();
  if (linked) openRover(linked);
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

  const story = STORIES[rover.id][getLang()];
  const list = $('p-story');
  list.replaceChildren(...story.chapters.map((c) => {
    const li = document.createElement('li');
    const when = document.createElement('time');
    const title = document.createElement('h3');
    const text = document.createElement('p');
    when.textContent = c.when; title.textContent = c.title; text.textContent = c.text;
    li.append(when, title, text);
    return li;
  }));
  $('p-closing').textContent = story.closing;
  panel.style.setProperty('--c', rover.color);
}

function openRover(rover) {
  selected = rover;
  fillPanel(rover);
  panel.scrollTop = 0;
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
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selected && !drive.running) closePanel(); });

onLangChange(() => {
  globe.updateMarkerLabels((r) => t(`${r.id}.place`));
  if (selected) fillPanel(selected);
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
