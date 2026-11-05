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
