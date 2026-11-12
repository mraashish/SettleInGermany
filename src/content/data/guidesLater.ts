import type { Guide } from '../types';
import { CHECKED, FREE, L, NOT_ADVICE, S } from './util';

export const guidesLater: Guide[] = [
  {
    slug: 'find-a-family-doctor',
    title: L('Find a family doctor', 'पारिवारिक डाक्टर खोज्नुहोस्', 'फ़ैमिली डॉक्टर खोजें'),
    term: { term: 'Hausarzt' },
    stage: 'living',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A general practitioner who is your first stop when you are ill and who refers you to specialists.',
        'बिरामी हुँदा पहिलो पटक जाने र विशेषज्ञकहाँ पठाउने सामान्य चिकित्सक।',
        'एक सामान्य चिकित्सक जो बीमार होने पर आपका पहला पड़ाव है और विशेषज्ञ के पास भेजता है।',
      ),
      when: L('Before you get ill — new patients can wait for weeks.', 'बिरामी पर्नुअघि नै — नयाँ बिरामीले हप्तौं पर्खनुपर्ने हुन सक्छ।', 'बीमार पड़ने से पहले — नए मरीज़ों को हफ़्तों इंतज़ार करना पड़ सकता है।'),
      deadline: L('No deadline', 'कुनै समयसीमा छैन', 'कोई समयसीमा नहीं'),
    },
    steps: [
      {
        title: L('Search on 116117', '116117 मा खोज्नुहोस्', '116117 पर खोजें'),
        body: L(
          'The official doctor search on 116117.de (and the 116117 app) lets you filter by distance and by languages the doctor speaks.',
          '116117.de (र 116117 एप) को आधिकारिक डाक्टर खोजमा दूरी र डाक्टरले बोल्ने भाषाअनुसार छान्न सकिन्छ।',
          '116117.de (और 116117 ऐप) की आधिकारिक डॉक्टर खोज में दूरी और डॉक्टर की भाषाओं के अनुसार फ़िल्टर कर सकते हैं।',
        ),
        term: { term: 'Arztsuche' },
        cost: FREE,
      },
      {
        title: L('Call and ask if they take new patients', 'फोन गरेर नयाँ बिरामी लिन्छन् कि सोध्नुहोस्', 'फ़ोन करके पूछें कि नए मरीज़ लेते हैं या नहीं'),
        body: L(
          'Say: “Nehmen Sie neue Patienten auf?” If the practice is full, the 116117 appointment service can help you find one.',
          'भन्नुहोस्: “Nehmen Sie neue Patienten auf?” क्लिनिक भरिएको छ भने 116117 को अपोइन्टमेन्ट सेवाले खोज्न सहयोग गर्छ।',
          'कहें: “Nehmen Sie neue Patienten auf?” अगर क्लिनिक भरा है, तो 116117 की अपॉइंटमेंट सेवा मदद कर सकती है।',
        ),
      },
      {
        title: L('Bring your health card to every visit', 'हरेक भेटमा स्वास्थ्य कार्ड लैजानुहोस्', 'हर बार हेल्थ कार्ड साथ ले जाएं'),
        body: L(
          'With statutory insurance, visits are paid directly by your fund. For prescriptions you usually pay a small share at the pharmacy.',
          'सरकारी बीमामा डाक्टरको खर्च कोषले सिधै तिर्छ। औषधिको प्रेस्क्रिप्सनमा प्रायः फार्मेसीमा थोरै अंश तिर्नुहुन्छ।',
          'वैधानिक बीमा में डॉक्टर का ख़र्च कोष सीधे भरता है। दवा के पर्चे पर आमतौर पर फ़ार्मेसी में थोड़ा हिस्सा देना होता है।',
        ),
        term: { term: 'Versichertenkarte' },
      },
    ],
    documents: [L('Health card', 'स्वास्थ्य कार्ड', 'हेल्थ कार्ड'), L('List of your medicines', 'तपाईंका औषधिहरूको सूची', 'आपकी दवाओं की सूची')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Ill at night or at the weekend and it can’t wait? Call 116117 (free, 24/7) for the on-call doctor service.',
          'राति वा सप्ताहान्तमा बिरामी, पर्खन नमिल्ने? अन-कल डाक्टर सेवाका लागि 116117 (निःशुल्क, २४/७) मा फोन गर्नुहोस्।',
          'रात में या सप्ताहांत पर बीमार और इंतज़ार नहीं कर सकते? ऑन-कॉल डॉक्टर सेवा के लिए 116117 (मुफ़्त, 24/7) पर कॉल करें।',
        ),
      },
      {
        kind: 'warning',
        text: L('Life-threatening emergency: call 112.', 'ज्यान जोखिमको आपतकाल: ११२ मा फोन गर्नुहोस्।', 'जानलेवा आपात स्थिति: 112 पर कॉल करें।'),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Activate your health insurance', 'स्वास्थ्य बीमा सक्रिय गर्नुहोस्', 'स्वास्थ्य बीमा सक्रिय करें'), href: '/guides/activate-health-insurance' },
      { kind: 'tool', title: L('Safety and emergency numbers', 'सुरक्षा र आपतकालीन नम्बर', 'सुरक्षा और आपातकालीन नंबर'), href: '/tools/safety' },
    ],
    actions: [
      { label: L('Find a doctor on 116117', '116117 मा डाक्टर खोज्नुहोस्', '116117 पर डॉक्टर खोजें'), url: S.p116117.url },
    ],
    sources: [S.p116117, S.p116117Duty, S.kbv116117],
  },
  {
    slug: 'student-jobs',
    title: L('Student jobs and work limits', 'विद्यार्थी काम र कामको सीमा', 'छात्र नौकरियां और काम की सीमा'),
    term: { term: 'Nebenjob' },
    stage: 'living',
    readingMinutes: 6,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'With a student residence permit you may work 140 full days or 280 half days a year — or alternatively up to 20 hours a week.',
        'विद्यार्थी आवास अनुमतिपत्रमा वर्षमा १४० पूरा दिन वा २८० आधा दिन — वा विकल्पमा हप्तामा बढीमा २० घण्टा काम गर्न पाइन्छ।',
        'छात्र निवास परमिट पर आप साल में 140 पूरे दिन या 280 आधे दिन — या विकल्प के तौर पर हफ़्ते में 20 घंटे तक काम कर सकते हैं।',
      ),
      when: L('Before you sign a job contract.', 'कामको सम्झौतामा हस्ताक्षर गर्नुअघि।', 'नौकरी के अनुबंध पर हस्ताक्षर से पहले।'),
      deadline: L('Counts per calendar year', 'पात्रो वर्षअनुसार गनिन्छ', 'कैलेंडर साल के हिसाब से गिना जाता है'),
    },
    steps: [
      {
        title: L('Count your days', 'आफ्ना दिनहरू गन्नुहोस्', 'अपने दिन गिनें'),
        body: L(
          'A day with more than 4 hours of work counts as a full day; up to 4 hours is a half day. Log every work day — our work-limit tool does it for you.',
          '४ घण्टाभन्दा बढी काम गरेको दिन पूरा दिन गनिन्छ; ४ घण्टासम्म आधा दिन। हरेक कामको दिन लेख्नुहोस् — हाम्रो कामको सीमा उपकरणले यो गर्छ।',
          '4 घंटे से ज़्यादा काम वाला दिन पूरा दिन गिना जाता है; 4 घंटे तक आधा दिन। हर काम का दिन लिखें — हमारा काम-सीमा टूल यह करता है।',
        ),
        term: { term: 'Arbeitstag' },
      },
      {
        title: L('Know your pay', 'आफ्नो तलब बुझ्नुहोस्', 'अपना वेतन समझें'),
        body: L(
          'The minimum wage is €13.90 an hour in 2026 (€14.60 from 2027). In a mini-job you may earn up to €603 a month; you pay 3.6% pension contribution unless you opt out.',
          '२०२६ मा न्यूनतम ज्याला प्रतिघण्टा €१३.९० (२०२७ देखि €१४.६०) छ। मिनी-जबमा महिनामा €६०३ सम्म कमाउन पाइन्छ; छुट नलिएसम्म ३.६% पेन्सन योगदान तिर्नुहुन्छ।',
          '2026 में न्यूनतम वेतन €13.90 प्रति घंटा (2027 से €14.60) है। मिनी-जॉब में आप हर महीने €603 तक कमा सकते हैं; छूट न लें तो 3.6% पेंशन योगदान देते हैं।',
        ),
        term: { term: 'Mindestlohn' },
      },
      {
        title: L('Working student job', 'वर्किङ स्टुडेन्ट काम', 'वर्किंग स्टूडेंट नौकरी'),
        body: L(
          'Above €603 a month, a job of up to 20 hours a week during lectures is usually a working-student job. You then pay only pension insurance (9.3%) — no health or unemployment insurance.',
          'महिनामा €६०३ भन्दा बढी भए, कक्षा अवधिमा हप्तामा २० घण्टासम्मको काम प्रायः वर्किङ स्टुडेन्ट काम हुन्छ। त्यसमा पेन्सन बीमा (९.३%) मात्र तिर्नुहुन्छ — स्वास्थ्य वा बेरोजगारी बीमा होइन।',
          '€603 प्रति माह से ज़्यादा पर, लेक्चर के समय हफ़्ते में 20 घंटे तक का काम आमतौर पर वर्किंग स्टूडेंट नौकरी होता है। तब आप केवल पेंशन बीमा (9.3%) देते हैं — स्वास्थ्य या बेरोज़गारी बीमा नहीं।',
        ),
        term: { term: 'Werkstudent' },
      },
      {
        title: L('Need more? Ask first', 'बढी चाहियो? पहिले सोध्नुहोस्', 'ज़्यादा चाहिए? पहले पूछें'),
        body: L(
          'Working more, or working as a freelancer, needs permission from the foreigners’ office (and often the Federal Employment Agency). Ask before you start.',
          'बढी काम गर्न वा फ्रिलान्सरका रूपमा काम गर्न विदेशी कार्यालय (र प्रायः संघीय रोजगार एजेन्सी) को अनुमति चाहिन्छ। सुरु गर्नुअघि सोध्नुहोस्।',
          'ज़्यादा काम करने या फ़्रीलांसर के रूप में काम करने के लिए विदेशी कार्यालय (और अक्सर संघीय रोज़गार एजेंसी) की अनुमति चाहिए। शुरू करने से पहले पूछें।',
        ),
      },
    ],
    documents: [
      L('Residence permit', 'आवास अनुमतिपत्र', 'निवास परमिट'),
      L('Tax ID', 'कर आईडी', 'टैक्स आईडी'),
      L('Social security number (your pension insurance sends it)', 'सामाजिक सुरक्षा नम्बर (पेन्सन बीमाले पठाउँछ)', 'सामाजिक सुरक्षा नंबर (पेंशन बीमा भेजता है)'),
      L('Enrolment certificate', 'भर्ना प्रमाणपत्र', 'दाख़िला प्रमाणपत्र'),
      L('German bank account', 'जर्मन बैंक खाता', 'जर्मन बैंक खाता'),
    ],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'Working more than allowed can cost you your residence permit. Keep your own record of days and hours.',
          'अनुमतिभन्दा बढी काम गर्दा आवास अनुमतिपत्र गुम्न सक्छ। दिन र घण्टाको आफ्नै अभिलेख राख्नुहोस्।',
          'अनुमति से ज़्यादा काम करने पर निवास परमिट जा सकता है। दिनों और घंटों का अपना रिकॉर्ड रखें।',
        ),
      },
      {
        kind: 'tip',
        text: L(
          'Tax was taken from your pay? If you earned less than €12,348 in 2026, a tax return usually gets it back.',
          'तलबबाट कर काटियो? २०२६ मा €१२,३४८ भन्दा कम कमाउनुभयो भने कर विवरण बुझाउँदा प्रायः फिर्ता पाइन्छ।',
          'वेतन से टैक्स कटा? अगर 2026 में €12,348 से कम कमाया, तो टैक्स रिटर्न से आमतौर पर वापस मिल जाता है।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Work-limit tracker', 'कामको सीमा ट्र्याकर', 'काम-सीमा ट्रैकर'), href: '/tools/work-limit' },
      { kind: 'tool', title: L('Net pay calculator', 'खुद तलब क्याल्कुलेटर', 'शुद्ध वेतन कैलकुलेटर'), href: '/tools/net-pay' },
    ],
    sources: [S.skilledImmigration, S.daadSideJobs, S.drvMinijob603, S.minijobStudents, S.minijobPension, S.drvStudents],
  },
  {
    slug: 'file-tax-return',
    title: L('File your tax return', 'कर विवरण बुझाउनुहोस्', 'टैक्स रिटर्न भरें'),
    term: { term: 'Steuererklärung' },
    stage: 'living',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A yearly statement of your income to the tax office. Students with a small job often get withheld tax back.',
        'कर कार्यालयलाई आफ्नो आम्दानीको वार्षिक विवरण। सानो काम गर्ने विद्यार्थीले प्रायः काटिएको कर फिर्ता पाउँछन्।',
        'टैक्स कार्यालय को अपनी आय का सालाना विवरण। छोटी नौकरी करने वाले छात्रों को अक्सर कटा हुआ टैक्स वापस मिलता है।',
      ),
      when: L('After the end of the year in which you worked.', 'काम गरेको वर्ष सकिएपछि।', 'जिस साल काम किया, उसके ख़त्म होने के बाद।'),
      deadline: L('31 July of the next year, if you must file', 'बुझाउनैपर्ने भए अर्को वर्षको ३१ जुलाई', 'अगर भरना ज़रूरी है तो अगले साल की 31 जुलाई'),
    },
    steps: [
      {
        title: L('Find out if you must file', 'बुझाउनैपर्छ कि पत्ता लगाउनुहोस्', 'पता करें कि भरना ज़रूरी है या नहीं'),
        body: L(
          'With only one ordinary job you usually don’t have to. Filing voluntarily is still worth it if tax was deducted — you can do it up to 4 years back.',
          'एउटा सामान्य काम मात्र भए प्रायः बुझाउनु पर्दैन। कर काटिएको भए स्वेच्छाले बुझाउनु फाइदाजनक छ — ४ वर्ष पछाडिसम्म बुझाउन सकिन्छ।',
          'केवल एक सामान्य नौकरी हो तो आमतौर पर ज़रूरी नहीं। टैक्स कटा हो तो अपनी मर्ज़ी से भरना फ़ायदेमंद है — 4 साल पीछे तक भर सकते हैं।',
        ),
        term: { term: 'Pflichtveranlagung' },
      },
      {
        title: L('Register for ELSTER', 'ELSTER मा दर्ता गर्नुहोस्', 'ELSTER पर पंजीकरण करें'),
        body: L(
          'ELSTER is the tax office’s free online portal. Registering needs your tax ID; an activation code comes by post.',
          'ELSTER कर कार्यालयको निःशुल्क अनलाइन पोर्टल हो। दर्ताका लागि कर आईडी चाहिन्छ; सक्रियता कोड हुलाकबाट आउँछ।',
          'ELSTER टैक्स कार्यालय का मुफ़्त ऑनलाइन पोर्टल है। पंजीकरण के लिए टैक्स आईडी चाहिए; सक्रियता कोड डाक से आता है।',
        ),
        cost: FREE,
        wait: L('About 2 weeks for the code', 'कोडका लागि करिब २ हप्ता', 'कोड के लिए लगभग 2 हफ़्ते'),
      },
      {
        title: L('Enter your wage statement', 'तलब विवरण भर्नुहोस्', 'वेतन विवरण भरें'),
        body: L(
          'Your employer gives you an annual wage tax statement. ELSTER often fills it in for you. Add costs for work, such as travel to work.',
          'रोजगारदाताले वार्षिक तलब कर विवरण दिन्छ। ELSTER ले प्रायः आफैं भरिदिन्छ। कामसम्बन्धी खर्च, जस्तै कामसम्मको यात्रा, थप्नुहोस्।',
          'आपका नियोक्ता सालाना वेतन टैक्स विवरण देता है। ELSTER अक्सर इसे अपने आप भर देता है। काम से जुड़े ख़र्च, जैसे काम पर आने-जाने का ख़र्च, जोड़ें।',
        ),
        term: { term: 'Lohnsteuerbescheinigung' },
      },
      {
        title: L('Wait for the tax assessment', 'कर निर्धारण पत्र पर्खनुहोस्', 'टैक्स निर्धारण का इंतज़ार करें'),
        body: L(
          'The tax office sends a decision. Any refund is paid into your bank account. Check it — you can object within one month.',
          'कर कार्यालयले निर्णय पठाउँछ। फिर्ता हुने रकम बैंक खातामा आउँछ। जाँच्नुहोस् — एक महिनाभित्र आपत्ति गर्न सकिन्छ।',
          'टैक्स कार्यालय फ़ैसला भेजता है। रिफ़ंड बैंक खाते में आता है। इसे जांचें — एक महीने के अंदर आपत्ति कर सकते हैं।',
        ),
        term: { term: 'Steuerbescheid' },
      },
    ],
    documents: [
      L('Tax ID', 'कर आईडी', 'टैक्स आईडी'),
      L('Annual wage tax statement from each employer', 'हरेक रोजगारदाताको वार्षिक तलब कर विवरण', 'हर नियोक्ता का सालाना वेतन टैक्स विवरण'),
      L('Bank account (IBAN)', 'बैंक खाता (IBAN)', 'बैंक खाता (IBAN)'),
      L('Receipts for work-related costs', 'कामसम्बन्धी खर्चका रसिद', 'काम से जुड़े ख़र्चों की रसीदें'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'In 2026 the first €12,348 of income is tax-free. Many students with a part-time job get all their wage tax back.',
          '२०२६ मा पहिलो €१२,३४८ आम्दानी करमुक्त छ। आंशिक काम गर्ने धेरै विद्यार्थीले सबै तलब कर फिर्ता पाउँछन्।',
          '2026 में पहले €12,348 की आय टैक्स-मुक्त है। पार्ट-टाइम नौकरी करने वाले कई छात्रों को पूरा वेतन टैक्स वापस मिलता है।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'If you must file and miss the deadline, the tax office can charge a late fee. When in doubt, ask a free counselling service.',
          'बुझाउनैपर्ने भएर पनि समयसीमा नाघ्नुभयो भने कर कार्यालयले ढिलाइ शुल्क लिन सक्छ। शंका भए निःशुल्क परामर्श सेवालाई सोध्नुहोस्।',
          'अगर भरना ज़रूरी है और समयसीमा चूक गए, तो टैक्स कार्यालय देरी शुल्क ले सकता है। शक हो तो मुफ़्त परामर्श सेवा से पूछें।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Net pay calculator', 'खुद तलब क्याल्कुलेटर', 'शुद्ध वेतन कैलकुलेटर'), href: '/tools/net-pay' },
      { kind: 'guide', title: L('Get your tax ID', 'आफ्नो कर आईडी लिनुहोस्', 'अपनी टैक्स आईडी पाएं'), href: '/guides/get-your-tax-id' },
    ],
    actions: [
      { label: L('Open ELSTER', 'ELSTER खोल्नुहोस्', 'ELSTER खोलें'), url: S.elster.url },
    ],
    sources: [S.elster, S.bmfTax2026, S.bmfAoDeadlines],
  },
  {
    slug: 'extend-your-residence-permit',
    title: L('Extend your residence permit', 'आवास अनुमतिपत्र नवीकरण गर्नुहोस्', 'निवास परमिट बढ़वाएं'),
    term: { term: 'Verlängerung' },
    stage: 'career',
    city: 'leipzig',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Your student permit is issued for a limited time. In Leipzig you apply online to extend it while you are still studying.',
        'विद्यार्थी अनुमतिपत्र सीमित अवधिका लागि दिइन्छ। पढाइ जारी रहँदा लाइपजिगमा अनलाइन आवेदन दिएर नवीकरण गर्नुहुन्छ।',
        'छात्र परमिट सीमित समय के लिए मिलता है। पढ़ाई जारी रहने पर लाइपज़िग में ऑनलाइन आवेदन करके इसे बढ़वाते हैं।',
      ),
      when: L('A few weeks before the date on your card.', 'कार्डमा लेखिएको मितिभन्दा केही हप्ताअघि।', 'कार्ड पर लिखी तारीख से कुछ हफ़्ते पहले।'),
      deadline: L('Before your permit ends', 'अनुमतिपत्रको म्याद सकिनुअघि', 'परमिट ख़त्म होने से पहले'),
    },
    steps: [
      {
        title: L('Prepare up-to-date documents', 'अद्यावधिक कागजात तयार गर्नुहोस्', 'ताज़ा दस्तावेज़ तैयार करें'),
        body: L(
          'You need a current enrolment certificate, proof of money for the new period and proof of health insurance. The office may ask about your study progress.',
          'हालको भर्ना प्रमाणपत्र, नयाँ अवधिका लागि पैसाको प्रमाण र स्वास्थ्य बीमाको प्रमाण चाहिन्छ। कार्यालयले पढाइको प्रगतिबारे सोध्न सक्छ।',
          'आपको ताज़ा दाख़िला प्रमाणपत्र, नई अवधि के लिए पैसे का सबूत और स्वास्थ्य बीमा का सबूत चाहिए। कार्यालय पढ़ाई की प्रगति के बारे में पूछ सकता है।',
        ),
      },
      {
        title: L('Apply online', 'अनलाइन आवेदन दिनुहोस्', 'ऑनलाइन आवेदन करें'),
        body: L(
          'Use the same online application as for your first permit. Apply before your permit ends — then your stay remains legal while the office decides.',
          'पहिलो अनुमतिपत्रकै अनलाइन आवेदन प्रयोग गर्नुहोस्। म्याद सकिनुअघि आवेदन दिनुहोस् — त्यसपछि कार्यालयले निर्णय नगरुन्जेल तपाईंको बसाइ कानुनी रहन्छ।',
          'पहले परमिट वाला ही ऑनलाइन आवेदन इस्तेमाल करें। परमिट ख़त्म होने से पहले आवेदन करें — तब कार्यालय के फ़ैसले तक आपका रहना क़ानूनी रहता है।',
        ),
        where: L('Ausländerbehörde Leipzig (online)', 'Ausländerbehörde Leipzig (अनलाइन)', 'Ausländerbehörde Leipzig (ऑनलाइन)'),
        cost: L('€93', '€९३', '€93'),
      },
      {
        title: L('Give biometrics and collect the card', 'बायोमेट्रिक दिनुहोस् र कार्ड लिनुहोस्', 'बायोमेट्रिक दें और कार्ड लें'),
        body: L(
          'You are invited by email. If the card is not ready before the old one ends, you get a Fiktionsbescheinigung.',
          'तपाईंलाई इमेलबाट बोलाइन्छ। पुरानो कार्डको म्याद सकिनुअघि नयाँ तयार नभए Fiktionsbescheinigung पाउनुहुन्छ।',
          'आपको ईमेल से बुलाया जाता है। पुराना कार्ड ख़त्म होने तक नया तैयार न हो तो Fiktionsbescheinigung मिलता है।',
        ),
        term: { term: 'Fiktionsbescheinigung' },
      },
    ],
    documents: [
      L('Passport and current residence permit', 'राहदानी र हालको आवास अनुमतिपत्र', 'पासपोर्ट और मौजूदा निवास परमिट'),
      L('Current enrolment certificate', 'हालको भर्ना प्रमाणपत्र', 'ताज़ा दाख़िला प्रमाणपत्र'),
      L('Proof of money (€992 a month)', 'पैसाको प्रमाण (महिनामा €९९२)', 'पैसे का सबूत (हर महीने €992)'),
      L('Proof of health insurance', 'स्वास्थ्य बीमाको प्रमाण', 'स्वास्थ्य बीमा का सबूत'),
      L('Rental contract', 'भाडा सम्झौता', 'किराया अनुबंध'),
      L('Transcript of records, if asked', 'माग भएमा अङ्कपत्र', 'मांगने पर अंकपत्र'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Set a reminder about 8 weeks before your permit ends — the Me › Reminders tool can do this for you.',
          'अनुमतिपत्रको म्याद सकिनुभन्दा करिब ८ हप्ताअघि रिमाइन्डर राख्नुहोस् — Me › Reminders ले यो गर्न सक्छ।',
          'परमिट ख़त्म होने से लगभग 8 हफ़्ते पहले रिमाइंडर लगाएं — Me › Reminders यह कर सकता है।',
        ),
      },
      {
        kind: 'warning',
        text: L(
          'Your passport must also be valid. Renew it at your embassy in time — a Nepali passport can take 1–2 months.',
          'राहदानी पनि वैध हुनुपर्छ। समयमै दूतावासमा नवीकरण गर्नुहोस् — नेपाली राहदानीमा १–२ महिना लाग्न सक्छ।',
          'पासपोर्ट भी वैध होना चाहिए। समय पर दूतावास में नवीनीकरण कराएं — नेपाली पासपोर्ट में 1–2 महीने लग सकते हैं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Stay and look for work after graduation', 'स्नातकपछि बसेर काम खोज्नुहोस्', 'स्नातक के बाद रहकर नौकरी खोजें'), href: '/guides/job-search-after-graduation' },
      { kind: 'guide', title: L('Apply for your residence permit', 'आवास अनुमतिपत्रका लागि आवेदन दिनुहोस्', 'निवास परमिट के लिए आवेदन करें'), href: '/guides/book-residence-permit-appointment' },
    ],
    actions: [
      { label: L('Apply online', 'अनलाइन आवेदन दिनुहोस्', 'ऑनलाइन आवेदन करें'), url: S.leipzigOnlineStudy.url },
    ],
    sources: [S.leipzigPermitStudy, S.leipzigOnlineStudy, S.leipzigPermitStudyEn, S.nepalEmbassy],
  },
  {
    slug: 'job-search-after-graduation',
    title: L('Stay and look for work after graduation', 'स्नातकपछि बसेर काम खोज्नुहोस्', 'स्नातक के बाद रहकर नौकरी खोजें'),
    term: { term: 'Aufenthaltserlaubnis zur Arbeitsplatzsuche' },
    stage: 'career',
    city: 'leipzig',
    readingMinutes: 6,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'After you graduate you can get a residence permit for up to 18 months to look for a job that matches your degree. You may work in any job during that time.',
        'स्नातकपछि आफ्नो डिग्रीअनुसारको काम खोज्न बढीमा १८ महिनाको आवास अनुमतिपत्र पाउन सक्नुहुन्छ। त्यस बेला जुनसुकै काम गर्न पाइन्छ।',
        'स्नातक के बाद अपनी डिग्री के अनुरूप नौकरी खोजने के लिए 18 महीने तक का निवास परमिट मिल सकता है। उस दौरान आप कोई भी काम कर सकते हैं।',
      ),
      when: L('When you have passed your final exams.', 'अन्तिम परीक्षा पास गरेपछि।', 'अंतिम परीक्षा पास करने के बाद।'),
      deadline: L('Before your student permit ends', 'विद्यार्थी अनुमतिपत्रको म्याद सकिनुअघि', 'छात्र परमिट ख़त्म होने से पहले'),
    },
    steps: [
      {
        title: L('Get proof that you graduated', 'स्नातक भएको प्रमाण लिनुहोस्', 'स्नातक होने का सबूत लें'),
        body: L(
          'Ask your examination office for a certificate or a confirmation that you have passed, if the diploma isn’t ready yet.',
          'डिग्री प्रमाणपत्र तयार नभए परीक्षा कार्यालयसँग पास भएको प्रमाणपत्र वा पुष्टि-पत्र माग्नुहोस्।',
          'अगर डिग्री तैयार नहीं है तो परीक्षा कार्यालय से पास होने का प्रमाणपत्र या पुष्टि-पत्र मांगें।',
        ),
      },
      {
        title: L('Apply online in Leipzig', 'लाइपजिगमा अनलाइन आवेदन दिनुहोस्', 'लाइपज़िग में ऑनलाइन आवेदन करें'),
        body: L(
          'Apply to the foreigners’ office before your current permit ends. You must show that you can support yourself and are insured.',
          'हालको अनुमतिपत्रको म्याद सकिनुअघि विदेशी कार्यालयमा आवेदन दिनुहोस्। आफूलाई धान्न सक्ने र बीमित भएको देखाउनुपर्छ।',
          'मौजूदा परमिट ख़त्म होने से पहले विदेशी कार्यालय में आवेदन करें। आपको दिखाना होगा कि आप अपना ख़र्च उठा सकते हैं और बीमित हैं।',
        ),
        cost: L('About €93–100', 'करिब €९३–१००', 'लगभग €93–100'),
      },
      {
        title: L('Found a qualified job? Switch your permit', 'योग्यताअनुसारको काम पाउनुभयो? अनुमतिपत्र बदल्नुहोस्', 'योग्य नौकरी मिली? परमिट बदलें'),
        body: L(
          'With a job that matches your degree, you can apply for an EU Blue Card or a residence permit for skilled workers. The 18 months can’t be extended.',
          'डिग्रीअनुसारको काम पाएपछि EU Blue Card वा दक्ष कामदारको आवास अनुमतिपत्रका लागि आवेदन दिन सक्नुहुन्छ। १८ महिना थप गर्न मिल्दैन।',
          'डिग्री के अनुरूप नौकरी मिलने पर आप EU Blue Card या कुशल कामगार निवास परमिट के लिए आवेदन कर सकते हैं। 18 महीने बढ़ाए नहीं जा सकते।',
        ),
        term: { term: 'Blaue Karte EU' },
      },
    ],
    documents: [
      L('Passport and current residence permit', 'राहदानी र हालको आवास अनुमतिपत्र', 'पासपोर्ट और मौजूदा निवास परमिट'),
      L('Degree certificate or confirmation of passing', 'डिग्री प्रमाणपत्र वा पास भएको पुष्टि-पत्र', 'डिग्री प्रमाणपत्र या पास होने का पुष्टि-पत्र'),
      L('Proof of money for the job search', 'काम खोज्ने अवधिका लागि पैसाको प्रमाण', 'नौकरी खोजने की अवधि के लिए पैसे का सबूत'),
      L('Proof of health insurance', 'स्वास्थ्य बीमाको प्रमाण', 'स्वास्थ्य बीमा का सबूत'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Once you graduate, student health insurance ends. Tell your fund straight away so your insurance continues without a gap.',
          'स्नातक भएपछि विद्यार्थी स्वास्थ्य बीमा सकिन्छ। बीमा बीचमा नरोकियोस् भनेर तुरुन्तै कोषलाई जानकारी दिनुहोस्।',
          'स्नातक होते ही छात्र स्वास्थ्य बीमा ख़त्म हो जाता है। बीमा बिना रुकावट जारी रहे, इसके लिए तुरंत कोष को बताएं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Extend your residence permit', 'आवास अनुमतिपत्र नवीकरण गर्नुहोस्', 'निवास परमिट बढ़वाएं'), href: '/guides/extend-your-residence-permit' },
      { kind: 'tool', title: L('Net pay calculator', 'खुद तलब क्याल्कुलेटर', 'शुद्ध वेतन कैलकुलेटर'), href: '/tools/net-pay' },
    ],
    actions: [
      { label: L('Apply online', 'अनलाइन आवेदन दिनुहोस्', 'ऑनलाइन आवेदन करें'), url: S.leipzigOnlineWork.url },
    ],
    sources: [S.leipzigJobSearch, S.leipzigOnlineWork, S.bamfGraduates, S.mkigAfterStudies],
  },
];
