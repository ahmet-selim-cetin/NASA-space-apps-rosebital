// Story timelines shown in the side panel. Each chapter: when · title · text.
// `closing` is the last line, shown as a quote. Sources are listed in README.md.
// Written for readers aged 7-12: short sentences, everyday words, same facts.
import { TWINS } from './twins.js';
import { INGENUITY } from './ingenuity.js';

export const STORIES = {
  ...TWINS, // Spirit & Opportunity: the team's own story, see twins.js

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

  ingenuity: INGENUITY, // the team's own story, see ingenuity.js
};
