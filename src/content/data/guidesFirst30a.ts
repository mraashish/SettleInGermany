import type { Guide } from '../types';
import { CHECKED, FREE, L, NOT_ADVICE, S } from './util';

const PASSPORT = L('Passport with visa', 'भिसासहितको राहदानी', 'वीज़ा सहित पासपोर्ट');

export const guidesFirst30a: Guide[] = [
  {
    slug: 'register-your-address',
    title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'),
    term: { term: 'Anmeldung' },
    stage: 'first30',
    city: 'leipzig',
    readingMinutes: 6,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Telling the city where you live. You get a registration certificate that the bank, the foreigners’ office and many others ask for.',
        'तपाईं कहाँ बस्नुहुन्छ भनेर सहरलाई जानकारी दिनु। तपाईंले दर्ता प्रमाणपत्र पाउनुहुन्छ, जुन बैंक, विदेशी कार्यालय र अरू धेरैले माग्छन्।',
        'शहर को बताना कि आप कहाँ रहते हैं। आपको पंजीकरण प्रमाणपत्र मिलता है, जिसे बैंक, विदेशी कार्यालय और कई दूसरे मांगते हैं।',
      ),
      when: L('Every time you move into a new flat in Germany.', 'जर्मनीमा हरेक पटक नयाँ फ्ल्याटमा सर्दा।', 'जर्मनी में हर बार नए फ़्लैट में जाने पर।'),
      deadline: L('Within 2 weeks of moving in', 'सरेको २ हप्ताभित्र', 'शिफ़्ट होने के 2 हफ़्ते के अंदर'),
    },
    steps: [
      {
        title: L('Get the landlord’s confirmation', 'घरधनीको पुष्टि-पत्र लिनुहोस्', 'मकान मालिक का पुष्टि-पत्र लें'),
        body: L(
          'Your landlord (or the Studentenwerk for a dorm) confirms in writing that you moved in. Your rental contract is not enough. You can use the city’s form. If you don’t have it yet, you can register anyway and hand it in later.',
          'तपाईंको घरधनी (छात्रावास भए Studentenwerk) ले तपाईं सर्नुभएको लिखित पुष्टि दिन्छ। भाडा सम्झौता मात्र पुग्दैन। सहरको फारम प्रयोग गर्न सकिन्छ। अहिलेसम्म छैन भने पनि दर्ता गर्न सक्नुहुन्छ र पछि बुझाउन सक्नुहुन्छ।',
          'आपका मकान मालिक (हॉस्टल हो तो Studentenwerk) लिखित में पुष्टि करता है कि आप रहने आए हैं। किराया अनुबंध काफ़ी नहीं है। आप शहर का फ़ॉर्म इस्तेमाल कर सकते हैं। अभी नहीं है तो भी पंजीकरण कर सकते हैं और बाद में जमा कर सकते हैं।',
        ),
        term: { term: 'Wohnungsgeberbestätigung' },
      },
      {
        title: L('Book an appointment at a Bürgerbüro', 'Bürgerbüro मा अपोइन्टमेन्ट बुक गर्नुहोस्', 'Bürgerbüro में अपॉइंटमेंट बुक करें'),
        body: L(
          'Book on the city’s appointment website or call 115. Any Bürgerbüro in Leipzig can register you. New slots are released every day at 8:00 — at Otto-Schill-Straße also at 12:00.',
          'सहरको अपोइन्टमेन्ट वेबसाइटमा बुक गर्नुहोस् वा ११५ मा फोन गर्नुहोस्। लाइपजिगको जुनसुकै Bürgerbüro ले दर्ता गर्न सक्छ। नयाँ समय हरेक दिन बिहान ८:०० बजे खुल्छ — Otto-Schill-Straße मा दिउँसो १२:०० बजे पनि।',
          'शहर की अपॉइंटमेंट वेबसाइट पर बुक करें या 115 पर कॉल करें। लाइपज़िग का कोई भी Bürgerbüro पंजीकरण कर सकता है। नए स्लॉट हर दिन सुबह 8:00 बजे खुलते हैं — Otto-Schill-Straße में दोपहर 12:00 बजे भी।',
        ),
        where: L('Any Bürgerbüro, e.g. Otto-Schill-Straße 2, 04109 Leipzig', 'जुनसुकै Bürgerbüro, जस्तै Otto-Schill-Straße 2, 04109 Leipzig', 'कोई भी Bürgerbüro, जैसे Otto-Schill-Straße 2, 04109 Leipzig'),
        cost: FREE,
      },
      {
        title: L('Fill in the registration form', 'दर्ता फारम भर्नुहोस्', 'पंजीकरण फ़ॉर्म भरें'),
        body: L(
          'Fill in the registration form before the appointment — it saves time. Each adult registers; you can register family members who move in with you at the same time.',
          'अपोइन्टमेन्टअघि दर्ता फारम भर्नुहोस् — समय बच्छ। हरेक वयस्कले दर्ता गर्छ; सँगै सर्ने परिवारका सदस्यलाई एकैपटक दर्ता गर्न सकिन्छ।',
          'अपॉइंटमेंट से पहले पंजीकरण फ़ॉर्म भर लें — समय बचता है। हर वयस्क पंजीकरण करता है; साथ में आने वाले परिवार के सदस्यों का एक साथ पंजीकरण हो सकता है।',
        ),
        term: { term: 'Meldeformular' },
      },
      {
        title: L('Go to the appointment', 'अपोइन्टमेन्टमा जानुहोस्', 'अपॉइंटमेंट पर जाएं'),
        body: L(
          'Bring your original passport. You leave with the registration certificate. Keep it safe and make copies.',
          'सक्कली राहदानी लैजानुहोस्। तपाईं दर्ता प्रमाणपत्र लिएर निस्कनुहुन्छ। सुरक्षित राख्नुहोस् र प्रतिलिपि बनाउनुहोस्।',
          'असली पासपोर्ट साथ ले जाएं। आप पंजीकरण प्रमाणपत्र लेकर निकलते हैं। इसे संभालकर रखें और कॉपी बनाएं।',
        ),
        term: { term: 'Meldebescheinigung' },
        wait: L('Usually done in one visit', 'प्रायः एकै भेटमा सकिन्छ', 'आमतौर पर एक ही बार में हो जाता है'),
      },
    ],
    documents: [
      PASSPORT,
      L('Landlord’s confirmation (Wohnungsgeberbestätigung)', 'घरधनीको पुष्टि-पत्र (Wohnungsgeberbestätigung)', 'मकान मालिक का पुष्टि-पत्र (Wohnungsgeberbestätigung)'),
      L('Registration form, filled in', 'भरिएको दर्ता फारम', 'भरा हुआ पंजीकरण फ़ॉर्म'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'No free slot? Check the booking page right at 8:00 in the morning, when new slots are released.',
          'खाली समय छैन? बिहान ठीक ८:०० बजे बुकिङ पेज हेर्नुहोस्, त्यही बेला नयाँ समय खुल्छ।',
          'कोई स्लॉट खाली नहीं? सुबह ठीक 8:00 बजे बुकिंग पेज देखें, तभी नए स्लॉट खुलते हैं।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Waiting for a slot doesn’t pause the 2 weeks. Book on day one, even if the appointment is later.',
          'समय पर्खँदा २ हप्ताको अवधि रोकिँदैन। अपोइन्टमेन्ट पछि भए पनि पहिलो दिनमै बुक गर्नुहोस्।',
          'स्लॉट का इंतज़ार 2 हफ़्ते की अवधि को नहीं रोकता। अपॉइंटमेंट बाद का हो तब भी पहले दिन ही बुक करें।',
        ),
      },
      {
        kind: 'warning',
        text: L(
          'Moving again? Register the new address within 2 weeks too. When you leave Germany, deregister.',
          'फेरि सर्दै हुनुहुन्छ? नयाँ ठेगाना पनि २ हप्ताभित्र दर्ता गर्नुहोस्। जर्मनी छोड्दा दर्ता खारेज गर्नुहोस्।',
          'फिर से शिफ़्ट हो रहे हैं? नया पता भी 2 हफ़्ते के अंदर पंजीकृत करें। जर्मनी छोड़ते समय पंजीकरण रद्द करें।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Open a bank account', 'बैंक खाता खोल्नुहोस्', 'बैंक खाता खोलें'), href: '/guides/open-a-bank-account' },
      { kind: 'guide', title: L('Get your tax ID', 'आफ्नो कर आईडी लिनुहोस्', 'अपनी टैक्स आईडी पाएं'), href: '/guides/get-your-tax-id' },
    ],
    sources: [S.leipzigRegister, S.leipzigRegisterEn, S.leipzigLandlordForm, S.leipzigOttoSchill, S.leipzigBooking, S.bmgRegister],
  },
  {
    slug: 'enrol-at-university',
    title: L('Enrol at university', 'विश्वविद्यालयमा भर्ना हुनुहोस्', 'विश्वविद्यालय में दाख़िला लें'),
    term: { term: 'Immatrikulation' },
    stage: 'first30',
    city: 'leipzig',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Becoming a registered student. You need the enrolment certificate for your residence permit, your health insurance and your semester ticket.',
        'दर्ता भएको विद्यार्थी बन्नु। आवास अनुमतिपत्र, स्वास्थ्य बीमा र सेमेस्टर टिकटका लागि भर्ना प्रमाणपत्र चाहिन्छ।',
        'पंजीकृत छात्र बनना। निवास परमिट, स्वास्थ्य बीमा और सेमेस्टर टिकट के लिए दाख़िला प्रमाणपत्र चाहिए।',
      ),
      when: L('After you accept your admission — by the date in your admission letter.', 'भर्ना स्वीकार गरेपछि — भर्ना पत्रमा लेखिएको मितिसम्म।', 'प्रवेश स्वीकार करने के बाद — प्रवेश पत्र में लिखी तारीख तक।'),
      deadline: L('Date in your admission letter', 'भर्ना पत्रमा लेखिएको मिति', 'प्रवेश पत्र में लिखी तारीख'),
    },
    steps: [
      {
        title: L('Get your health insurance reported', 'स्वास्थ्य बीमाको सूचना पठाउन लगाउनुहोस्', 'स्वास्थ्य बीमा की सूचना भिजवाएं'),
        body: L(
          'Your German health insurance fund reports your insurance to the university electronically. Ask your fund to send the report to Leipzig University.',
          'तपाईंको जर्मन स्वास्थ्य बीमा कोषले विश्वविद्यालयलाई इलेक्ट्रोनिक रूपमा बीमाको सूचना पठाउँछ। लाइपजिग विश्वविद्यालयमा सूचना पठाउन आफ्नो कोषलाई भन्नुहोस्।',
          'आपका जर्मन स्वास्थ्य बीमा कोष विश्वविद्यालय को इलेक्ट्रॉनिक रूप से बीमा की सूचना भेजता है। अपने कोष से लाइपज़िग विश्वविद्यालय को सूचना भेजने को कहें।',
        ),
      },
      {
        title: L('Pay the semester fee', 'सेमेस्टर शुल्क तिर्नुहोस्', 'सेमेस्टर फ़ीस भरें'),
        body: L(
          'At Leipzig University the fee is €332.30 for the winter semester 2026/27. It includes the Deutschland-Semesterticket (€226.80) and the Studentenwerk fee. There is no tuition fee for most programmes.',
          'लाइपजिग विश्वविद्यालयमा २०२६/२७ जाडो सेमेस्टरका लागि शुल्क €३३२.३० छ। यसमा Deutschland-Semesterticket (€२२६.८०) र Studentenwerk शुल्क समावेश छ। धेरैजसो कार्यक्रममा ट्युसन शुल्क छैन।',
          'लाइपज़िग विश्वविद्यालय में शीतकालीन सेमेस्टर 2026/27 की फ़ीस €332.30 है। इसमें Deutschland-Semesterticket (€226.80) और Studentenwerk फ़ीस शामिल है। ज़्यादातर कोर्स में ट्यूशन फ़ीस नहीं है।',
        ),
        term: { term: 'Semesterbeitrag' },
        cost: L('€332.30 per semester', 'प्रति सेमेस्टर €३३२.३०', 'प्रति सेमेस्टर €332.30'),
      },
      {
        title: L('Complete enrolment', 'भर्ना पूरा गर्नुहोस्', 'दाख़िला पूरा करें'),
        body: L(
          'Follow the steps in your admission letter and the university portal. You then download your enrolment certificate and get your student card.',
          'भर्ना पत्र र विश्वविद्यालय पोर्टलमा दिइएका चरण पालना गर्नुहोस्। त्यसपछि भर्ना प्रमाणपत्र डाउनलोड गर्नुहुन्छ र विद्यार्थी कार्ड पाउनुहुन्छ।',
          'प्रवेश पत्र और विश्वविद्यालय पोर्टल में दिए चरणों का पालन करें। फिर आप दाख़िला प्रमाणपत्र डाउनलोड करते हैं और छात्र कार्ड पाते हैं।',
        ),
        term: { term: 'Immatrikulationsbescheinigung' },
      },
      {
        title: L('Activate your semester ticket', 'सेमेस्टर टिकट सक्रिय गर्नुहोस्', 'सेमेस्टर टिकट सक्रिय करें'),
        body: L(
          'Activate the Deutschland-Semesterticket in the LeipzigMOVE app each semester. It is valid on local and regional transport across Germany.',
          'हरेक सेमेस्टर LeipzigMOVE एपमा Deutschland-Semesterticket सक्रिय गर्नुहोस्। यो जर्मनीभरका स्थानीय र क्षेत्रीय यातायातमा चल्छ।',
          'हर सेमेस्टर LeipzigMOVE ऐप में Deutschland-Semesterticket सक्रिय करें। यह पूरे जर्मनी में स्थानीय और क्षेत्रीय परिवहन में मान्य है।',
        ),
      },
      {
        title: L('Re-register every semester', 'हरेक सेमेस्टर पुनः दर्ता गर्नुहोस्', 'हर सेमेस्टर फिर से पंजीकरण करें'),
        body: L(
          'You stay enrolled by paying the next semester fee in the re-registration period. If you miss it, you can be removed from the university.',
          'पुनः दर्ता अवधिमा अर्को सेमेस्टरको शुल्क तिरेर भर्ना कायम रहन्छ। छुटाउनुभयो भने विश्वविद्यालयबाट हटाइन सक्नुहुन्छ।',
          'दोबारा पंजीकरण की अवधि में अगले सेमेस्टर की फ़ीस भरकर आपका दाख़िला बना रहता है। चूक गए तो विश्वविद्यालय से नाम कट सकता है।',
        ),
        term: { term: 'Rückmeldung' },
      },
    ],
    documents: [
      L('Admission letter', 'भर्ना पत्र', 'प्रवेश पत्र'),
      PASSPORT,
      L('Health insurance (reported electronically)', 'स्वास्थ्य बीमा (इलेक्ट्रोनिक सूचना)', 'स्वास्थ्य बीमा (इलेक्ट्रॉनिक सूचना)'),
      L('Proof of paying the semester fee', 'सेमेस्टर शुल्क तिरेको प्रमाण', 'सेमेस्टर फ़ीस भरने का सबूत'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Not at Leipzig University? Other universities in Leipzig (e.g. HTWK) have their own fees and steps — check your admission letter.',
          'लाइपजिग विश्वविद्यालयमा हुनुहुन्न? लाइपजिगका अन्य विश्वविद्यालय (जस्तै HTWK) को आफ्नै शुल्क र प्रक्रिया छ — भर्ना पत्र हेर्नुहोस्।',
          'लाइपज़िग विश्वविद्यालय में नहीं हैं? लाइपज़िग के दूसरे विश्वविद्यालयों (जैसे HTWK) की अपनी फ़ीस और प्रक्रिया है — प्रवेश पत्र देखें।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Activate your health insurance', 'स्वास्थ्य बीमा सक्रिय गर्नुहोस्', 'स्वास्थ्य बीमा सक्रिय करें'), href: '/guides/activate-health-insurance' },
      { kind: 'guide', title: L('Book your residence-permit appointment', 'आवास अनुमतिपत्रको अपोइन्टमेन्ट बुक गर्नुहोस्', 'निवास परमिट की अपॉइंटमेंट बुक करें'), href: '/guides/book-residence-permit-appointment' },
    ],
    sources: [S.uniSemesterFee, S.uniFeeOverview, S.uniStart, S.uniHealth, S.swTicketPrice2026],
  },
  {
    slug: 'book-residence-permit-appointment',
    title: L('Apply for your residence permit', 'आवास अनुमतिपत्रका लागि आवेदन दिनुहोस्', 'निवास परमिट के लिए आवेदन करें'),
    term: { term: 'Aufenthaltserlaubnis' },
    stage: 'first30',
    city: 'leipzig',
    readingMinutes: 7,
    lastVerified: CHECKED,
    updatedRecently: true,
    summary: {
      what: L(
        'Your visa is only for the start. In Leipzig you apply online to the foreigners’ office for a residence permit for your studies.',
        'तपाईंको भिसा सुरुका लागि मात्र हो। लाइपजिगमा पढाइका लागि आवास अनुमतिपत्र विदेशी कार्यालयमा अनलाइन आवेदन दिनुहुन्छ।',
        'आपका वीज़ा केवल शुरुआत के लिए है। लाइपज़िग में पढ़ाई के निवास परमिट के लिए आप विदेशी कार्यालय में ऑनलाइन आवेदन करते हैं।',
      ),
      when: L(
        'As soon as you are registered and enrolled — at the latest before your visa ends.',
        'ठेगाना दर्ता र भर्ना भएपछि तुरुन्तै — बढीमा भिसाको म्याद सकिनुअघि।',
        'पता पंजीकरण और दाख़िले के तुरंत बाद — ज़्यादा से ज़्यादा वीज़ा ख़त्म होने से पहले।',
      ),
      deadline: L('Before your visa ends', 'भिसाको म्याद सकिनुअघि', 'वीज़ा ख़त्म होने से पहले'),
    },
    steps: [
      {
        title: L('Collect your documents as PDFs', 'कागजातहरू PDF मा तयार गर्नुहोस्', 'दस्तावेज़ PDF में तैयार करें'),
        body: L(
          'You upload everything in the online application. Scan each document clearly — you also need the signed “Belehrung” form from the city’s website.',
          'तपाईं अनलाइन आवेदनमा सबै अपलोड गर्नुहुन्छ। हरेक कागजात स्पष्ट स्क्यान गर्नुहोस् — सहरको वेबसाइटबाट हस्ताक्षर गरिएको “Belehrung” फारम पनि चाहिन्छ।',
          'आप ऑनलाइन आवेदन में सब कुछ अपलोड करते हैं। हर दस्तावेज़ साफ़ स्कैन करें — शहर की वेबसाइट से हस्ताक्षरित “Belehrung” फ़ॉर्म भी चाहिए।',
        ),
      },
      {
        title: L('Apply online', 'अनलाइन आवेदन दिनुहोस्', 'ऑनलाइन आवेदन करें'),
        body: L(
          'Leipzig handles residence permits for studies fully online. You don’t book an appointment first — you send the online application.',
          'लाइपजिगले पढाइका लागि आवास अनुमतिपत्र पूर्ण रूपमा अनलाइन प्रक्रिया गर्छ। पहिले अपोइन्टमेन्ट बुक गर्नु पर्दैन — अनलाइन आवेदन पठाउनुहुन्छ।',
          'लाइपज़िग पढ़ाई के निवास परमिट की प्रक्रिया पूरी तरह ऑनलाइन करता है। पहले अपॉइंटमेंट बुक नहीं करना होता — आप ऑनलाइन आवेदन भेजते हैं।',
        ),
        where: L('Ausländerbehörde Leipzig, Technisches Rathaus, Prager Straße 126–128, 04317 Leipzig', 'Ausländerbehörde Leipzig, Technisches Rathaus, Prager Straße 126–128, 04317 Leipzig', 'Ausländerbehörde Leipzig, Technisches Rathaus, Prager Straße 126–128, 04317 Leipzig'),
      },
      {
        title: L('Wait for the email invitation', 'इमेल निमन्त्रणा पर्खनुहोस्', 'ईमेल निमंत्रण का इंतज़ार करें'),
        body: L(
          'When your application is checked, the office invites you by email to give your fingerprints and photo. Until the permit is ready you can get a certificate that lets you stay (Fiktionsbescheinigung).',
          'आवेदन जाँचेपछि कार्यालयले औंठाछाप र फोटोका लागि इमेलबाट बोलाउँछ। अनुमतिपत्र तयार नहुँदासम्म बस्न दिने प्रमाणपत्र (Fiktionsbescheinigung) पाउन सक्नुहुन्छ।',
          'आवेदन जांचने के बाद कार्यालय उंगलियों के निशान और फ़ोटो के लिए ईमेल से बुलाता है। परमिट तैयार होने तक आपको रहने की अनुमति देने वाला प्रमाणपत्र (Fiktionsbescheinigung) मिल सकता है।',
        ),
        term: { term: 'Fiktionsbescheinigung' },
        wait: L('About 4–6 weeks until the invitation', 'निमन्त्रणासम्म करिब ४–६ हप्ता', 'निमंत्रण तक लगभग 4–6 हफ़्ते'),
      },
      {
        title: L('Pay and collect your card', 'शुल्क तिर्नुहोस् र कार्ड लिनुहोस्', 'फ़ीस भरें और कार्ड लें'),
        body: L(
          'The permit is an electronic card (eAT). It is produced in Berlin and takes a few more weeks. You collect it in person.',
          'अनुमतिपत्र इलेक्ट्रोनिक कार्ड (eAT) हो। यो बर्लिनमा बनाइन्छ र थप केही हप्ता लाग्छ। तपाईं आफैं गएर लिनुहुन्छ।',
          'परमिट एक इलेक्ट्रॉनिक कार्ड (eAT) है। यह बर्लिन में बनता है और कुछ और हफ़्ते लगते हैं। आप इसे ख़ुद जाकर लेते हैं।',
        ),
        term: { term: 'elektronischer Aufenthaltstitel' },
        cost: L('€100 (waived with a public scholarship)', '€१०० (सरकारी छात्रवृत्ति भए छुट)', '€100 (सरकारी छात्रवृत्ति पर माफ़)'),
      },
    ],
    documents: [
      L('Passport and visa (copy)', 'राहदानी र भिसा (प्रतिलिपि)', 'पासपोर्ट और वीज़ा (कॉपी)'),
      L('Rental contract', 'भाडा सम्झौता', 'किराया अनुबंध'),
      L('Proof of health insurance', 'स्वास्थ्य बीमाको प्रमाण', 'स्वास्थ्य बीमा का सबूत'),
      L('Enrolment certificate', 'भर्ना प्रमाणपत्र', 'दाख़िला प्रमाणपत्र'),
      L('Proof of money: €992 a month (e.g. blocked account)', 'पैसाको प्रमाण: महिनामा €९९२ (जस्तै ब्लक्ड खाता)', 'पैसे का सबूत: हर महीने €992 (जैसे ब्लॉक्ड अकाउंट)'),
      L('Signed “Belehrung” form', 'हस्ताक्षर गरिएको “Belehrung” फारम', 'हस्ताक्षरित “Belehrung” फ़ॉर्म'),
    ],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'Apply before your visa ends. If you apply in time, you may stay while the office decides.',
          'भिसाको म्याद सकिनुअघि आवेदन दिनुहोस्। समयमै आवेदन दिनुभयो भने कार्यालयले निर्णय नगरुन्जेल बस्न पाउनुहुन्छ।',
          'वीज़ा ख़त्म होने से पहले आवेदन करें। समय पर आवेदन करने पर कार्यालय के फ़ैसले तक आप रह सकते हैं।',
        ),
      },
      {
        kind: 'tip',
        text: L(
          'Questions? The foreigners’ office phone is 0341 123-3310. The Welcome Centre at Otto-Schill-Straße 2 also helps for free.',
          'प्रश्न छन्? विदेशी कार्यालयको फोन ०३४१ १२३-३३१० हो। Otto-Schill-Straße 2 को Welcome Centre ले पनि निःशुल्क सहयोग गर्छ।',
          'सवाल हैं? विदेशी कार्यालय का फ़ोन 0341 123-3310 है। Otto-Schill-Straße 2 का Welcome Centre भी मुफ़्त मदद करता है।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), href: '/guides/register-your-address' },
      { kind: 'guide', title: L('Extend your residence permit', 'आवास अनुमतिपत्र नवीकरण गर्नुहोस्', 'निवास परमिट बढ़वाएं'), href: '/guides/extend-your-residence-permit' },
    ],
    sources: [S.leipzigPermitStudy, S.leipzigPermitStudyEn, S.leipzigOnlineStudy, S.leipzigForeignersAuthority],
  },
  {
    slug: 'activate-health-insurance',
    title: L('Activate your health insurance', 'स्वास्थ्य बीमा सक्रिय गर्नुहोस्', 'स्वास्थ्य बीमा सक्रिय करें'),
    term: { term: 'Gesundheitskarte' },
    stage: 'first30',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Finishing your membership with the German health insurance fund, so you get your health card and can see a doctor.',
        'जर्मन स्वास्थ्य बीमा कोषमा सदस्यता पूरा गर्नु, ताकि स्वास्थ्य कार्ड पाउनुहोस् र डाक्टरकहाँ जान सक्नुहोस्।',
        'जर्मन स्वास्थ्य बीमा कोष में सदस्यता पूरी करना, ताकि आपको हेल्थ कार्ड मिले और आप डॉक्टर के पास जा सकें।',
      ),
      when: L('In your first days, before enrolment.', 'सुरुका दिनमै, भर्ना हुनुअघि।', 'शुरुआती दिनों में, दाख़िले से पहले।'),
      deadline: L('Before enrolment', 'भर्ना हुनुअघि', 'दाख़िले से पहले'),
    },
    steps: [
      {
        title: L('Send your German address and enrolment details', 'जर्मन ठेगाना र भर्ना विवरण पठाउनुहोस्', 'जर्मन पता और दाख़िले का विवरण भेजें'),
        body: L(
          'Give your fund your new address, your university and your bank account for the monthly payment.',
          'कोषलाई नयाँ ठेगाना, विश्वविद्यालय र मासिक भुक्तानीका लागि बैंक खाता दिनुहोस्।',
          'कोष को अपना नया पता, विश्वविद्यालय और मासिक भुगतान के लिए बैंक खाता दें।',
        ),
      },
      {
        title: L('Upload a photo for your health card', 'स्वास्थ्य कार्डका लागि फोटो अपलोड गर्नुहोस्', 'हेल्थ कार्ड के लिए फ़ोटो अपलोड करें'),
        body: L(
          'The card arrives by post. Show it at every doctor’s visit. Until it arrives, ask your fund for a confirmation you can show.',
          'कार्ड हुलाकबाट आउँछ। हरेक पटक डाक्टरकहाँ देखाउनुहोस्। कार्ड नआउँदासम्म देखाउन मिल्ने पुष्टि-पत्र कोषसँग माग्नुहोस्।',
          'कार्ड डाक से आता है। हर बार डॉक्टर के पास इसे दिखाएं। कार्ड आने तक दिखाने लायक पुष्टि-पत्र अपने कोष से मांगें।',
        ),
        term: { term: 'elektronische Gesundheitskarte' },
      },
      {
        title: L('Make sure the fund reports you to the university', 'कोषले विश्वविद्यालयलाई सूचना पठाएको सुनिश्चित गर्नुहोस्', 'सुनिश्चित करें कि कोष विश्वविद्यालय को सूचना भेजे'),
        body: L(
          'Universities receive insurance confirmations electronically. Without it you can’t enrol or re-register.',
          'विश्वविद्यालयले बीमाको पुष्टि इलेक्ट्रोनिक रूपमा पाउँछ। यो बिना भर्ना वा पुनः दर्ता हुन सक्दैन।',
          'विश्वविद्यालय को बीमा की पुष्टि इलेक्ट्रॉनिक रूप से मिलती है। इसके बिना दाख़िला या दोबारा पंजीकरण नहीं हो सकता।',
        ),
      },
    ],
    documents: [
      L('Passport', 'राहदानी', 'पासपोर्ट'),
      L('Registration certificate or rental contract', 'दर्ता प्रमाणपत्र वा भाडा सम्झौता', 'पंजीकरण प्रमाणपत्र या किराया अनुबंध'),
      L('Admission letter', 'भर्ना पत्र', 'प्रवेश पत्र'),
      L('Photo', 'फोटो', 'फ़ोटो'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Turning 30 or finishing your studies changes your rate. Tell your fund in time.',
          '३० वर्ष पुग्दा वा पढाइ सकिँदा तपाईंको दर बदलिन्छ। समयमै कोषलाई जानकारी दिनुहोस्।',
          '30 साल के होने या पढ़ाई ख़त्म होने पर आपकी दर बदलती है। समय पर कोष को बताएं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Find a family doctor', 'पारिवारिक डाक्टर खोज्नुहोस्', 'फ़ैमिली डॉक्टर खोजें'), href: '/guides/find-a-family-doctor' },
      { kind: 'guide', title: L('Get health insurance', 'स्वास्थ्य बीमा लिनुहोस्', 'स्वास्थ्य बीमा लें'), href: '/guides/get-health-insurance' },
    ],
    sources: [S.uniHealth, S.tkStudents, S.gkvRates2026],
  },
  {
    slug: 'find-housing-leipzig',
    title: L('Find a room in Leipzig', 'लाइपजिगमा कोठा खोज्नुहोस्', 'लाइपज़िग में कमरा खोजें'),
    term: { term: 'Wohnungssuche' },
    stage: 'before',
    city: 'leipzig',
    readingMinutes: 6,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Options are a Studentenwerk dorm, a shared flat (WG) or your own flat. Leipzig is cheaper than most German cities, but good rooms go fast.',
        'विकल्पहरू: Studentenwerk छात्रावास, साझा फ्ल्याट (WG) वा आफ्नै फ्ल्याट। लाइपजिग धेरैजसो जर्मन सहरभन्दा सस्तो छ, तर राम्रा कोठा छिटै सकिन्छन्।',
        'विकल्प हैं: Studentenwerk हॉस्टल, साझा फ़्लैट (WG) या अपना फ़्लैट। लाइपज़िग ज़्यादातर जर्मन शहरों से सस्ता है, लेकिन अच्छे कमरे जल्दी चले जाते हैं।',
      ),
      when: L('Start as soon as you have your admission.', 'भर्ना पाउनेबित्तिकै सुरु गर्नुहोस्।', 'प्रवेश मिलते ही शुरू करें।'),
      deadline: L('Before you travel', 'यात्रा गर्नुअघि', 'यात्रा से पहले'),
    },
    steps: [
      {
        title: L('Apply for a Studentenwerk dorm', 'Studentenwerk छात्रावासका लागि आवेदन दिनुहोस्', 'Studentenwerk हॉस्टल के लिए आवेदन करें'),
        body: L(
          'Apply online. Rents are all-inclusive: about €215–325 for a room in a shared flat and €295–435 for a single apartment. The deposit is €450.',
          'अनलाइन आवेदन दिनुहोस्। भाडामा सबै समावेश हुन्छ: साझा फ्ल्याटको कोठा करिब €२१५–३२५ र एकल अपार्टमेन्ट €२९५–४३५। धरौटी €४५० हो।',
          'ऑनलाइन आवेदन करें। किराए में सब कुछ शामिल है: साझा फ़्लैट का कमरा लगभग €215–325 और अकेले का अपार्टमेंट €295–435। जमानत राशि €450 है।',
        ),
        cost: L('€215–435 a month · deposit €450', 'महिनामा €२१५–४३५ · धरौटी €४५०', 'हर महीने €215–435 · जमानत €450'),
        term: { term: 'Wohnheim' },
      },
      {
        title: L('Look for a shared flat', 'साझा फ्ल्याट खोज्नुहोस्', 'साझा फ़्लैट खोजें'),
        body: L(
          'Most students live in a WG. Compare the “warm rent” (with heating and service charges). Leipzig’s average asking rent for new contracts was about €9.26 per m² (2024, before heating).',
          'धेरैजसो विद्यार्थी WG मा बस्छन्। “वार्म भाडा” (तताउने र सेवा शुल्कसहित) तुलना गर्नुहोस्। नयाँ सम्झौताको लागि लाइपजिगको औसत माग गरिएको भाडा करिब €९.२६ प्रति वर्गमिटर (२०२४, तताउने बाहेक) थियो।',
          'ज़्यादातर छात्र WG में रहते हैं। “वार्म किराया” (हीटिंग और सेवा शुल्क सहित) की तुलना करें। नए अनुबंधों के लिए लाइपज़िग का औसत मांगा गया किराया लगभग €9.26 प्रति वर्ग मीटर (2024, हीटिंग के बिना) था।',
        ),
        term: { term: 'Wohngemeinschaft (WG)' },
      },
      {
        title: L('View the room and read the contract', 'कोठा हेर्नुहोस् र सम्झौता पढ्नुहोस्', 'कमरा देखें और अनुबंध पढ़ें'),
        body: L(
          'Pay nothing before you have seen the room (in person or by live video) and signed a contract. The deposit may be at most three months’ cold rent and you may pay it in three instalments.',
          'कोठा हेर्नु (आफैं वा प्रत्यक्ष भिडियोमार्फत) र सम्झौतामा हस्ताक्षर गर्नुअघि केही नतिर्नुहोस्। धरौटी बढीमा तीन महिनाको कोल्ड भाडा हुन सक्छ र तीन किस्तामा तिर्न पाइन्छ।',
          'कमरा देखने (ख़ुद या लाइव वीडियो से) और अनुबंध पर हस्ताक्षर से पहले कुछ भी न भरें। जमानत ज़्यादा से ज़्यादा तीन महीने का कोल्ड किराया हो सकती है और आप इसे तीन किस्तों में दे सकते हैं।',
        ),
        term: { term: 'Mietvertrag' },
      },
      {
        title: L('Get the landlord’s confirmation', 'घरधनीको पुष्टि-पत्र लिनुहोस्', 'मकान मालिक का पुष्टि-पत्र लें'),
        body: L(
          'When you move in, ask for the Wohnungsgeberbestätigung — you need it to register your address within 2 weeks.',
          'सर्दा Wohnungsgeberbestätigung माग्नुहोस् — २ हप्ताभित्र ठेगाना दर्ता गर्न यो चाहिन्छ।',
          'शिफ़्ट होते समय Wohnungsgeberbestätigung मांगें — 2 हफ़्ते में पता पंजीकृत करने के लिए यह चाहिए।',
        ),
      },
    ],
    documents: [
      L('Passport', 'राहदानी', 'पासपोर्ट'),
      L('Admission letter or enrolment certificate', 'भर्ना पत्र वा भर्ना प्रमाणपत्र', 'प्रवेश पत्र या दाख़िला प्रमाणपत्र'),
      L('Proof of money (e.g. blocked account)', 'पैसाको प्रमाण (जस्तै ब्लक्ड खाता)', 'पैसे का सबूत (जैसे ब्लॉक्ड अकाउंट)'),
    ],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'A “landlord abroad” who wants money before a viewing is a common scam. If you have paid, ask your bank to recall the transfer right away and report it to the police.',
          'हेर्नुअघि पैसा माग्ने “विदेशमा रहेको घरधनी” सामान्य ठगी हो। तिरिसक्नुभएको छ भने तुरुन्तै बैंकलाई ट्रान्सफर फिर्ता गर्न भन्नुहोस् र प्रहरीलाई खबर गर्नुहोस्।',
          'देखने से पहले पैसा मांगने वाला “विदेश में रहने वाला मकान मालिक” आम धोखा है। अगर भुगतान कर दिया है, तो तुरंत बैंक से ट्रांसफ़र वापस मंगाने को कहें और पुलिस में शिकायत करें।',
        ),
      },
      {
        kind: 'tip',
        text: L(
          'Problems with your landlord? The Mieterverein Leipzig checks contracts and bills for members (€84 a year).',
          'घरधनीसँग समस्या? Mieterverein Leipzig ले सदस्यका लागि सम्झौता र बिल जाँच्छ (वर्षको €८४)।',
          'मकान मालिक से समस्या? Mieterverein Leipzig सदस्यों के लिए अनुबंध और बिल जांचता है (साल के €84)।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), href: '/guides/register-your-address' },
      { kind: 'tool', title: L('Plan your monthly budget', 'मासिक बजेट योजना बनाउनुहोस्', 'मासिक बजट की योजना बनाएं'), href: '/tools/budget' },
    ],
    sources: [S.swHousing, S.swHousingFaq, S.swHousingApply, S.leipzigRentIndex, S.bgbDeposit, S.vzFakeFlats, S.policeAdvance],
  },
];
