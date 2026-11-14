# NASA-space-apps-rosebital
Rosebital is the technology team of Gulizar Zeki Obdan Anadolu Lisesi in Istanbul, Türkiye.   Our name combines “rose” and “orbital”, inspired by the rose gardens that give our school its name. We imagine roses blooming in orbits out in space.more adventure

**NASA Space Apps Challenge 2026 · Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**

---

## Abandoned but not Forgotten / Terk Edildi ama Unutulmadı

**EN** — An interactive, bilingual (English / Türkçe) story about the robots we left on Mars, made for readers aged 7–12.
Spin a 3D globe of Mars built from a real NASA map, click a glowing beacon, and meet the rover that lies there:
a three-picture story with real NASA photos, a full story with dates and numbers, and — for Opportunity —
a short first-person game in which you drive through its last days as the 2018 dust storm slowly turns the sky dark.

**TR** — Mars'ta bıraktığımız robotların etkileşimli ve iki dilli (Türkçe / English) hikâyesi; 7–12 yaş için hazırlandı.
Gerçek bir NASA haritasıyla kaplanmış 3B Mars'ı çevir, parlayan bir işarete tıkla ve orada yatan gezgini tanı:
gerçek NASA fotoğraflarıyla üç sayfalık bir resimli hikâye, tarihleri ve sayılarıyla hikâyenin tamamı ve Opportunity için
2018 toz fırtınası gökyüzünü yavaş yavaş karartırken son günlerini birinci şahıs gözünden sürdüğün kısa bir oyun.

### How it works / Nasıl çalışır

1. **Explore Mars / Mars'ı keşfet** — drag to rotate, scroll to zoom. Four beacons: Opportunity, Spirit, Sojourner, Ingenuity.
   *Sürükleyerek döndür, kaydırarak yakınlaş. Dört işaret var.*
2. **Picture story / Resimli hikâye** — clicking a beacon opens 3 slides: the beginning, the big discovery, the goodbye.
   *Bir işarete tıklayınca 3 sayfa açılır: başlangıç, büyük keşif, veda.*
3. **Full story / Hikâyenin tamamı** — a side panel with mission numbers and the whole story as a timeline.
   *Görev bilgileri ve hikâyenin tamamı yan panelde, zaman çizelgesi olarak.*
4. **Drive the last days / Son günleri sür** (Opportunity) — W A S D or arrow keys to drive, drag to look, C to change camera.
   In about two minutes the storm grows: dust fills the sky, solar power and battery fall, the rover slows down and finally goes silent.
   *Yaklaşık iki dakikada fırtına büyür: gökyüzü tozla dolar, güneş gücü ve batarya düşer, gezgin yavaşlar ve sonunda susar.*

Battery, solar-power and temperature values in the game are illustrations; the dates, sol numbers, distance and sky opacity (tau 10.8) follow NASA.
*Oyundaki batarya, güneş gücü ve sıcaklık değerleri temsilîdir; tarihler, sol sayıları, mesafe ve gökyüzü opaklığı (tau 10,8) NASA verisine dayanır.*

### The story / Hikâye

The Spirit, Opportunity, Sojourner and Ingenuity stories were written by **Team Rosebital** in Turkish and translated into English.
Their facts were checked against the NASA / JPL sources below.
*Spirit, Opportunity, Sojourner ve Ingenuity hikâyeleri **Rosebital Takımı** tarafından Türkçe yazıldı ve İngilizceye çevrildi; bilgiler aşağıdaki NASA / JPL kaynaklarıyla kontrol edildi.*

### Built with / Kullanılan teknolojiler

- HTML, CSS and JavaScript modules, no build step · [three.js](https://threejs.org/) r160 for the globe and the game
- Wind sound generated in the browser with the Web Audio API (no audio files)
- `server.py` — small Python server for local testing

### Project structure / Proje yapısı

```
index.html          page
css/style.css       styles
js/main.js          app wiring (globe, slides, panel, game)
js/globe.js         3D Mars globe and beacons
js/drive.js         first-person drive and dust storm
js/audio.js         wind sound
js/data.js          mission numbers and coordinates
js/twins.js         Spirit & Opportunity story (Team Rosebital)
js/sojourner.js     Sojourner story (Team Rosebital)
js/ingenuity.js     Ingenuity story (Team Rosebital)
js/stories.js       stories for all rovers
js/slides.js        3-slide picture stories
js/i18n.js          English / Türkçe texts
img/slides/         NASA photos for the slides
textures/           NASA Mars map
models/             3D models
```

## Run locally / Yerelde çalıştırma

```
python server.py
```

Then open / Ardından aç: http://localhost:8000

## References / Kaynaklar

### Mars map
- **Mars Viking Colorized Global Mosaic 232m (MDIM 2.1)** — NASA Ames / USGS Astrogeology Science Center. Public domain.
  https://astrogeology.usgs.gov/search/map/mars_viking_colorized_global_mosaic_232m
- Tiles downloaded from **NASA Mars Trek** (NASA / JPL-Caltech), layer `Mars_Viking_MDIM21_ClrMosaic_global_232m`, zoom level 3, stitched to `textures/mars_viking_mdim21_4k.jpg`.
  https://trek.nasa.gov/mars/

### Mission data
- **Opportunity & Spirit** — NASA Science, Mars Exploration Rovers: https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/
  Opportunity page: https://science.nasa.gov/mission/mer-opportunity/ · Spirit page: https://science.nasa.gov/mission/mer-spirit/
  JPL news release, 13 Feb 2019: https://www.jpl.nasa.gov/news/nasas-opportunity-rover-mission-on-mars-comes-to-end/
  Coordinates (NAIF / PDS mission catalog): https://naif.jpl.nasa.gov/pub/naif/pds/data/mer1-m-spice-6-v1.0/mer1sp_1000/catalog/mission.cat
- **Sojourner / Mars Pathfinder** — NASA Science: https://science.nasa.gov/mission/mars-pathfinder/
  Landing site: https://mars.nasa.gov/internal_resources/815/
- **Ingenuity** — NASA Science: https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/
  JPL news release, 25 Jan 2024: https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/
  Flight log and positions: https://en.wikipedia.org/wiki/List_of_Ingenuity_flights

### Story details (checked against)
- Opportunity: hole-in-one landing and hematite "blueberries" — https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/science-highlights/ ; last contact on sol 5111 — JPL end-of-mission report https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl%3A2014%2F47103
- Spirit: Husband Hill climb — https://science.nasa.gov/photojournal/looking-back-at-spirits-trail-to-the-summit/ ; stuck at "Troy" — https://www.jpl.nasa.gov/news/nasa-to-begin-attempts-to-free-sand-trapped-mars-rover/
- Sojourner: NASA Facts sheet (coordinates, size, speed, rocks, end of mission) — https://mars.nasa.gov/internal_resources/815/ ; https://www.nasa.gov/history/25-years-ago-mars-pathfinder-launches-to-mars-to-deploy-sojourner-the-first-planetary-rover/
- Ingenuity: first flight — https://www.nasa.gov/news-release/nasas-ingenuity-mars-helicopter-succeeds-in-historic-first-flight/ ; Flight 72 investigation — https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/

### Slide images / Slayt resimleri
All images are NASA imagery from the NASA Image and Video Library (https://images.nasa.gov) and the JPL Photojournal, resized for the web. On the site, the credit line under each slide image links to the image's NASA page.
*Tüm resimler NASA görselleridir; web için küçültüldü.*

| Slide | Image | Credit |
|---|---|---|
| Opportunity 1 | Artist Concept of Rover on Mars — https://photojournal.jpl.nasa.gov/catalog/PIA04413 | NASA/JPL/Cornell University |
| Opportunity 2 | "Berries" on the Ground — https://photojournal.jpl.nasa.gov/catalog/PIA05273 | NASA/JPL/Cornell/USGS |
| Opportunity 3 | Shades of Martian Darkness — https://photojournal.jpl.nasa.gov/catalog/PIA22521 | NASA/JPL-Caltech/TAMU |
| Spirit 1 | Launch of MER-A "Spirit", 10 June 2003 — https://images.nasa.gov/details/KSC-03pd1894 | NASA |
| Spirit 2 | Silica-Rich Soil Found by Spirit — https://photojournal.jpl.nasa.gov/catalog/PIA09491 | NASA/JPL/Cornell |
| Spirit 3 | Computer Reconstruction of Spirit Predicament — https://photojournal.jpl.nasa.gov/catalog/PIA12337 | NASA/JPL-Caltech |
| Sojourner 1 | Pathfinder Rover, Airbags, & Martian Terrain — https://photojournal.jpl.nasa.gov/catalog/PIA00611 | NASA/JPL |
| Sojourner 2 | Sojourner Success Image — https://photojournal.jpl.nasa.gov/catalog/PIA00664 | NASA/JPL |
| Sojourner 3 | Mars Pathfinder Rover Traverse Image — https://photojournal.jpl.nasa.gov/catalog/PIA01238 | NASA/JPL |
| Ingenuity 1 | WATSON Spies Ingenuity on Perseverance Rover's Belly — https://photojournal.jpl.nasa.gov/catalog/PIA24424 | NASA/JPL-Caltech/MSSS |
| Ingenuity 2 | Ingenuity's First Flight Recorded by Mastcam-Z — https://photojournal.jpl.nasa.gov/catalog/PIA24550 | NASA/JPL-Caltech/ASU/MSSS |
| Ingenuity 3 | Ingenuity Spots the Shadow of Its Damaged Rotor Blade — https://photojournal.jpl.nasa.gov/catalog/PIA26243 | NASA/JPL-Caltech |

### Team source sheet / Takım kaynak tablosu
https://docs.google.com/spreadsheets/d/1B27CVgnJ7uxL9cvEWX8QfvTVxY87lROzzPXS3N427qw

### 3D models
- Opportunity / Spirit — NASA 3D Resources: https://science.nasa.gov/3d-resources/mars-exploration-rover-spirit-and-opportunity/
- Ingenuity — NASA 3D Resources: https://science.nasa.gov/3d-resources/ingenuity-mars-helicopter/
- Sojourner — Sketchfab: https://sketchfab.com/3d-models/sojourner-mars-rover-7f135874ddd34f8f98904b53a2c178e1
- `models/Mars(yeni).glb` — stylised Mars sculpt by Team Rosebital (not used on the globe; the globe uses the NASA map above).
