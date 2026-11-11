import type { City, EmbassyContact, HelpService, Phrase, Provider, RoadmapTask, RuleChange, Rules, ScamWarning } from '../types';
import { generatedCities, leipzigPlaces } from './cities';
import { CHECKED, L, S } from './util';

const G = {
  paperwork: L('Paperwork', 'कागजी काम', 'काग़ज़ी काम'),
  money: L('Money', 'पैसा', 'पैसा'),
  health: L('Health', 'स्वास्थ्य', 'स्वास्थ्य'),
  housing: L('Housing', 'आवास', 'आवास'),
  work: L('Work', 'काम', 'काम'),
  everyday: L('Everyday life', 'दैनिक जीवन', 'रोज़मर्रा का जीवन'),
};

export const tasks: RoadmapTask[] = [
  // Before arrival
  { id: 'visa', stage: 'before', group: G.paperwork, title: L('Apply for your student visa', 'विद्यार्थी भिसाका लागि आवेदन दिनुहोस्', 'स्टूडेंट वीज़ा के लिए आवेदन करें'), term: { term: 'Visum' }, effort: L('several weeks', 'केही हप्ता', 'कई हफ़्ते'), guideSlug: 'apply-for-student-visa' },
  { id: 'blocked', stage: 'before', group: G.money, title: L('Open a blocked account', 'ब्लक्ड खाता खोल्नुहोस्', 'ब्लॉक्ड अकाउंट खोलें'), term: { term: 'Sperrkonto' }, effort: L('about 1 h + transfer', 'करिब १ घण्टा + ट्रान्सफर', 'लगभग 1 घंटा + ट्रांसफ़र'), guideSlug: 'open-a-blocked-account' },
  { id: 'insurance-pre', stage: 'before', group: G.health, title: L('Get health insurance', 'स्वास्थ्य बीमा लिनुहोस्', 'स्वास्थ्य बीमा लें'), term: { term: 'Krankenversicherung' }, effort: L('30 min', '३० मिनेट', '30 मिनट'), guideSlug: 'get-health-insurance' },
  { id: 'housing', stage: 'before', group: G.housing, title: L('Find a room', 'कोठा खोज्नुहोस्', 'कमरा खोजें'), term: { term: 'Wohnungssuche' }, guideSlug: 'find-housing-leipzig' },
  // First 30 days
  { id: 'anmeldung', stage: 'first30', group: G.paperwork, title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), term: { term: 'Anmeldung' }, effort: L('about 1 h', 'करिब १ घण्टा', 'लगभग 1 घंटा'), deadlineDaysAfterArrival: 14, guideSlug: 'register-your-address' },
  { id: 'enrol', stage: 'first30', group: G.paperwork, title: L('Enrol at university', 'विश्वविद्यालयमा भर्ना हुनुहोस्', 'विश्वविद्यालय में दाख़िला लें'), term: { term: 'Immatrikulation' }, timingNote: L('Date in your admission letter', 'भर्ना पत्रमा लेखिएको मिति', 'प्रवेश पत्र में लिखी तारीख'), statuses: ['student'], guideSlug: 'enrol-at-university' },
  { id: 'permit', stage: 'first30', group: G.paperwork, title: L('Apply for your residence permit', 'आवास अनुमतिपत्रका लागि आवेदन दिनुहोस्', 'निवास परमिट के लिए आवेदन करें'), term: { term: 'Aufenthaltserlaubnis' }, effort: L('about 1 h online', 'अनलाइन करिब १ घण्टा', 'ऑनलाइन लगभग 1 घंटा'), timingNote: L('Before your visa ends', 'भिसाको म्याद सकिनुअघि', 'वीज़ा ख़त्म होने से पहले'), guideSlug: 'book-residence-permit-appointment' },
  { id: 'taxid', stage: 'first30', group: G.paperwork, title: L('Get your tax ID', 'आफ्नो कर आईडी लिनुहोस्', 'अपनी टैक्स आईडी पाएं'), term: { term: 'Steuer-ID' }, timingNote: L('Arrives by post', 'हुलाकबाट आउँछ', 'डाक से आएगी'), guideSlug: 'get-your-tax-id' },
  { id: 'rundfunk', stage: 'first30', group: G.money, title: L('Pay the broadcasting fee', 'प्रसारण शुल्क तिर्नुहोस्', 'प्रसारण शुल्क भरें'), term: { term: 'Rundfunkbeitrag' }, effort: L('10 min', '१० मिनेट', '10 मिनट'), timingNote: L('From the month you move in', 'सरेको महिनादेखि', 'शिफ़्ट होने वाले महीने से'), guideSlug: 'pay-the-broadcasting-fee' },
  { id: 'bank', stage: 'first30', group: G.money, title: L('Open a bank account', 'बैंक खाता खोल्नुहोस्', 'बैंक खाता खोलें'), term: { term: 'Girokonto' }, effort: L('about 1 h', 'करिब १ घण्टा', 'लगभग 1 घंटा'), guideSlug: 'open-a-bank-account' },
  { id: 'phone', stage: 'first30', group: G.money, title: L('Choose a phone plan', 'फोन प्लान छान्नुहोस्', 'फ़ोन प्लान चुनें'), term: { term: 'Handyvertrag' }, effort: L('30 min', '३० मिनेट', '30 मिनट'), guideSlug: 'choose-a-phone-plan' },
  { id: 'transit', stage: 'first30', group: G.money, title: L('Get a monthly transit pass', 'मासिक यातायात पास लिनुहोस्', 'मासिक परिवहन पास लें'), term: { term: 'Deutschlandticket' }, effort: L('10 min', '१० मिनेट', '10 मिनट'), guideSlug: 'monthly-transit-pass' },
  { id: 'insurance', stage: 'first30', group: G.health, title: L('Activate your health insurance', 'स्वास्थ्य बीमा सक्रिय गर्नुहोस्', 'स्वास्थ्य बीमा सक्रिय करें'), term: { term: 'Gesundheitskarte' }, effort: L('20 min', '२० मिनेट', '20 मिनट'), guideSlug: 'activate-health-insurance' },
  { id: 'doctor', stage: 'first30', group: G.health, title: L('Find a family doctor', 'पारिवारिक डाक्टर खोज्नुहोस्', 'फ़ैमिली डॉक्टर खोजें'), term: { term: 'Hausarzt' }, effort: L('30 min', '३० मिनेट', '30 मिनट'), guideSlug: 'find-a-family-doctor' },
  // Living
  { id: 'jobs', stage: 'living', group: G.work, title: L('Understand your work limit', 'आफ्नो कामको सीमा बुझ्नुहोस्', 'अपनी काम की सीमा समझें'), term: { term: 'Nebenjob' }, statuses: ['student'], guideSlug: 'student-jobs' },
  { id: 'tax-return', stage: 'living', group: G.money, title: L('File your tax return', 'कर विवरण बुझाउनुहोस्', 'टैक्स रिटर्न भरें'), term: { term: 'Steuererklärung' }, effort: L('about 2 h', 'करिब २ घण्टा', 'लगभग 2 घंटे'), timingNote: L('Once a year', 'वर्षमा एकपटक', 'साल में एक बार'), guideSlug: 'file-tax-return' },
  { id: 'liability', stage: 'living', group: G.money, title: L('Get liability insurance', 'दायित्व बीमा लिनुहोस्', 'देयता बीमा लें'), term: { term: 'Haftpflichtversicherung' }, effort: L('30 min', '३० मिनेट', '30 मिनट'), guideSlug: 'get-liability-insurance' },
  { id: 'german', stage: 'living', group: G.everyday, title: L('Learn German', 'जर्मन भाषा सिक्नुहोस्', 'जर्मन सीखें'), term: { term: 'Deutschkurs' }, timingNote: L('Start in your first semester', 'पहिलो सेमेस्टरमै सुरु गर्नुहोस्', 'पहले सेमेस्टर में शुरू करें'), guideSlug: 'learn-german' },
  { id: 'waste', stage: 'living', group: G.everyday, title: L('Separate your waste', 'फोहोर छुट्याउनुहोस्', 'कचरा अलग करें'), term: { term: 'Mülltrennung' }, effort: L('5 min', '५ मिनेट', '5 मिनट'), guideSlug: 'separate-your-waste' },
  { id: 'utility-bill', stage: 'living', group: G.housing, title: L('Check your utility bill', 'उपयोगिता बिल जाँच्नुहोस्', 'उपयोगिता बिल जांचें'), term: { term: 'Nebenkostenabrechnung' }, timingNote: L('When the yearly statement arrives', 'वार्षिक हिसाब आएपछि', 'जब सालाना हिसाब आए'), guideSlug: 'check-your-utility-bill' },
  { id: 'driving', stage: 'living', group: G.everyday, title: L('Use or convert your driving licence', 'ड्राइभिङ लाइसेन्स प्रयोग वा रूपान्तरण गर्नुहोस्', 'ड्राइविंग लाइसेंस इस्तेमाल करें या बदलवाएं'), term: { term: 'Führerschein' }, timingNote: L('Within 6 months, if you drive', 'गाडी चलाउनुहुन्छ भने ६ महिनाभित्र', 'गाड़ी चलाते हैं तो 6 महीने में'), guideSlug: 'convert-your-driving-licence' },
  // Career
  { id: 'cv', stage: 'career', group: G.work, title: L('Write a German CV and application', 'जर्मन CV र आवेदन लेख्नुहोस्', 'जर्मन CV और आवेदन लिखें'), term: { term: 'Lebenslauf' }, effort: L('about 3 h', 'करिब ३ घण्टा', 'लगभग 3 घंटे'), guideSlug: 'write-a-german-cv' },
  { id: 'internship', stage: 'career', group: G.work, title: L('Find an internship', 'इन्टर्नसिप खोज्नुहोस्', 'इंटर्नशिप खोजें'), term: { term: 'Praktikum' }, statuses: ['student'], guideSlug: 'find-an-internship' },
  { id: 'recognition', stage: 'career', group: G.paperwork, title: L('Get your degree recognised', 'डिग्री मान्यता लिनुहोस्', 'अपनी डिग्री की मान्यता लें'), term: { term: 'Anerkennung' }, timingNote: L('Allow up to 3 months', '३ महिनासम्म समय राख्नुहोस्', '3 महीने तक का समय रखें'), guideSlug: 'get-your-degree-recognised' },
  { id: 'jobcenter', stage: 'career', group: G.work, title: L('Register with the employment agency', 'रोजगार एजेन्सीमा दर्ता गर्नुहोस्', 'रोज़गार एजेंसी में पंजीकरण करें'), term: { term: 'Agentur für Arbeit' }, effort: L('20 min', '२० मिनेट', '20 मिनट'), guideSlug: 'register-as-job-seeker' },
  { id: 'bluecard', stage: 'career', group: G.paperwork, title: L('Get an EU Blue Card', 'EU Blue Card लिनुहोस्', 'EU Blue Card लें'), term: { term: 'Blaue Karte EU' }, timingNote: L('When you have a job offer', 'कामको प्रस्ताव पाएपछि', 'नौकरी का ऑफ़र मिलने पर'), guideSlug: 'get-an-eu-blue-card' },
  { id: 'settlement', stage: 'career', group: G.paperwork, title: L('Get a settlement permit', 'स्थायी बसोबास अनुमति लिनुहोस्', 'स्थायी निवास परमिट लें'), term: { term: 'Niederlassungserlaubnis' }, timingNote: L('After 2 years of qualified work', 'योग्यताअनुसारको २ वर्षको कामपछि', '2 साल के योग्य काम के बाद'), guideSlug: 'get-a-settlement-permit' },
  { id: 'extend', stage: 'career', group: G.paperwork, title: L('Extend your residence permit', 'आवास अनुमतिपत्र नवीकरण गर्नुहोस्', 'निवास परमिट बढ़वाएं'), term: { term: 'Verlängerung' }, timingNote: L('Before your permit ends', 'अनुमतिपत्रको म्याद सकिनुअघि', 'परमिट ख़त्म होने से पहले'), guideSlug: 'extend-your-residence-permit' },
  { id: 'jobseeker', stage: 'career', group: G.work, title: L('Plan your job search after graduation', 'स्नातकपछि काम खोजको योजना बनाउनुहोस्', 'स्नातक के बाद नौकरी खोज की योजना बनाएं'), term: { term: 'Aufenthaltserlaubnis zur Arbeitsplatzsuche' }, statuses: ['student'], guideSlug: 'job-search-after-graduation' },
];

export const cities: City[] = [
  {
    slug: 'leipzig',
    name: 'Leipzig',
    lastVerified: CHECKED,
    facts: [
      { label: L('Studentenwerk dorm, all-inclusive', 'Studentenwerk छात्रावास, सबै समावेश', 'Studentenwerk हॉस्टल, सब शामिल'), value: L('€215–435 a month · average €310', 'महिनामा €२१५–४३५ · औसत €३१०', 'हर महीने €215–435 · औसत €310') },
      { label: L('Asking rent for new contracts', 'नयाँ सम्झौताको माग गरिएको भाडा', 'नए अनुबंधों का मांगा गया किराया'), value: L('about €9.26 per m², before heating (2024)', 'प्रति वर्गमिटर करिब €९.२६, तताउने बाहेक (२०२४)', 'प्रति वर्ग मीटर लगभग €9.26, हीटिंग के बिना (2024)') },
      { label: L('Semester fee, Leipzig University', 'सेमेस्टर शुल्क, लाइपजिग विश्वविद्यालय', 'सेमेस्टर फ़ीस, लाइपज़िग विश्वविद्यालय'), value: L('€332.30 (winter 2026/27), incl. Deutschland-Semesterticket', '€३३२.३० (जाडो २०२६/२७), Deutschland-Semesterticket सहित', '€332.30 (शीतकालीन 2026/27), Deutschland-Semesterticket सहित') },
      { label: L('Deutschlandticket', 'Deutschlandticket', 'Deutschlandticket'), value: L('€63 a month · €66.80 from 2027', 'महिनाको €६३ · २०२७ देखि €६६.८०', 'हर महीने €63 · 2027 से €66.80') },
      { label: L('Living costs, university estimate', 'जीवनयापन खर्च, विश्वविद्यालयको अनुमान', 'रहने का ख़र्च, विश्वविद्यालय का अनुमान'), value: L('about €1,000 a month incl. rent', 'भाडासहित महिनामा करिब €१,०००', 'किराए सहित हर महीने लगभग €1,000') },
      { label: L('City service hotline', 'सहर सेवा हटलाइन', 'शहर सेवा हॉटलाइन'), value: L('115', '११५', '115') },
    ],
    appointments: [
      {
        title: L('Citizens’ office · Bürgerbüro', 'नागरिक कार्यालय · Bürgerbüro', 'नागरिक कार्यालय · Bürgerbüro'),
        body: L(
          'Book online or call 115. Any Bürgerbüro can register you. New slots appear daily at 8:00 (Otto-Schill-Straße also at 12:00). Otto-Schill-Straße 2: Mon, Tue, Thu, Fri 8–19, Wed 8–12 and 16–19, Sat 8–13.',
          'अनलाइन बुक गर्नुहोस् वा ११५ मा फोन गर्नुहोस्। जुनसुकै Bürgerbüro ले दर्ता गर्छ। नयाँ समय दैनिक ८:०० बजे खुल्छ (Otto-Schill-Straße मा १२:०० बजे पनि)। Otto-Schill-Straße 2: सोम, मंगल, बिहि, शुक्र ८–१९, बुध ८–१२ र १६–१९, शनि ८–१३।',
          'ऑनलाइन बुक करें या 115 पर कॉल करें। कोई भी Bürgerbüro पंजीकरण करता है। नए स्लॉट रोज़ 8:00 बजे खुलते हैं (Otto-Schill-Straße में 12:00 बजे भी)। Otto-Schill-Straße 2: सोम, मंगल, गुरु, शुक्र 8–19, बुध 8–12 और 16–19, शनि 8–13।',
        ),
        url: S.leipzigBooking.url,
      },
      {
        title: L('Foreigners’ office · Ausländerbehörde', 'विदेशी कार्यालय · Ausländerbehörde', 'विदेशी कार्यालय · Ausländerbehörde'),
        body: L(
          'Residence permits for studies are applied for online — you are invited by email for biometrics. Technisches Rathaus, Prager Straße 126–128, 04317 Leipzig · 0341 123-3310.',
          'पढाइका लागि आवास अनुमतिपत्रको आवेदन अनलाइन दिइन्छ — बायोमेट्रिकका लागि इमेलबाट बोलाइन्छ। Technisches Rathaus, Prager Straße 126–128, 04317 Leipzig · ०३४१ १२३-३३१०।',
          'पढ़ाई के निवास परमिट का आवेदन ऑनलाइन होता है — बायोमेट्रिक के लिए ईमेल से बुलाया जाता है। Technisches Rathaus, Prager Straße 126–128, 04317 Leipzig · 0341 123-3310।',
        ),
        url: S.leipzigOnlineStudy.url,
      },
      {
        title: L('Welcome Centre · Willkommenszentrum', 'स्वागत केन्द्र · Willkommenszentrum', 'स्वागत केंद्र · Willkommenszentrum'),
        body: L(
          'Free first advice for newcomers in several languages: residence, work, language courses, everyday life. Otto-Schill-Straße 2, 04109 Leipzig · 0341 123-2676.',
          'नयाँ आउनेहरूका लागि धेरै भाषामा निःशुल्क प्रारम्भिक सल्लाह: बसाइ, काम, भाषा कक्षा, दैनिक जीवन। Otto-Schill-Straße 2, 04109 Leipzig · ०३४१ १२३-२६७६।',
          'नए लोगों के लिए कई भाषाओं में मुफ़्त शुरुआती सलाह: निवास, काम, भाषा कोर्स, रोज़मर्रा का जीवन। Otto-Schill-Straße 2, 04109 Leipzig · 0341 123-2676।',
        ),
        url: S.leipzigWelcome.url,
      },
    ],
    community: [
      {
        name: 'Willkommenszentrum Leipzig',
        kind: L('Advice', 'सल्लाह', 'सलाह'),
        description: L('The city’s first stop for newcomers. Free.', 'नयाँ आउनेहरूका लागि सहरको पहिलो ठाउँ। निःशुल्क।', 'नए लोगों के लिए शहर का पहला पड़ाव। मुफ़्त।'),
        address: 'Otto-Schill-Straße 2, 04109 Leipzig',
        phone: '+49 341 1232676',
        url: S.leipzigWelcome.url,
      },
      {
        name: 'Studentenwerk Leipzig — International student support',
        kind: L('Students', 'विद्यार्थी', 'छात्र'),
        description: L('Free social counselling for international students in several languages: money, housing, jobs.', 'अन्तर्राष्ट्रिय विद्यार्थीका लागि धेरै भाषामा निःशुल्क सामाजिक परामर्श: पैसा, आवास, काम।', 'अंतरराष्ट्रीय छात्रों के लिए कई भाषाओं में मुफ़्त सामाजिक परामर्श: पैसा, आवास, नौकरी।'),
        url: S.swIntlSupport.url,
      },
      {
        name: 'Caritas Leipzig — Migrationsberatung',
        kind: L('Migration advice', 'आप्रवासन सल्लाह', 'प्रवासन सलाह'),
        description: L('Free migration counselling for adults (MBE).', 'वयस्कका लागि निःशुल्क आप्रवासन परामर्श (MBE)।', 'वयस्कों के लिए मुफ़्त प्रवासन परामर्श (MBE)।'),
        address: 'Ruth-Pfau-Straße 2, 04107 Leipzig',
        phone: '+49 341 9636125',
        url: S.caritasMbe.url,
      },
      {
        name: 'Diakonie Leipzig — Jugendmigrationsdienst Naomi',
        kind: L('Under 27', '२७ वर्षमुनि', '27 से कम उम्र'),
        description: L('Free migration counselling for young people aged 12–27.', '१२–२७ वर्षका युवाका लागि निःशुल्क आप्रवासन परामर्श।', '12–27 साल के युवाओं के लिए मुफ़्त प्रवासन परामर्श।'),
        address: 'Eisenbahnstraße 66, 04315 Leipzig',
        phone: '+49 341 68709124',
        url: S.naomiJmd.url,
      },
      {
        name: 'Mieterverein Leipzig',
        kind: L('Housing', 'आवास', 'आवास'),
        description: L('Tenants’ association: checks contracts and bills for members.', 'भाडावाल संघ: सदस्यका लागि सम्झौता र बिल जाँच्छ।', 'किरायेदार संघ: सदस्यों के लिए अनुबंध और बिल जांचता है।'),
        phone: '+49 341 2131277',
        url: S.mieterverein.url,
      },
    ],
    places: leipzigPlaces,
    budget: [
      { label: L('Rent (dorm average, all-inclusive)', 'भाडा (छात्रावास औसत, सबै समावेश)', 'किराया (हॉस्टल औसत, सब शामिल)'), value: 310 },
      { label: L('Health insurance (student rate)', 'स्वास्थ्य बीमा (विद्यार्थी दर)', 'स्वास्थ्य बीमा (छात्र दर)'), value: 141 },
      { label: L('Food and everyday costs', 'खाना र दैनिक खर्च', 'खाना और रोज़मर्रा का ख़र्च'), value: 300 },
      { label: L('Semester fee incl. ticket (per month)', 'टिकटसहित सेमेस्टर शुल्क (प्रति महिना)', 'टिकट सहित सेमेस्टर फ़ीस (प्रति माह)'), value: 55 },
      { label: L('Study materials', 'पढाइ सामग्री', 'पढ़ाई का सामान'), value: 70 },
      { label: L('Broadcasting fee', 'प्रसारण शुल्क', 'प्रसारण शुल्क'), value: 18 },
    ],
    sources: [S.leipzigBuergerbueros, S.leipzigOttoSchill, S.leipzigForeignersAuthority, S.leipzigWelcome, S.swHousingSurvey, S.leipzigRentIndex, S.uniFeeOverview, S.uniStart, S.bahnDticket],
  },
  ...generatedCities,
];

export const rules: Rules = {
  studentWorkFullDays: 140,
  studentWorkHalfDays: 280,
  blockedAccountMonthly: 992,
  miniJobLimitMonthly: 603,
  minimumWage: 13.9,
  basicTaxAllowance: 12348,
  miniJobPensionPercent: 3.6,
  studentPensionPercent: 9.3,
  studentWeeklyHours: 20,
  fullDayHours: 4,
  broadcastingFeeMonthly: 18.36,
  deutschlandticketMonthly: 63,
  lastVerified: CHECKED,
  sources: [S.skilledImmigration, S.daadSideJobs, S.aaFunds, S.kathmanduStudy, S.drvMinijob603, S.minijobPension, S.minijobStudents, S.bmfTax2026, S.estg32a, S.lsth2026, S.solzg, S.rundfunkPayment, S.bundesregDticket],
};

export const ruleChanges: RuleChange[] = [
  {
    id: 'rc-2027-wage',
    date: '2027-01-01',
    affects: { statuses: ['student', 'trainee', 'worker'] },
    title: L('Minimum wage and mini-job limit rise in 2027', '२०२७ मा न्यूनतम ज्याला र मिनी-जब सीमा बढ्छ', '2027 में न्यूनतम वेतन और मिनी-जॉब सीमा बढ़ेगी'),
    summary: L(
      'From 1 January 2027 the minimum wage rises from €13.90 to €14.60 an hour, and the mini-job limit from €603 to €633 a month.',
      '१ जनवरी २०२७ देखि न्यूनतम ज्याला प्रतिघण्टा €१३.९० बाट €१४.६० र मिनी-जब सीमा महिनामा €६०३ बाट €६३३ हुन्छ।',
      '1 जनवरी 2027 से न्यूनतम वेतन €13.90 से बढ़कर €14.60 प्रति घंटा, और मिनी-जॉब सीमा €603 से बढ़कर €633 प्रति माह होगी।',
    ),
    guideSlug: 'student-jobs',
    sources: [S.drvMinijob603],
  },
  {
    id: 'rc-2027-dticket',
    date: '2027-01-01',
    affects: {},
    title: L('Deutschlandticket costs €66.80 from 2027', '२०२७ देखि Deutschlandticket €६६.८०', '2027 से Deutschlandticket €66.80'),
    summary: L(
      'The monthly price rises from €63 to €66.80 on 1 January 2027. Students with the Deutschland-Semesterticket pay through their semester fee.',
      '१ जनवरी २०२७ देखि मासिक मूल्य €६३ बाट €६६.८० हुन्छ। Deutschland-Semesterticket भएका विद्यार्थीले सेमेस्टर शुल्कमार्फत तिर्छन्।',
      '1 जनवरी 2027 से मासिक कीमत €63 से बढ़कर €66.80 होगी। Deutschland-Semesterticket वाले छात्र सेमेस्टर फ़ीस से भरते हैं।',
    ),
    guideSlug: 'monthly-transit-pass',
    sources: [S.bahnDticket, S.bundesregDticket],
  },
  {
    id: 'rc-2026-leipzig-fee',
    date: '2026-10-01',
    affects: { statuses: ['student'], cities: ['leipzig'] },
    title: L('Higher semester fee at Leipzig University', 'लाइपजिग विश्वविद्यालयमा सेमेस्टर शुल्क बढ्यो', 'लाइपज़िग विश्वविद्यालय में सेमेस्टर फ़ीस बढ़ी'),
    summary: L(
      'From the winter semester 2026/27 the fee is €332.30 (before: €312.30), because the Deutschland-Semesterticket now costs €226.80.',
      '२०२६/२७ जाडो सेमेस्टरदेखि शुल्क €३३२.३० (पहिले: €३१२.३०) भएको छ, किनभने Deutschland-Semesterticket अब €२२६.८० पर्छ।',
      'शीतकालीन सेमेस्टर 2026/27 से फ़ीस €332.30 (पहले: €312.30) है, क्योंकि Deutschland-Semesterticket अब €226.80 का है।',
    ),
    guideSlug: 'enrol-at-university',
    sources: [S.uniFeeOverview, S.swTicketPrice2026],
  },
  {
    id: 'rc-2026-wage',
    date: '2026-01-01',
    affects: { statuses: ['student', 'trainee', 'worker'] },
    title: L('New minimum wage and mini-job limit', 'नयाँ न्यूनतम ज्याला र मिनी-जब सीमा', 'नया न्यूनतम वेतन और मिनी-जॉब सीमा'),
    summary: L(
      'Since 1 January 2026 the minimum wage is €13.90 an hour and you can earn up to €603 a month in a mini-job.',
      '१ जनवरी २०२६ देखि न्यूनतम ज्याला प्रतिघण्टा €१३.९० छ र मिनी-जबमा महिनामा €६०३ सम्म कमाउन सकिन्छ।',
      '1 जनवरी 2026 से न्यूनतम वेतन €13.90 प्रति घंटा है और मिनी-जॉब में हर महीने €603 तक कमा सकते हैं।',
    ),
    guideSlug: 'student-jobs',
    sources: [S.drvMinijob603, S.minijobStudents],
  },
  {
    id: 'rc-2026-tax',
    date: '2026-01-01',
    affects: {},
    title: L('Tax-free allowance is €12,348', 'करमुक्त सीमा €१२,३४८', 'टैक्स-मुक्त सीमा €12,348'),
    summary: L(
      'For 2026 the first €12,348 of income is tax-free (2025: €12,096). Students with small jobs often get all wage tax back with a tax return.',
      '२०२६ का लागि पहिलो €१२,३४८ आम्दानी करमुक्त छ (२०२५: €१२,०९६)। सानो काम गर्ने विद्यार्थीले कर विवरण बुझाएर प्रायः सबै तलब कर फिर्ता पाउँछन्।',
      '2026 के लिए पहले €12,348 की आय टैक्स-मुक्त है (2025: €12,096)। छोटी नौकरी वाले छात्रों को टैक्स रिटर्न से अक्सर पूरा वेतन टैक्स वापस मिलता है।',
    ),
    guideSlug: 'file-tax-return',
    sources: [S.bmfTax2026],
  },
  {
    id: 'rc-2026-india-saxony',
    date: '2026-01-20',
    affects: { nationalities: ['india'], cities: ['leipzig'] },
    title: L('Saxony: consular services from the Embassy in Berlin', 'सक्सोनी: बर्लिनस्थित दूतावासबाट कन्सुलर सेवा', 'सैक्सनी: बर्लिन दूतावास से कांसुलर सेवाएं'),
    summary: L(
      'Indian citizens living in Saxony get passport and consular services from the Embassy of India in Berlin. Appointments are booked online.',
      'सक्सोनीमा बस्ने भारतीय नागरिकले राहदानी र कन्सुलर सेवा बर्लिनस्थित भारतीय दूतावासबाट पाउँछन्। अपोइन्टमेन्ट अनलाइन बुक गरिन्छ।',
      'सैक्सनी में रहने वाले भारतीय नागरिकों को पासपोर्ट और कांसुलर सेवाएं बर्लिन स्थित भारतीय दूतावास से मिलती हैं। अपॉइंटमेंट ऑनलाइन बुक होते हैं।',
    ),
    sources: [S.indiaJurisdiction, S.indiaAppointment],
  },
];

const blockedFacts = (setup: string, monthly: string) => [
  L(`Year one: ${setup} set-up + 12 × ${monthly}`, `पहिलो वर्ष: ${setup} सुरु शुल्क + १२ × ${monthly}`, `पहला साल: ${setup} शुरुआती फ़ीस + 12 × ${monthly}`),
  L('Opened online, before your visa appointment', 'भिसा अपोइन्टमेन्टअघि अनलाइन खोलिन्छ', 'वीज़ा अपॉइंटमेंट से पहले ऑनलाइन खुलता है'),
  L('Pays your monthly amount into your German current account', 'तपाईंको जर्मन चल्ती खातामा मासिक रकम पठाउँछ', 'आपके जर्मन चालू खाते में हर महीने की रकम भेजता है'),
];

const FREE_STUDENT = (age: string) => L(`Free for students up to ${age}`, `${age} वर्षसम्मका विद्यार्थीका लागि निःशुल्क`, `${age} साल तक के छात्रों के लिए मुफ़्त`);

/**
 * Comparison data. No referral links: every provider is a non-partner and the list is
 * sorted by the cost for a student in the first year (feeSortKey), never by commission.
 */
export const providers: Provider[] = [
  // ── Blocked accounts ─────────────────────────────────────────────
  {
    id: 'expatrio', category: 'blocked', name: 'Expatrio', setupFee: '€119', monthlyFee: '€9', openingTime: '', payout: '',
    facts: [
      ...blockedFacts('€119', '€9'),
      L('Adds a €100 buffer to your transfer; the unused part is paid back with the last payout', 'ट्रान्सफरमा €१०० बफर थप्छ; नचलेको भाग अन्तिम भुक्तानीसँग फिर्ता हुन्छ', 'ट्रांसफ़र में €100 बफ़र जोड़ता है; बचा हुआ हिस्सा आख़िरी भुगतान के साथ लौटता है'),
      L('Prices for applications from 7 July 2026', '७ जुलाई २०२६ देखिका आवेदनको मूल्य', '7 जुलाई 2026 से आवेदनों की कीमत'),
    ],
    isPartner: false, url: 'https://www.expatrio.com/blocked-account', lastChecked: CHECKED, feeSortKey: 227, speedSortKey: 0, sources: [S.expatrio, S.expatrioFees],
  },
  {
    id: 'fintiba', category: 'blocked', name: 'Fintiba', setupFee: '€159', monthlyFee: '€9.90', openingTime: '', payout: '',
    facts: [...blockedFacts('€159', '€9.90'), L('Prices for accounts opened from 3 November 2025', '३ नोभेम्बर २०२५ देखि खोलिएका खाताको मूल्य', '3 नवंबर 2025 से खुले खातों की कीमत')],
    isPartner: false, url: 'https://www.fintiba.com/', lastChecked: CHECKED, feeSortKey: 277.8, speedSortKey: 0, sources: [S.fintiba, S.fintibaNews],
  },
  {
    id: 'deutsche-bank-blocked', category: 'blocked', name: 'Deutsche Bank', setupFee: '€150', monthlyFee: '', openingTime: '', payout: '',
    facts: [
      L('€150 for the blocking agreement, €150 again for every change', 'ब्लक सम्झौताका लागि €१५०, हरेक परिवर्तनमा फेरि €१५०', 'ब्लॉकिंग समझौते के लिए €150, हर बदलाव पर फिर €150'),
      L('A normal Deutsche Bank current account with the block on top — account fees apply', 'Deutsche Bank को सामान्य चल्ती खातामा ब्लक — खाता शुल्क लाग्छ', 'Deutsche Bank के सामान्य चालू खाते पर ब्लॉक — खाता फ़ीस लगती है'),
      L('Opening from abroad needs your signature certified at a German embassy (fee)', 'विदेशबाट खोल्दा जर्मन दूतावासमा हस्ताक्षर प्रमाणित गराउनुपर्छ (शुल्क लाग्छ)', 'विदेश से खोलने पर जर्मन दूतावास में हस्ताक्षर प्रमाणित कराने होते हैं (फ़ीस लगती है)'),
    ],
    notice: L('Paper-based and slower than the online providers. Check with Deutsche Bank before you apply.', 'कागजमा आधारित र अनलाइन प्रदायकभन्दा ढिलो। आवेदन दिनुअघि Deutsche Bank सँग सोध्नुहोस्।', 'काग़ज़ पर आधारित और ऑनलाइन प्रदाताओं से धीमा। आवेदन से पहले Deutsche Bank से पूछें।'),
    isPartner: false, url: S.dbBlocked.url, lastChecked: CHECKED, feeSortKey: 150 + 12 * 6.9, speedSortKey: 0, sources: [S.dbBlocked, S.aaBlockedItaly],
  },
  {
    id: 'coracle', category: 'blocked', name: 'Coracle', setupFee: '€99', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      L('One-time fee, no monthly fee (published terms, 2023)', 'एकपटकको शुल्क, मासिक शुल्क छैन (प्रकाशित सर्त, २०२३)', 'एक बार की फ़ीस, कोई मासिक फ़ीस नहीं (प्रकाशित शर्तें, 2023)'),
    ],
    notice: L('Not accepting new blocked-account applications since August 2025. Check coracle.de before you rely on it.', 'अगस्ट २०२५ देखि नयाँ ब्लक्ड खाताको आवेदन लिइरहेको छैन। भर पर्नुअघि coracle.de हेर्नुहोस्।', 'अगस्त 2025 से नए ब्लॉक्ड अकाउंट आवेदन नहीं ले रहा। भरोसा करने से पहले coracle.de देखें।'),
    isPartner: false, url: 'https://www.coracle.de/', lastChecked: CHECKED, feeSortKey: 9999, speedSortKey: 0, sources: [S.coracle, S.coracleTerms, S.bankdatenBlocked],
  },
  // ── Current accounts ─────────────────────────────────────────────
  {
    id: 'sparkasse', category: 'bank', name: 'Sparkasse (local savings bank)', setupFee: '€0', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      L('Each city has its own Sparkasse with its own prices', 'हरेक सहरको आफ्नै Sparkasse र आफ्नै मूल्य हुन्छ', 'हर शहर की अपनी Sparkasse और अपनी कीमतें होती हैं'),
      L('Examples: Sparkasse Leipzig free up to 26, Berliner Sparkasse free until your 25th birthday', 'उदाहरण: Sparkasse Leipzig २६ वर्षसम्म, Berliner Sparkasse २५ औं जन्मदिनसम्म निःशुल्क', 'उदाहरण: Sparkasse Leipzig 26 साल तक, Berliner Sparkasse 25वें जन्मदिन तक मुफ़्त'),
      L('Branches and ATMs everywhere — advice in person', 'जताततै शाखा र ATM — आमनेसामने सल्लाह', 'हर जगह शाखाएं और ATM — आमने-सामने सलाह'),
      L('Bring your enrolment certificate', 'भर्ना प्रमाणपत्र लैजानुहोस्', 'दाख़िला प्रमाणपत्र साथ लाएं'),
    ],
    isPartner: false, url: 'https://www.sparkasse.de/pk/produkte/konten-und-karten/girokonto/studenten-und-auszubildende', lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0,
    sources: [S.sparkasseDe, S.sparkasseStudents, S.berlinerSparkasse],
  },
  {
    id: 'volksbank', category: 'bank', name: 'Volksbank (local cooperative bank)', setupFee: '€0', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      L('Each Volksbank sets its own prices — many are free for students up to 27', 'हरेक Volksbank ले आफ्नै मूल्य तोक्छ — धेरै २७ वर्षसम्मका विद्यार्थीका लागि निःशुल्क', 'हर Volksbank अपनी कीमतें तय करता है — कई 27 साल तक के छात्रों के लिए मुफ़्त हैं'),
      L('Branches and ATMs across Germany — advice in person', 'जर्मनीभर शाखा र ATM — आमनेसामने सल्लाह', 'पूरे जर्मनी में शाखाएं और ATM — आमने-सामने सलाह'),
      L('Bring your enrolment certificate', 'भर्ना प्रमाणपत्र लैजानुहोस्', 'दाख़िला प्रमाणपत्र साथ लाएं'),
    ],
    notice: L('Check the price list of the Volksbank in your city before you open the account.', 'खाता खोल्नुअघि आफ्नो सहरको Volksbank को मूल्य सूची हेर्नुहोस्।', 'खाता खोलने से पहले अपने शहर के Volksbank की मूल्य सूची देखें।'),
    isPartner: false, url: 'https://www.vr.de/privatkunden/unsere-produkte/konten-und-karten/girokonten.html', lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0,
    sources: [S.vbMittelhessen, S.vzNiedersachsen],
  },
  {
    id: 'commerzbank', category: 'bank', name: 'Commerzbank StartKonto', setupFee: '€0', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      L('Free for students, trainees and interns until their 28th birthday (with proof of studies)', '२८ औं जन्मदिनसम्म विद्यार्थी, तालिमार्थी र इन्टर्नका लागि निःशुल्क (पढाइको प्रमाणसहित)', '28वें जन्मदिन तक छात्रों, प्रशिक्षुओं और इंटर्न के लिए मुफ़्त (पढ़ाई के सबूत के साथ)'),
      L('Account is run digitally; free cash at Commerzbank and Cash Group ATMs', 'खाता डिजिटल रूपमा चल्छ; Commerzbank र Cash Group ATM मा निःशुल्क नगद', 'खाता डिजिटल चलता है; Commerzbank और Cash Group ATM पर मुफ़्त नकद'),
      L('Switches to a paid account automatically at 28', '२८ वर्षमा आफैं सशुल्क खातामा बदलिन्छ', '28 साल पर अपने आप शुल्क वाले खाते में बदल जाता है'),
    ],
    isPartner: false, url: S.commerzStart.url, lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0, sources: [S.commerzStart, S.commerzStudents],
  },
  {
    id: 'deutsche-bank', category: 'bank', name: 'Deutsche Bank — Das Junge Konto', setupFee: '€0', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      FREE_STUDENT('30'),
      L('Needs a registered address in the EU', 'EU मा दर्ता भएको ठेगाना चाहिन्छ', 'EU में पंजीकृत पता चाहिए'),
      L('Afterwards it becomes an AktivKonto for €6.90 a month', 'त्यसपछि महिनाको €६.९० को AktivKonto बन्छ', 'उसके बाद यह €6.90 प्रति माह का AktivKonto बन जाता है'),
    ],
    isPartner: false, url: S.dbYoung.url, lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0, sources: [S.dbYoung, S.dbYoungPrices],
  },
  {
    id: 'n26', category: 'bank', name: 'N26 Standard', setupFee: '€0', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      L('Online bank, opened in the app with a video call', 'अनलाइन बैंक, भिडियो कलसहित एपमै खोलिन्छ', 'ऑनलाइन बैंक, वीडियो कॉल के साथ ऐप में खुलता है'),
      L('App in English', 'अंग्रेजीमा एप', 'अंग्रेज़ी में ऐप'),
      L('Cash: 2 free withdrawals a month in euros, then €2 each', 'नगद: महिनामा २ पटक युरोमा निःशुल्क, त्यसपछि प्रत्येक €२', 'नकद: हर महीने यूरो में 2 बार मुफ़्त निकासी, फिर हर बार €2'),
      L('Card payments in other currencies: 1.7% fee', 'अन्य मुद्रामा कार्ड भुक्तानी: १.७% शुल्क', 'दूसरी मुद्राओं में कार्ड भुगतान: 1.7% फ़ीस'),
    ],
    isPartner: false, url: S.n26Plans.url, lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0, sources: [S.n26Plans, S.n26Withdrawals],
  },
  {
    id: 'revolut', category: 'bank', name: 'Revolut Standard', setupFee: '€0', monthlyFee: '€0', openingTime: '', payout: '',
    facts: [
      L('Online bank, opened in the app', 'अनलाइन बैंक, एपमै खोलिन्छ', 'ऑनलाइन बैंक, ऐप में खुलता है'),
      L('Cash: free up to 5 withdrawals or €200 a month, then 2% (at least €1)', 'नगद: महिनामा ५ पटक वा €२०० सम्म निःशुल्क, त्यसपछि २% (कम्तीमा €१)', 'नकद: हर महीने 5 निकासी या €200 तक मुफ़्त, फिर 2% (कम से कम €1)'),
      L('Currency exchange: €1,000 a month without fee on weekdays', 'मुद्रा सटही: हप्ताका दिनमा महिनामा €१,००० सम्म शुल्कविना', 'मुद्रा विनिमय: कार्यदिवसों पर हर महीने €1,000 तक बिना फ़ीस'),
    ],
    notice: L('Some landlords and employers prefer a German bank — check the IBAN you get.', 'केही घरधनी र रोजगारदाता जर्मन बैंक रुचाउँछन् — पाउने IBAN जाँच्नुहोस्।', 'कुछ मकान मालिक और नियोक्ता जर्मन बैंक पसंद करते हैं — मिलने वाला IBAN जांचें।'),
    isPartner: false, url: S.revolutFees.url, lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0, sources: [S.revolutFees, S.revolutAtm],
  },
  {
    id: 'ing', category: 'bank', name: 'ING Girokonto', setupFee: '€0', monthlyFee: '€0 / €4.90', openingTime: '', payout: '',
    facts: [
      L('Online bank, opened online with identity check', 'अनलाइन बैंक, पहिचान जाँचसहित अनलाइन खोलिन्छ', 'ऑनलाइन बैंक, पहचान जांच के साथ ऑनलाइन खुलता है'),
      L('€0 under 28 or with at least €1,000 incoming a month — otherwise €4.90', '२८ वर्षमुनि वा महिनामा कम्तीमा €१,००० आउने भए €०, नत्र €४.९०', '28 से कम उम्र या हर महीने कम से कम €1,000 आने पर €0, वरना €4.90'),
    ],
    isPartner: false, url: S.ingConditions.url, lastChecked: CHECKED, feeSortKey: 0, speedSortKey: 0, sources: [S.ingConditions],
  },
];

const OFFICE = L('Foreigners’ office', 'विदेशी कार्यालय', 'विदेशी कार्यालय');
const BUERGER = L('Citizens’ office', 'नागरिक कार्यालय', 'नागरिक कार्यालय');
const DOCTOR = L('Doctor', 'डाक्टर', 'डॉक्टर');
const FLAT = L('Housing', 'आवास', 'आवास');
const PHONE = L('On the phone', 'फोनमा', 'फ़ोन पर');
const EVERYDAY = L('Everyday', 'दैनिक', 'रोज़मर्रा');
const SHOP = L('Shopping', 'किनमेल', 'ख़रीदारी');
const TRANSPORT = L('Bus and train', 'बस र रेल', 'बस और ट्रेन');
const BANK = L('Bank', 'बैंक', 'बैंक');
const PHARMACY = L('Pharmacy', 'फार्मेसी', 'फ़ार्मेसी');
const UNI = L('University', 'विश्वविद्यालय', 'विश्वविद्यालय');
const WORK = L('Work', 'काम', 'काम');
const EMERGENCY = L('Emergency', 'आपतकाल', 'आपात स्थिति');

export const phrases: Phrase[] = [
  { id: 'p1', situation: OFFICE, german: 'Ich habe einen Termin um 10 Uhr.', transliteration: { ne: 'इश हाबे आइनेन टेर्मीन उम त्सेन ऊर', hi: 'इश हाबे आइनेन टेरमीन उम त्सेन ऊर' }, meaning: L('I have an appointment at 10.', 'मेरो १० बजे अपोइन्टमेन्ट छ।', 'मेरी 10 बजे अपॉइंटमेंट है।') },
  { id: 'p2', situation: OFFICE, german: 'Können Sie bitte langsamer sprechen?', transliteration: { ne: 'क्योनेन ज़ी बिटे लाङज़ामर श्प्रेशेन?', hi: 'क्योनेन ज़ी बिटे लांगज़ामर श्प्रेशेन?' }, meaning: L('Could you speak more slowly, please?', 'कृपया अलि बिस्तारै बोल्न सक्नुहुन्छ?', 'क्या आप कृपया थोड़ा धीरे बोल सकते हैं?') },
  { id: 'p3', situation: OFFICE, german: 'Ich verstehe das nicht.', transliteration: { ne: 'इश फ़ेरश्टेए दास निश्ट', hi: 'इश फ़ेरश्टेए दास निश्ट' }, meaning: L('I don’t understand this.', 'मैले यो बुझिनँ।', 'मुझे यह समझ नहीं आया।') },
  { id: 'p4', situation: OFFICE, german: 'Welche Unterlagen brauche ich?', transliteration: { ne: 'वेल्शे उन्टरलागेन ब्राउखे इश?', hi: 'वेल्शे उंटरलागेन ब्राउखे इश?' }, meaning: L('Which documents do I need?', 'मलाई कुन कागजातहरू चाहिन्छ?', 'मुझे कौन से दस्तावेज़ चाहिए?') },
  { id: 'p5', situation: OFFICE, german: 'Kann ich bitte eine Kopie bekommen?', transliteration: { ne: 'कान इश बिटे आइने कोपी बेकोमेन?', hi: 'कान इश बिटे आइने कोपी बेकोमेन?' }, meaning: L('Can I have a copy, please?', 'कृपया मलाई एउटा प्रतिलिपि दिन सक्नुहुन्छ?', 'क्या मुझे कृपया एक कॉपी मिल सकती है?') },
  { id: 'p6', situation: BUERGER, german: 'Ich möchte meine Wohnung anmelden.', transliteration: { ne: 'इश म्योश्टे माइने वोनुङ आनमेल्डेन', hi: 'इश म्योश्टे माइने वोनुंग आनमेल्डेन' }, meaning: L('I would like to register my flat.', 'म मेरो फ्ल्याट दर्ता गर्न चाहन्छु।', 'मैं अपना फ़्लैट पंजीकृत कराना चाहता/चाहती हूँ।') },
  { id: 'p7', situation: BUERGER, german: 'Hier ist die Wohnungsgeberbestätigung.', transliteration: { ne: 'हिअर इस्ट डी वोनुङ्सगेबरबेश्टेटिगुङ', hi: 'हीर इस्ट डी वोनुंग्सगेबरबेश्टेटिगुंग' }, meaning: L('Here is the landlord’s confirmation.', 'यो घरधनीको पुष्टि-पत्र हो।', 'यह मकान मालिक का पुष्टि-पत्र है।') },
  { id: 'p8', situation: DOCTOR, german: 'Nehmen Sie neue Patienten auf?', transliteration: { ne: 'नेमेन ज़ी नोए पात्सिएन्टेन आउफ?', hi: 'नेमेन ज़ी नॉए पात्सिएंटेन आउफ़?' }, meaning: L('Do you take new patients?', 'तपाईं नयाँ बिरामी लिनुहुन्छ?', 'क्या आप नए मरीज़ लेते हैं?') },
  { id: 'p9', situation: DOCTOR, german: 'Ich habe Fieber und Halsschmerzen.', transliteration: { ne: 'इश हाबे फीबर उन्ट हाल्सश्मेर्त्सेन', hi: 'इश हाबे फ़ीबर उंट हाल्सश्मेर्त्सेन' }, meaning: L('I have a fever and a sore throat.', 'मलाई ज्वरो आएको छ र घाँटी दुखेको छ।', 'मुझे बुखार है और गले में दर्द है।') },
  { id: 'p10', situation: DOCTOR, german: 'Ich brauche eine Krankmeldung.', transliteration: { ne: 'इश ब्राउखे आइने क्राङ्कमेल्डुङ', hi: 'इश ब्राउखे आइने क्रांकमेल्डुंग' }, meaning: L('I need a sick note.', 'मलाई बिरामी भएको प्रमाणपत्र चाहिन्छ।', 'मुझे बीमारी का प्रमाणपत्र चाहिए।') },
  { id: 'p11', situation: FLAT, german: 'Ist die Wohnung noch frei?', transliteration: { ne: 'इस्ट डी वोनुङ नोख फ्राइ?', hi: 'इस्ट डी वोनुंग नोख़ फ़्राइ?' }, meaning: L('Is the flat still available?', 'फ्ल्याट अझै खाली छ?', 'क्या फ़्लैट अभी भी ख़ाली है?') },
  { id: 'p12', situation: FLAT, german: 'Wie hoch ist die Warmmiete?', transliteration: { ne: 'वी होख इस्ट डी वार्ममीटे?', hi: 'वी होख़ इस्ट डी वार्ममीटे?' }, meaning: L('How much is the rent including heating and bills?', 'तताउने र बिलसहित भाडा कति हो?', 'हीटिंग और बिल सहित किराया कितना है?') },
  { id: 'p13', situation: FLAT, german: 'Wann kann ich die Wohnung besichtigen?', transliteration: { ne: 'वान कान इश डी वोनुङ बेज़िश्टिगेन?', hi: 'वान कान इश डी वोनुंग बेज़िश्टिगेन?' }, meaning: L('When can I view the flat?', 'म फ्ल्याट कहिले हेर्न सक्छु?', 'मैं फ़्लैट कब देख सकता/सकती हूँ?') },
  { id: 'p14', situation: PHONE, german: 'Können Sie das bitte buchstabieren?', transliteration: { ne: 'क्योनेन ज़ी दास बिटे बुखश्टाबीरेन?', hi: 'क्योनेन ज़ी दास बिटे बूख़श्टाबीरेन?' }, meaning: L('Could you spell that, please?', 'कृपया हिज्जे गरेर भन्न सक्नुहुन्छ?', 'क्या आप कृपया इसकी स्पेलिंग बता सकते हैं?') },
  { id: 'p15', situation: PHONE, german: 'Ich rufe wegen meines Termins an.', transliteration: { ne: 'इश रूफे वेगेन माइनेस टेर्मीन्स आन', hi: 'इश रूफ़े वेगेन माइनेस टेरमीन्स आन' }, meaning: L('I’m calling about my appointment.', 'म मेरो अपोइन्टमेन्टबारे फोन गर्दैछु।', 'मैं अपनी अपॉइंटमेंट के बारे में कॉल कर रहा/रही हूँ।') },
  // Everyday
  { id: 'p16', situation: EVERYDAY, german: 'Guten Tag! Entschuldigung, sprechen Sie Englisch?', transliteration: { ne: 'गुटेन ताग! एन्टशुल्डिगुङ, श्प्रेशेन ज़ी एङ्लिश?', hi: 'गूटेन टाग! एंटशुल्डिगुंग, श्प्रेशेन ज़ी एंग्लिश?' }, meaning: L('Hello! Excuse me, do you speak English?', 'नमस्ते! माफ गर्नुहोस्, तपाईं अंग्रेजी बोल्नुहुन्छ?', 'नमस्ते! माफ़ कीजिए, क्या आप अंग्रेज़ी बोलते हैं?') },
  { id: 'p17', situation: EVERYDAY, german: 'Ich spreche nur ein bisschen Deutsch.', transliteration: { ne: 'इश श्प्रेशे नूर आइन बिसशेन डोइच', hi: 'इश श्प्रेशे नूर आइन बिसशेन डॉइच' }, meaning: L('I only speak a little German.', 'म थोरै मात्र जर्मन बोल्छु।', 'मैं थोड़ी-सी ही जर्मन बोलता/बोलती हूँ।') },
  { id: 'p18', situation: EVERYDAY, german: 'Können Sie das bitte wiederholen?', transliteration: { ne: 'क्योनेन ज़ी दास बिटे वीडरहोलेन?', hi: 'क्योनेन ज़ी दास बिटे वीडरहोलेन?' }, meaning: L('Could you repeat that, please?', 'कृपया फेरि भन्न सक्नुहुन्छ?', 'क्या आप कृपया इसे दोहरा सकते हैं?') },
  { id: 'p19', situation: EVERYDAY, german: 'Vielen Dank für Ihre Hilfe.', transliteration: { ne: 'फीलेन दाङ्क फ्युर ईरे हिल्फे', hi: 'फ़ीलेन डांक फ़्यूर ईरे हिल्फ़े' }, meaning: L('Thank you very much for your help.', 'सहयोगका लागि धेरै धन्यवाद।', 'आपकी मदद के लिए बहुत धन्यवाद।') },
  // Shopping
  { id: 'p20', situation: SHOP, german: 'Kann ich mit Karte zahlen?', transliteration: { ne: 'कान इश मिट कार्टे त्सालेन?', hi: 'कान इश मिट कार्टे त्सालेन?' }, meaning: L('Can I pay by card?', 'कार्डबाट तिर्न मिल्छ?', 'क्या मैं कार्ड से भुगतान कर सकता/सकती हूँ?') },
  { id: 'p21', situation: SHOP, german: 'Wo finde ich Reis?', transliteration: { ne: 'वो फिन्डे इश राइस?', hi: 'वो फ़िंडे इश राइस?' }, meaning: L('Where can I find rice?', 'चामल कहाँ पाइन्छ?', 'चावल कहाँ मिलेगा?') },
  { id: 'p22', situation: SHOP, german: 'Eine Tüte, bitte.', transliteration: { ne: 'आइने ट्युटे, बिटे', hi: 'आइने ट्यूटे, बिटे' }, meaning: L('A bag, please.', 'एउटा झोला दिनुहोस्।', 'एक थैली, कृपया।') },
  { id: 'p23', situation: SHOP, german: 'Ich möchte das zurückgeben.', transliteration: { ne: 'इश म्योश्टे दास त्सुरुकगेबेन', hi: 'इश म्योश्टे दास त्सुरुकगेबेन' }, meaning: L('I would like to return this.', 'म यो फिर्ता गर्न चाहन्छु।', 'मैं इसे वापस करना चाहता/चाहती हूँ।') },
  // Transport
  { id: 'p24', situation: TRANSPORT, german: 'Fährt dieser Zug nach Leipzig Hauptbahnhof?', transliteration: { ne: 'फेर्ट डीज़र त्सुग नाख लाइप्त्सिश हाउप्टबानहोफ?', hi: 'फ़ेर्ट डीज़र त्सूग नाख़ लाइप्त्सिश हाउप्टबानहोफ़?' }, meaning: L('Does this train go to Leipzig main station?', 'के यो रेल लाइपजिग मुख्य स्टेसन जान्छ?', 'क्या यह ट्रेन लाइपज़िग मुख्य स्टेशन जाती है?') },
  { id: 'p25', situation: TRANSPORT, german: 'Wo muss ich umsteigen?', transliteration: { ne: 'वो मुस इश उमश्टाइगेन?', hi: 'वो मुस इश उमश्टाइगेन?' }, meaning: L('Where do I have to change?', 'मैले कहाँ गाडी फेर्नुपर्छ?', 'मुझे कहाँ गाड़ी बदलनी होगी?') },
  { id: 'p26', situation: TRANSPORT, german: 'Ist dieser Platz frei?', transliteration: { ne: 'इस्ट डीज़र प्लात्स फ्राइ?', hi: 'इस्ट डीज़र प्लात्स फ़्राइ?' }, meaning: L('Is this seat free?', 'के यो सिट खाली छ?', 'क्या यह सीट ख़ाली है?') },
  { id: 'p27', situation: TRANSPORT, german: 'Ich habe ein Deutschlandticket.', transliteration: { ne: 'इश हाबे आइन डोइचलान्टटिकेट', hi: 'इश हाबे आइन डॉइचलांटटिकेट' }, meaning: L('I have a Deutschlandticket.', 'मसँग Deutschlandticket छ।', 'मेरे पास Deutschlandticket है।') },
  // Bank
  { id: 'p28', situation: BANK, german: 'Ich möchte ein Girokonto eröffnen.', transliteration: { ne: 'इश म्योश्टे आइन जिरोकोन्टो एरओफ्नेन', hi: 'इश म्योश्टे आइन ज़ीरोकोंटो एरऑफ़नेन' }, meaning: L('I would like to open a current account.', 'म चल्ती खाता खोल्न चाहन्छु।', 'मैं एक चालू खाता खोलना चाहता/चाहती हूँ।') },
  { id: 'p29', situation: BANK, german: 'Meine Karte ist verloren gegangen.', transliteration: { ne: 'माइने कार्टे इस्ट फेरलोरेन गेगाङेन', hi: 'माइने कार्टे इस्ट फ़ेरलोरेन गेगांगेन' }, meaning: L('I have lost my card.', 'मेरो कार्ड हरायो।', 'मेरा कार्ड खो गया है।') },
  { id: 'p30', situation: BANK, german: 'Wie hoch sind die Kontogebühren?', transliteration: { ne: 'वी होख ज़िन्ड डी कोन्टोगेब्युरेन?', hi: 'वी होख़ ज़िंट डी कोंटोगेब्यूरेन?' }, meaning: L('How much are the account fees?', 'खाताको शुल्क कति हो?', 'खाते की फ़ीस कितनी है?') },
  // Pharmacy
  { id: 'p31', situation: PHARMACY, german: 'Ich brauche etwas gegen Kopfschmerzen.', transliteration: { ne: 'इश ब्राउखे एट्वास गेगेन कोप्फश्मेर्त्सेन', hi: 'इश ब्राउख़े एटवास गेगेन कॉप्फ़श्मेर्त्सेन' }, meaning: L('I need something for a headache.', 'मलाई टाउको दुखाइको औषधि चाहियो।', 'मुझे सिरदर्द के लिए कुछ चाहिए।') },
  { id: 'p32', situation: PHARMACY, german: 'Hier ist mein Rezept.', transliteration: { ne: 'हिअर इस्ट माइन रेत्सेप्ट', hi: 'हीर इस्ट माइन रेत्सेप्ट' }, meaning: L('Here is my prescription.', 'यो मेरो प्रेस्क्रिप्सन हो।', 'यह मेरा पर्चा है।') },
  { id: 'p33', situation: PHARMACY, german: 'Wie oft muss ich das nehmen?', transliteration: { ne: 'वी ओफ्ट मुस इश दास नेमेन?', hi: 'वी ऑफ़्ट मुस इश दास नेमेन?' }, meaning: L('How often do I have to take this?', 'यो कति पटक खानुपर्छ?', 'मुझे इसे कितनी बार लेना है?') },
  // University
  { id: 'p34', situation: UNI, german: 'Wo ist das Studierendensekretariat?', transliteration: { ne: 'वो इस्ट दास श्टुडीरेन्डेनसेक्रेटारियाट?', hi: 'वो इस्ट दास श्टूडीरेंडेनज़ेक्रेटारियाट?' }, meaning: L('Where is the student registry office?', 'विद्यार्थी कार्यालय कहाँ छ?', 'छात्र कार्यालय कहाँ है?') },
  { id: 'p35', situation: UNI, german: 'Ich brauche eine Immatrikulationsbescheinigung.', transliteration: { ne: 'इश ब्राउखे आइने इमात्रिकुलात्सिओन्सबेशाइनिगुङ', hi: 'इश ब्राउख़े आइने इमात्रिकुलात्सियोंसबेशाइनिगुंग' }, meaning: L('I need an enrolment certificate.', 'मलाई भर्ना प्रमाणपत्र चाहियो।', 'मुझे दाख़िला प्रमाणपत्र चाहिए।') },
  { id: 'p36', situation: UNI, german: 'Wann ist die Sprechstunde?', transliteration: { ne: 'वान इस्ट डी श्प्रेशश्टुन्डे?', hi: 'वान इस्ट डी श्प्रेशश्टुंडे?' }, meaning: L('When are the office hours?', 'भेट्ने समय कहिले हो?', 'मिलने का समय कब है?') },
  // Work
  { id: 'p37', situation: WORK, german: 'Ich bin heute krank und kann nicht arbeiten.', transliteration: { ne: 'इश बिन होइटे क्राङ्क उन्ट कान निश्ट आर्बाइटेन', hi: 'इश बिन हॉइटे क्रांक उंट कान निश्ट आर्बाइटेन' }, meaning: L('I am ill today and can’t work.', 'आज म बिरामी छु र काम गर्न सक्दिनँ।', 'मैं आज बीमार हूँ और काम नहीं कर सकता/सकती।') },
  { id: 'p38', situation: WORK, german: 'Wann bekomme ich meinen Lohn?', transliteration: { ne: 'वान बेकोमे इश माइनेन लोन?', hi: 'वान बेकॉमे इश माइनेन लोन?' }, meaning: L('When do I get my pay?', 'मैले तलब कहिले पाउँछु?', 'मुझे मेरा वेतन कब मिलेगा?') },
  { id: 'p39', situation: WORK, german: 'Kann ich bitte einen schriftlichen Arbeitsvertrag bekommen?', transliteration: { ne: 'कान इश बिटे आइनेन श्रिफ्टलिशेन आर्बाइट्सफेर्ट्राग बेकोमेन?', hi: 'कान इश बिटे आइनेन श्रिफ़्टलिशेन आर्बाइट्सफ़ेर्ट्राग बेकॉमेन?' }, meaning: L('Can I please get a written employment contract?', 'कृपया मलाई लिखित रोजगार सम्झौता दिन सक्नुहुन्छ?', 'क्या मुझे कृपया लिखित रोज़गार अनुबंध मिल सकता है?') },
  // Emergency
  { id: 'p40', situation: EMERGENCY, german: 'Hilfe! Rufen Sie einen Krankenwagen!', transliteration: { ne: 'हिल्फे! रूफेन ज़ी आइनेन क्राङ्केनवागेन!', hi: 'हिल्फ़े! रूफ़ेन ज़ी आइनेन क्रांकेनवागेन!' }, meaning: L('Help! Call an ambulance!', 'सहयोग! एम्बुलेन्स बोलाउनुहोस्!', 'मदद! एम्बुलेंस बुलाइए!') },
  { id: 'p41', situation: EMERGENCY, german: 'Ich wurde bestohlen.', transliteration: { ne: 'इश वुर्डे बेश्टोलेन', hi: 'इश वुर्डे बेश्टोलेन' }, meaning: L('I have been robbed.', 'मेरो सामान चोरी भयो।', 'मेरा सामान चोरी हो गया।') },
  { id: 'p42', situation: EMERGENCY, german: 'Wo ist das nächste Krankenhaus?', transliteration: { ne: 'वो इस्ट दास नेक्स्टे क्राङ्केनहाउस?', hi: 'वो इस्ट दास नेक्स्टे क्रांकेनहाउस?' }, meaning: L('Where is the nearest hospital?', 'सबैभन्दा नजिकको अस्पताल कहाँ छ?', 'सबसे नज़दीकी अस्पताल कहाँ है?') },
  // Housing (more)
  { id: 'p43', situation: FLAT, german: 'Die Heizung funktioniert nicht.', transliteration: { ne: 'डी हाइत्सुङ फुङ्क्सिओनीर्ट निश्ट', hi: 'डी हाइत्सुंग फ़ुंक्त्सियोनीर्ट निश्ट' }, meaning: L('The heating doesn’t work.', 'तताउने यन्त्र चलेको छैन।', 'हीटिंग काम नहीं कर रही।') },
  { id: 'p44', situation: FLAT, german: 'Wie hoch ist die Kaution?', transliteration: { ne: 'वी होख इस्ट डी काउत्सिओन?', hi: 'वी होख़ इस्ट डी काउत्सियोन?' }, meaning: L('How much is the deposit?', 'धरौटी कति हो?', 'जमानत राशि कितनी है?') },
  { id: 'p45', situation: FLAT, german: 'Können Sie mir die Wohnungsgeberbestätigung geben?', transliteration: { ne: 'क्योनेन ज़ी मिअर डी वोनुङ्सगेबरबेश्टेटिगुङ गेबेन?', hi: 'क्योनेन ज़ी मीर डी वोनुंग्सगेबरबेश्टेटिगुंग गेबेन?' }, meaning: L('Can you give me the landlord’s confirmation?', 'मलाई घरधनीको पुष्टि-पत्र दिन सक्नुहुन्छ?', 'क्या आप मुझे मकान मालिक का पुष्टि-पत्र दे सकते हैं?') },
];

export const helpServices: HelpService[] = [
  {
    id: 'welcome', name: 'Willkommenszentrum Leipzig', kind: L('City advice for newcomers', 'नयाँ आउनेका लागि सहरको सल्लाह', 'नए लोगों के लिए शहर की सलाह'), free: true,
    description: L(
      'The City of Leipzig’s Welcome Centre gives first advice on residence, work, language courses and everyday life, and refers you to the right office.',
      'लाइपजिग सहरको स्वागत केन्द्रले बसाइ, काम, भाषा कक्षा र दैनिक जीवनबारे प्रारम्भिक सल्लाह दिन्छ र सही कार्यालयमा पठाउँछ।',
      'लाइपज़िग शहर का स्वागत केंद्र निवास, काम, भाषा कोर्स और रोज़मर्रा के जीवन पर शुरुआती सलाह देता है और सही कार्यालय तक भेजता है।',
    ),
    phone: '+493411232676', address: 'Otto-Schill-Straße 2, 04109 Leipzig', url: S.leipzigWelcome.url, topics: ['visa', 'work', 'housing'], sources: [S.leipzigWelcome, S.leipzigWelcomeAdvice],
  },
  {
    id: 'studentenwerk', name: 'Studentenwerk Leipzig — Social counselling', kind: L('For students', 'विद्यार्थीका लागि', 'छात्रों के लिए'), free: true,
    description: L(
      'Free and confidential counselling for international students in several languages: money problems, jobs, housing, health insurance. Psychosocial counselling is also available.',
      'अन्तर्राष्ट्रिय विद्यार्थीका लागि धेरै भाषामा निःशुल्क र गोप्य परामर्श: पैसाको समस्या, काम, आवास, स्वास्थ्य बीमा। मनोसामाजिक परामर्श पनि उपलब्ध छ।',
      'अंतरराष्ट्रीय छात्रों के लिए कई भाषाओं में मुफ़्त और गोपनीय परामर्श: पैसे की समस्या, नौकरी, आवास, स्वास्थ्य बीमा। मनोसामाजिक परामर्श भी उपलब्ध है।',
    ),
    email: 'sozialberatung@studentenwerk-leipzig.de', url: S.swIntlSupport.url, topics: ['money', 'housing', 'work', 'study', 'health'], sources: [S.swIntlSupport, S.swSocialIntl],
  },
  {
    id: 'caritas-mbe', name: 'Caritas Leipzig — Migrationsberatung (MBE)', kind: L('Migration counselling, 27+', 'आप्रवासन परामर्श, २७+', 'प्रवासन परामर्श, 27+'), free: true,
    description: L(
      'Help with residence permits, letters from authorities, work and language courses for adults from about 27 years.',
      'करिब २७ वर्षमाथिका वयस्कका लागि आवास अनुमतिपत्र, सरकारी चिठी, काम र भाषा कक्षामा सहयोग।',
      'लगभग 27 साल से ऊपर के वयस्कों के लिए निवास परमिट, सरकारी पत्र, काम और भाषा कोर्स में मदद।',
    ),
    phone: '+493419636125', email: 'migrantenhilfe@caritas-leipzig.de', address: 'Ruth-Pfau-Straße 2, 04107 Leipzig', url: S.caritasMbe.url, topics: ['visa', 'work'], sources: [S.caritasMbe],
  },
  {
    id: 'naomi-jmd', name: 'Diakonie Leipzig — Jugendmigrationsdienst Naomi', kind: L('Migration counselling, 12–27', 'आप्रवासन परामर्श, १२–२७', 'प्रवासन परामर्श, 12–27'), free: true,
    description: L(
      'Youth migration service for people aged 12 to 27: residence, studies, training, jobs and everyday questions.',
      '१२ देखि २७ वर्षका लागि युवा आप्रवासन सेवा: बसाइ, पढाइ, तालिम, काम र दैनिक प्रश्न।',
      '12 से 27 साल के लोगों के लिए युवा प्रवासन सेवा: निवास, पढ़ाई, प्रशिक्षण, नौकरी और रोज़मर्रा के सवाल।',
    ),
    phone: '+4934168709124', email: 'jmd@diakonie-leipzig.de', address: 'Eisenbahnstraße 66, 04315 Leipzig', url: S.naomiJmd.url, topics: ['visa', 'study', 'work'], sources: [S.naomiJmd],
  },
  {
    id: 'mieterverein', name: 'Mieterverein Leipzig', kind: L('Tenants’ association', 'भाडावाल संघ', 'किरायेदार संघ'), free: false,
    cost: L('€84 a year + €10 joining fee · trial: €30 for 3 months', 'वर्षको €८४ + €१० प्रवेश शुल्क · परीक्षण: ३ महिनाको €३०', 'साल के €84 + €10 सदस्यता शुल्क · ट्रायल: 3 महीने के €30'),
    description: L(
      'Checks rental contracts, deposits and service-charge bills, and advises members in disputes with landlords.',
      'भाडा सम्झौता, धरौटी र सेवा शुल्कको बिल जाँच्छ, र घरधनीसँगको विवादमा सदस्यलाई सल्लाह दिन्छ।',
      'किराया अनुबंध, जमानत और सेवा शुल्क के बिल जांचता है, और मकान मालिक से विवाद में सदस्यों को सलाह देता है।',
    ),
    phone: '+493412131277', url: S.mieterverein.url, topics: ['housing'], sources: [S.mieterverein, S.mietervereinFaq],
  },
  {
    id: 'p116117', name: '116117 — Patient service', kind: L('Doctor at night and weekends', 'राति र सप्ताहान्तमा डाक्टर', 'रात और सप्ताहांत में डॉक्टर'), free: true,
    description: L(
      'Free, 24/7: on-call doctors when your practice is closed, help finding appointments, and a doctor search by language.',
      'निःशुल्क, २४/७: क्लिनिक बन्द हुँदा अन-कल डाक्टर, अपोइन्टमेन्ट खोज्न सहयोग, र भाषाअनुसार डाक्टर खोज।',
      'मुफ़्त, 24/7: क्लिनिक बंद होने पर ऑन-कॉल डॉक्टर, अपॉइंटमेंट खोजने में मदद, और भाषा के अनुसार डॉक्टर खोज।',
    ),
    phone: '116117', url: S.p116117.url, topics: ['health'], sources: [S.p116117, S.p116117Duty],
  },
  {
    id: 'seelsorge', name: 'TelefonSeelsorge', kind: L('Someone to talk to', 'कुरा गर्ने कोही', 'कोई बात करने वाला'), free: true,
    description: L(
      'Feeling overwhelmed or alone? Talk to someone any time, day or night, anonymously and free of charge.',
      'धेरै दबाब वा एक्लो महसुस भइरहेको छ? दिन होस् वा रात, जुनसुकै बेला गोप्य र निःशुल्क रूपमा कसैसँग कुरा गर्नुहोस्।',
      'बहुत दबाव या अकेलापन महसूस हो रहा है? दिन हो या रात, कभी भी गुमनाम और मुफ़्त में किसी से बात करें।',
    ),
    phone: '08001110111', url: 'https://www.telefonseelsorge.de/', topics: ['health'], sources: [{ title: 'TelefonSeelsorge Deutschland', url: 'https://www.telefonseelsorge.de/' }],
  },
];

export const scamWarnings: ScamWarning[] = [
  {
    id: 'rental',
    title: L('A landlord wants money before you see the flat', 'फ्ल्याट हेर्नुअघि घरधनीले पैसा माग्छ', 'फ़्लैट देखने से पहले मकान मालिक पैसे मांगता है'),
    signs: [
      L('The landlord is “abroad” and will send the keys after you pay', 'घरधनी “विदेशमा” छ र पैसा तिरेपछि साँचो पठाउने भन्छ', 'मकान मालिक “विदेश में” है और भुगतान के बाद चाबी भेजने की बात करता है'),
      L('Rent is far below other flats nearby', 'भाडा नजिकैका अन्य फ्ल्याटभन्दा धेरै कम छ', 'किराया आसपास के दूसरे फ़्लैटों से बहुत कम है'),
      L('Payment by Western Union, gift cards or to a foreign account', 'Western Union, गिफ्ट कार्ड वा विदेशी खातामा भुक्तानी', 'Western Union, गिफ़्ट कार्ड या विदेशी खाते में भुगतान'),
      L('Pressure to decide today', 'आजै निर्णय गर्न दबाब', 'आज ही फ़ैसला करने का दबाव'),
    ],
    actions: [
      L('Pay nothing before a viewing and a signed contract', 'हेर्नु र सम्झौतामा हस्ताक्षर गर्नुअघि केही नतिर्नुहोस्', 'देखने और हस्ताक्षरित अनुबंध से पहले कुछ न भरें'),
      L('Already paid? Ask your bank to recall the transfer immediately', 'तिरिसक्नुभयो? तुरुन्तै बैंकलाई ट्रान्सफर फिर्ता गर्न भन्नुहोस्', 'भुगतान कर दिया? तुरंत बैंक से ट्रांसफ़र वापस मंगाने को कहें'),
      L('Report it to the police (online report possible) and keep screenshots', 'प्रहरीलाई खबर गर्नुहोस् (अनलाइन उजुरी गर्न मिल्छ) र स्क्रिनसट राख्नुहोस्', 'पुलिस में शिकायत करें (ऑनलाइन भी) और स्क्रीनशॉट रखें'),
    ],
    sources: [S.vzFakeFlats, S.policeAdvance, S.bgbDeposit],
  },
  {
    id: 'fake-officials',
    title: L('A caller says they are from the police or an authority', 'फोन गर्नेले आफू प्रहरी वा सरकारी निकायबाट भएको भन्छ', 'फ़ोन करने वाला ख़ुद को पुलिस या सरकारी विभाग का बताता है'),
    signs: [
      L('They demand money, gift cards or bank details by phone', 'उनीहरू फोनमै पैसा, गिफ्ट कार्ड वा बैंक विवरण माग्छन्', 'वे फ़ोन पर पैसे, गिफ़्ट कार्ड या बैंक विवरण मांगते हैं'),
      L('They threaten deportation or arrest if you don’t pay now', 'तुरुन्तै नतिरे देश निकाला वा पक्राउ गर्ने धम्की दिन्छन्', 'अभी भुगतान न करने पर निर्वासन या गिरफ़्तारी की धमकी देते हैं'),
      L('“110” or an official number appears on your display', 'तपाईंको स्क्रिनमा “110” वा सरकारी नम्बर देखिन्छ', 'आपकी स्क्रीन पर “110” या सरकारी नंबर दिखता है'),
    ],
    actions: [
      L('Hang up. The police and authorities never ask for money by phone', 'फोन राख्नुहोस्। प्रहरी र सरकारी निकायले फोनमा कहिल्यै पैसा माग्दैनन्', 'फ़ोन काट दें। पुलिस और सरकारी विभाग फ़ोन पर कभी पैसे नहीं मांगते'),
      L('Call 110 yourself — numbers on the display can be faked', 'आफैं ११० मा फोन गर्नुहोस् — स्क्रिनमा देखिने नम्बर नक्कली हुन सक्छ', 'ख़ुद 110 पर कॉल करें — स्क्रीन पर दिखने वाले नंबर नकली हो सकते हैं'),
      L('Real letters from the foreigners’ office come by post', 'विदेशी कार्यालयका सक्कली चिठी हुलाकबाट आउँछन्', 'विदेशी कार्यालय के असली पत्र डाक से आते हैं'),
    ],
    sources: [S.policeFakeOfficers, S.policeSaxonyFake],
  },
  {
    id: 'visa-agent',
    title: L('An agent promises a “guaranteed visa” or a faster appointment', 'एजेन्टले “ग्यारेन्टी भिसा” वा छिटो अपोइन्टमेन्टको वाचा गर्छ', 'एजेंट “पक्का वीज़ा” या जल्दी अपॉइंटमेंट का वादा करता है'),
    signs: [
      L('They charge for appointments, which are free', 'निःशुल्क हुने अपोइन्टमेन्टका लागि पैसा लिन्छन्', 'मुफ़्त अपॉइंटमेंट के लिए पैसे लेते हैं'),
      L('They offer to prepare bank statements or documents for you', 'तपाईंका लागि बैंक स्टेटमेन्ट वा कागजात बनाइदिने प्रस्ताव गर्छन्', 'आपके लिए बैंक स्टेटमेंट या दस्तावेज़ बनाने की पेशकश करते हैं'),
      L('They claim contacts inside the embassy', 'दूतावासभित्र चिनजान भएको दाबी गर्छन्', 'दूतावास के अंदर जान-पहचान का दावा करते हैं'),
    ],
    actions: [
      L('Book appointments only on the official embassy or VFS website', 'आधिकारिक दूतावास वा VFS वेबसाइटमा मात्र अपोइन्टमेन्ट बुक गर्नुहोस्', 'अपॉइंटमेंट केवल आधिकारिक दूतावास या VFS वेबसाइट पर बुक करें'),
      L('Never submit documents you didn’t get yourself from the issuer', 'जारी गर्ने निकायबाट आफैंले नलिएको कागजात कहिल्यै नबुझाउनुहोस्', 'जो दस्तावेज़ आपने ख़ुद जारीकर्ता से नहीं लिए, उन्हें कभी जमा न करें'),
      L('Report fraud attempts to the German embassy', 'ठगीको प्रयास जर्मन दूतावासलाई जानकारी गराउनुहोस्', 'धोखाधड़ी की कोशिश की सूचना जर्मन दूतावास को दें'),
    ],
    sources: [S.kathmanduAppointment, S.indiaFraud],
  },
];

export const embassies: EmbassyContact[] = [
  {
    country: 'nepal', name: 'Embassy of Nepal, Berlin', phone: '+49 30 34359920', url: S.nepalEmbassy.url,
    address: 'Guerickestraße 27, 10587 Berlin', email: 'eonberlin@mofa.gov.np',
    note: L(
      'Passports, documents and help in emergencies. A new passport can take 1–2 months — apply in time.',
      'राहदानी, कागजात र आपतकालमा सहयोग। नयाँ राहदानीमा १–२ महिना लाग्न सक्छ — समयमै आवेदन दिनुहोस्।',
      'पासपोर्ट, दस्तावेज़ और आपात स्थिति में मदद। नए पासपोर्ट में 1–2 महीने लग सकते हैं — समय पर आवेदन करें।',
    ),
    sources: [S.nepalEmbassy, S.nepalEmbassyList],
  },
  {
    country: 'india', name: 'Embassy of India, Berlin', phone: '+49 30 257950', url: 'https://indianembassyberlin.gov.in/',
    address: 'Tiergartenstraße 17, 10785 Berlin',
    note: L(
      'Responsible for Indian citizens in Saxony, including Leipzig. Consular appointments are booked online.',
      'लाइपजिगसहित सक्सोनीमा बस्ने भारतीय नागरिकका लागि जिम्मेवार। कन्सुलर अपोइन्टमेन्ट अनलाइन बुक गरिन्छ।',
      'लाइपज़िग सहित सैक्सनी में रहने वाले भारतीय नागरिकों के लिए ज़िम्मेदार। कांसुलर अपॉइंटमेंट ऑनलाइन बुक होते हैं।',
    ),
    sources: [S.indiaJurisdiction, S.indiaAppointment],
  },
];
