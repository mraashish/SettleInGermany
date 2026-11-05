import type { Guide } from '../types';
import { CHECKED, FREE, L, NOT_ADVICE, S } from './util';

export const guidesFirst30b: Guide[] = [
  {
    slug: 'open-a-bank-account',
    title: L('Open a bank account', 'बैंक खाता खोल्नुहोस्', 'बैंक खाता खोलें'),
    term: { term: 'Girokonto' },
    stage: 'first30',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A normal current account for rent, salary and payments. Your blocked account pays your monthly money into it.',
        'भाडा, तलब र भुक्तानीका लागि सामान्य चल्ती खाता। ब्लक्ड खाताले मासिक पैसा यसैमा पठाउँछ।',
        'किराया, वेतन और भुगतान के लिए एक सामान्य चालू खाता। आपका ब्लॉक्ड अकाउंट हर महीने का पैसा इसी में भेजता है।',
      ),
      when: L('In your first weeks, ideally right after registering your address.', 'पहिलो हप्ताहरूमा, सम्भव भए ठेगाना दर्तापछि तुरुन्तै।', 'पहले हफ़्तों में, हो सके तो पता पंजीकरण के तुरंत बाद।'),
      deadline: L('Before your first rent payment', 'पहिलो भाडा तिर्नुअघि', 'पहला किराया देने से पहले'),
    },
    steps: [
      {
        title: L('Decide: branch bank or online bank', 'शाखा बैंक कि अनलाइन बैंक, निर्णय गर्नुहोस्', 'तय करें: शाखा बैंक या ऑनलाइन बैंक'),
        body: L(
          'A branch bank such as Sparkasse Leipzig offers advice in person and free student accounts up to age 26. Online banks such as N26 or ING are opened in an app, often in English.',
          'Sparkasse Leipzig जस्ता शाखा बैंकले आमनेसामने सल्लाह र २६ वर्षसम्म निःशुल्क विद्यार्थी खाता दिन्छ। N26 वा ING जस्ता अनलाइन बैंक एपमै खोलिन्छ, प्रायः अंग्रेजीमा।',
          'Sparkasse Leipzig जैसा शाखा बैंक आमने-सामने सलाह और 26 साल तक मुफ़्त छात्र खाता देता है। N26 या ING जैसे ऑनलाइन बैंक ऐप में खुलते हैं, अक्सर अंग्रेज़ी में।',
        ),
      },
      {
        title: L('Compare the real costs', 'वास्तविक खर्च तुलना गर्नुहोस्', 'असली ख़र्च की तुलना करें'),
        body: L(
          'Look at the monthly fee after the student period, cash withdrawals and card fees. ING, for example, is free under 28 or with €1,000 incoming a month, otherwise €4.90.',
          'विद्यार्थी अवधिपछिको मासिक शुल्क, नगद झिक्ने र कार्ड शुल्क हेर्नुहोस्। जस्तै ING, २८ वर्षमुनि वा महिनामा €१,००० आउने भए निःशुल्क, नत्र €४.९०।',
          'छात्र अवधि के बाद की मासिक फ़ीस, नकद निकासी और कार्ड फ़ीस देखें। जैसे ING, 28 से कम उम्र या हर महीने €1,000 आने पर मुफ़्त, वरना €4.90।',
        ),
      },
      {
        title: L('Verify your identity', 'आफ्नो पहिचान पुष्टि गर्नुहोस्', 'अपनी पहचान सत्यापित करें'),
        body: L(
          'At a branch you show your passport. Online banks use a video call. Most banks ask for your German address; many also for the registration certificate.',
          'शाखामा राहदानी देखाउनुहुन्छ। अनलाइन बैंकले भिडियो कल प्रयोग गर्छ। धेरैजसो बैंकले जर्मन ठेगाना र धेरैले दर्ता प्रमाणपत्र पनि माग्छन्।',
          'शाखा में आप पासपोर्ट दिखाते हैं। ऑनलाइन बैंक वीडियो कॉल का उपयोग करते हैं। ज़्यादातर बैंक जर्मन पता मांगते हैं; कई पंजीकरण प्रमाणपत्र भी।',
        ),
        cost: L('Student accounts: often €0', 'विद्यार्थी खाता: प्रायः €०', 'छात्र खाते: अक्सर €0'),
      },
      {
        title: L('Connect it to your blocked account', 'ब्लक्ड खातासँग जोड्नुहोस्', 'ब्लॉक्ड अकाउंट से जोड़ें'),
        body: L(
          'Give your blocked-account provider your new IBAN so the monthly payouts start. Give it to your landlord and employer too.',
          'मासिक भुक्तानी सुरु होस् भनेर ब्लक्ड खाता प्रदायकलाई नयाँ IBAN दिनुहोस्। घरधनी र रोजगारदातालाई पनि दिनुहोस्।',
          'हर महीने का भुगतान शुरू हो, इसके लिए ब्लॉक्ड अकाउंट प्रदाता को नया IBAN दें। मकान मालिक और नियोक्ता को भी दें।',
        ),
      },
    ],
    documents: [
      L('Passport with visa or residence permit', 'भिसा वा आवास अनुमतिपत्रसहितको राहदानी', 'वीज़ा या निवास परमिट सहित पासपोर्ट'),
      L('Registration certificate (Meldebescheinigung)', 'दर्ता प्रमाणपत्र (Meldebescheinigung)', 'पंजीकरण प्रमाणपत्र (Meldebescheinigung)'),
      L('Enrolment certificate for a student account', 'विद्यार्थी खाताका लागि भर्ना प्रमाणपत्र', 'छात्र खाते के लिए दाख़िला प्रमाणपत्र'),
      L('Tax ID (can usually be given later)', 'कर आईडी (प्रायः पछि दिन मिल्छ)', 'टैक्स आईडी (आमतौर पर बाद में दे सकते हैं)'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Every person living legally in the EU has the right to a basic account (Basiskonto). A bank may not refuse it just because you are new or have no credit history.',
          'EU मा कानुनी रूपमा बस्ने हरेक व्यक्तिलाई आधारभूत खाता (Basiskonto) पाउने अधिकार छ। नयाँ भएको वा क्रेडिट इतिहास नभएको कारणले मात्र बैंकले अस्वीकार गर्न पाउँदैन।',
          'EU में क़ानूनी रूप से रहने वाले हर व्यक्ति को बेसिक खाते (Basiskonto) का अधिकार है। सिर्फ़ नए होने या क्रेडिट इतिहास न होने पर बैंक मना नहीं कर सकता।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Check what happens after your student years: some free accounts start charging a monthly fee at 26 or 28.',
          'विद्यार्थी अवधिपछि के हुन्छ जाँच्नुहोस्: केही निःशुल्क खाताले २६ वा २८ वर्षपछि मासिक शुल्क लिन थाल्छन्।',
          'छात्र अवधि के बाद क्या होगा, जांचें: कुछ मुफ़्त खाते 26 या 28 की उम्र के बाद मासिक फ़ीस लेने लगते हैं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Compare bank accounts', 'बैंक खाताहरू तुलना गर्नुहोस्', 'बैंक खातों की तुलना करें'), href: '/tools/compare/bank-accounts' },
      { kind: 'guide', title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), href: '/guides/register-your-address' },
    ],
    sources: [S.sparkasseStudents, S.n26Plans, S.ingConditions, S.zkgBasicAccount],
    compareLink: { label: L('Compare banks', 'बैंकहरू तुलना गर्नुहोस्', 'बैंकों की तुलना करें'), href: '/tools/compare/bank-accounts' },
  },
  {
    slug: 'get-your-tax-id',
    title: L('Get your tax ID', 'आफ्नो कर आईडी लिनुहोस्', 'अपनी टैक्स आईडी पाएं'),
    term: { term: 'Steuerliche Identifikationsnummer' },
    stage: 'first30',
    readingMinutes: 3,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'An 11-digit number for life. Your employer needs it to pay you correctly; banks ask for it too.',
        'जीवनभरको ११ अङ्कको नम्बर। तपाईंलाई सही तलब दिन रोजगारदातालाई यो चाहिन्छ; बैंकले पनि माग्छ।',
        'जीवन भर के लिए 11 अंकों का नंबर। आपको सही वेतन देने के लिए नियोक्ता को यह चाहिए; बैंक भी मांगते हैं।',
      ),
      when: L('It comes automatically after you register your address.', 'ठेगाना दर्ता गरेपछि आफैं आउँछ।', 'पता पंजीकृत करने के बाद अपने आप आती है।'),
      deadline: L('Before your first job', 'पहिलो काम सुरु गर्नुअघि', 'पहली नौकरी से पहले'),
    },
    steps: [
      {
        title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'),
        body: L(
          'You don’t apply for the tax ID. The Federal Central Tax Office (BZSt) sends it by letter after your first registration in Germany.',
          'कर आईडीका लागि आवेदन दिनु पर्दैन। जर्मनीमा पहिलो पटक दर्ता भएपछि संघीय केन्द्रीय कर कार्यालय (BZSt) ले चिठीबाट पठाउँछ।',
          'टैक्स आईडी के लिए आवेदन नहीं करना होता। जर्मनी में पहली बार पंजीकरण के बाद संघीय केंद्रीय कर कार्यालय (BZSt) इसे पत्र से भेजता है।',
        ),
        wait: L('About 4 weeks', 'करिब ४ हप्ता', 'लगभग 4 हफ़्ते'),
      },
      {
        title: L('Put your name on the mailbox', 'पत्रपेटिकामा आफ्नो नाम राख्नुहोस्', 'लेटरबॉक्स पर अपना नाम लगाएं'),
        body: L(
          'Letters without your name on the mailbox often go back. In a shared flat, add your name next to the main tenant’s.',
          'पत्रपेटिकामा नाम नभए चिठी प्रायः फिर्ता जान्छ। साझा फ्ल्याटमा मुख्य भाडावालको नामछेउ आफ्नो नाम थप्नुहोस्।',
          'लेटरबॉक्स पर नाम न हो तो पत्र अक्सर वापस चले जाते हैं। साझा फ़्लैट में मुख्य किरायेदार के नाम के साथ अपना नाम जोड़ें।',
        ),
        term: { term: 'Briefkasten' },
      },
      {
        title: L('Nothing came? Request it again', 'केही आएन? फेरि माग्नुहोस्', 'कुछ नहीं आया? फिर से मांगें'),
        body: L(
          'Use the BZSt online form. For data protection, the number is only sent by post to your registered address — never by phone or email.',
          'BZSt को अनलाइन फारम प्रयोग गर्नुहोस्। तथ्याङ्क सुरक्षाका कारण नम्बर दर्ता भएको ठेगानामा हुलाकबाट मात्र पठाइन्छ — फोन वा इमेलबाट कहिल्यै होइन।',
          'BZSt का ऑनलाइन फ़ॉर्म इस्तेमाल करें। डेटा सुरक्षा के लिए नंबर केवल आपके पंजीकृत पते पर डाक से भेजा जाता है — फ़ोन या ईमेल से कभी नहीं।',
        ),
        cost: FREE,
        wait: L('About 4 weeks', 'करिब ४ हप्ता', 'लगभग 4 हफ़्ते'),
      },
    ],
    documents: [L('Registration certificate', 'दर्ता प्रमाणपत्र', 'पंजीकरण प्रमाणपत्र')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Need it urgently for a job? The Bürgerbüro where you registered can often tell you the number when you show your passport.',
          'कामका लागि तुरुन्तै चाहियो? दर्ता गरेको Bürgerbüro ले राहदानी देखाएपछि प्रायः नम्बर बताउन सक्छ।',
          'नौकरी के लिए तुरंत चाहिए? जिस Bürgerbüro में पंजीकरण किया था, वह पासपोर्ट दिखाने पर अक्सर नंबर बता सकता है।',
        ),
      },
      {
        kind: 'warning',
        text: L(
          'Without the tax ID your employer has to deduct more tax. Give it to them as soon as you have it.',
          'कर आईडी बिना रोजगारदाताले बढी कर काट्नुपर्छ। पाउनेबित्तिकै दिनुहोस्।',
          'टैक्स आईडी के बिना नियोक्ता को ज़्यादा टैक्स काटना पड़ता है। मिलते ही उन्हें दें।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Student jobs and work limits', 'विद्यार्थी काम र कामको सीमा', 'छात्र नौकरियां और काम की सीमा'), href: '/guides/student-jobs' },
      { kind: 'guide', title: L('File your tax return', 'कर विवरण बुझाउनुहोस्', 'टैक्स रिटर्न भरें'), href: '/guides/file-tax-return' },
    ],
    sources: [S.bzstIdNr, S.bzstFaq, S.bzstResend],
  },
  {
    slug: 'pay-the-broadcasting-fee',
    title: L('Pay the broadcasting fee', 'प्रसारण शुल्क तिर्नुहोस्', 'प्रसारण शुल्क भरें'),
    term: { term: 'Rundfunkbeitrag' },
    stage: 'first30',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A fee for public TV and radio. It is paid once per flat — not per person — whether or not you own a TV.',
        'सार्वजनिक टिभी र रेडियोको शुल्क। यो प्रति व्यक्ति होइन, प्रति फ्ल्याट एकपटक तिरिन्छ — टिभी भए पनि नभए पनि।',
        'सार्वजनिक टीवी और रेडियो का शुल्क। यह प्रति व्यक्ति नहीं, प्रति फ़्लैट एक बार भरा जाता है — टीवी हो या न हो।',
      ),
      when: L('From the month you move in.', 'सरेको महिनादेखि।', 'शिफ़्ट होने वाले महीने से।'),
      deadline: L('Register when you move in', 'सर्दा दर्ता गर्नुहोस्', 'शिफ़्ट होते समय पंजीकरण करें'),
    },
    steps: [
      {
        title: L('Check whether your flat already pays', 'फ्ल्याटले पहिले नै तिर्छ कि जाँच्नुहोस्', 'जांचें कि फ़्लैट पहले से भरता है या नहीं'),
        body: L(
          'In a shared flat, one person pays for everyone. Ask your flatmates for their contribution number and register with it, so you aren’t charged twice. In a dorm, your own room usually counts as a flat.',
          'साझा फ्ल्याटमा एकजनाले सबैका लागि तिर्छ। दोहोरो शुल्क नलागोस् भनेर साथीहरूसँग योगदान नम्बर लिएर त्यसैसँग दर्ता गर्नुहोस्। छात्रावासमा प्रायः आफ्नै कोठालाई फ्ल्याट मानिन्छ।',
          'साझा फ़्लैट में एक व्यक्ति सबके लिए भरता है। दोहरा शुल्क न लगे, इसलिए साथियों से उनका योगदान नंबर लेकर उसी से पंजीकरण करें। हॉस्टल में आमतौर पर आपका अपना कमरा फ़्लैट माना जाता है।',
        ),
        term: { term: 'Beitragsnummer' },
      },
      {
        title: L('Register online', 'अनलाइन दर्ता गर्नुहोस्', 'ऑनलाइन पंजीकरण करें'),
        body: L(
          'Register on rundfunkbeitrag.de. You get a contribution number by post.',
          'rundfunkbeitrag.de मा दर्ता गर्नुहोस्। योगदान नम्बर हुलाकबाट आउँछ।',
          'rundfunkbeitrag.de पर पंजीकरण करें। योगदान नंबर डाक से आता है।',
        ),
        cost: L('€18.36 a month per flat', 'प्रति फ्ल्याट महिनाको €१८.३६', 'प्रति फ़्लैट हर महीने €18.36'),
      },
      {
        title: L('Pay every three months', 'हरेक तीन महिनामा तिर्नुहोस्', 'हर तीन महीने में भरें'),
        body: L(
          'The fee is due quarterly (€55.08). A direct debit from your German account is easiest. In a shared flat, split the cost.',
          'शुल्क हरेक तीन महिनामा (€५५.०८) तिर्नुपर्छ। जर्मन खाताबाट स्वचालित कटौती सबैभन्दा सजिलो हो। साझा फ्ल्याटमा खर्च बाँड्नुहोस्।',
          'शुल्क हर तिमाही (€55.08) देना होता है। जर्मन खाते से ऑटो डेबिट सबसे आसान है। साझा फ़्लैट में ख़र्च बांटें।',
        ),
        term: { term: 'SEPA-Lastschrift' },
      },
    ],
    documents: [L('Your address and moving-in date', 'तपाईंको ठेगाना र सरेको मिति', 'आपका पता और शिफ़्ट होने की तारीख'), L('Flatmate’s contribution number, if they already pay', 'साथीले तिरिरहेको भए उसको योगदान नम्बर', 'अगर साथी भरता है तो उसका योगदान नंबर')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Students who receive BAföG and don’t live with their parents can apply for an exemption. It is not automatic — you must apply.',
          'BAföG पाउने र आमाबुबासँग नबस्ने विद्यार्थीले छुटका लागि आवेदन दिन सक्छन्। यो आफैं हुँदैन — आवेदन दिनुपर्छ।',
          'BAföG पाने वाले और माता-पिता के साथ न रहने वाले छात्र छूट के लिए आवेदन कर सकते हैं। यह अपने आप नहीं होता — आवेदन करना होता है।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Ignoring the letters doesn’t help: unpaid fees are collected with extra charges.',
          'चिठी बेवास्ता गर्नु काम लाग्दैन: नतिरेको शुल्क थप शुल्कसहित असुल गरिन्छ।',
          'पत्रों को अनदेखा करने से कुछ नहीं होता: बकाया शुल्क अतिरिक्त शुल्क के साथ वसूला जाता है।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Plan your monthly budget', 'मासिक बजेट योजना बनाउनुहोस्', 'मासिक बजट की योजना बनाएं'), href: '/tools/budget' },
      { kind: 'guide', title: L('Find a room in Leipzig', 'लाइपजिगमा कोठा खोज्नुहोस्', 'लाइपज़िग में कमरा खोजें'), href: '/guides/find-housing-leipzig' },
    ],
    sources: [S.rundfunkStudents, S.rundfunkPayment, S.rundfunkInfo],
  },
  {
    slug: 'choose-a-phone-plan',
    title: L('Choose a phone plan', 'फोन प्लान छान्नुहोस्', 'फ़ोन प्लान चुनें'),
    term: { term: 'Handyvertrag' },
    stage: 'first30',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A German number for calls, mobile data and the codes that banks and offices send by SMS.',
        'कल, मोबाइल डाटा र बैंक तथा कार्यालयले SMS बाट पठाउने कोडका लागि जर्मन नम्बर।',
        'कॉल, मोबाइल डेटा और बैंकों व दफ़्तरों के SMS कोड के लिए जर्मन नंबर।',
      ),
      when: L('In your first days.', 'सुरुका दिनमै।', 'शुरुआती दिनों में।'),
      deadline: L('No deadline', 'कुनै समयसीमा छैन', 'कोई समयसीमा नहीं'),
    },
    steps: [
      {
        title: L('Start with prepaid', 'प्रिपेडबाट सुरु गर्नुहोस्', 'प्रीपेड से शुरू करें'),
        body: L(
          'Prepaid has no contract and no credit check. You top up and can stop any time. It is the easiest start.',
          'प्रिपेडमा सम्झौता र क्रेडिट जाँच हुँदैन। रिचार्ज गर्नुहुन्छ र जुनसुकै बेला बन्द गर्न सक्नुहुन्छ। सुरुका लागि सबैभन्दा सजिलो।',
          'प्रीपेड में कोई अनुबंध और क्रेडिट जांच नहीं होती। आप रिचार्ज करते हैं और कभी भी बंद कर सकते हैं। शुरुआत के लिए सबसे आसान।',
        ),
        term: { term: 'Prepaid' },
      },
      {
        title: L('Verify your identity', 'आफ्नो पहिचान पुष्टि गर्नुहोस्', 'अपनी पहचान सत्यापित करें'),
        body: L(
          'By law, every SIM card must be registered with a valid ID. You activate it in a shop or online by video call, with your passport.',
          'कानुनअनुसार हरेक SIM कार्ड वैध परिचयपत्रसहित दर्ता हुनुपर्छ। पसलमा वा अनलाइन भिडियो कलमार्फत राहदानी देखाएर सक्रिय गर्नुहुन्छ।',
          'क़ानून के अनुसार हर SIM कार्ड वैध पहचान-पत्र से पंजीकृत होना चाहिए। आप दुकान में या ऑनलाइन वीडियो कॉल से पासपोर्ट दिखाकर इसे सक्रिय करते हैं।',
        ),
        term: { term: 'Video-Ident' },
      },
      {
        title: L('Thinking of a contract? Read the term', 'सम्झौता सोच्दै हुनुहुन्छ? अवधि पढ्नुहोस्', 'अनुबंध सोच रहे हैं? अवधि पढ़ें'),
        body: L(
          'Contracts can run for up to 24 months; providers must also offer a 12-month option. After the minimum term you can cancel with one month’s notice.',
          'सम्झौता बढीमा २४ महिनासम्म हुन सक्छ; प्रदायकले १२ महिनाको विकल्प पनि दिनैपर्छ। न्यूनतम अवधिपछि एक महिनाको सूचना दिएर रद्द गर्न सकिन्छ।',
          'अनुबंध ज़्यादा से ज़्यादा 24 महीने का हो सकता है; प्रदाता को 12 महीने का विकल्प भी देना होता है। न्यूनतम अवधि के बाद एक महीने के नोटिस पर रद्द कर सकते हैं।',
        ),
        term: { term: 'Mindestvertragslaufzeit' },
      },
    ],
    documents: [L('Passport', 'राहदानी', 'पासपोर्ट'), L('German address', 'जर्मन ठेगाना', 'जर्मन पता'), L('German bank account (for contracts)', 'जर्मन बैंक खाता (सम्झौताका लागि)', 'जर्मन बैंक खाता (अनुबंध के लिए)')],
    callouts: [
      {
        kind: 'mistake',
        text: L(
          'Don’t sign a 24-month contract in your first week. Prepaid lets you test the network in your area first.',
          'पहिलो हप्तामै २४ महिनाको सम्झौतामा हस्ताक्षर नगर्नुहोस्। प्रिपेडले पहिले आफ्नो क्षेत्रमा नेटवर्क जाँच्न दिन्छ।',
          'पहले हफ़्ते में ही 24 महीने के अनुबंध पर हस्ताक्षर न करें। प्रीपेड से पहले अपने इलाक़े में नेटवर्क जांच सकते हैं।',
        ),
      },
      {
        kind: 'warning',
        text: L(
          'Avoid SIM cards that are already activated in someone else’s name. The card stays linked to that person’s ID, and you have no rights under the contract.',
          'अरूकै नाममा पहिले नै सक्रिय गरिएको SIM कार्ड नलिनुहोस्। कार्ड त्यही व्यक्तिको परिचयपत्रसँग जोडिएको रहन्छ, र सम्झौतामा तपाईंको कुनै अधिकार हुँदैन।',
          'किसी और के नाम पर पहले से सक्रिय SIM कार्ड न लें। कार्ड उसी व्यक्ति की पहचान से जुड़ा रहता है, और अनुबंध में आपका कोई अधिकार नहीं होता।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Open a bank account', 'बैंक खाता खोल्नुहोस्', 'बैंक खाता खोलें'), href: '/guides/open-a-bank-account' },
      { kind: 'tool', title: L('Plan your monthly budget', 'मासिक बजेट योजना बनाउनुहोस्', 'मासिक बजट की योजना बनाएं'), href: '/tools/budget' },
    ],
    sources: [S.bnetzaContract, S.bnetzaPrepaid, S.vzPrepaid],
  },
  {
    slug: 'monthly-transit-pass',
    title: L('Get a monthly transit pass', 'मासिक यातायात पास लिनुहोस्', 'मासिक परिवहन पास लें'),
    term: { term: 'Deutschlandticket' },
    stage: 'first30',
    readingMinutes: 3,
    lastVerified: CHECKED,
    updatedRecently: true,
    summary: {
      what: L(
        'One monthly ticket for buses, trams, U-/S-Bahn and regional trains across Germany. Not valid on ICE/IC long-distance trains.',
        'जर्मनीभरका बस, ट्राम, U-/S-Bahn र क्षेत्रीय रेलका लागि एउटै मासिक टिकट। ICE/IC लामो दूरीका रेलमा मान्य छैन।',
        'पूरे जर्मनी में बस, ट्राम, U-/S-Bahn और क्षेत्रीय ट्रेनों के लिए एक मासिक टिकट। ICE/IC लंबी दूरी की ट्रेनों में मान्य नहीं।',
      ),
      when: L('From your first month — unless your semester ticket already covers you.', 'पहिलो महिनादेखि — सेमेस्टर टिकटले पहिले नै कभर गर्दैन भने।', 'पहले महीने से — अगर सेमेस्टर टिकट पहले से कवर नहीं करता।'),
      deadline: L('Cancel by the 10th for the end of the month', 'महिनाको अन्त्यका लागि १० तारिखसम्म रद्द गर्नुहोस्', 'महीने के अंत के लिए 10 तारीख तक रद्द करें'),
    },
    steps: [
      {
        title: L('Students: use your semester ticket', 'विद्यार्थी: सेमेस्टर टिकट प्रयोग गर्नुहोस्', 'छात्र: सेमेस्टर टिकट इस्तेमाल करें'),
        body: L(
          'At Leipzig University the Deutschland-Semesterticket is part of your semester fee. Activate it in LeipzigMOVE — don’t buy a second ticket.',
          'लाइपजिग विश्वविद्यालयमा Deutschland-Semesterticket सेमेस्टर शुल्कमै समावेश छ। LeipzigMOVE मा सक्रिय गर्नुहोस् — अर्को टिकट नकिन्नुहोस्।',
          'लाइपज़िग विश्वविद्यालय में Deutschland-Semesterticket सेमेस्टर फ़ीस में शामिल है। इसे LeipzigMOVE में सक्रिय करें — दूसरा टिकट न ख़रीदें।',
        ),
      },
      {
        title: L('Everyone else: subscribe', 'अरू सबै: सदस्यता लिनुहोस्', 'बाक़ी सब: सदस्यता लें'),
        body: L(
          'The Deutschlandticket is a monthly subscription. In Leipzig you can buy it from the local transport companies in the MDV area, or from Deutsche Bahn.',
          'Deutschlandticket मासिक सदस्यता हो। लाइपजिगमा MDV क्षेत्रका स्थानीय यातायात कम्पनी वा Deutsche Bahn बाट किन्न सकिन्छ।',
          'Deutschlandticket एक मासिक सदस्यता है। लाइपज़िग में आप इसे MDV क्षेत्र की स्थानीय परिवहन कंपनियों या Deutsche Bahn से ख़रीद सकते हैं।',
        ),
        cost: L('€63 a month · €66.80 from January 2027', 'महिनाको €६३ · जनवरी २०२७ देखि €६६.८०', 'हर महीने €63 · जनवरी 2027 से €66.80'),
      },
      {
        title: L('Cancel in time', 'समयमै रद्द गर्नुहोस्', 'समय पर रद्द करें'),
        body: L(
          'You can cancel monthly. Cancel by the 10th to stop at the end of that month.',
          'मासिक रूपमा रद्द गर्न सकिन्छ। त्यही महिनाको अन्त्यमा रोक्न १० तारिखसम्म रद्द गर्नुहोस्।',
          'आप हर महीने रद्द कर सकते हैं। उसी महीने के अंत में बंद करने के लिए 10 तारीख तक रद्द करें।',
        ),
      },
    ],
    documents: [L('German bank account for the direct debit', 'स्वचालित कटौतीका लागि जर्मन बैंक खाता', 'ऑटो डेबिट के लिए जर्मन बैंक खाता')],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'The price rises to €66.80 on 1 January 2027. Your ticket provider will tell you how the change works for your subscription.',
          '१ जनवरी २०२७ देखि मूल्य €६६.८० हुन्छ। तपाईंको सदस्यतामा परिवर्तन कसरी हुन्छ, टिकट प्रदायकले जानकारी दिन्छ।',
          '1 जनवरी 2027 से कीमत €66.80 हो जाएगी। आपकी सदस्यता में बदलाव कैसे होगा, टिकट प्रदाता बताएगा।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Enrol at university', 'विश्वविद्यालयमा भर्ना हुनुहोस्', 'विश्वविद्यालय में दाख़िला लें'), href: '/guides/enrol-at-university' },
      { kind: 'tool', title: L('Plan your monthly budget', 'मासिक बजेट योजना बनाउनुहोस्', 'मासिक बजट की योजना बनाएं'), href: '/tools/budget' },
    ],
    sources: [S.bundesregDticket, S.bahnDticket, S.mdvDticket, S.swTicketPrice2026],
  },
];
