<p align="center"><img src="assets/rosebital-logo.svg" width="360" alt="Rosebital, GZOAL Tech Team" /></p>

# NASA-space-apps-rosebital
Rosebital is the technology team of Gulizar Zeki Obdan Anadolu Lisesi in Istanbul, Türkiye.   Our name combines “rose” and “orbital”, inspired by the rose gardens that give our school its name. We imagine roses blooming in orbits out in space.more adventure

**NASA Space Apps Challenge 2026 · Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**

---

## The Last Signal / Son Sinyal

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
5. **Fly the last flight / Son uçuşu yap** (Ingenuity) — W S to move, A D to turn, Space / Shift to go higher / lower, drag to look, C to change camera. You choose the height and the direction; the ending never changes (see below).
6. **Try to break free / Kumdan kurtulmaya çalış** (Spirit) — W A S D to drive; after about 24 m (or 24 s) the sand takes the wheels, and then S or ↓ pushes in reverse, A D steer a little, drag to look, C to see Spirit from outside. The rover creeps a few centimetres at best, then winter takes the light; the ending never changes.
   In about two minutes the storm grows: dust fills the sky, solar power and battery fall, the rover slows down and finally goes silent.
   *Yaklaşık iki dakikada fırtına büyür: gökyüzü tozla dolar, güneş gücü ve batarya düşer, gezgin yavaşlar ve sonunda susar.*

Battery, solar-power and temperature values in the game are illustrations; the dates, sol numbers, distance and sky opacity (tau 10.8) follow NASA.
*Oyundaki batarya, güneş gücü ve sıcaklık değerleri temsilîdir; tarihler, sol sayıları, mesafe ve gökyüzü opaklığı (tau 10,8) NASA verisine dayanır.*

### The story / Hikâye

The Spirit, Opportunity, Sojourner, Ingenuity and Surveyor 3 & Apollo 12 (Moon) stories were written by **Team Rosebital** in Turkish and translated into English.
Their facts were checked against the NASA / JPL sources below.
*Spirit, Opportunity, Sojourner, Ingenuity ve Surveyor 3 & Apollo 12 (Ay) hikâyeleri **Rosebital Takımı** tarafından Türkçe yazıldı ve İngilizceye çevrildi; bilgiler aşağıdaki NASA / JPL kaynaklarıyla kontrol edildi.*

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
js/drive.js         first-person Opportunity drive (dust storm) and Ingenuity flight 72
js/audio.js         wind sound
js/data.js          mission numbers and coordinates
js/twins.js         Spirit & Opportunity story (Team Rosebital)
js/sojourner.js     Sojourner story (Team Rosebital)
js/ingenuity.js     Ingenuity story (Team Rosebital)
js/moon.js          Surveyor 3 & Apollo 12 Moon story (Team Rosebital)
js/stories.js       stories for all rovers
js/slides.js        3-slide picture stories
js/i18n.js          English / Türkçe texts
img/slides/         NASA photos for the slides
img/share-card.png  social share card (team logo)
assets/             team logo (SVG), tab icon
fonts/              title font "Hacked"
favicon.ico         tab icon (fallback)
textures/           NASA Mars map
models/             3D models (models/terrain/ = baked drive ground)
tools/              bake-terrain.mjs: turns the terrain model into game files
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
| Moon 1 | Surveyor 3 footpad and soil sampler, Apollo 12 EVA-2 — https://images.nasa.gov/details/as12-48-7110 | NASA |
| Moon 2 | Two U.S. spacecraft on the Moon: Surveyor 3 and the Apollo 12 LM — https://images.nasa.gov/details/AS12-48-7134 | NASA |
| Moon 3 | View of Surveyor III in its crater — https://images.nasa.gov/details/as12-48-7121 | NASA |

### Moon / Ay
- Moon map: texture taken from `models/moon (1).glb` — "moon" by RenderX on Sketchfab, licensed CC BY 4.0: https://sketchfab.com/3d-models/moon-26cc0b7878bb4d919b68e2be399db466 (flipped north-up and resized to `textures/moon_4k.jpg`).
- Surveyor 3 — NASA Science: https://science.nasa.gov/mission/surveyor-3/
- Apollo 12 lunar module (samples, time on the surface, ascent stage impact) — NASA NSSDCA: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C

### Coordinates / Koordinatlar
The side panel shows the landing-site coordinates exactly as printed on these pages (each panel also links to its source):
- **Opportunity** — 1.9483° S, 354.47417° E — NASA Science: https://science.nasa.gov/mission/mer-opportunity/
- **Spirit** — 14.5692° S, 175.4729° E — NASA/JPL NAIF mission catalog: https://naif.jpl.nasa.gov/pub/naif/pds/data/mer1-m-spice-6-v1.0/mer1sp_1000/catalog/mission.cat
- **Sojourner / Mars Pathfinder** — 19.13° N, 33.22° W — NASA Facts, Mars Pathfinder: https://mars.nasa.gov/internal_resources/815/ (other NASA pages give slightly different values: NSSDC 19.33° N, 33.55° W; Mars24 19.47° N, 326.75° E)
- **Ingenuity** — first airfield, Wright Brothers Field, 18°26′41″ N 77°27′04″ E — Wikipedia, List of Ingenuity flights: https://en.wikipedia.org/wiki/List_of_Ingenuity_flights (no NASA page with coordinates was found). Its final resting place, Airfield Chi (flight 72), is on the same page: 18°29′50″ N 77°19′21″ E
- **Surveyor 3** — 3.0162° S, 336.582° E (found from Lunar Reconnaissance Orbiter images) — NASA NSSDCA: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A
- **Apollo 12** — lunar module, 3.0128° S, 23.4219° W — NASA NSSDCA lunar sites: https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html

Where the team's source sheet differed from the page it cites (Sojourner, Surveyor 3, small rounding for Apollo 12 and Ingenuity), the value printed on the cited page was used.

### Fonts and logo / Yazı tipleri ve logo
- **Hacked** (intro title) — by David Libeau, licensed CC BY 4.0: https://www.fontspace.com/hacked-font-f28425 · `fonts/hacked-font/`
- **Nunito** (all other text) — Google Fonts, SIL Open Font License: https://fonts.google.com/specimen/Nunito
- **Logo** — Rosebital / GZOAL Tech Team logo, made by the team (`assets/rosebital-lockup-dark.svg`). `assets/rosebital-logo.svg`, `assets/rosebital-pill.svg`, `assets/favicon.svg`, `favicon.ico` and `img/share-card.png` are derived from it (background removed, straightened, cropped).

### Team source sheet / Takım kaynak tablosu
https://docs.google.com/spreadsheets/d/1B27CVgnJ7uxL9cvEWX8QfvTVxY87lROzzPXS3N427qw

### 3D models
- Opportunity / Spirit — NASA 3D Resources: https://science.nasa.gov/3d-resources/mars-exploration-rover-spirit-and-opportunity/
- Ingenuity — NASA 3D Resources: https://science.nasa.gov/3d-resources/ingenuity-mars-helicopter/
- Sojourner — Sketchfab: https://sketchfab.com/3d-models/sojourner-mars-rover-7f135874ddd34f8f98904b53a2c178e1
- `models/Mars(yeni).glb` — stylised Mars sculpt by Team Rosebital (not used on the globe; the globe uses the NASA map above).
- Opportunity drive ground — `models/Mars - Opportunity Yolu.glb`, a terrain sculpted by Team Rosebital (one tile, ~141 × 143 m, 11.5 MB). The game does not load the GLB itself: `tools/bake-terrain.mjs` bakes it into `models/terrain/` (`height.bin` 1 m height grid, `color.png` colours from the model, `terrain.json` size/scale), which is much smaller and also gives the rover its ground height. The outer 8 m of the model is trimmed because its edge is stretched. To rebuild after the model changes: `node tools/bake-terrain.mjs "models/Mars - Opportunity Yolu.glb" models/terrain 8`. The rover is kept inside the terrain (8 m margin), cannot climb slopes steeper than ~32°, and beyond the edge the ground fades into generated hills for the horizon. (The tool also joins multi-tile models, as it did for an earlier "Spirit Yolu" terrain.)
- Ingenuity helicopter in the flight game — `models/ingenuity_mars_helicopter.glb`, "Ingenuity Mars helicopter" by Cybertron B-127 (https://sketchfab.com/robo-reboot) on Sketchfab, licensed CC BY 4.0: https://sketchfab.com/3d-models/ingenuity-mars-helicopter-0d5bdd6b28bb469ea99cc9a74e06169a

### Ingenuity flight game (flight 72) / Ingenuity uçuş oyunu
The timeline follows NASA/JPL's account of flight 72 (January 18, 2024); the game runs slower than the flight clock shown on screen so there is time to look around (1.9× slower until the descent starts, 1.2× from there on, under a minute in all).
- NASA performs first aircraft accident investigation on another world (flight 72: 12 m, about 20 s after takeoff the navigation system could not find enough surface features, descent at 19 s, back on the ground at 32 s, hard impact on a sand ripple, all four blades snapped, contact later restored): https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/
- After three years on Mars, NASA's Ingenuity helicopter mission ends (contact with Perseverance lost about 1 m above the surface; mission end announced January 25, 2024): https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/
- The flight happens in Jezero Crater, but the ground in the game is the same team-made Opportunity terrain (`models/terrain/`), started from a different spot (northwest, facing the middle). The helicopter is shown at its real size (1.21 m rotor span). The spinning of the blades is for show.

### Spirit's last winter game / Spirit'in son kışı oyunu
60 seconds: free driving in "spring 2009", then the rover sinks into soft sand (after 24 m driven or 24 s, whichever comes first), then "winter 2010" (sols 2190 to 2210). The ten months between getting stuck and the winter are skipped on screen, which is why the date changes from "Spring 2009" to the sol count. Facts follow NASA/JPL (the rover sat in soft sand beside Home Plate from spring 2009, could not tilt its solar panels toward the Sun in winter 2010, moved only about 13 inches (33 cm) in its last 10 backward drives, went into deep sleep with its heaters and radio off, and last communicated on March 22, 2010, sol 2210; the last recovery attempt ended on May 25, 2011).
- NASA's Spirit rover completes mission on Mars (7.73 km, March 22, 2010, May 25, 2011): https://www.jpl.nasa.gov/news/nasas-spirit-rover-completes-mission-on-mars/
- NASA trapped Mars rover finds evidence of subsurface water (winter 2010 plan, deep sleep, 13 inches in the last 10 backward drives): https://jpl.nasa.gov/news/news.php?release=2010-355
- NASA concludes attempts to contact Mars rover Spirit (more than 1,300 commands, May 25, 2011): https://www.jpl.nasa.gov/news/nasa-concludes-attempts-to-contact-mars-rover-spirit/
- Mars Exploration Rover Spirit End of Mission Report (sol 2210): https://ntrs.nasa.gov/citations/20160001767
- The model is the same twin rover as Opportunity (`models/nasa_opportunity_rover.glb`). The ground is the same team-made Opportunity terrain (`models/terrain/`), started from the southwest; the place name on screen is Gusev Crater · Home Plate.
- The game shows the real 33 cm as the most the rover can move. Pushing changes the numbers (how much sand is thrown, how far it creeps), never the ending.
