import { PopularRoute } from '../types';

export interface CityGeo {
  id: string;
  name: string;
  country: string;
  region: string;
  coords: [number, number]; // [lat, lng]
  isHub: boolean;
}

export const COUNTRIES = [
  { id: 'KG', name: 'Кыргызстан', code: 'KG', flag: '🇰🇬', currency: 'KGS' },
  { id: 'KZ', name: 'Казахстан', code: 'KZ', flag: '🇰🇿', currency: 'KZT' },
  { id: 'UZ', name: 'Узбекистан', code: 'UZ', flag: '🇺🇿', currency: 'USD' },
  { id: 'TJ', name: 'Таджикистан', code: 'TJ', flag: '🇹🇯', currency: 'USD' },
];

export const CITIES: CityGeo[] = [
  // Kyrgyzstan
  { id: 'kg-bishkek', name: 'Бишкек', country: 'Кыргызстан', region: 'Чуйская область', coords: [42.8746, 74.5698], isHub: true },
  { id: 'kg-osh', name: 'Ош', country: 'Кыргызстан', region: 'Ошская область', coords: [40.5140, 72.8161], isHub: true },
  { id: 'kg-karakol', name: 'Каракол', country: 'Кыргызстан', region: 'Иссык-Кульская область', coords: [42.4907, 78.3936], isHub: true },
  { id: 'kg-jalal-abad', name: 'Джалал-Абад', country: 'Кыргызстан', region: 'Джалал-Абадская область', coords: [40.9333, 72.9833], isHub: true },
  { id: 'kg-tokmok', name: 'Токмок', country: 'Кыргызстан', region: 'Чуйская область', coords: [42.8419, 75.3015], isHub: false },
  { id: 'kg-kant', name: 'Кант', country: 'Кыргызстан', region: 'Чуйская область', coords: [42.8908, 74.8508], isHub: false },
  { id: 'kg-naryn', name: 'Нарын', country: 'Кыргызстан', region: 'Нарынская область', coords: [41.4286, 75.9911], isHub: true },
  { id: 'kg-talas', name: 'Талас', country: 'Кыргызстан', region: 'Таласская область', coords: [42.5228, 72.2428], isHub: true },
  { id: 'kg-batken', name: 'Баткен', country: 'Кыргызстан', region: 'Баткенская область', coords: [40.0553, 70.8194], isHub: true },
  { id: 'kg-kara-balta', name: 'Кара-Балта', country: 'Кыргызстан', region: 'Чуйская область', coords: [42.8144, 73.8481], isHub: false },
  { id: 'kg-balykchy', name: 'Балыкчы', country: 'Кыргызстан', region: 'Иссык-Кульская область', coords: [42.4601, 76.1870], isHub: false },
  { id: 'kg-cholpon-ata', name: 'Чолпон-Ата', country: 'Кыргызстан', region: 'Иссык-Кульская область', coords: [42.6500, 77.0833], isHub: false },
  { id: 'kg-uzgen', name: 'Узген', country: 'Кыргызстан', region: 'Ошская область', coords: [40.7699, 73.3007], isHub: false },
  { id: 'kg-kyzyl-kiya', name: 'Кызыл-Кия', country: 'Кыргызстан', region: 'Баткенская область', coords: [40.2570, 72.1278], isHub: false },

  // Kazakhstan
  { id: 'kz-almaty', name: 'Алматы', country: 'Казахстан', region: 'Алматинская область', coords: [43.2389, 76.8897], isHub: true },
  { id: 'kz-astana', name: 'Астана', country: 'Казахстан', region: 'Акмолинская область', coords: [51.1694, 71.4491], isHub: true },
  { id: 'kz-shymkent', name: 'Шымкент', country: 'Казахстан', region: 'Туркестанская область', coords: [42.3417, 69.5901], isHub: true },
  { id: 'kz-taraz', name: 'Тараз', country: 'Казахстан', region: 'Жамбылская область', coords: [42.9000, 71.3667], isHub: false },

  // Uzbekistan
  { id: 'uz-tashkent', name: 'Ташкент', country: 'Узбекистан', region: 'Ташкентская область', coords: [41.2995, 69.2401], isHub: true },
  { id: 'uz-andijan', name: 'Андижан', country: 'Узбекистан', region: 'Андижанская область', coords: [40.7821, 72.3442], isHub: true },
  { id: 'uz-fergana', name: 'Фергана', country: 'Узбекистан', region: 'Ферганская область', coords: [40.3842, 71.7843], isHub: false },
  { id: 'uz-samarkand', name: 'Самарканд', country: 'Узбекистан', region: 'Самаркандская область', coords: [39.6270, 66.9750], isHub: true },

  // Tajikistan
  { id: 'tj-dushanbe', name: 'Душанбе', country: 'Таджикистан', region: 'РРП', coords: [38.5598, 68.7870], isHub: true },
  { id: 'tj-khujand', name: 'Худжанд', country: 'Таджикистан', region: 'Согдийская область', coords: [40.2826, 69.6222], isHub: true },
];

export function calculateDistance(city1Name: string, city2Name: string): { km: number; hours: number } {
  const c1 = CITIES.find(c => c.name.toLowerCase() === city1Name.toLowerCase());
  const c2 = CITIES.find(c => c.name.toLowerCase() === city2Name.toLowerCase());

  if (!c1 || !c2 || c1.name === c2.name) {
    return { km: 45, hours: 1.5 };
  }

  // Pre-calculated known routes for high accuracy in Central Asia
  const key = `${c1.name}-${c2.name}`.toLowerCase();
  const reverseKey = `${c2.name}-${c1.name}`.toLowerCase();

  const exactTable: Record<string, { km: number; hours: number }> = {
    'бишкек-ош': { km: 605, hours: 11 },
    'ош-бишкек': { km: 605, hours: 11 },
    'бишкек-каракол': { km: 400, hours: 6 },
    'каракол-бишкек': { km: 400, hours: 6 },
    'бишкек-джалал-абад': { km: 560, hours: 10 },
    'джалал-абад-бишкек': { km: 560, hours: 10 },
    'бишкек-нарын': { km: 315, hours: 5 },
    'нарын-бишкек': { km: 315, hours: 5 },
    'бишкек-талас': { km: 290, hours: 4.5 },
    'талас-бишкек': { km: 290, hours: 4.5 },
    'бишкек-баткен': { km: 780, hours: 14 },
    'баткен-бишкек': { km: 780, hours: 14 },
    'бишкек-токмок': { km: 65, hours: 1.2 },
    'бишкек-кант': { km: 25, hours: 0.5 },
    'бишкек-кара-балта': { km: 62, hours: 1.1 },
    'бишкек-алматы': { km: 240, hours: 4.5 },
    'алматы-бишкек': { km: 240, hours: 4.5 },
    'бишкек-ташкент': { km: 580, hours: 9.5 },
    'ташкент-бишкек': { km: 580, hours: 9.5 },
    'ош-джалал-абад': { km: 105, hours: 2 },
    'ош-баткен': { km: 220, hours: 4 },
    'ош-андижан': { km: 55, hours: 1.5 },
    'ош-ташкент': { km: 410, hours: 7.5 },
    'каракол-чолпон-ата': { km: 140, hours: 2.2 },
    'бишкек-чолпон-ата': { km: 260, hours: 3.8 },
  };

  if (exactTable[key]) return exactTable[key];
  if (exactTable[reverseKey]) return exactTable[reverseKey];

  // Haversine formula approximation with mountain factor
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(c2.coords[0] - c1.coords[0]);
  const dLon = toRad(c2.coords[1] - c1.coords[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(c1.coords[0])) * Math.cos(toRad(c2.coords[0])) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;

  // Road factor for mountainous Central Asian terrain is ~1.38
  const roadKm = Math.round(directDistance * 1.38);
  const avgSpeed = 55; // km/h for freight
  const hours = +(roadKm / avgSpeed).toFixed(1);

  return { km: roadKm, hours };
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'r-1',
    fromCity: 'Бишкек',
    fromCountry: 'Кыргызстан',
    toCity: 'Ош',
    toCountry: 'Кыргызстан',
    distanceKm: 605,
    avgHours: 11,
    activeCargosCount: 38,
    avgPriceKgs: 18500,
    popularBodyType: 'Тент / Фургон',
    trend: '+15%',
  },
  {
    id: 'r-2',
    fromCity: 'Ош',
    fromCountry: 'Кыргызстан',
    toCity: 'Бишкек',
    toCountry: 'Кыргызстан',
    distanceKm: 605,
    avgHours: 11,
    activeCargosCount: 29,
    avgPriceKgs: 14200,
    popularBodyType: 'Рефрижератор / Тент',
    trend: '+12%',
  },
  {
    id: 'r-3',
    fromCity: 'Бишкек',
    fromCountry: 'Кыргызстан',
    toCity: 'Каракол',
    toCountry: 'Кыргызстан',
    distanceKm: 400,
    avgHours: 6,
    activeCargosCount: 19,
    avgPriceKgs: 12000,
    popularBodyType: 'Бортовой / Тент',
    trend: '+8%',
  },
  {
    id: 'r-4',
    fromCity: 'Каракол',
    fromCountry: 'Кыргызстан',
    toCity: 'Бишкек',
    toCountry: 'Кыргызстан',
    distanceKm: 400,
    avgHours: 6,
    activeCargosCount: 14,
    avgPriceKgs: 9500,
    popularBodyType: 'Тент / Изотерм',
    trend: '-3%',
  },
  {
    id: 'r-5',
    fromCity: 'Бишкек',
    fromCountry: 'Кыргызстан',
    toCity: 'Алматы',
    toCountry: 'Казахстан',
    distanceKm: 240,
    avgHours: 4.5,
    activeCargosCount: 42,
    avgPriceKgs: 22000,
    popularBodyType: 'Фургон / Контейнер',
    trend: '+15%',
  },
  {
    id: 'r-6',
    fromCity: 'Алматы',
    fromCountry: 'Казахстан',
    toCity: 'Бишкек',
    toCountry: 'Кыргызстан',
    distanceKm: 240,
    avgHours: 4.5,
    activeCargosCount: 31,
    avgPriceKgs: 19000,
    popularBodyType: 'Тент / Сборный',
    trend: '+8%',
  },
  {
    id: 'r-7',
    fromCity: 'Бишкек',
    fromCountry: 'Кыргызстан',
    toCity: 'Ташкент',
    toCountry: 'Узбекистан',
    distanceKm: 580,
    avgHours: 9.5,
    activeCargosCount: 23,
    avgPriceKgs: 32000,
    popularBodyType: 'Рефрижератор / Тент',
    trend: '+12%',
  },
  {
    id: 'r-8',
    fromCity: 'Ош',
    fromCountry: 'Кыргызстан',
    toCity: 'Джалал-Абад',
    toCountry: 'Кыргызстан',
    distanceKm: 105,
    avgHours: 2,
    activeCargosCount: 17,
    avgPriceKgs: 6500,
    popularBodyType: 'Любой кузов',
    trend: '+8%',
  },
];
