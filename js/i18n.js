// English / Türkçe strings. Elements with data-i18n="key" are translated automatically.
const STRINGS = {
  en: {
    'title.top': 'Abandoned',
    'title.bottom': 'but not Forgotten',
    'intro.lead': 'They were built to last 90 days. They kept going for years. This is the story of the machines we left on Mars.',
    'intro.start': 'Explore Mars',
    'intro.moon': 'Explore the Moon',
    'world.mars': 'Mars',
    'world.moon': 'Moon',
    'slides.info': 'Mission facts',
    'credit.moon': 'Team Rosebital · NASA Space Apps Challenge · Moon map: “moon” by RenderX (CC BY 4.0)',
    'apollo12.place': 'Ocean of Storms',
    'apollo12.tagline': 'A robot waited on the Moon for two and a half years. Then two astronauts came to visit.',
    'hint.drag': 'Drag to rotate · Scroll to zoom · Click a beacon',
    'panel.landed': 'Landed',
    'panel.lastContact': 'Last contact',
    'panel.distance': 'Distance',
    'panel.planned': 'Planned mission',
    'panel.lasted': 'Lasted',
    'panel.sols': 'sols',
    'panel.flights': 'flights',
    'panel.lastFlight': 'Last flight',
    'panel.storyTitle': 'The story',
    'panel.drive': 'Drive the last days',
    'panel.back': 'Back to Mars',
    'slides.prev': 'Back',
    'slides.next': 'Next',
    'slides.story': 'Read the whole story',
    'drive.location': 'Perseverance Valley, Meridiani Planum',
    'drive.view': 'Camera',
    'drive.battery': 'Battery',
    'drive.speed': 'Speed',
    'drive.solar': 'Solar power',
    'drive.tau': 'Dust in the sky',
    'drive.temp': 'Temperature',
    'drive.heading': 'Heading',
    'drive.trip': 'Driven',
    'drive.help': 'W A S D or arrow keys to drive · Drag to look around · C to change camera',
    'drive.loading': 'Waking up Opportunity…',
    'drive.card': 'Sol 5,100 · Perseverance Valley\nYou are looking through Opportunity\'s eyes.',
    'log.detect': 'Sol 5100 · A NASA spacecraft in orbit spots a dust storm nearby',
    'log.rising': 'The sky is filling with dust · science work stops',
    'log.panels': 'The sunlight is fading · the solar panels are making less power',
    'log.low': 'Battery low · switching off everything that can wait',
    'log.fault': 'Almost no power left · everything is off except the clock',
    'log.last': 'Sol 5111 · June 10, 2018 · last signal received on Earth',
    'end.kicker': 'Sol 5111 · June 10, 2018',
    'end.title': 'Opportunity fell silent.',
    'end.body': 'The storm grew until it covered the whole planet. For eight months engineers sent more than a thousand commands, hoping for an answer. None came. On February 13, 2019, NASA announced that the mission was complete.',
    'end.sols': '5,111',
    'end.km': '45.16',
    'end.closing': 'Maybe the greatest discovery of all is to keep trying, without ever saying "if only".',
    'end.again': 'Drive again',
    'credit': 'Team Rosebital · NASA Space Apps Challenge · Map: NASA / JPL / USGS',
    'opportunity.place': 'Meridiani Planum',
    'opportunity.tagline': 'Built for 90 days, it kept going for more than 14 years — until a dust storm turned its sky dark.',
    'spirit.place': 'Gusev Crater',
    'spirit.tagline': 'Stuck in soft sand with a broken wheel, it fought one last Martian winter.',
    'sojourner.place': 'Ares Vallis',
    'sojourner.tagline': 'The first wheels on Mars. It worked twelve times longer than planned — then lost its voice home.',
    'ingenuity.place': 'Jezero Crater',
    'ingenuity.tagline': 'Planned for 5 flights, it flew 72 — then a broken blade grounded it forever.',
  },
  tr: {
    'title.top': 'Terk Edildi',
    'title.bottom': 'ama Unutulmadı',
    'intro.lead': '90 gün dayanmaları için üretildiler. Yıllarca devam ettiler. Bu, Mars\'ta bıraktığımız makinelerin hikâyesi.',
    'intro.start': 'Mars\'ı Keşfet',
    'intro.moon': 'Ay\'ı Keşfet',
    'world.mars': 'Mars',
    'world.moon': 'Ay',
    'slides.info': 'Görev bilgileri',
    'credit.moon': 'Rosebital Takımı · NASA Space Apps Challenge · Ay haritası: RenderX, “moon” (CC BY 4.0)',
    'apollo12.place': 'Fırtınalar Okyanusu',
    'apollo12.tagline': 'Bir robot Ay\'da iki buçuk yıl bekledi. Sonra iki astronot onu ziyarete geldi.',
    'hint.drag': 'Döndürmek için sürükle · Yakınlaşmak için kaydır · Bir işarete tıkla',
    'panel.landed': 'İniş',
    'panel.lastContact': 'Son iletişim',
    'panel.distance': 'Mesafe',
    'panel.planned': 'Planlanan görev',
    'panel.lasted': 'Dayandığı süre',
    'panel.sols': 'sol',
    'panel.flights': 'uçuş',
    'panel.lastFlight': 'Son uçuş',
    'panel.storyTitle': 'Hikâyesi',
    'panel.drive': 'Son günleri sür',
    'panel.back': 'Mars\'a dön',
    'slides.prev': 'Geri',
    'slides.next': 'İleri',
    'slides.story': 'Hikâyenin tamamını oku',
    'drive.location': 'Perseverance Vadisi, Meridiani Planum',
    'drive.view': 'Kamera',
    'drive.battery': 'Batarya',
    'drive.speed': 'Hız',
    'drive.solar': 'Güneş gücü',
    'drive.tau': 'Gökyüzündeki toz',
    'drive.temp': 'Sıcaklık',
    'drive.heading': 'Yön',
    'drive.trip': 'Gidilen yol',
    'drive.help': 'Sürmek için W A S D ya da ok tuşları · Etrafa bakmak için sürükle · Kamera için C',
    'drive.loading': 'Opportunity uyandırılıyor…',
    'drive.card': 'Sol 5.100 · Perseverance Vadisi\nOpportunity\'nin gözlerinden bakıyorsun.',
    'log.detect': 'Sol 5100 · Yörüngedeki bir NASA uzay aracı yakında bir toz fırtınası gördü',
    'log.rising': 'Gökyüzü tozla doluyor · bilim çalışmaları durdu',
    'log.panels': 'Güneş ışığı azalıyor · paneller daha az güç üretiyor',
    'log.low': 'Batarya azaldı · bekleyebilecek her şey kapatılıyor',
    'log.fault': 'Güç neredeyse bitti · saat dışında her şey kapalı',
    'log.last': 'Sol 5111 · 10 Haziran 2018 · Dünya\'ya ulaşan son sinyal',
    'end.kicker': 'Sol 5111 · 10 Haziran 2018',
    'end.title': 'Opportunity sustu.',
    'end.body': 'Fırtına büyüdü ve bütün gezegeni kapladı. Mühendisler sekiz ay boyunca binden fazla komut gönderip bir yanıt bekledi. Yanıt gelmedi. 13 Şubat 2019\'da NASA görevin tamamlandığını duyurdu.',
    'end.sols': '5.111',
    'end.km': '45,16',
    'end.closing': 'Belki de en güzel keşif, "keşke" demeden denemeye devam etmektir.',
    'end.again': 'Yeniden sür',
    'credit': 'Rosebital Takımı · NASA Space Apps Challenge · Harita: NASA / JPL / USGS',
    'opportunity.place': 'Meridiani Planum',
    'opportunity.tagline': '90 gün için üretildi, 14 yıldan uzun süre yol aldı — ta ki bir toz fırtınası gökyüzünü karartana dek.',
    'spirit.place': 'Gusev Krateri',
    'spirit.tagline': 'Bozuk bir tekerlekle yumuşak kuma saplandı ve son bir Mars kışına direndi.',
    'sojourner.place': 'Ares Vallis',
    'sojourner.tagline': 'Mars\'taki ilk tekerlekler. Planlanandan on iki kat uzun çalıştı, sonra eve ulaşan sesini kaybetti.',
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
