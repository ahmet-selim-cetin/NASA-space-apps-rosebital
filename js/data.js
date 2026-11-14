// Mission data. Coordinates: latitude, east longitude (0–360). Dates are UTC. Sources: see REFERENCES in README.
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
  },
  {
    id: 'spirit',
    name: 'Spirit',
    lat: -14.5692,
    lon: 175.4729,
    color: '#7fd3ff',
    playable: false,
    stats: { landed: '2004-01-03', last: '2010-03-22', distanceKm: 7.73, planned: 90, lasted: 2210, unit: 'sols' },
  },
  {
    id: 'sojourner',
    name: 'Sojourner',
    lat: 19.13,
    lon: 326.78,
    color: '#c9a7ff',
    playable: false,
    stats: { landed: '1997-07-04', last: '1997-09-27', distanceKm: 0.1, planned: 7, lasted: 83, unit: 'sols' },
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity',
    lat: 18.4447,
    lon: 77.4508,
    color: '#8affc1',
    playable: false,
    stats: { landed: '2021-02-18', last: '2024-01-18', lastLabel: 'panel.lastFlight', distanceKm: 17, planned: 5, lasted: 72, unit: 'flights' },
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
    facts: {
      tr: [['Surveyor 3 inişi', '20 Nisan 1967'], ['Surveyor 3 son iletişim', '4 Mayıs 1967'], ['Apollo 12 inişi', '18 Kasım 1969'], ['Aradaki mesafe', '180 m'], ['Surveyor 3\'ün fotoğrafları', '6.326']],
      en: [['Surveyor 3 landed', 'April 20, 1967'], ['Surveyor 3 last contact', 'May 4, 1967'], ['Apollo 12 landed', 'November 18, 1969'], ['Distance apart', '180 m'], ['Photos by Surveyor 3', '6,326']],
    },
  },
];
