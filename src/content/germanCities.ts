/**
 * German cities offered in onboarding (all cities with more than 100,000 inhabitants plus
 * common university towns). Only cities with a page in the content database
 * (collection `cities`) show a city page; any other city is still saved to the profile.
 */
export const GERMAN_CITIES = [
  'Aachen', 'Augsburg', 'Bamberg', 'Bayreuth', 'Berlin', 'Bergisch Gladbach', 'Bielefeld', 'Bochum', 'Bonn', 'Bottrop',
  'Braunschweig', 'Bremen', 'Bremerhaven', 'Chemnitz', 'Cottbus', 'Darmstadt', 'Dortmund', 'Dresden', 'Duisburg',
  'Düsseldorf', 'Erfurt', 'Erlangen', 'Essen', 'Flensburg', 'Frankfurt am Main', 'Frankfurt (Oder)', 'Freiberg',
  'Freiburg im Breisgau', 'Fulda', 'Fürth', 'Gelsenkirchen', 'Gießen', 'Göttingen', 'Greifswald', 'Gütersloh', 'Hagen',
  'Halle (Saale)', 'Hamburg', 'Hamm', 'Hannover', 'Heidelberg', 'Heilbronn', 'Herne', 'Hildesheim', 'Ilmenau', 'Ingolstadt',
  'Jena', 'Kaiserslautern', 'Karlsruhe', 'Kassel', 'Kiel', 'Koblenz', 'Köln', 'Konstanz', 'Krefeld', 'Leipzig',
  'Leverkusen', 'Lübeck', 'Ludwigshafen am Rhein', 'Lüneburg', 'Magdeburg', 'Mainz', 'Mannheim', 'Marburg',
  'Merseburg', 'Mittweida', 'Moers', 'Mönchengladbach', 'Mülheim an der Ruhr', 'München', 'Münster', 'Neuss',
  'Nürnberg', 'Oberhausen', 'Offenbach am Main', 'Oldenburg', 'Osnabrück', 'Paderborn', 'Passau', 'Pforzheim',
  'Potsdam', 'Recklinghausen', 'Regensburg', 'Remscheid', 'Reutlingen', 'Rostock', 'Saarbrücken', 'Salzgitter',
  'Schwerin', 'Siegen', 'Solingen', 'Stuttgart', 'Trier', 'Tübingen', 'Ulm', 'Weimar', 'Wiesbaden', 'Wismar',
  'Wolfsburg', 'Wuppertal', 'Würzburg', 'Zittau', 'Zwickau',
];

export const citySlug = (name: string) =>
  name.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** English and other common spellings people type for German city names. */
const ALIASES: Record<string, string> = {
  munich: 'München', cologne: 'Köln', nuremberg: 'Nürnberg', hanover: 'Hannover', brunswick: 'Braunschweig',
  frankfurt: 'Frankfurt am Main', freiburg: 'Freiburg im Breisgau', halle: 'Halle (Saale)', mayence: 'Mainz',
  treves: 'Trier', 'aix-la-chapelle': 'Aachen', ratisbon: 'Regensburg', wurzburg: 'Würzburg', lubeck: 'Lübeck',
};

/** Lower case, no accents; ä/ö/ü may also be typed as ae/oe/ue, ß as ss. */
export const normalizeCity = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
    .replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '').trim();

/**
 * City names matching what someone typed: a word of the name (or an English name such as
 * “Munich”) starts with the query — so “Mün” finds München and Münster but not Dortmund.
 * Results keep the order of `names`; exact and alias matches come first.
 */
export function searchCities(names: string[], query: string): string[] {
  const q = normalizeCity(query);
  if (!q) return names;
  const words = (n: string) => normalizeCity(n).split(/[\s()/-]+/).filter(Boolean);
  const aliasHits = Object.entries(ALIASES).filter(([alias]) => alias.startsWith(q)).map(([, name]) => name);
  const hits = names.filter((n) => normalizeCity(n).startsWith(q) || words(n).some((w) => w.startsWith(q)));
  const first = names.filter((n) => normalizeCity(n) === q || aliasHits.includes(n));
  return [...new Set([...first, ...hits, ...aliasHits.filter((n) => names.includes(n))])];
}
