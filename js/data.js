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
];
