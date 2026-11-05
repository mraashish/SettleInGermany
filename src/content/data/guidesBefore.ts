import type { Guide } from '../types';
import { CHECKED, L, NOT_ADVICE, S } from './util';

export const guidesBefore: Guide[] = [
  {
    slug: 'open-a-blocked-account',
    title: L('Open a blocked account', 'ब्लक्ड खाता खोल्नुहोस्', 'ब्लॉक्ड अकाउंट खोलें'),
    term: { term: 'Sperrkonto' },
    stage: 'before',
    readingMinutes: 6,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A German account that holds the money for your first year. Each month only a fixed amount is paid out to you. It is the usual proof that you can pay for your studies.',
        'तपाईंको पहिलो वर्षको पैसा राख्ने जर्मन खाता। हरेक महिना एउटा तोकिएको रकम मात्र तपाईंलाई दिइन्छ। पढाइको खर्च धान्न सक्छु भन्ने सामान्य प्रमाण यही हो।',
        'एक जर्मन खाता जिसमें आपके पहले साल का पैसा रहता है। हर महीने केवल एक तय रकम आपको मिलती है। यह इस बात का आम सबूत है कि आप पढ़ाई का खर्च उठा सकते हैं।',
      ),
      when: L(
        'Before you apply for the visa — the embassy wants the confirmation with your application.',
        'भिसाको आवेदन दिनुअघि — दूतावासले आवेदनसँगै पुष्टि-पत्र माग्छ।',
        'वीज़ा आवेदन से पहले — दूतावास आवेदन के साथ पुष्टि-पत्र मांगता है।',
      ),
      deadline: L('Before your visa appointment', 'भिसा अपोइन्टमेन्टभन्दा पहिले', 'वीज़ा अपॉइंटमेंट से पहले'),
    },
    steps: [
      {
        title: L('Check the amount for your year', 'आफ्नो वर्षको रकम जाँच्नुहोस्', 'अपने साल की रकम जांचें'),
        body: L(
          'For 2026 students must show €11,904 for one year — that is €992 a month. The amount usually changes each year, so check the embassy page before you transfer.',
          '२०२६ का लागि विद्यार्थीले एक वर्षका लागि €११,९०४ देखाउनुपर्छ — अर्थात् महिनामा €९९२। यो रकम प्रायः हरेक वर्ष बदलिन्छ, त्यसैले पैसा पठाउनुअघि दूतावासको पेज जाँच्नुहोस्।',
          '2026 के लिए छात्रों को एक साल के लिए €11,904 दिखाने होते हैं — यानी हर महीने €992। यह रकम आमतौर पर हर साल बदलती है, इसलिए पैसा भेजने से पहले दूतावास का पेज देखें।',
        ),
        cost: L('€11,904 for 12 months', '१२ महिनाका लागि €११,९०४', '12 महीनों के लिए €11,904'),
      },
      {
        title: L('Choose a provider', 'प्रदायक छान्नुहोस्', 'प्रदाता चुनें'),
        body: L(
          'Blocked accounts are opened online with a provider. Fees differ by more than €100 in the first year — compare them. We list providers by fees, not by commission.',
          'ब्लक्ड खाता कुनै प्रदायकमार्फत अनलाइन खोलिन्छ। पहिलो वर्षमा शुल्कमा €१०० भन्दा बढी फरक हुन्छ — तुलना गर्नुहोस्। हामी प्रदायकहरूलाई कमिसन होइन, शुल्कका आधारमा देखाउँछौं।',
          'ब्लॉक्ड अकाउंट किसी प्रदाता के साथ ऑनलाइन खोला जाता है। पहले साल में फ़ीस में €100 से ज़्यादा का अंतर होता है — तुलना करें। हम प्रदाताओं को कमीशन से नहीं, फ़ीस के आधार पर दिखाते हैं।',
        ),
      },
      {
        title: L('Fill in the application and verify your identity', 'आवेदन भर्नुहोस् र आफ्नो पहिचान पुष्टि गर्नुहोस्', 'आवेदन भरें और अपनी पहचान सत्यापित करें'),
        body: L(
          'You enter your passport details and verify your identity online, usually by video call. Then you receive the account details for the transfer.',
          'तपाईं राहदानीको विवरण भर्नुहुन्छ र प्रायः भिडियो कलमार्फत अनलाइन पहिचान पुष्टि गर्नुहुन्छ। त्यसपछि पैसा पठाउने खाता विवरण पाउनुहुन्छ।',
          'आप पासपोर्ट का विवरण भरते हैं और आमतौर पर वीडियो कॉल से ऑनलाइन पहचान सत्यापित करते हैं। फिर आपको पैसा भेजने के लिए खाते का विवरण मिलता है।',
        ),
        documents: [L('Passport', 'राहदानी', 'पासपोर्ट'), L('Admission letter (if you have it)', 'भर्ना पत्र (छ भने)', 'प्रवेश पत्र (अगर हो)')],
      },
      {
        title: L('Transfer the money from an account in your name', 'आफ्नै नामको खाताबाट पैसा पठाउनुहोस्', 'अपने नाम के खाते से पैसा भेजें'),
        body: L(
          'Send the full amount plus any buffer the provider asks for. International transfers take a few working days. Keep the bank receipt.',
          'पूरा रकम र प्रदायकले माग्ने थप रकम पठाउनुहोस्। अन्तर्राष्ट्रिय ट्रान्सफरमा केही कार्यदिन लाग्छ। बैंकको रसिद राख्नुहोस्।',
          'पूरी रकम और प्रदाता जो अतिरिक्त राशि मांगे, भेजें। अंतरराष्ट्रीय ट्रांसफ़र में कुछ कार्यदिवस लगते हैं। बैंक की रसीद रखें।',
        ),
        wait: L('A few working days', 'केही कार्यदिन', 'कुछ कार्यदिवस'),
      },
      {
        title: L('Download the blocking confirmation', 'ब्लक पुष्टि-पत्र डाउनलोड गर्नुहोस्', 'ब्लॉकिंग पुष्टि-पत्र डाउनलोड करें'),
        body: L(
          'When the money has arrived, the provider sends a confirmation. Bring it to your visa appointment. In Germany you need it again for your residence permit.',
          'पैसा पुगेपछि प्रदायकले पुष्टि-पत्र पठाउँछ। यसलाई भिसा अपोइन्टमेन्टमा लैजानुहोस्। जर्मनीमा आवास अनुमतिपत्रका लागि फेरि चाहिन्छ।',
          'पैसा पहुंचने पर प्रदाता पुष्टि-पत्र भेजता है। इसे वीज़ा अपॉइंटमेंट पर ले जाएं। जर्मनी में निवास परमिट के लिए यह फिर से चाहिए।',
        ),
        term: { term: 'Sperrbestätigung' },
      },
    ],
    documents: [
      L('Passport', 'राहदानी', 'पासपोर्ट'),
      L('Admission letter from the university', 'विश्वविद्यालयको भर्ना पत्र', 'विश्वविद्यालय का प्रवेश पत्र'),
      L('Proof of the transfer', 'पैसा पठाएको प्रमाण', 'पैसा भेजने का सबूत'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Germany’s missions in Nepal and India also accept other proofs in some cases, such as a scholarship or a formal obligation letter from someone in Germany (Verpflichtungserklärung). Check your embassy’s checklist.',
          'नेपाल र भारतका जर्मन नियोगहरूले केही अवस्थामा छात्रवृत्ति वा जर्मनीमा बस्ने कसैको औपचारिक जिम्मेवारी पत्र (Verpflichtungserklärung) जस्ता अन्य प्रमाण पनि स्वीकार्छन्। आफ्नो दूतावासको चेकलिस्ट हेर्नुहोस्।',
          'नेपाल और भारत में जर्मन मिशन कुछ मामलों में दूसरे सबूत भी मानते हैं, जैसे छात्रवृत्ति या जर्मनी में रहने वाले किसी व्यक्ति का औपचारिक दायित्व पत्र (Verpflichtungserklärung)। अपने दूतावास की चेकलिस्ट देखें।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Don’t pay a “visa agent” to open the account for you. You can open it yourself online, and it must be in your own name.',
          'खाता खोलिदिन “भिसा एजेन्ट”लाई पैसा नतिर्नुहोस्। तपाईं आफैं अनलाइन खोल्न सक्नुहुन्छ, र खाता तपाईंकै नाममा हुनुपर्छ।',
          'अकाउंट खुलवाने के लिए किसी “वीज़ा एजेंट” को पैसे न दें। आप इसे खुद ऑनलाइन खोल सकते हैं, और यह आपके ही नाम पर होना चाहिए।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Compare blocked accounts', 'ब्लक्ड खाताहरू तुलना गर्नुहोस्', 'ब्लॉक्ड अकाउंट की तुलना करें'), href: '/tools/compare/blocked-accounts' },
      { kind: 'guide', title: L('Apply for your student visa', 'विद्यार्थी भिसाका लागि आवेदन दिनुहोस्', 'स्टूडेंट वीज़ा के लिए आवेदन करें'), href: '/guides/apply-for-student-visa' },
    ],
    sources: [S.aaBlocked, S.kathmanduStudy, S.indiaFaq],
    compareLink: { label: L('Compare providers', 'प्रदायकहरू तुलना गर्नुहोस्', 'प्रदाताओं की तुलना करें'), href: '/tools/compare/blocked-accounts' },
  },
  {
    slug: 'apply-for-student-visa',
    title: L('Apply for your student visa', 'विद्यार्थी भिसाका लागि आवेदन दिनुहोस्', 'स्टूडेंट वीज़ा के लिए आवेदन करें'),
    term: { term: 'Visum zu Studienzwecken' },
    stage: 'before',
    readingMinutes: 8,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A national visa (type D) that lets you enter Germany to study. In Germany you then turn it into a residence permit.',
        'जर्मनीमा पढ्न प्रवेश गर्न दिने राष्ट्रिय भिसा (टाइप D)। जर्मनी पुगेपछि यसलाई आवास अनुमतिपत्रमा बदल्नुहुन्छ।',
        'एक राष्ट्रीय वीज़ा (टाइप D) जिससे आप पढ़ाई के लिए जर्मनी आ सकते हैं। जर्मनी में आप इसे निवास परमिट में बदलते हैं।',
      ),
      when: L(
        'As soon as you have your admission letter. Appointments can be booked out for weeks.',
        'भर्ना पत्र पाउनेबित्तिकै। अपोइन्टमेन्ट हप्तौंसम्म भरिएको हुन सक्छ।',
        'जैसे ही आपको प्रवेश पत्र मिले। अपॉइंटमेंट कई हफ़्तों तक भरे हो सकते हैं।',
      ),
      deadline: L('Well before your semester starts', 'सेमेस्टर सुरु हुनुभन्दा धेरै अगाडि', 'सेमेस्टर शुरू होने से काफ़ी पहले'),
    },
    steps: [
      {
        title: L('Download your embassy’s checklist', 'आफ्नो दूतावासको चेकलिस्ट डाउनलोड गर्नुहोस्', 'अपने दूतावास की चेकलिस्ट डाउनलोड करें'),
        body: L(
          'Nepal: German Embassy Kathmandu. India: the German mission for your state, with applications through VFS Global. Each publishes its own checklist — follow it exactly, including the order of documents.',
          'नेपाल: काठमाडौंस्थित जर्मन दूतावास। भारत: तपाईंको राज्यको जर्मन नियोग, आवेदन VFS Global मार्फत। हरेकले आफ्नै चेकलिस्ट प्रकाशित गर्छ — कागजातको क्रमसहित ठ्याक्कै पालना गर्नुहोस्।',
          'नेपाल: काठमांडू स्थित जर्मन दूतावास। भारत: आपके राज्य का जर्मन मिशन, आवेदन VFS Global के ज़रिए। हर मिशन अपनी चेकलिस्ट प्रकाशित करता है — दस्तावेज़ों के क्रम सहित उसका ठीक-ठीक पालन करें।',
        ),
      },
      {
        title: L('India only: get your APS certificate', 'भारत मात्र: APS प्रमाणपत्र लिनुहोस्', 'केवल भारत: APS प्रमाणपत्र लें'),
        body: L(
          'Students from India need a certificate from the Academic Evaluation Centre (APS) before they can apply. It takes time, so start early.',
          'भारतका विद्यार्थीलाई आवेदन दिनुअघि Academic Evaluation Centre (APS) को प्रमाणपत्र चाहिन्छ। यसमा समय लाग्छ, त्यसैले चाँडै सुरु गर्नुहोस्।',
          'भारत के छात्रों को आवेदन से पहले Academic Evaluation Centre (APS) का प्रमाणपत्र चाहिए। इसमें समय लगता है, इसलिए जल्दी शुरू करें।',
        ),
        term: { term: 'APS-Zertifikat' },
      },
      {
        title: L('Prepare proof of money and insurance', 'पैसा र बीमाको प्रमाण तयार गर्नुहोस्', 'पैसे और बीमा का सबूत तैयार करें'),
        body: L(
          'Usually a blocked account confirmation (€11,904 for 2026). You also need travel health insurance that covers you until your German health insurance starts.',
          'प्रायः ब्लक्ड खाताको पुष्टि-पत्र (२०२६ का लागि €११,९०४)। जर्मन स्वास्थ्य बीमा सुरु नहुँदासम्मको यात्रा स्वास्थ्य बीमा पनि चाहिन्छ।',
          'आमतौर पर ब्लॉक्ड अकाउंट का पुष्टि-पत्र (2026 के लिए €11,904)। जर्मन स्वास्थ्य बीमा शुरू होने तक के लिए यात्रा स्वास्थ्य बीमा भी चाहिए।',
        ),
      },
      {
        title: L('Book the appointment yourself', 'अपोइन्टमेन्ट आफैं बुक गर्नुहोस्', 'अपॉइंटमेंट खुद बुक करें'),
        body: L(
          'Appointments are booked online and are free. Nobody can sell you a faster appointment — the embassies warn about agents who claim this.',
          'अपोइन्टमेन्ट अनलाइन बुक गरिन्छ र निःशुल्क हुन्छ। कसैले पनि छिटो अपोइन्टमेन्ट बेच्न सक्दैन — दूतावासहरूले यस्तो दाबी गर्ने एजेन्टबारे चेतावनी दिएका छन्।',
          'अपॉइंटमेंट ऑनलाइन बुक होते हैं और मुफ़्त हैं। कोई भी आपको जल्दी अपॉइंटमेंट नहीं बेच सकता — दूतावास ऐसे दावे करने वाले एजेंटों से सावधान करते हैं।',
        ),
        cost: L('Appointment: free · visa fee: €75 in local currency', 'अपोइन्टमेन्ट: निःशुल्क · भिसा शुल्क: स्थानीय मुद्रामा €७५', 'अपॉइंटमेंट: मुफ़्त · वीज़ा फ़ीस: स्थानीय मुद्रा में €75'),
      },
      {
        title: L('Hand in your application and wait', 'आवेदन बुझाउनुहोस् र पर्खनुहोस्', 'आवेदन जमा करें और इंतज़ार करें'),
        body: L(
          'You give your fingerprints and documents. The foreigners’ office in your German city may have to agree, which takes several weeks. Don’t book a flight you can’t change.',
          'तपाईं औंठाछाप र कागजात दिनुहुन्छ। तपाईंको जर्मन सहरको विदेशी कार्यालयले सहमति दिनुपर्ने हुन सक्छ, जसमा केही हप्ता लाग्छ। परिवर्तन गर्न नमिल्ने उडान टिकट नकिन्नुहोस्।',
          'आप उंगलियों के निशान और दस्तावेज़ देते हैं। आपके जर्मन शहर के विदेशी कार्यालय की सहमति लग सकती है, जिसमें कई हफ़्ते लगते हैं। ऐसी फ़्लाइट न बुक करें जिसे बदला न जा सके।',
        ),
        wait: L('Several weeks', 'केही हप्ता', 'कई हफ़्ते'),
      },
    ],
    documents: [
      L('Passport (valid long enough, with empty pages)', 'राहदानी (पर्याप्त म्याद र खाली पानासहित)', 'पासपोर्ट (पर्याप्त वैधता और खाली पन्नों के साथ)'),
      L('Completed visa application form', 'भरिएको भिसा आवेदन फारम', 'भरा हुआ वीज़ा आवेदन फ़ॉर्म'),
      L('Admission letter from the German university', 'जर्मन विश्वविद्यालयको भर्ना पत्र', 'जर्मन विश्वविद्यालय का प्रवेश पत्र'),
      L('Proof of money, e.g. blocked account confirmation', 'पैसाको प्रमाण, जस्तै ब्लक्ड खाता पुष्टि-पत्र', 'पैसे का सबूत, जैसे ब्लॉक्ड अकाउंट पुष्टि-पत्र'),
      L('Travel health insurance', 'यात्रा स्वास्थ्य बीमा', 'यात्रा स्वास्थ्य बीमा'),
      L('Certificates and language certificate (as on the checklist)', 'शैक्षिक प्रमाणपत्र र भाषा प्रमाणपत्र (चेकलिस्टअनुसार)', 'शैक्षिक प्रमाणपत्र और भाषा प्रमाणपत्र (चेकलिस्ट के अनुसार)'),
      L('India: APS certificate', 'भारत: APS प्रमाणपत्र', 'भारत: APS प्रमाणपत्र'),
    ],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'Fake documents lead to refusal and can lead to a ban on entering Germany. No agent can guarantee a visa.',
          'नक्कली कागजातले भिसा अस्वीकृत हुन्छ र जर्मनी प्रवेशमा प्रतिबन्ध पनि लाग्न सक्छ। कुनै पनि एजेन्टले भिसाको ग्यारेन्टी दिन सक्दैन।',
          'नकली दस्तावेज़ों से वीज़ा अस्वीकार होता है और जर्मनी आने पर रोक भी लग सकती है। कोई भी एजेंट वीज़ा की गारंटी नहीं दे सकता।',
        ),
      },
      {
        kind: 'tip',
        text: L(
          'India: the German missions accept language certificates such as IELTS, TOEFL, Goethe, telc or TestDaF — Duolingo is not accepted.',
          'भारत: जर्मन नियोगहरूले IELTS, TOEFL, Goethe, telc वा TestDaF जस्ता भाषा प्रमाणपत्र स्वीकार्छन् — Duolingo स्वीकार्दैनन्।',
          'भारत: जर्मन मिशन IELTS, TOEFL, Goethe, telc या TestDaF जैसे भाषा प्रमाणपत्र मानते हैं — Duolingo नहीं माना जाता।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Open a blocked account', 'ब्लक्ड खाता खोल्नुहोस्', 'ब्लॉक्ड अकाउंट खोलें'), href: '/guides/open-a-blocked-account' },
      { kind: 'guide', title: L('Get health insurance', 'स्वास्थ्य बीमा लिनुहोस्', 'स्वास्थ्य बीमा लें'), href: '/guides/get-health-insurance' },
    ],
    sources: [S.kathmanduStudy, S.kathmanduChecklist, S.kathmanduAppointment, S.indiaStudy, S.indiaChecklist, S.indiaFraud],
  },
  {
    slug: 'get-health-insurance',
    title: L('Get health insurance', 'स्वास्थ्य बीमा लिनुहोस्', 'स्वास्थ्य बीमा लें'),
    term: { term: 'Krankenversicherung' },
    stage: 'before',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Health insurance is compulsory in Germany. You need travel insurance for the visa and the first days, then a German health insurance for your studies.',
        'जर्मनीमा स्वास्थ्य बीमा अनिवार्य छ। भिसा र सुरुका दिनका लागि यात्रा बीमा, त्यसपछि पढाइका लागि जर्मन स्वास्थ्य बीमा चाहिन्छ।',
        'जर्मनी में स्वास्थ्य बीमा अनिवार्य है। वीज़ा और शुरुआती दिनों के लिए यात्रा बीमा, फिर पढ़ाई के लिए जर्मन स्वास्थ्य बीमा चाहिए।',
      ),
      when: L(
        'Travel insurance before the visa appointment. German insurance before you enrol.',
        'भिसा अपोइन्टमेन्टअघि यात्रा बीमा। भर्ना हुनुअघि जर्मन बीमा।',
        'वीज़ा अपॉइंटमेंट से पहले यात्रा बीमा। दाख़िले से पहले जर्मन बीमा।',
      ),
      deadline: L('Before enrolment', 'भर्ना हुनुअघि', 'दाख़िले से पहले'),
    },
    steps: [
      {
        title: L('Buy travel health insurance for the start', 'सुरुका लागि यात्रा स्वास्थ्य बीमा किन्नुहोस्', 'शुरुआत के लिए यात्रा स्वास्थ्य बीमा खरीदें'),
        body: L(
          'The embassy needs it for the visa. It must cover you from arrival until your German insurance starts — the German missions in India ask for the first 90 days.',
          'भिसाका लागि दूतावासलाई यो चाहिन्छ। आइपुगेदेखि जर्मन बीमा सुरु नहुँदासम्म यसले कभर गर्नुपर्छ — भारतका जर्मन नियोगहरूले पहिलो ९० दिन माग्छन्।',
          'वीज़ा के लिए दूतावास को यह चाहिए। यह पहुंचने से लेकर जर्मन बीमा शुरू होने तक कवर करे — भारत में जर्मन मिशन पहले 90 दिन मांगते हैं।',
        ),
        term: { term: 'Reisekrankenversicherung' },
      },
      {
        title: L('Choose a statutory health insurance fund', 'सरकारी स्वास्थ्य बीमा कोष छान्नुहोस्', 'वैधानिक स्वास्थ्य बीमा कोष चुनें'),
        body: L(
          'Students under 30 are usually insured in statutory insurance at the student rate. All funds pay the same base rate; they differ in the additional contribution and extras. Travel insurance is not accepted for enrolment.',
          '३० वर्षमुनिका विद्यार्थी प्रायः विद्यार्थी दरमा सरकारी बीमामा बीमित हुन्छन्। सबै कोषको आधार दर उस्तै हुन्छ; अतिरिक्त योगदान र सुविधामा फरक हुन्छ। भर्नाका लागि यात्रा बीमा मान्य हुँदैन।',
          '30 साल से कम उम्र के छात्र आमतौर पर छात्र दर पर वैधानिक बीमा में बीमित होते हैं। सभी कोषों की मूल दर एक जैसी है; अंतर अतिरिक्त योगदान और सुविधाओं में है। दाख़िले के लिए यात्रा बीमा मान्य नहीं है।',
        ),
        term: { term: 'gesetzliche Krankenkasse' },
        cost: L('About €140–150 a month in 2026 (incl. care insurance)', '२०२६ मा महिनाको करिब €१४०–१५० (हेरचाह बीमासहित)', '2026 में हर महीने लगभग €140–150 (देखभाल बीमा सहित)'),
      },
      {
        title: L('Apply online and give your German address later', 'अनलाइन आवेदन दिनुहोस्, जर्मन ठेगाना पछि दिनुहोस्', 'ऑनलाइन आवेदन करें, जर्मन पता बाद में दें'),
        body: L(
          'Most funds let you apply online with your passport and admission letter. Insurance starts at the beginning of the semester at the latest.',
          'धेरैजसो कोषले राहदानी र भर्ना पत्र लिएर अनलाइन आवेदन दिन दिन्छन्। बीमा बढीमा सेमेस्टर सुरु हुँदा सुरु हुन्छ।',
          'ज़्यादातर कोष पासपोर्ट और प्रवेश पत्र के साथ ऑनलाइन आवेदन करने देते हैं। बीमा ज़्यादा से ज़्यादा सेमेस्टर की शुरुआत से शुरू होता है।',
        ),
      },
      {
        title: L('Private insurance? Get it exempted first', 'निजी बीमा? पहिले छुट लिनुहोस्', 'निजी बीमा? पहले छूट लें'),
        body: L(
          'If you want private insurance, a statutory fund must first confirm your exemption from compulsory insurance. The decision usually applies for your whole studies and can’t be reversed.',
          'निजी बीमा चाहनुहुन्छ भने पहिले कुनै सरकारी कोषले अनिवार्य बीमाबाट छुट पुष्टि गर्नुपर्छ। यो निर्णय प्रायः पूरा पढाइभर लागू हुन्छ र फिर्ता लिन मिल्दैन।',
          'अगर आप निजी बीमा चाहते हैं, तो पहले किसी वैधानिक कोष को अनिवार्य बीमा से आपकी छूट की पुष्टि करनी होगी। यह फ़ैसला आमतौर पर पूरी पढ़ाई के लिए लागू होता है और बदला नहीं जा सकता।',
        ),
        term: { term: 'Befreiung von der Versicherungspflicht' },
      },
    ],
    documents: [
      L('Passport', 'राहदानी', 'पासपोर्ट'),
      L('Admission letter', 'भर्ना पत्र', 'प्रवेश पत्र'),
      L('Passport photo for the health card', 'स्वास्थ्य कार्डका लागि राहदानी साइजको फोटो', 'हेल्थ कार्ड के लिए पासपोर्ट साइज़ फ़ोटो'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'The 2026 student rate is €87.38 plus your fund’s additional contribution, plus care insurance (€30.78 under 23, €35.91 from 23 without children). Example: TK costs €141.16 under 23.',
          '२०२६ को विद्यार्थी दर €८७.३८ र तपाईंको कोषको अतिरिक्त योगदान, साथै हेरचाह बीमा (२३ वर्षमुनि €३०.७८, २३ वर्षदेखि सन्तान नभएमा €३५.९१) हो। उदाहरण: TK मा २३ वर्षमुनि €१४१.१६।',
          '2026 की छात्र दर €87.38 और आपके कोष का अतिरिक्त योगदान, साथ में देखभाल बीमा (23 से कम उम्र पर €30.78, 23 से ऊपर बिना बच्चों के €35.91) है। उदाहरण: TK में 23 से कम उम्र पर €141.16।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Don’t rely on travel insurance after arrival — Leipzig University does not accept it for enrolment.',
          'आइपुगेपछि यात्रा बीमामा भर नपर्नुहोस् — लाइपजिग विश्वविद्यालयले भर्नाका लागि यसलाई मान्दैन।',
          'पहुंचने के बाद यात्रा बीमा पर निर्भर न रहें — लाइपज़िग विश्वविद्यालय दाख़िले के लिए इसे नहीं मानता।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Activate your health insurance', 'स्वास्थ्य बीमा सक्रिय गर्नुहोस्', 'स्वास्थ्य बीमा सक्रिय करें'), href: '/guides/activate-health-insurance' },
      { kind: 'tool', title: L('Plan your monthly budget', 'मासिक बजेट योजना बनाउनुहोस्', 'मासिक बजट की योजना बनाएं'), href: '/tools/budget' },
    ],
    sources: [S.gkvRates2026, S.tkStudents, S.uniHealth, S.indiaChecklist],
  },
];
