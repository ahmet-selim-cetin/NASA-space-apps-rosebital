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

  // Moon: one shared story for Surveyor 3 and Apollo 12 (robot lands → astronauts visit → what stayed behind).
  apollo12: [
    {
      img: 'img/slides/apollo12-1.jpg', credit: 'NASA · AS12-48-7110',
      tr: { when: 'Nisan 1967', title: "Zıplaya zıplaya Ay'a", text: "Surveyor 3 Ay'a çarptı, iki kez zıpladı ve üçüncüde yumuşak indi. Toprağı kazdı: Ay toprağı bir Apollo ay modülünü taşıyacak kadar sağlamdı.", cap: "Surveyor 3'ün ayağı ve zıplarken toprakta bıraktığı iz" },
      en: { when: 'April 1967', title: 'Bouncing onto the Moon', text: 'Surveyor 3 hit the Moon, bounced twice and landed softly the third time. It dug into the soil: the ground was strong enough to hold an Apollo lunar module.', cap: "Surveyor 3's footpad and the mark it left when it bounced" },
    },
    {
      img: 'img/slides/apollo12-2.jpg', credit: 'NASA · AS12-48-7134',
      tr: { when: 'Kasım 1969', title: 'İki buçuk yıl sonra bir ziyaret', text: "Apollo 12 astronotları Surveyor 3'e sadece 180 metre uzağa indi. İkinci gün ona yürüdüler; kamerasını ve toprak kepçesini söküp Dünya'ya götürdüler.", cap: "Astronot Surveyor 3'ün yanında; arkada ay modülü Intrepid" },
      en: { when: 'November 1969', title: 'A visit, two and a half years later', text: 'The Apollo 12 astronauts landed just 180 metres from Surveyor 3. The next day they walked to it and took its camera and soil scoop back to Earth.', cap: 'An astronaut beside Surveyor 3; the lunar module Intrepid behind' },
    },
    {
      img: 'img/slides/apollo12-3.jpg', credit: 'NASA · AS12-48-7121',
      tr: { when: 'Bugün', title: 'Hâlâ orada', text: "Gövdesi Ay'da kaldı. İki buçuk yıl ziyaretçi bekledi. Ziyaretçi geldi, bir parçasını aldı, gitti. Surveyor 3 beklemeye devam ediyor.", cap: "Surveyor 3, Fırtınalar Okyanusu'ndaki küçük kraterinde" },
      en: { when: 'Today', title: 'Still there', text: 'Its body stayed on the Moon. For two and a half years it waited for a visitor. The visitor came, took a piece of it, and left. Surveyor 3 is still waiting.', cap: 'Surveyor 3 in its small crater in the Ocean of Storms' },
    },
  ],

    // Dates and captions follow the NASA image pages named in each credit line (see README).
  viking1: [
    {
      img: 'img/slides/viking1-1.jpg', credit: 'NASA/JPL · PIA00381',
      tr: { when: '20 Temmuz 1976', title: "Mars'tan ilk fotoğraf", text: "Viking 1 paraşüt ve üç motorla Chryse Planitia'ya yumuşak iniş yaptı. Beş dakika içinde Mars yüzeyinden çekilen ilk fotoğrafı göndermeye başladı.", cap: "İnişten dakikalar sonra çekilen ilk fotoğraf: kayalar ve iniş aracının ayağı" },
      en: { when: 'July 20, 1976', title: 'The first photo from Mars', text: 'Viking 1 landed softly in Chryse Planitia with a parachute and three engines. Within five minutes it began sending the first photo ever taken on Mars.', cap: "The first photo, taken minutes after landing: rocks and a footpad of the lander" },
    },
    {
      img: 'img/slides/viking1-2.jpg', credit: 'NASA/JPL · PIA00382',
      tr: { when: '1976 – 1982', title: 'Toprakta yaşam arayışı', text: 'Robot kolu toprağı kazdı, üç deney toprakta canlı aradı. Kesin bir yaşam kanıtı bulunamadı. 90 gün için tasarlanmıştı; 6 yıldan fazla çalıştı.', cap: "Viking 1'in ilk panoraması: antenler, kayalar ve ufuktaki yayla" },
      en: { when: '1976 – 1982', title: 'Looking for life in the soil', text: 'Its robotic arm dug up soil, and three experiments searched it for life. No proof of life was found. Built for 90 days, it worked for more than 6 years.', cap: "Viking 1's first panorama: antennas, rocks and a plateau on the horizon" },
    },
    {
      img: 'img/slides/viking1-3.jpg', credit: 'NASA/JPL · PIA00565',
      tr: { when: 'Bugün', title: 'Hâlâ orada', text: "11 Kasım 1982'de Dünya'dan giden hatalı bir komut bağlantıyı kopardı. Viking 1 hâlâ Chryse Planitia'nın batı yamacında, tozla kaplı duruyor.", cap: "Viking 1'in üzerindeki ABD bayrağı" },
      en: { when: 'Today', title: 'Still there', text: 'On November 11, 1982, a wrong command from Earth cut the link. Viking 1 still stands on the western slope of Chryse Planitia, covered in dust.', cap: 'The U.S. flag on Viking 1' },
    },
  ],
  viking2: [
    {
      img: 'img/slides/viking2-1.jpg', credit: 'NASA/JPL · PIA00396',
      tr: { when: '3 Eylül 1976', title: 'Yan yatmış bir iniş', text: "Viking 2, Mars'ın kuzeyindeki Utopia Planitia'ya indi. Bir ayağı kayaya bastığı için hafifçe yan yatmıştı. Ama hemen ilk fotoğrafını gönderdi.", cap: "Viking 2'nin yüzeyden çektiği ilk fotoğraf" },
      en: { when: 'September 3, 1976', title: 'A tilted landing', text: 'Viking 2 landed in Utopia Planitia, in the north of Mars. One foot rested on a rock, so it leaned a little to one side. But it sent its first photo right away.', cap: "Viking 2's first picture from the surface" },
    },
    {
      img: 'img/slides/viking2-2.jpg', credit: 'NASA/JPL · PIA00573',
      tr: { when: '1976 – 1980', title: 'Kırağı', text: 'Robot kolu toprağı kazdı ve yaşam aradı, ama kesin bir kanıt bulunamadı. Kış gelince kuzeydeki ovanın donla kaplandığını gördü.', cap: "Viking 2'nin iniş yerinde kırağı" },
      en: { when: '1976 – 1980', title: 'Frost', text: 'Its robotic arm dug up soil and searched for life, but found no clear proof. When winter came, it saw the northern plain covered in frost.', cap: 'Frost at the Viking 2 landing site' },
    },
    {
      img: 'img/slides/viking2-3.jpg', credit: 'NASA · PIA04023',
      tr: { when: 'Bugün', title: 'Hâlâ orada', text: "1.281 Mars günü çalıştı. Pilleri bitince 11 Nisan 1980'de sustu. Hâlâ Utopia Planitia'da, bir ayağı kayada, hafifçe yan yatmış duruyor.", cap: "Viking 2'nin iniş yeri, Mars Odyssey'in kızılötesi görüntüsünde (X işareti)" },
      en: { when: 'Today', title: 'Still there', text: 'It worked for 1,281 Martian days. Its batteries failed, and on April 11, 1980 it fell silent. It still stands in Utopia Planitia, one foot on a rock.', cap: "The Viking 2 landing site in a Mars Odyssey infrared image (marked X)" },
    },
  ],
  insight: [
    {
      img: 'img/slides/insight-1.jpg', credit: 'NASA/JPL-Caltech · PIA22736',
      tr: { when: '26 Kasım 2018', title: 'Dinlemeye geldi', text: "InSight'ın tekerlekleri yoktu. Elysium Planitia'nın düz ovasına indi. Görevi gezmek değil, olduğu yerde durup Mars'ın derinliklerini dinlemekti.", cap: "InSight'ın güneş panellerinden biri, Mars yüzeyinden görüntülendi" },
      en: { when: 'November 26, 2018', title: 'Here to listen', text: 'InSight had no wheels. It landed on the flat plain of Elysium Planitia. Its job was not to roam, but to stay in one place and listen to the depths of Mars.', cap: "One of InSight's solar panels, seen from the surface of Mars" },
    },
    {
      img: 'img/slides/insight-2.jpg', credit: 'NASA/JPL-Caltech · PIA22956',
      tr: { when: 'Nisan 2019 – 2022', title: 'Mars depremleri', text: "Sismometre 1.300'den fazla sismik olay kaydetti. Dalgaları inceleyen bilim insanları Mars'ın katmanlarını gördü: kabuk, manto ve çekirdek.", cap: 'Robot kol sismometreyi (SEIS) Mars yüzeyine yerleştirdi (19 Aralık 2018)' },
      en: { when: 'April 2019 – 2022', title: 'Marsquakes', text: 'The seismometer recorded more than 1,300 seismic events. By studying the waves, scientists could see the layers of Mars: crust, mantle and core.', cap: 'The robotic arm set the seismometer (SEIS) on the surface of Mars (December 19, 2018)' },
    },
    {
      img: 'img/slides/insight-3.jpg', credit: 'NASA/JPL-Caltech · PIA25287',
      tr: { when: '15 Aralık 2022', title: 'Son sinyal', text: "Toz güneş panellerini kapladı, enerjisi tükendi. 15 Aralık 2022'de son sinyalini gönderdi. Hâlâ Elysium Planitia'da, olduğu yerde duruyor.", cap: "InSight'ın son özçekimi (24 Nisan 2022): toz güneş panellerini kapladı" },
      en: { when: 'December 15, 2022', title: 'The last signal', text: 'Dust covered its solar panels and its power ran out. It sent its last signal on December 15, 2022. It still stands in Elysium Planitia.', cap: "InSight's final selfie (April 24, 2022): dust covers its solar panels" },
    },
  ],
  apollo11: [
    {
      img: 'img/slides/apollo11-1.jpg', credit: 'NASA · 6900540',
      tr: { when: '16 Temmuz 1969', title: "Ay'a doğru", text: "Dev Saturn V roketi Florida'dan havalandı. İçinde Armstrong, Aldrin ve Collins vardı. Hedefleri, insanı ilk kez Ay'a indirmekti. Yolculuk üç gün sürecekti.", cap: "Apollo 11'i taşıyan Saturn V roketi Kennedy Uzay Merkezi'nden havalanıyor" },
      en: { when: 'July 16, 1969', title: 'Off to the Moon', text: 'A Saturn V rocket lifted off from Florida with Armstrong, Aldrin and Collins on board. Their goal: to land people on the Moon for the first time.', cap: 'The Saturn V rocket carrying Apollo 11 lifts off from Kennedy Space Center' },
    },
    {
      img: 'img/slides/apollo11-2.jpg', credit: 'NASA · AS11-40-5903',
      tr: { when: '20 Temmuz 1969', title: 'Kartal indi', text: 'Yakıt bitmek üzereyken Eagle Ay\'a indi. Armstrong ilk adımında şöyle dedi: "Bu, bir insan için küçük, insanlık için büyük bir adım."', cap: 'Buzz Aldrin, Eagle ay modülünün ayağının yanında; fotoğrafı Neil Armstrong çekti' },
      en: { when: 'July 20, 1969', title: 'The Eagle has landed', text: 'With almost no fuel left, the Eagle landed. Armstrong\'s first step: "That\'s one small step for a man, one giant leap for mankind."', cap: 'Buzz Aldrin beside a landing leg of the Eagle; Neil Armstrong took the photo' },
    },
    {
      img: 'img/slides/apollo11-3.jpg', credit: 'NASA · AS11-40-5899',
      tr: { when: 'Bugün', title: 'İzler hâlâ orada', text: "Eagle'ın alt kısmı ve bu plaket Ay'da kaldı. Ay'da rüzgâr da yağmur da yok. Armstrong ve Aldrin'in ayak izleri hâlâ orada.", cap: "Astronotların Ay'da bıraktığı plaket (ay modülünün inen kısmına tutturulmuş)" },
      en: { when: 'Today', title: 'The footprints are still there', text: "The Eagle's lower half and this plaque stayed on the Moon. With no wind or rain, Armstrong's and Aldrin's footprints are still there.", cap: 'The plaque the astronauts left on the Moon (attached to the lunar module descent stage)' },
    },
  ],
  apollo15: [
    {
      img: 'img/slides/apollo15-1.jpg', credit: 'NASA · AS15-85-11425',
      tr: { when: '30 Temmuz 1971', title: "Hadley'e iniş", text: 'Scott ve Irwin, Falcon ile Hadley Oluğu\'nun yanına indi. Scott ilk adımında şöyle dedi: "İnsan keşfetmeli. Bu, keşfin en büyüğüdür."', cap: 'Hadley Oluğu manzarası, kuzeybatıya doğru (31 Temmuz 1971)' },
      en: { when: 'July 30, 1971', title: 'Landing at Hadley', text: 'Scott and Irwin landed the Falcon beside Hadley Rille. As he stepped out, Scott said: "Man must explore. And this is exploration at its greatest."', cap: 'A view of Hadley Rille, looking northwest (July 31, 1971)' },
    },
    {
      img: 'img/slides/apollo15-2.jpg', credit: 'NASA · AS15-85-11437',
      tr: { when: '31 Temmuz – 2 Ağustos 1971', title: "Ay'da ilk araba", text: "Ay'da araç kullanan ilk insan Scott oldu. Üç çıkışta Ay Arabası'yla 27,9 km gittiler ve yaklaşık 4,1 milyar yıllık Genesis Kayası'nı buldular.", cap: 'David Scott, Hadley Delta yamacında; sağ önde ay arabası' },
      en: { when: 'July 31 – August 2, 1971', title: 'The first car on the Moon', text: 'Scott became the first person to drive on the Moon. In three trips they covered 27.9 km and found the Genesis Rock, about 4.1 billion years old.', cap: 'David Scott on the slope of Hadley Delta; the rover at right' },
    },
    {
      img: 'img/slides/apollo15-3.jpg', credit: 'NASA · AS15-88-11866',
      tr: { when: 'Bugün', title: 'Hâlâ orada', text: "Ay Arabası, Falcon'un kalkışını çekebilsin diye 160 metre uzağa park edildi. Hâlâ orada, Hadley Oluğu'nun yanında sessizce duruyor.", cap: 'James Irwin bayrağın yanında selam duruyor; arkada ay modülü ve ay arabası (1 Ağustos 1971)' },
      en: { when: 'Today', title: 'Still there', text: "The rover was parked 160 metres away so its camera could film the Falcon's liftoff. It still stands quietly beside Hadley Rille.", cap: 'James Irwin salutes beside the flag; the lunar module and rover behind (August 1, 1971)' },
    },
  ],
};
