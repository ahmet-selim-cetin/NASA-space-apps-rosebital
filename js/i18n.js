// English / Türkçe strings. Elements with data-i18n="key" are translated automatically.
const STRINGS = {
  en: {
    'title.top': 'Abandoned',
    'title.bottom': 'but not Forgotten',
    'intro.lead': 'They were built to last 90 days. They kept going for years. This is the story of the machines we left on Mars.',
    'intro.start': 'Explore Mars',
    'hint.drag': 'Drag to rotate · Scroll to zoom · Click a beacon',
    'panel.landed': 'Landed',
    'panel.lastContact': 'Last contact',
    'panel.distance': 'Distance',
    'panel.planned': 'Planned mission',
    'panel.lasted': 'Lasted',
    'panel.sols': 'sols',
    'panel.flights': 'flights',
    'panel.lastFlight': 'Last flight',
    'panel.story': 'Read the story',
    'panel.drive': 'Drive the last days',
    'panel.soon': 'Story coming soon',
    'panel.back': 'Back to Mars',
    'credit': 'Team Rosebital · NASA Space Apps Challenge · Map: NASA / JPL / USGS',
    'opportunity.place': 'Meridiani Planum',
    'opportunity.tagline': 'The rover that outlived its 90-day mission by 14 years — until a planet-wide dust storm went dark.',
    'spirit.place': 'Gusev Crater',
    'spirit.tagline': 'Trapped in soft sand with a broken wheel, it fought one last Martian winter.',
    'sojourner.place': 'Ares Vallis',
    'sojourner.tagline': 'The first wheels on Mars. It never broke — it simply lost its voice home.',
    'ingenuity.place': 'Jezero Crater',
    'ingenuity.tagline': 'Planned for 5 flights, it flew 72 — then a broken blade grounded it forever.',
  },
  tr: {
    'title.top': 'Terk Edildi',
    'title.bottom': 'ama Unutulmadı',
    'intro.lead': '90 gün dayanmaları için üretildiler. Yıllarca devam ettiler. Bu, Mars\'ta bıraktığımız makinelerin hikâyesi.',
    'intro.start': 'Mars\'ı Keşfet',
    'hint.drag': 'Döndürmek için sürükle · Yakınlaşmak için kaydır · Bir işarete tıkla',
    'panel.landed': 'İniş',
    'panel.lastContact': 'Son iletişim',
    'panel.distance': 'Mesafe',
    'panel.planned': 'Planlanan görev',
    'panel.lasted': 'Dayandığı süre',
    'panel.sols': 'sol',
    'panel.flights': 'uçuş',
    'panel.lastFlight': 'Son uçuş',
    'panel.story': 'Hikâyeyi oku',
    'panel.drive': 'Son günleri sür',
    'panel.soon': 'Hikâye yakında',
    'panel.back': 'Mars\'a dön',
    'credit': 'Rosebital Takımı · NASA Space Apps Challenge · Harita: NASA / JPL / USGS',
    'opportunity.place': 'Meridiani Planum',
    'opportunity.tagline': '90 günlük görevini 14 yıl aşan gezgin — ta ki tüm gezegeni saran bir toz fırtınası onu karanlığa gömene dek.',
    'spirit.place': 'Gusev Krateri',
    'spirit.tagline': 'Kırık bir tekerlekle yumuşak kuma saplandı ve son bir Mars kışıyla savaştı.',
    'sojourner.place': 'Ares Vallis',
    'sojourner.tagline': 'Mars\'taki ilk tekerlekler. Hiç bozulmadı — yalnızca eve ulaşan sesini kaybetti.',
    'ingenuity.place': 'Jezero Krateri',
    'ingenuity.tagline': '5 uçuş için planlandı, 72 kez uçtu — sonra kırık bir pervane onu sonsuza dek yere indirdi.',
  },
};

const listeners = new Set();
let lang = null;
try { lang = localStorage.getItem('lang'); } catch { /* storage unavailable */ }
if (lang !== 'en' && lang !== 'tr') lang = (navigator.language || '').startsWith('tr') ? 'tr' : 'en';

export function t(key) {
  return STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}

export function getLang() { return lang; }

export function setLang(next) {
  lang = next;
  try { localStorage.setItem('lang', next); } catch { /* ignore */ }
  document.documentElement.lang = next;
  applyI18n();
  listeners.forEach((fn) => fn(next));
}

export function onLangChange(fn) { listeners.add(fn); }

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
}
