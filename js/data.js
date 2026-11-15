// Coordinates shown in the side panel (`coords`, `sites`) are the values printed on the source page named in `src`.
// Format: [degrees, minutes, seconds, hemisphere]. Mission data. Coordinates: latitude, east longitude (0–360). Dates are UTC. Sources: see REFERENCES in README.
// planned / lasted are counted in `unit` (Martian days, or flights for the helicopter).
export const ROVERS = [
  {
    id: 'opportunity',
    name: 'Opportunity',
    lat: -1.9483,
    lon: 354.47417,
    color: '#ffb347',
    playable: true,
    stats: { landed: '2004-01-24', last: '2018-06-10', distanceKm: 45.16, planned: 90, lasted: 5111, unit: 'sols' },
    coords: {
      lat: ['1', '56', '53.88', 'S'], lon: ['5', '31', '33.00', 'W'], dec: ['-1.9483', '354.47417'],
      src: { name: 'NASA Science', url: 'https://science.nasa.gov/mission/mer-opportunity/' },
    },
  },
  {
    id: 'spirit',
    name: 'Spirit',
    lat: -14.5692,
    lon: 175.4729,
    color: '#7fd3ff',
    playable: true,
    playKey: 'panel.escape', // button label
    stats: { landed: '2004-01-03', last: '2010-03-22', distanceKm: 7.73, planned: 90, lasted: 2210, unit: 'sols' },
    coords: {
      lat: ['14', '34', '09.12', 'S'], lon: ['175', '28', '22.44', 'E'], dec: ['-14.5692', '175.4729'],
      src: { name: 'NASA/JPL NAIF', url: 'https://naif.jpl.nasa.gov/pub/naif/pds/data/mer1-m-spice-6-v1.0/mer1sp_1000/catalog/mission.cat' },
    },
  },
  {
    id: 'sojourner',
    name: 'Sojourner',
    lat: 19.13,
    lon: 326.78,
    color: '#c9a7ff',
    playable: false,
    stats: { landed: '1997-07-04', last: '1997-09-27', distanceKm: 0.1, planned: 7, lasted: 83, unit: 'sols' },
    coords: {
      lat: ['19', '07', '48', 'N'], lon: ['33', '13', '12', 'W'], dec: ['19.13', '326.78'],
      src: { name: 'NASA Facts', url: 'https://mars.nasa.gov/internal_resources/815/' },
    },
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity',
    lat: 18.4447,
    lon: 77.4508,
    color: '#8affc1',
    playable: true,
    playKey: 'panel.fly', // button label (default: panel.drive)
    stats: { landed: '2021-02-18', last: '2024-01-18', lastLabel: 'panel.lastFlight', distanceKm: 17, planned: 5, lasted: 72, unit: 'flights' },
    coords: {
      lat: ['18', '26', '41', 'N'], lon: ['77', '27', '04', 'E'], dec: ['18.44486', '77.45102'],
      src: { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/List_of_Ingenuity_flights' },
      label: 'panel.coords.airfield',
    },
    // Where Ingenuity stands today: Airfield Chi (flight 72), about 13 km from the first airfield.
    coordsMore: [
      {
        label: 'panel.coords.final',
        lat: ['18', '29', '50', 'N'], lon: ['77', '19', '21', 'E'], dec: ['18.497263', '77.322539'],
        src: { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/List_of_Ingenuity_flights' },
      },
    ],
  },
  // Landers with no driving: a facts list and one landing site each (values checked against NASA/NSSDCA pages, see README).
  {
    id: 'viking1',
    name: 'Viking 1',
    lat: 22.483,
    lon: 312.06,
    color: '#ff8a65',
    playable: false,
    sites: [
      { labelKey: 'panel.coords', lat: ['22', '28', '58.80', 'N'], lon: ['47', '56', '24.00', 'W'], src: { name: 'NASA Science', url: 'https://science.nasa.gov/mission/viking-1/' } },
    ],
    facts: {
      tr: [['İniş', '20 Temmuz 1976'], ['Son iletişim', '11 Kasım 1982']],
      en: [['Landed', 'July 20, 1976'], ['Last contact', 'November 11, 1982']],
    },
  },
  {
    id: 'viking2',
    name: 'Viking 2',
    lat: 47.6673,
    lon: 134.2809,
    color: '#ffd166',
    playable: false,
    sites: [
      { labelKey: 'panel.coords', lat: ['47', '40', '02.28', 'N'], lon: ['134', '16', '51.24', 'E'], src: { name: 'NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1975-083C' } },
    ],
    facts: {
      tr: [['İniş', '3 Eylül 1976'], ['Son iletişim', '11 Nisan 1980']],
      en: [['Landed', 'September 3, 1976'], ['Last contact', 'April 11, 1980']],
    },
  },
  {
    id: 'insight',
    name: 'InSight',
    lat: 4.5,
    lon: 135.9,
    color: '#f78fb3',
    playable: false,
    sites: [
      { labelKey: 'panel.coords', lat: ['4', '30', '00.00', 'N'], lon: ['135', '54', '00.00', 'E'], src: { name: 'NASA Science', url: 'https://science.nasa.gov/mission/insight/' } },
    ],
    facts: {
      tr: [['İniş', '26 Kasım 2018'], ['Son iletişim', '15 Aralık 2022']],
      en: [['Landed', 'November 26, 2018'], ['Last contact', 'December 15, 2022']],
    },
  },
  // The Moon: Surveyor 3 and Apollo 12 landed about 180 m apart, so they share one beacon and one story.
  {
    id: 'apollo12',
    world: 'moon',
    name: 'Apollo 12 · Surveyor 3',
    lat: -3.0124,
    lon: -23.4216,
    color: '#bcd4ff',
    playable: false,
    sites: [
      { labelKey: 'panel.coords.surveyor3', lat: ['3', '00', '58.32', 'S'], lon: ['23', '25', '04.80', 'W'], src: { name: 'NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A' } },
      { labelKey: 'panel.coords.apollo12', lat: ['3', '00', '46.08', 'S'], lon: ['23', '25', '18.84', 'W'], src: { name: 'NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html' } },
    ],
    facts: {
      tr: [['Surveyor 3 inişi', '20 Nisan 1967'], ['Surveyor 3 son iletişim', '4 Mayıs 1967'], ['Apollo 12 inişi', '18 Kasım 1969'], ['Aradaki mesafe', '180 m'], ['Surveyor 3\'ün fotoğrafları', '6.326', true]],
      en: [['Surveyor 3 landed', 'April 20, 1967'], ['Surveyor 3 last contact', 'May 4, 1967'], ['Apollo 12 landed', 'November 18, 1969'], ['Distance apart', '180 m'], ['Photos by Surveyor 3', '6,326', true]],
    },
  },
  {
    id: 'apollo11',
    world: 'moon',
    name: 'Apollo 11',
    lat: 0.67416,
    lon: 23.47314,
    color: '#ffe08a',
    playable: false,
    sites: [
      { labelKey: 'panel.coords', lat: ['0', '40', '26.98', 'N'], lon: ['23', '28', '23.30', 'E'], src: { name: 'NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html' } },
    ],
    facts: {
      tr: [['Fırlatma', '16 Temmuz 1969'], ['Ay\'a iniş', '20 Temmuz 1969'], ['Ay\'dan ayrılış', '21 Temmuz 1969'], ['Dünya\'ya dönüş', '24 Temmuz 1969'], ['Görev süresi', '8 gün 3 saat 18 dakika', true]],
      en: [['Launched', 'July 16, 1969'], ['Landed on the Moon', 'July 20, 1969'], ['Left the Moon', 'July 21, 1969'], ['Back on Earth', 'July 24, 1969'], ['Mission length', '8 days 3 hours 18 minutes', true]],
    },
  },
  {
    id: 'apollo15',
    world: 'moon',
    name: 'Apollo 15',
    lat: 26.13239,
    lon: 3.6333,
    color: '#9be7ff',
    playable: false,
    sites: [
      { labelKey: 'panel.coords', lat: ['26', '07', '56.60', 'N'], lon: ['3', '37', '59.88', 'E'], src: { name: 'NSSDCA', url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html' } },
    ],
    facts: {
      tr: [['Fırlatma', '26 Temmuz 1971'], ['Ay\'a iniş', '30 Temmuz 1971'], ['Dünya\'ya dönüş', '7 Ağustos 1971'], ['Görev süresi', '12 gün 7 saat 12 dakika']],
      en: [['Launched', 'July 26, 1971'], ['Landed on the Moon', 'July 30, 1971'], ['Back on Earth', 'August 7, 1971'], ['Mission length', '12 days 7 hours 12 minutes']],
    },
  },
];
