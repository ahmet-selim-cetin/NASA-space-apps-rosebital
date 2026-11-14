// Story timelines shown in the side panel. Each chapter: when · title · text.
// `closing` is the last line, shown as a quote. Sources are listed in README.md.
export const STORIES = {
  opportunity: {
    en: {
      chapters: [
        { when: 'January 2004', title: 'A hole in one', text: 'Wrapped in airbags, Opportunity bounced across Meridiani Planum and rolled to a stop inside a small crater. Within weeks it found tiny iron-rich spheres nicknamed "blueberries" — proof that water once soaked this ground.' },
        { when: '2004 – 2011', title: 'Ninety days become years', text: 'The mission was planned for 90 Martian days. Opportunity kept driving from crater to crater — Endurance, Victoria — and then spent three years crossing the plains to reach the giant Endeavour Crater.' },
        { when: 'March 2015', title: 'A marathon on Mars', text: 'After eleven years of driving at a few centimetres per second, Opportunity passed 42.195 km — the first marathon ever completed on another world.' },
        { when: 'June 2018', title: 'The sky goes dark', text: 'A dust storm grew until it wrapped the whole planet. Over Perseverance Valley the Sun almost disappeared, and the solar panels could no longer charge the batteries. On June 10 Opportunity sent its last message and went to sleep.' },
        { when: 'February 2019', title: 'One last song', text: 'For eight months engineers sent more than a thousand commands, hoping the wind would clean the panels. No answer came. On February 13, 2019 NASA declared the mission complete, after playing one final wake-up song: "I\'ll Be Seeing You."' },
      ],
      closing: 'Built for 90 days. Worked for more than 14 years.',
    },
    tr: {
      chapters: [
        { when: 'Ocak 2004', title: 'Tek atışta isabet', text: 'Hava yastıklarına sarılı Opportunity, Meridiani Planum\'da sekerek ilerledi ve küçük bir kraterin içinde durdu. Birkaç hafta içinde "yaban mersini" lakaplı, demir açısından zengin minik küreler buldu: bu toprağın bir zamanlar suyla ıslandığının kanıtı.' },
        { when: '2004 – 2011', title: 'Doksan gün yıllara dönüşüyor', text: 'Görev 90 Mars günü için planlanmıştı. Opportunity kraterden kratere ilerlemeyi sürdürdü — Endurance, Victoria — ve ardından dev Endeavour Krateri\'ne ulaşmak için düzlükleri üç yılda geçti.' },
        { when: 'Mart 2015', title: 'Mars\'ta bir maraton', text: 'Saniyede birkaç santimetre hızla geçen on bir yılın sonunda Opportunity 42,195 km\'yi aştı: başka bir dünyada tamamlanan ilk maraton.' },
        { when: 'Haziran 2018', title: 'Gökyüzü kararıyor', text: 'Bir toz fırtınası büyüyerek tüm gezegeni sardı. Perseverance Vadisi\'nin üzerinde Güneş neredeyse kayboldu ve güneş panelleri artık bataryaları şarj edemedi. 10 Haziran\'da Opportunity son mesajını gönderdi ve uykuya daldı.' },
        { when: 'Şubat 2019', title: 'Son bir şarkı', text: 'Mühendisler sekiz ay boyunca, rüzgârın panelleri temizlemesini umarak binden fazla komut gönderdi. Yanıt gelmedi. 13 Şubat 2019\'da NASA, son bir uyandırma şarkısı çaldıktan sonra görevin tamamlandığını duyurdu: "I\'ll Be Seeing You."' },
      ],
      closing: '90 gün için üretildi. 14 yıldan uzun süre çalıştı.',
    },
  },

  spirit: {
    en: {
      chapters: [
        { when: 'January 2004', title: 'First of the twins', text: 'Spirit landed in Gusev Crater three weeks before its twin, Opportunity. Like its sibling, it was expected to work for 90 Martian days.' },
        { when: '2005', title: 'The mountaineer', text: 'Spirit spent more than a year climbing to the summit of Husband Hill. Passing whirlwinds blew the dust off its solar panels and gave it new life.' },
        { when: '2006 – 2007', title: 'A broken wheel finds treasure', text: 'The right front wheel stopped turning, so Spirit drove backwards, dragging it. The stuck wheel scraped a trench and uncovered bright, nearly pure silica: a sign of ancient hot springs.' },
        { when: 'May 2009', title: 'Trapped at Troy', text: 'Spirit broke through a thin crust into soft sand. For months engineers tried to drive it out using a test rover in a sandbox on Earth. In January 2010 NASA accepted that Spirit would never move again.' },
        { when: 'March 2010', title: 'The last winter', text: 'Stuck in place, Spirit could not tilt its panels toward the low winter Sun. Its power faded in the cold, and on March 22, 2010 it fell silent. NASA ended recovery efforts on May 25, 2011.' },
      ],
      closing: 'Even standing still, it kept doing science until the end.',
    },
    tr: {
      chapters: [
        { when: 'Ocak 2004', title: 'İkizlerin ilki', text: 'Spirit, ikizi Opportunity\'den üç hafta önce Gusev Krateri\'ne indi. Kardeşi gibi onun da 90 Mars günü çalışması bekleniyordu.' },
        { when: '2005', title: 'Dağcı', text: 'Spirit, bir yıldan uzun süren bir tırmanışla Husband Tepesi\'nin zirvesine ulaştı. Yanından geçen hortumlar güneş panellerindeki tozu süpürdü ve ona yeni bir hayat verdi.' },
        { when: '2006 – 2007', title: 'Kırık tekerlek hazine buluyor', text: 'Sağ ön tekerlek dönmeyi bıraktı; Spirit de onu sürükleyerek geri geri ilerledi. Kilitlenen tekerlek toprakta bir hendek açtı ve parlak, neredeyse saf silika ortaya çıktı: eski sıcak su kaynaklarının işareti.' },
        { when: 'Mayıs 2009', title: 'Troy\'da mahsur', text: 'Spirit ince bir kabuğu kırıp yumuşak kuma gömüldü. Mühendisler aylarca, Dünya\'daki bir kum havuzunda test aracıyla onu kurtarmanın yolunu aradı. Ocak 2010\'da NASA, Spirit\'in bir daha hareket edemeyeceğini kabul etti.' },
        { when: 'Mart 2010', title: 'Son kış', text: 'Yerinden kıpırdayamayan Spirit, panellerini alçalan kış Güneşi\'ne çeviremedi. Soğukta gücü tükendi ve 22 Mart 2010\'da sustu. NASA kurtarma çabalarını 25 Mayıs 2011\'de sonlandırdı.' },
      ],
      closing: 'Yerinde dururken bile sonuna kadar bilim yapmayı sürdürdü.',
    },
  },

  sojourner: {
    en: {
      chapters: [
        { when: 'July 4, 1997', title: 'Bouncing onto Mars', text: 'Mars Pathfinder hit the surface inside a cluster of airbags, bounced, and rolled to rest in Ares Vallis, an ancient flood plain. Inside was a rover about the size of a microwave oven.' },
        { when: 'July 1997', title: 'The first wheels on another planet', text: 'Sojourner rolled down its ramp and became the first rover ever to drive on Mars. It weighed about 10.6 kg and moved roughly a centimetre every second.' },
        { when: 'Summer 1997', title: 'Sniffing the rocks', text: 'Sojourner pressed its instrument against rocks the team named Barnacle Bill and Yogi to learn what they were made of. It was designed to last 7 Martian days. It worked for 83.' },
        { when: 'September 27, 1997', title: 'The voice goes quiet', text: 'Sojourner could only talk to Earth through the Pathfinder lander. When the lander\'s battery wore out and its electronics grew too cold, the link was lost. The little rover itself was probably still working — waiting for instructions that never came.' },
      ],
      closing: 'It never broke. It simply lost its way to call home.',
    },
    tr: {
      chapters: [
        { when: '4 Temmuz 1997', title: 'Mars\'a sekerek iniş', text: 'Mars Pathfinder, hava yastıklarının içinde yüzeye çarptı, sekti ve eski bir taşkın ovası olan Ares Vallis\'te durdu. İçinde mikrodalga fırın büyüklüğünde bir gezgin vardı.' },
        { when: 'Temmuz 1997', title: 'Başka bir gezegendeki ilk tekerlekler', text: 'Sojourner rampasından indi ve Mars\'ta yol alan ilk gezgin oldu. Yaklaşık 10,6 kg ağırlığındaydı ve saniyede aşağı yukarı bir santimetre ilerliyordu.' },
        { when: '1997 yazı', title: 'Kayaları koklamak', text: 'Sojourner, ekibin Barnacle Bill ve Yogi adını verdiği kayalara ölçüm aletini dayayıp neyden yapıldıklarını öğrendi. 7 Mars günü dayanması için tasarlanmıştı. 83 gün çalıştı.' },
        { when: '27 Eylül 1997', title: 'Ses kesiliyor', text: 'Sojourner Dünya ile yalnızca Pathfinder iniş aracı üzerinden konuşabiliyordu. İniş aracının bataryası tükenip elektroniği fazla soğuyunca bağlantı koptu. Küçük gezginin kendisi büyük olasılıkla hâlâ çalışıyordu: hiç gelmeyen komutları bekliyordu.' },
      ],
      closing: 'Hiç bozulmadı. Yalnızca evi aramanın yolunu kaybetti.',
    },
  },

  ingenuity: {
    en: {
      chapters: [
        { when: 'February 2021', title: 'A passenger under the rover', text: 'Ingenuity arrived in Jezero Crater folded under the belly of the Perseverance rover. It carried a small piece of fabric from the Wright brothers\' first aeroplane.' },
        { when: 'April 19, 2021', title: 'First flight on another planet', text: 'In air a hundred times thinner than Earth\'s, Ingenuity rose 3 metres, hovered, and landed: 39 seconds that proved powered flight is possible on Mars.' },
        { when: '2021 – 2023', title: 'From experiment to scout', text: 'It was meant to fly five times in 30 days. Instead it became Perseverance\'s scout, flying ahead to photograph the route — through dust storms, a frozen winter and a dead sensor.' },
        { when: 'January 18, 2024', title: 'Flight 72', text: 'Over smooth, featureless sand, Ingenuity\'s navigation camera had almost nothing to track. It came down hard, and its rotor blades were damaged. It could still talk — but it would never fly again.' },
      ],
      closing: 'Planned for 5 flights. It flew 72.',
    },
    tr: {
      chapters: [
        { when: 'Şubat 2021', title: 'Gezginin altındaki yolcu', text: 'Ingenuity, Perseverance gezgininin karnının altında katlanmış halde Jezero Krateri\'ne ulaştı. Yanında Wright kardeşlerin ilk uçağından küçük bir kumaş parçası taşıyordu.' },
        { when: '19 Nisan 2021', title: 'Başka bir gezegende ilk uçuş', text: 'Dünya\'dakinden yüz kat ince bir havada Ingenuity 3 metre yükseldi, havada asılı kaldı ve indi: Mars\'ta motorlu uçuşun mümkün olduğunu kanıtlayan 39 saniye.' },
        { when: '2021 – 2023', title: 'Deneyden öncülüğe', text: '30 günde beş kez uçması planlanmıştı. Bunun yerine Perseverance\'ın öncüsü oldu: toz fırtınalarına, dondurucu bir kışa ve bozulan bir sensöre rağmen önden uçup rotayı fotoğrafladı.' },
        { when: '18 Ocak 2024', title: '72. uçuş', text: 'Pürüzsüz, özelliksiz kumların üzerinde Ingenuity\'nin navigasyon kamerası takip edecek neredeyse hiçbir şey bulamadı. Sert bir iniş yaptı ve pervane kanatları hasar gördü. Hâlâ konuşabiliyordu, ama bir daha asla uçamayacaktı.' },
      ],
      closing: '5 uçuş için planlandı. 72 kez uçtu.',
    },
  },
};
