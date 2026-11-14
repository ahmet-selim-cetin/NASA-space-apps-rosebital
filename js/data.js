// Mission data. Coordinates: planetocentric latitude, east longitude (0–360).
export const ROVERS = [
  {
    id: 'opportunity',
    name: 'Opportunity',
    lat: -1.9462,
    lon: 354.4734,
    color: '#ffb347',
    playable: true,
    stats: { landed: '2004-01-25', lastContact: '2018-06-10', distanceKm: 45.16, plannedSols: 90, sols: 5111 },
  },
  {
    id: 'spirit',
    name: 'Spirit',
    lat: -14.5684,
    lon: 175.4726,
    color: '#7fd3ff',
    playable: false,
    stats: { landed: '2004-01-04', lastContact: '2010-03-22', distanceKm: 7.73, plannedSols: 90, sols: 2208 },
  },
  {
    id: 'sojourner',
    name: 'Sojourner',
    lat: 19.13,
    lon: 326.78,
    color: '#c9a7ff',
    playable: false,
    stats: { landed: '1997-07-04', lastContact: '1997-09-27', distanceKm: 0.1, plannedSols: 7, sols: 83 },
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity',
    lat: 18.4447,
    lon: 77.4508,
    color: '#8affc1',
    playable: false,
    stats: { landed: '2021-02-18', lastContact: '2024-01-18', distanceKm: 17.24, plannedSols: 30, sols: 1042 },
  },
];
