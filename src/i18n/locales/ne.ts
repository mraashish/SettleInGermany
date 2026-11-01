// TODO(product owner): native-speaker review of all Nepali copy (HANDOFF §12).
// Strings seeded from design-source/LocalHome.dc.html; anything missing falls back to English.
const ne = {
  nav: { main: 'मुख्य मेनु', home: 'गृहपृष्ठ', guides: 'गाइडहरू', assist: 'सहायता', tools: 'उपकरण', me: 'मेरो', back: 'पछाडि', skip: 'छोड्नुहोस्', continue: 'जारी राख्नुहोस्', close: 'बन्द गर्नुहोस्', cancel: 'रद्द गर्नुहोस्', save: 'सेभ गर्नुहोस्' },
  common: { howTo: 'कसरी गर्ने', seeAll: 'सबै {{count}} हेर्नुहोस्', generalInfo: 'सामान्य जानकारी, कानुनी सल्लाह होइन।', retry: 'फेरि प्रयास गर्नुहोस्' },
  deadline: { urgent: 'अत्यावश्यक · {{count}} दिन', soon: 'छिट्टै · {{count}} दिन', days: '{{count}} दिन', inDays: '{{count}} दिनमा', done: 'पूरा' },
  home: {
    hello: 'नमस्ते, {{name}}', helloAnon: 'नमस्ते', searchLabel: 'गाइड, उपकरण र जर्मन शब्द खोज्नुहोस्',
    ruleChange: 'नियम परिवर्तन · {{date}}', seeWhatChanges: 'के बदलियो, हेर्नुहोस्',
    stageOf: 'चरण {{n}} / 4 · {{city}}', progress: '{{total}} मध्ये {{done}} पूरा · लगभग {{hours}} घण्टा बाँकी',
    nextSteps: 'तपाईंका अर्को 3 कदम', upcoming: 'आउँदै गरेका म्यादहरू',
    letterTitle: 'बुझ्न नसकेको चिठी आयो?', letterSub: 'स्क्यान गर्नुहोस् · यो महिना {{count}} निःशुल्क स्क्यान बाँकी',
  },
  stages: { first30: 'पहिलो 30 दिन' },
  onboarding: { getStarted: 'सुरु गर्नुहोस्', chooseLanguage: 'आफ्नो भाषा छान्नुहोस्' },
};
export default ne;
