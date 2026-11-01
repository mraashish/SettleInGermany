// TODO(product owner): native-speaker review of all Hindi copy (HANDOFF §12).
// Strings seeded from design-source/LocalHome.dc.html; anything missing falls back to English.
const hi = {
  nav: { main: 'मुख्य मेन्यू', home: 'होम', guides: 'गाइड', assist: 'सहायता', tools: 'टूल्स', me: 'मेरा खाता', back: 'वापस', skip: 'छोड़ें', continue: 'जारी रखें', close: 'बंद करें', cancel: 'रद्द करें', save: 'सेव करें' },
  common: { howTo: 'कैसे करें', seeAll: 'सभी {{count}} देखें', generalInfo: 'सामान्य जानकारी, कानूनी सलाह नहीं।', retry: 'फिर से कोशिश करें' },
  deadline: { urgent: 'ज़रूरी · {{count}} दिन', soon: 'जल्द · {{count}} दिन', days: '{{count}} दिन', inDays: '{{count}} दिन में', done: 'पूरा' },
  home: {
    hello: 'नमस्ते, {{name}}', helloAnon: 'नमस्ते', searchLabel: 'गाइड, टूल और जर्मन शब्द खोजें',
    ruleChange: 'नियम में बदलाव · {{date}}', seeWhatChanges: 'क्या बदला, देखें',
    stageOf: 'चरण {{n}} / 4 · {{city}}', progress: '{{total}} में से {{done}} पूरे · लगभग {{hours}} घंटे बाकी',
    nextSteps: 'आपके अगले 3 कदम', upcoming: 'आने वाली समय-सीमाएँ',
    letterTitle: 'कोई चिट्ठी समझ नहीं आई?', letterSub: 'स्कैन करें · इस महीने {{count}} मुफ़्त स्कैन बाकी',
  },
  stages: { first30: 'पहले 30 दिन' },
  onboarding: { getStarted: 'शुरू करें', chooseLanguage: 'अपनी भाषा चुनें' },
};
export default hi;
