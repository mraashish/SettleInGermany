/**
 * City pages for every city offered in onboarding (src/content/germanCities.ts).
 *
 * Per city: typical student costs for the budget planner and the places newcomers need
 * (city hall, foreigners' office, a church, tourist information, main station, nearest
 * airport, banks). Addresses change, so places link to a live map search unless the
 * address was checked against an official source (Leipzig).
 *
 * Rent: average warm rent for a room in a shared flat (WG), from the sources named per
 * city. Cities without a published local figure use the Germany-wide average and say so.
 * Editors can replace any value in the CMS.
 */
import type { City, Localized, Source } from '../types';
import { citySlug, GERMAN_CITIES } from '../germanCities';
import { CHECKED, L, S } from './util';

type RentSource = 'mmi2026' | 'studisEstimate' | 'empirica2026';

export const RENT_SOURCES: Record<RentSource | 'average', Source & { when: Localized }> = {
  mmi2026: {
    title: 'Studis Online — WG room rents (data: Moses Mendelssohn Institut / WG-Gesucht)',
    url: 'https://www.studis-online.de/studienkosten/wg-zimmer-mietspiegel.php',
    when: L('spring 2026', 'वसन्त २०२६', 'वसंत 2026'),
  },
  studisEstimate: {
    title: 'Studis Online — WG room rents (autumn 2024 data, updated estimate)',
    url: 'https://www.studis-online.de/studienkosten/wg-zimmer-mietspiegel.php',
    when: L('estimate based on autumn 2024', 'शरद २०२४ को तथ्यांकमा आधारित अनुमान', 'शरद 2024 के आंकड़ों पर आधारित अनुमान'),
  },
  empirica2026: {
    title: 'empirica — WG rents in university cities, summer semester 2026 (PDF)',
    url: 'https://www.empirica-institut.de/assets/content/typo3/Redaktion/Publikationen_Referenzen/PDFs/preisspiegel-wg-mieten-sommer-2026.pdf',
    when: L('summer semester 2026', 'ग्रीष्म सेमेस्टर २०२६', 'ग्रीष्म सेमेस्टर 2026'),
  },
  average: {
    title: 'Moses Mendelssohn Institut — Student housing costs (Germany average)',
    url: 'https://www.moses-mendelssohn-institut.de/aktuelles/WiSe2026',
    when: L('Germany average, 2026', 'जर्मनीको औसत, २०२६', 'जर्मनी का औसत, 2026'),
  },
};

/** Germany-wide average WG room rent (MMI, March 2026). */
export const GERMANY_AVERAGE_RENT = 512;

/** Average WG room rent per city (€ a month, warm) and where the figure comes from. */
const RENT: Record<string, [number, RentSource]> = {
  'München': [800, 'mmi2026'], Berlin: [650, 'mmi2026'], Hamburg: [650, 'mmi2026'], 'Düsseldorf': [630, 'mmi2026'],
  'Köln': [620, 'mmi2026'], Bonn: [510, 'mmi2026'], Bochum: [385, 'mmi2026'], Bielefeld: [375, 'mmi2026'],
  'Frankfurt am Main': [694, 'studisEstimate'], Stuttgart: [582, 'studisEstimate'], Potsdam: [577, 'studisEstimate'],
  Konstanz: [572, 'studisEstimate'], Augsburg: [520, 'studisEstimate'], Heidelberg: [520, 'studisEstimate'],
  Mainz: [514, 'studisEstimate'], Mannheim: [514, 'studisEstimate'], 'Nürnberg': [498, 'studisEstimate'],
  Karlsruhe: [488, 'studisEstimate'], Darmstadt: [483, 'studisEstimate'], Regensburg: [483, 'studisEstimate'],
  'Tübingen': [483, 'studisEstimate'], 'Münster': [480, 'studisEstimate'], Ulm: [477, 'studisEstimate'],
  Bremen: [472, 'studisEstimate'], Erlangen: [472, 'studisEstimate'], Hannover: [467, 'studisEstimate'],
  Aachen: [462, 'studisEstimate'], Dortmund: [446, 'studisEstimate'], 'Würzburg': [446, 'studisEstimate'],
  Essen: [435, 'studisEstimate'], Bayreuth: [427, 'studisEstimate'], Duisburg: [420, 'studisEstimate'],
  'Göttingen': [418, 'studisEstimate'], Bamberg: [414, 'studisEstimate'], Braunschweig: [409, 'studisEstimate'],
  Kassel: [392, 'studisEstimate'], Dresden: [389, 'studisEstimate'], Cottbus: [371, 'studisEstimate'],
  Erfurt: [367, 'studisEstimate'], Chemnitz: [307, 'studisEstimate'], Mittweida: [281, 'studisEstimate'],
  Freiberg: [281, 'studisEstimate'],
  'Freiburg im Breisgau': [600, 'empirica2026'], Kiel: [450, 'empirica2026'], Jena: [390, 'empirica2026'],
  Greifswald: [368, 'empirica2026'], Siegen: [343, 'empirica2026'],
};

/** Nearest international airport (name and IATA code). */
const AIRPORT_BY_CODE: Record<string, string> = {
  BER: 'Berlin Brandenburg Airport (BER)', HAM: 'Hamburg Airport (HAM)', BRE: 'Bremen Airport (BRE)',
  HAJ: 'Hannover Airport (HAJ)', LEJ: 'Leipzig/Halle Airport (LEJ)', DRS: 'Dresden Airport (DRS)',
  ERF: 'Erfurt-Weimar Airport (ERF)', RLG: 'Rostock-Laage Airport (RLG)', DUS: 'Düsseldorf Airport (DUS)',
  DTM: 'Dortmund Airport (DTM)', CGN: 'Cologne Bonn Airport (CGN)', FMO: 'Münster Osnabrück Airport (FMO)',
  PAD: 'Paderborn Lippstadt Airport (PAD)', FRA: 'Frankfurt Airport (FRA)', LUX: 'Luxembourg Airport (LUX)',
  SCN: 'Saarbrücken Airport (SCN)', STR: 'Stuttgart Airport (STR)', FKB: 'Karlsruhe/Baden-Baden Airport (FKB)',
  BSL: 'EuroAirport Basel-Mulhouse-Freiburg (BSL)', ZRH: 'Zurich Airport (ZRH)', MUC: 'Munich Airport (MUC)',
  NUE: 'Nuremberg Airport (NUE)',
};

const AIRPORT: Record<string, keyof typeof AIRPORT_BY_CODE> = {
  Aachen: 'CGN', Augsburg: 'MUC', Bamberg: 'NUE', Bayreuth: 'NUE', Berlin: 'BER', 'Bergisch Gladbach': 'CGN', Bielefeld: 'PAD',
  Bochum: 'DUS', Bonn: 'CGN', Bottrop: 'DUS', Braunschweig: 'HAJ', Bremen: 'BRE', Bremerhaven: 'BRE', Chemnitz: 'LEJ',
  Cottbus: 'BER', Darmstadt: 'FRA', Dortmund: 'DTM', Dresden: 'DRS', Duisburg: 'DUS', 'Düsseldorf': 'DUS', Erfurt: 'ERF',
  Erlangen: 'NUE', Essen: 'DUS', Flensburg: 'HAM', 'Frankfurt am Main': 'FRA', 'Frankfurt (Oder)': 'BER', Freiberg: 'DRS',
  'Freiburg im Breisgau': 'BSL', Fulda: 'FRA', 'Fürth': 'NUE', Gelsenkirchen: 'DUS', 'Gießen': 'FRA', 'Göttingen': 'HAJ',
  Greifswald: 'RLG', 'Gütersloh': 'PAD', Hagen: 'DTM', 'Halle (Saale)': 'LEJ', Hamburg: 'HAM', Hamm: 'DTM', Hannover: 'HAJ',
  Heidelberg: 'FRA', Heilbronn: 'STR', Herne: 'DTM', Hildesheim: 'HAJ', Ilmenau: 'ERF', Ingolstadt: 'MUC', Jena: 'ERF',
  Kaiserslautern: 'FRA', Karlsruhe: 'FKB', Kassel: 'FRA', Kiel: 'HAM', Koblenz: 'CGN', 'Köln': 'CGN', Konstanz: 'ZRH',
  Krefeld: 'DUS', Leipzig: 'LEJ', Leverkusen: 'CGN', 'Lübeck': 'HAM', 'Ludwigshafen am Rhein': 'FRA', 'Lüneburg': 'HAM',
  Magdeburg: 'LEJ', Mainz: 'FRA', Mannheim: 'FRA', Marburg: 'FRA', Merseburg: 'LEJ', Mittweida: 'LEJ', Moers: 'DUS',
  'Mönchengladbach': 'DUS', 'Mülheim an der Ruhr': 'DUS', 'München': 'MUC', 'Münster': 'FMO', Neuss: 'DUS', 'Nürnberg': 'NUE',
  Oberhausen: 'DUS', 'Offenbach am Main': 'FRA', Oldenburg: 'BRE', 'Osnabrück': 'FMO', Paderborn: 'PAD', Passau: 'MUC',
  Pforzheim: 'STR', Potsdam: 'BER', Recklinghausen: 'DTM', Regensburg: 'MUC', Remscheid: 'DUS', Reutlingen: 'STR',
  Rostock: 'RLG', 'Saarbrücken': 'SCN', Salzgitter: 'HAJ', Schwerin: 'HAM', Siegen: 'CGN', Solingen: 'DUS', Stuttgart: 'STR',
  Trier: 'LUX', 'Tübingen': 'STR', Ulm: 'STR', Weimar: 'ERF', Wiesbaden: 'FRA', Wismar: 'HAM', Wolfsburg: 'HAJ',
  Wuppertal: 'DUS', 'Würzburg': 'NUE', Zittau: 'DRS', Zwickau: 'LEJ',
};

/** Landmark church in the city centre (only where well known). */
const CHURCH: Record<string, string> = {
  Aachen: 'Aachener Dom', Augsburg: 'Augsburger Dom', Bamberg: 'Bamberger Dom', Berlin: 'Berliner Dom', Bielefeld: 'Altstädter Nicolaikirche',
  Bonn: 'Bonner Münster', Braunschweig: 'Braunschweiger Dom', Bremen: 'St. Petri Dom Bremen', Darmstadt: 'Stadtkirche Darmstadt',
  Dortmund: 'St. Reinoldikirche', Dresden: 'Frauenkirche Dresden', 'Düsseldorf': 'St. Lambertus', Erfurt: 'Erfurter Dom',
  Essen: 'Essener Münster', 'Frankfurt am Main': 'Kaiserdom St. Bartholomäus', Freiberg: 'Freiberger Dom',
  'Freiburg im Breisgau': 'Freiburger Münster', Fulda: 'Fuldaer Dom', 'Göttingen': 'St. Johannis', Greifswald: 'Dom St. Nikolai',
  'Halle (Saale)': 'Marktkirche Unser Lieben Frauen', Hamburg: 'Hauptkirche St. Michaelis', Hannover: 'Marktkirche Hannover',
  Heidelberg: 'Heiliggeistkirche', Hildesheim: 'Hildesheimer Dom', Jena: 'Stadtkirche St. Michael', Karlsruhe: 'Evangelische Stadtkirche Karlsruhe',
  Kassel: 'Martinskirche', Kiel: 'Nikolaikirche Kiel', 'Köln': 'Kölner Dom', Konstanz: 'Konstanzer Münster', Leipzig: 'Thomaskirche',
  'Lübeck': 'Lübecker Dom', Magdeburg: 'Magdeburger Dom', Mainz: 'Mainzer Dom', Mannheim: 'Jesuitenkirche Mannheim', Marburg: 'Elisabethkirche',
  'München': 'Frauenkirche München', 'Münster': 'St.-Paulus-Dom', 'Nürnberg': 'St. Lorenz', 'Osnabrück': 'Dom St. Peter',
  Paderborn: 'Paderborner Dom', Passau: 'Dom St. Stephan', Potsdam: 'Nikolaikirche Potsdam', Regensburg: 'Regensburger Dom',
  Rostock: 'Marienkirche Rostock', Schwerin: 'Schweriner Dom', Stuttgart: 'Stiftskirche Stuttgart', Trier: 'Trierer Dom',
  Ulm: 'Ulmer Münster', Weimar: 'Stadtkirche St. Peter und Paul', Wiesbaden: 'Marktkirche Wiesbaden', Wismar: 'St. Nikolai Wismar',
  'Würzburg': 'Kiliansdom',
};

/** Cities whose main station is called "Hauptbahnhof" (Hbf). Others use the city's main station name search. */
const HBF = new Set([
  'Aachen', 'Augsburg', 'Bayreuth', 'Berlin', 'Bielefeld', 'Bochum', 'Bonn', 'Bottrop', 'Braunschweig', 'Bremen', 'Bremerhaven',
  'Chemnitz', 'Cottbus', 'Darmstadt', 'Dortmund', 'Dresden', 'Duisburg', 'Düsseldorf', 'Erfurt', 'Essen', 'Frankfurt am Main',
  'Freiburg im Breisgau', 'Fürth', 'Gelsenkirchen', 'Gütersloh', 'Hagen', 'Halle (Saale)', 'Hamburg', 'Hamm', 'Hannover',
  'Heidelberg', 'Heilbronn', 'Hildesheim', 'Ingolstadt', 'Kaiserslautern', 'Karlsruhe', 'Kassel', 'Kiel', 'Koblenz', 'Köln',
  'Krefeld', 'Leipzig', 'Lübeck', 'Ludwigshafen am Rhein', 'Magdeburg', 'Mainz', 'Mannheim', 'Mönchengladbach',
  'Mülheim an der Ruhr', 'München', 'Münster', 'Neuss', 'Nürnberg', 'Oberhausen', 'Offenbach am Main', 'Oldenburg', 'Osnabrück',
  'Paderborn', 'Passau', 'Pforzheim', 'Potsdam', 'Recklinghausen', 'Regensburg', 'Remscheid', 'Reutlingen', 'Rostock',
  'Saarbrücken', 'Schwerin', 'Siegen', 'Solingen', 'Stuttgart', 'Trier', 'Tübingen', 'Ulm', 'Wiesbaden', 'Wolfsburg', 'Wuppertal',
  'Würzburg', 'Zwickau',
]);

export const mapSearch = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const fmt = (n: number) => `€${n.toLocaleString('en-US')}`;
const fmtNe = (n: number) => `€${n.toLocaleString('en-US').replace(/\d/g, (d) => '०१२३४५६७८९'[+d])}`;

/** Budget items that are the same everywhere in Germany (official figures). */
const COMMON_BUDGET = [
  { label: L('Health insurance (student rate, example TK)', 'स्वास्थ्य बीमा (विद्यार्थी दर, उदाहरण TK)', 'स्वास्थ्य बीमा (छात्र दर, उदाहरण TK)'), value: 141 },
  { label: L('Food, transport, study materials and everyday costs (BAföG basic need)', 'खाना, यातायात, पढाइ सामग्री र दैनिक खर्च (BAföG आधारभूत आवश्यकता)', 'खाना, परिवहन, पढ़ाई का सामान और रोज़मर्रा का ख़र्च (BAföG मूल ज़रूरत)'), value: 475 },
  { label: L('Broadcasting fee (per flat)', 'प्रसारण शुल्क (प्रति फ्ल्याट)', 'प्रसारण शुल्क (प्रति फ़्लैट)'), value: 18 },
];

export const BUDGET_SOURCES: Source[] = [S.tkStudents, S.bafoegNeeds, S.rundfunkPayment];

function places(name: string) {
  const airport = AIRPORT_BY_CODE[AIRPORT[name] ?? 'FRA'];
  const station = HBF.has(name) ? `${name} Hauptbahnhof` : `Bahnhof ${name}`;
  const church = CHURCH[name];
  return [
    { kind: 'cityHall' as const, name: `Rathaus ${name}`, mapUrl: mapSearch(`Rathaus ${name}`) },
    { kind: 'immigration' as const, name: `Ausländerbehörde ${name}`, mapUrl: mapSearch(`Ausländerbehörde ${name}`) },
    { kind: 'church' as const, name: church ?? `Kirchen in ${name}`, mapUrl: mapSearch(church ? `${church} ${name}` : `Kirche ${name}`) },
    { kind: 'tourist' as const, name: `Tourist-Information ${name}`, mapUrl: mapSearch(`Tourist-Information ${name}`) },
    { kind: 'station' as const, name: station, mapUrl: mapSearch(station), url: 'https://www.bahn.de/' },
    { kind: 'airport' as const, name: airport, mapUrl: mapSearch(airport) },
    { kind: 'bank' as const, name: `Sparkasse ${name}`, mapUrl: mapSearch(`Sparkasse ${name}`) },
    { kind: 'bank' as const, name: `Volksbank ${name}`, mapUrl: mapSearch(`Volksbank ${name}`) },
  ];
}

/** One generated city page. Leipzig has a hand-written page in data.ts and is skipped here. */
function cityPage(name: string): City {
  const rent = RENT[name];
  const src = RENT_SOURCES[rent ? rent[1] : 'average'];
  const value = rent ? rent[0] : GERMANY_AVERAGE_RENT;
  const rentValue = rent
    ? L(`about ${fmt(value)} a month (${src.when.en})`, `महिनामा करिब ${fmtNe(value)} (${src.when.ne})`, `हर महीने लगभग ${fmt(value)} (${src.when.hi})`)
    : L(
      `no local figure yet — Germany average about ${fmt(value)} a month`,
      `स्थानीय तथ्यांक अझै छैन — जर्मनीको औसत महिनामा करिब ${fmtNe(value)}`,
      `अभी स्थानीय आंकड़ा नहीं — जर्मनी का औसत हर महीने लगभग ${fmt(value)}`,
    );
  return {
    slug: citySlug(name),
    name,
    lastVerified: CHECKED,
    facts: [
      { label: L('Room in a shared flat (WG), warm rent', 'साझा फ्ल्याट (WG) मा कोठा, वार्म भाडा', 'साझा फ़्लैट (WG) में कमरा, वार्म किराया'), value: rentValue },
      { label: L('Deutschlandticket', 'Deutschlandticket', 'Deutschlandticket'), value: L('€63 a month · €66.80 from 2027', 'महिनाको €६३ · २०२७ देखि €६६.८०', 'हर महीने €63 · 2027 से €66.80') },
      { label: L('Student budget, typical total', 'विद्यार्थी बजेट, सामान्य जम्मा', 'छात्र बजट, आम कुल'), value: L(`about ${fmt(value + 141 + 475 + 18)} a month — adjust it in the budget planner`, `महिनामा करिब ${fmtNe(value + 141 + 475 + 18)} — बजेट योजनामा मिलाउनुहोस्`, `हर महीने लगभग ${fmt(value + 141 + 475 + 18)} — बजट योजना में बदलें`) },
    ],
    appointments: [],
    community: [],
    places: places(name),
    budget: [
      { label: L('Rent (room in a shared flat)', 'भाडा (साझा फ्ल्याटमा कोठा)', 'किराया (साझा फ़्लैट में कमरा)'), value },
      ...COMMON_BUDGET,
    ],
    sources: [{ title: src.title, url: src.url }, ...BUDGET_SOURCES, S.bahnDticket],
  };
}

export const generatedCities: City[] = GERMAN_CITIES.filter((n) => n !== 'Leipzig').map(cityPage);

/** Leipzig: addresses checked against official sources. */
export const leipzigPlaces: NonNullable<City['places']> = [
  { kind: 'cityHall', name: 'Neues Rathaus', address: 'Martin-Luther-Ring 4–6, 04109 Leipzig', url: 'https://www.leipzig.de/', mapUrl: mapSearch('Neues Rathaus Leipzig') },
  { kind: 'immigration', name: 'Ausländerbehörde Leipzig (Technisches Rathaus)', address: 'Prager Straße 126–128, 04317 Leipzig', url: S.leipzigForeignersAuthority.url, mapUrl: mapSearch('Prager Straße 126 Leipzig') },
  { kind: 'cityHall', name: 'Bürgerbüro Otto-Schill-Straße (Stadthaus)', address: 'Otto-Schill-Straße 2, 04109 Leipzig', url: S.leipzigOttoSchill.url, mapUrl: mapSearch('Otto-Schill-Straße 2 Leipzig') },
  { kind: 'church', name: 'Thomaskirche', address: 'Thomaskirchhof 18, 04109 Leipzig', mapUrl: mapSearch('Thomaskirche Leipzig') },
  { kind: 'tourist', name: 'Leipzig Tourist-Information', mapUrl: mapSearch('Tourist-Information Leipzig') },
  { kind: 'station', name: 'Leipzig Hauptbahnhof', address: 'Willy-Brandt-Platz, 04109 Leipzig', url: 'https://www.bahn.de/', mapUrl: mapSearch('Leipzig Hauptbahnhof') },
  { kind: 'airport', name: 'Leipzig/Halle Airport (LEJ)', mapUrl: mapSearch('Flughafen Leipzig/Halle') },
  { kind: 'bank', name: 'Sparkasse Leipzig', url: S.sparkasseStudents.url, mapUrl: mapSearch('Sparkasse Leipzig') },
  { kind: 'bank', name: 'Volksbank Leipzig', mapUrl: mapSearch('Volksbank Leipzig') },
];
