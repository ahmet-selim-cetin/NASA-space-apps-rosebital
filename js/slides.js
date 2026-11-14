// Three-slide picture story shown when a beacon is clicked: beginning → big discovery → goodbye.
// Images: NASA Image and Video Library / JPL Photojournal (public domain NASA imagery, credits below).
// Slide texts are shortened from Team Rosebital's own stories (twins.js, sojourner.js, ingenuity.js).
export const SLIDES = {
  opportunity: [
    {
      img: 'img/slides/opportunity-1.jpg', credit: 'NASA/JPL/Cornell University · PIA04413',
      tr: { when: "24 Ocak 2004", title: "Tam isabet", text: "Opportunity üç hafta sonra, 24 Ocak 2004'te Mars'a indi. O daha şanslıydı: zıplayarak indikten sonra tam da küçük bir kraterin içine yuvarlandı.", cap: 'Mars yüzeyinde bir Mars Keşif Gezgini (çizim)' },
      en: { when: "January 24, 2004", title: "A hole in one", text: "Opportunity landed three weeks later, on January 24, 2004. It was luckier: after bouncing to a landing, it rolled right into a small crater.", cap: 'A Mars Exploration Rover on the surface of Mars (artist\'s concept)' },
    },
    {
      img: 'img/slides/opportunity-2.jpg', credit: 'NASA/JPL/Cornell/USGS · PIA05273',
      tr: { when: "2004", title: "Yaban mersinleri", text: "Taşların içinde boncuk kadar, yaban mersinine benzeyen minik toplar gördü: hematit. Sonra jarosit buldu. Yani burada, çok eskiden, su vardı.", cap: '"Yaban mersinleri": hematitten minik toplar, çok yakından' },
      en: { when: "2004", title: "Blueberries", text: "In the rocks it found tiny balls the size of beads that looked like blueberries: hematite. Then it found jarosite. So, long ago, there was water here.", cap: '"Blueberries": tiny balls of hematite, seen very close up' },
    },
    {
      img: 'img/slides/opportunity-3.jpg', credit: 'NASA/JPL-Caltech/TAMU · PIA22521',
      tr: { when: "Haziran 2018", title: "Gökyüzü karardı", text: "Dev bir toz fırtınası tüm gezegeni kapladı. Gündüz bile gece gibiydi. 10 Haziran 2018'deki son sinyali sanki \"Gücüm azalıyor\" der gibiydi.", cap: 'Fırtına büyüdükçe Opportunity\'nin gördüğü Güneş (canlandırma)' },
      en: { when: "June 2018", title: "The sky went dark", text: "A giant dust storm covered the whole planet. Even daytime was like night. Its last signal, on June 10, 2018, seemed to say: \"My power is getting low.\"", cap: 'The Sun as Opportunity saw it while the storm grew (simulation)' },
    },
  ],

  spirit: [
    {
      img: 'img/slides/spirit-1.jpg', credit: 'NASA · KSC-03pd1894',
      tr: { when: "2003 – 2004", title: "Yolculuk başlıyor", text: "2003 yazında roketle yola çıktı. 3 Ocak 2004'te dev bir şişme yastığa sarılı düştü ve yaklaşık otuz kez zıpladıktan sonra Gusev Krateri'nde durdu.", cap: 'Spirit\'i taşıyan roket fırlatılıyor' },
      en: { when: "2003 – 2004", title: "The journey begins", text: "In summer 2003 it set off on a rocket. On January 3, 2004 it fell wrapped in giant airbags and stopped in Gusev Crater after about thirty bounces.", cap: 'The rocket carrying Spirit lifts off' },
    },
    {
      img: 'img/slides/spirit-2.jpg', credit: 'NASA/JPL/Cornell · PIA09491',
      tr: { when: "2005 – 2007", title: "Bozuk tekerlek hazine buldu", text: "Bir gün tekerleklerinden biri bozuldu. Ama bu bozuk tekerlek, sürüklenirken toprağın altından neredeyse saf silika çıkardı. Bu madde kaplıcalarda oluşur!", cap: 'Sürüklenen tekerleğin açtığı parlak iz' },
      en: { when: "2005 – 2007", title: "A broken wheel found treasure", text: "One day one of its wheels broke. But as it was dragged along, that broken wheel dug up almost pure silica from under the soil. This forms in hot springs!", cap: 'The bright trail dug by the dragging wheel' },
    },
    {
      img: 'img/slides/spirit-3.jpg', credit: 'NASA/JPL-Caltech · PIA12337',
      tr: { when: "22 Mart 2010", title: "Son kış", text: "Mayıs 2009'da yumuşak kuma saplandı. Mars kışında panelleri ışık alamadı. 22 Mart 2010'da son sinyalini gönderdi ve Gusev Krateri'nde uykuya daldı.", cap: 'Spirit\'in kuma gömülen tekerlekleri (bilgisayar canlandırması)' },
      en: { when: "March 22, 2010", title: "The last winter", text: "In May 2009 it got stuck in soft sand. In winter its panels could not catch the light. On March 22, 2010 it sent its last signal and fell asleep.", cap: 'Spirit\'s wheels sunk in the sand (computer reconstruction)' },
    },
  ],

  sojourner: [
    {
      img: 'img/slides/sojourner-1.jpg', credit: 'NASA/JPL · PIA00611',
      tr: { when: "4 Temmuz 1997", title: "Zıplaya zıplaya Mars'a", text: "Adı bir yarışmayla seçildi: \"Sojourner\", yani \"yolcu\". 4 Temmuz 1997'de dev hava yastıklarıyla yaklaşık 15 kez zıplayıp Ares Vallis'e indi.", cap: 'İnişten hemen sonra: iniş aracının üzerinde Sojourner' },
      en: { when: "July 4, 1997", title: "Bouncing onto Mars", text: "Its name, \"Sojourner\", means \"traveller\". On July 4, 1997 it bounced about 15 times on giant airbags and landed in Ares Vallis.", cap: 'Just after landing: Sojourner on top of the lander' },
    },
    {
      img: 'img/slides/sojourner-2.jpg', credit: 'NASA/JPL · PIA00664',
      tr: { when: "Temmuz 1997", title: "İlk tekerlekler", text: "Ertesi gün rampadan indi ve başka bir gezegende yol alan ilk tekerlekli araç oldu. Sadece 7 gün çalışması gerekiyordu; 83 gün çalıştı!", cap: 'Sojourner\'ın Mars toprağında bıraktığı ilk izler' },
      en: { when: "July 1997", title: "The first wheels", text: "The next day it rolled down a ramp and became the first wheeled vehicle to drive on another planet. It only had to work for 7 days. It worked for 83!", cap: 'Sojourner\'s first tracks in the Martian soil' },
    },
    {
      img: 'img/slides/sojourner-3.jpg', credit: 'NASA/JPL · PIA01238',
      tr: { when: "27 Eylül 1997", title: "Bağlantı koptu", text: "Sojourner Dünya'ya yalnızca Pathfinder üzerinden ulaşabiliyordu. Pathfinder susunca onun sesi de kesildi. Hâlâ Ares Vallis'in toprağında duruyor.", cap: 'Sojourner\'ın iniş aracının çevresinde izlediği yol' },
      en: { when: "September 27, 1997", title: "The link was lost", text: "Sojourner could only reach Earth through Pathfinder. When Pathfinder fell silent, so did Sojourner. It still stands on the ground of Ares Vallis.", cap: 'The path Sojourner drove around its lander' },
    },
  ],

  ingenuity: [
    {
      img: 'img/slides/ingenuity-1.jpg', credit: 'NASA/JPL-Caltech/MSSS · PIA24424',
      tr: { when: "Şubat 2021", title: "Gezginin altındaki yolcu", text: "1,8 kilogramlık küçük bir helikopterdi. 18 Şubat 2021'de Perseverance'ın altında Jezero Krateri'ne indi. Tek bir soru vardı: Mars'ta uçmak mümkün mü?", cap: 'Perseverance\'ın altında katlı duran Ingenuity' },
      en: { when: "February 2021", title: "A passenger under the rover", text: "A small helicopter of just 1.8 kilograms, it landed in Jezero Crater under Perseverance on February 18, 2021. One question: can we fly on Mars?", cap: 'Ingenuity folded up under Perseverance' },
    },
    {
      img: 'img/slides/ingenuity-2.jpg', credit: 'NASA/JPL-Caltech/ASU/MSSS · PIA24550',
      tr: { when: "19 Nisan 2021", title: "Tarihe geçen 39 saniye", text: "Pervaneler dakikada 2.400 kez döndü. Ingenuity 3 metre yükseldi ve 39 saniye havada kaldı: başka bir gezegende uçan ilk motorlu hava aracı!", cap: 'İlk uçuşundan sonra Ingenuity, Perseverance\'ın kamerasından' },
      en: { when: "April 19, 2021", title: "39 seconds in history", text: "Its blades spun 2,400 times a minute. Ingenuity rose 3 metres and stayed in the air for 39 seconds: the first powered aircraft to fly on another planet!", cap: 'Ingenuity after its first flight, seen by Perseverance' },
    },
    {
      img: 'img/slides/ingenuity-3.jpg', credit: 'NASA/JPL-Caltech · PIA26243',
      tr: { when: "18 Ocak 2024", title: "72. uçuş", text: "Düz kumun üzerinde navigasyon sistemi takip edecek desen bulamadı. Sert indi ve dört pervanesi kırıldı. 5 uçuş için tasarlanmıştı; 72 kez uçtu.", cap: 'Ingenuity kendi hasarlı pervanesinin gölgesini fotoğrafladı' },
      en: { when: "January 18, 2024", title: "Flight 72", text: "Over flat sand, its navigation system found no patterns to follow. It landed hard and all four blades broke. Built for 5 flights, it flew 72.", cap: 'Ingenuity photographed the shadow of its own damaged blade' },
    },
  ],
};
