// Story timelines shown in the side panel. Each chapter: when · title · text.
// `closing` is the last line, shown as a quote. Sources are listed in README.md.
// Written for readers aged 7-12: short sentences, everyday words, same facts.
export const STORIES = {
  opportunity: {
    en: {
      chapters: [
        { when: 'January 2004', title: 'A hole in one', text: 'Wrapped in airbags, Opportunity bounced across Mars and rolled to a stop inside a small crater. A few weeks later it found tiny round stones, nicknamed "blueberries". They are full of iron, and stones like these form in water. So this dry, dusty land was once wet.' },
        { when: '2004 – 2011', title: 'Ninety days become years', text: 'The plan was to work for 90 Martian days. Opportunity just kept going. It drove from crater to crater — first Endurance, then Victoria. Then it spent three years crossing the plains to reach a giant crater called Endeavour.' },
        { when: 'March 2015', title: 'A marathon on Mars', text: 'Opportunity moved only a few centimetres every second. But it never gave up. After eleven years of driving it passed 42.195 km — the first marathon ever finished on another world.' },
        { when: 'June 2018', title: 'The sky goes dark', text: 'A dust storm grew and grew until it wrapped the whole planet. Over Perseverance Valley, day turned almost into night. Without sunlight, the solar panels could not charge the batteries. On June 10 Opportunity sent its last message and fell asleep.' },
        { when: 'February 2019', title: 'One last song', text: 'For eight months engineers sent more than a thousand commands. They hoped the wind would blow the dust off the panels. No answer came. On February 13, 2019 NASA played one last wake-up song, "I\'ll Be Seeing You", and announced that the mission was complete.' },
      ],
      closing: 'Built for 90 days. Worked for more than 14 years.',
    },
    tr: {
      chapters: [
        { when: 'Ocak 2004', title: 'Tek atışta isabet', text: 'Hava yastıklarına sarılı Opportunity, Mars\'ın üzerinde sekti ve küçük bir kraterin içinde durdu. Birkaç hafta sonra minik, yuvarlak taşlar buldu. Onlara "yaban mersini" adı verildi. İçleri demir doludur ve böyle taşlar suyun içinde oluşur. Demek ki bu kuru, tozlu toprak bir zamanlar ıslaktı.' },
        { when: '2004 – 2011', title: 'Doksan gün yıllara dönüşüyor', text: 'Plana göre 90 Mars günü çalışacaktı. Ama Opportunity durmadı. Kraterden kratere gitti: önce Endurance, sonra Victoria. Ardından üç yıl boyunca düzlükleri aşıp Endeavour adlı dev kratere ulaştı.' },
        { when: 'Mart 2015', title: 'Mars\'ta bir maraton', text: 'Opportunity her saniyede yalnızca birkaç santimetre ilerliyordu. Ama hiç pes etmedi. On bir yıllık yolculuğun sonunda 42,195 km\'yi geçti: başka bir dünyada tamamlanan ilk maraton.' },
        { when: 'Haziran 2018', title: 'Gökyüzü kararıyor', text: 'Bir toz fırtınası büyüdü, büyüdü ve bütün gezegeni sardı. Perseverance Vadisi\'nde gündüz neredeyse geceye döndü. Güneş ışığı olmayınca paneller bataryaları dolduramadı. 10 Haziran\'da Opportunity son mesajını gönderdi ve uykuya daldı.' },
        { when: 'Şubat 2019', title: 'Son bir şarkı', text: 'Mühendisler sekiz ay boyunca binden fazla komut gönderdi. Rüzgârın panellerdeki tozu süpürmesini umdular. Yanıt gelmedi. 13 Şubat 2019\'da NASA son bir uyandırma şarkısı çaldı, "I\'ll Be Seeing You", ve görevin tamamlandığını duyurdu.' },
      ],
      closing: '90 gün için üretildi. 14 yıldan uzun süre çalıştı.',
    },
  },

  spirit: {
    en: {
      chapters: [
        { when: 'January 2004', title: 'First of the twins', text: 'Spirit landed in Gusev Crater three weeks before its twin, Opportunity. Like its twin, it was built to work for 90 Martian days.' },
        { when: '2005', title: 'The mountaineer', text: 'Spirit spent more than a year climbing to the top of Husband Hill. On the way, whirlwinds swept the dust off its solar panels and gave it fresh energy.' },
        { when: '2006 – 2007', title: 'A broken wheel finds treasure', text: 'Spirit\'s right front wheel stopped turning. So Spirit drove backwards, dragging the stuck wheel behind it. The wheel dug a little trench and uncovered bright white soil called silica. It was a strong sign that this part of Mars was once much wetter.' },
        { when: 'Spring 2009', title: 'Trapped at Troy', text: 'Spirit broke through a thin crust and sank into soft sand. For months engineers tried to free it. They practised every move first with test rovers in a sandbox on Earth. In January 2010 NASA accepted that Spirit would never drive again.' },
        { when: 'March 2010', title: 'The last winter', text: 'Stuck in place, Spirit could not tilt its panels toward the low winter Sun. Its power faded in the cold. On March 22, 2010 it fell silent. NASA kept trying to reach it until May 25, 2011.' },
      ],
      closing: 'Even standing still, it kept doing science until the end.',
    },
    tr: {
      chapters: [
        { when: 'Ocak 2004', title: 'İkizlerin ilki', text: 'Spirit, ikizi Opportunity\'den üç hafta önce Gusev Krateri\'ne indi. İkizi gibi o da 90 Mars günü çalışmak için üretilmişti.' },
        { when: '2005', title: 'Dağcı', text: 'Spirit bir yıldan uzun süre tırmanarak Husband Tepesi\'nin zirvesine çıktı. Yolda hortumlar güneş panellerindeki tozu süpürdü ve ona taze enerji verdi.' },
        { when: '2006 – 2007', title: 'Kırık tekerlek hazine buluyor', text: 'Spirit\'in sağ ön tekerleği dönmeyi bıraktı. O da geri geri gitti ve bozuk tekerleği arkasından sürükledi. Tekerlek toprakta küçük bir hendek açtı ve silika denen parlak, beyaz bir toprağı ortaya çıkardı. Bu, Mars\'ın bu bölgesinin bir zamanlar çok daha ıslak olduğunun güçlü bir işaretiydi.' },
        { when: '2009 ilkbaharı', title: 'Troy\'da mahsur', text: 'Spirit ince bir kabuğu kırdı ve yumuşak kuma gömüldü. Mühendisler aylarca onu kurtarmaya çalıştı. Her hareketi önce Dünya\'daki bir kum havuzunda test araçlarıyla denediler. Ocak 2010\'da NASA, Spirit\'in bir daha yol alamayacağını kabul etti.' },
        { when: 'Mart 2010', title: 'Son kış', text: 'Yerinden kıpırdayamayan Spirit, panellerini alçaktaki kış Güneşi\'ne çeviremedi. Soğukta gücü yavaş yavaş tükendi. 22 Mart 2010\'da sustu. NASA ona ulaşmayı 25 Mayıs 2011\'e kadar denedi.' },
      ],
      closing: 'Yerinde dururken bile sonuna kadar bilim yapmayı sürdürdü.',
    },
  },

  sojourner: {
    en: {
      chapters: [
        { when: 'July 4, 1997', title: 'Bouncing onto Mars', text: 'Mars Pathfinder hit the ground wrapped in airbags, bounced, and rolled to a stop in Ares Vallis, a plain shaped by floods long ago. Inside was a rover the size of a microwave oven, just 30 centimetres tall.' },
        { when: 'July 1997', title: 'The first wheels on another planet', text: 'Sojourner rolled down its ramp and became the first wheeled vehicle ever to drive on another planet. It weighed 10.6 kg. Its top speed was about one centimetre per second.' },
        { when: 'Summer 1997', title: 'Sniffing the rocks', text: 'Sojourner pressed its instrument against rocks to find out what they were made of. The team gave the rocks funny names, like Barnacle Bill and Yogi. Sojourner was expected to last one week. It worked for 83 days — twelve times longer.' },
        { when: 'September 27, 1997', title: 'The voice goes quiet', text: 'Sojourner could only talk to Earth through the Pathfinder lander. On September 27 the lander sent its last data. Nobody knows exactly why, but engineers think its battery wore out and it grew too cold. The little rover probably switched to its backup plan: circling the lander, or standing still, waiting for instructions.' },
      ],
      closing: 'It lost its voice home — but it opened the road for every rover that followed.',
    },
    tr: {
      chapters: [
        { when: '4 Temmuz 1997', title: 'Mars\'a sekerek iniş', text: 'Mars Pathfinder hava yastıklarına sarılı halde yere çarptı, sekti ve Ares Vallis\'te durdu. Burası çok eski zamanlarda sellerin biçim verdiği bir ovadır. İçinde mikrodalga fırın büyüklüğünde, yalnızca 30 santimetre boyunda bir gezgin vardı.' },
        { when: 'Temmuz 1997', title: 'Başka bir gezegendeki ilk tekerlekler', text: 'Sojourner rampasından indi ve başka bir gezegende yol alan ilk tekerlekli araç oldu. 10,6 kg ağırlığındaydı. En yüksek hızı saniyede yaklaşık bir santimetreydi.' },
        { when: '1997 yazı', title: 'Kayaları koklamak', text: 'Sojourner ölçüm aletini kayalara dayadı ve neyden yapıldıklarını öğrendi. Ekip kayalara Barnacle Bill ve Yogi gibi eğlenceli adlar verdi. Sojourner\'ın bir hafta dayanması bekleniyordu. 83 gün çalıştı: on iki kat daha uzun.' },
        { when: '27 Eylül 1997', title: 'Ses kesiliyor', text: 'Sojourner Dünya ile yalnızca Pathfinder iniş aracı üzerinden konuşabiliyordu. 27 Eylül\'de iniş aracı son verisini gönderdi. Nedenini kimse tam olarak bilmiyor, ama mühendisler bataryasının tükendiğini ve aracın fazla soğuduğunu düşünüyor. Küçük gezgin büyük olasılıkla yedek planına geçti: iniş aracının çevresinde dönmek ya da yerinde durup komut beklemek.' },
      ],
      closing: 'Eve ulaşan sesini kaybetti, ama kendisinden sonraki bütün gezginlere yolu açtı.',
    },
  },

  ingenuity: {
    en: {
      chapters: [
        { when: 'February 2021', title: 'A passenger under the rover', text: 'Ingenuity, a small helicopter, arrived in Jezero Crater folded under the belly of the Perseverance rover. It carried a tiny piece of cloth from the Wright brothers\' first aeroplane.' },
        { when: 'April 19, 2021', title: 'First flight on another planet', text: 'The air on Mars is a hundred times thinner than on Earth, so flying there is very hard. Ingenuity rose 3 metres, hovered, and landed. Those 39 seconds proved that flying on Mars is possible.' },
        { when: '2021 – 2023', title: 'From experiment to scout', text: 'It was meant to fly five times in 30 days. Instead it became Perseverance\'s scout. It flew ahead to photograph the road — through dust storms, a freezing winter and a broken sensor.' },
        { when: 'January 18, 2024', title: 'Flight 72', text: 'Ingenuity finds its way by watching the ground with a camera. But over smooth sand with nothing on it, the camera had almost nothing to follow. Ingenuity came down hard and its rotor blades were damaged. It could still talk — but it would never fly again.' },
      ],
      closing: 'Planned for 5 flights. It flew 72.',
    },
    tr: {
      chapters: [
        { when: 'Şubat 2021', title: 'Gezginin altındaki yolcu', text: 'Küçük bir helikopter olan Ingenuity, Perseverance gezgininin karnının altında katlanmış halde Jezero Krateri\'ne ulaştı. Yanında Wright kardeşlerin ilk uçağından minik bir kumaş parçası taşıyordu.' },
        { when: '19 Nisan 2021', title: 'Başka bir gezegende ilk uçuş', text: 'Mars\'ın havası Dünya\'dakinden yüz kat incedir, bu yüzden orada uçmak çok zordur. Ingenuity 3 metre yükseldi, havada durdu ve indi. O 39 saniye, Mars\'ta uçmanın mümkün olduğunu kanıtladı.' },
        { when: '2021 – 2023', title: 'Deneyden öncülüğe', text: '30 günde beş kez uçması planlanmıştı. Bunun yerine Perseverance\'ın öncüsü oldu. Toz fırtınalarına, dondurucu bir kışa ve bozulan bir sensöre rağmen önden uçup yolun fotoğraflarını çekti.' },
        { when: '18 Ocak 2024', title: '72. uçuş', text: 'Ingenuity yolunu, bir kamerayla yere bakarak bulur. Ama üzerinde hiçbir şey olmayan dümdüz kumda kameranın takip edeceği neredeyse hiçbir şey yoktu. Ingenuity sert bir iniş yaptı ve pervane kanatları hasar gördü. Hâlâ konuşabiliyordu, ama bir daha asla uçamayacaktı.' },
      ],
      closing: '5 uçuş için planlandı. 72 kez uçtu.',
    },
  },
};
