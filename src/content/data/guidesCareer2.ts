import type { Guide } from '../types';
import { CHECKED, FREE, L, NOT_ADVICE, S } from './util';

const PASSPORT = L('Passport and residence permit', 'राहदानी र आवास अनुमतिपत्र', 'पासपोर्ट और निवास परमिट');
const DEGREE = L('Degree certificates and transcripts', 'डिग्री प्रमाणपत्र र अङ्कपत्र', 'डिग्री प्रमाणपत्र और अंकपत्र');

export const guidesCareer2: Guide[] = [
  {
    slug: 'write-a-german-cv',
    title: L('Write a German CV and application', 'जर्मन CV र आवेदन लेख्नुहोस्', 'जर्मन CV और आवेदन लिखें'),
    term: { term: 'Lebenslauf' },
    stage: 'career',
    readingMinutes: 6,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'German employers expect a short, tabular CV and a cover letter written for the job. Most applications are sent online as one PDF.',
        'जर्मन रोजगारदाताले छोटो, तालिकाबद्ध CV र कामका लागि लेखिएको आवेदन पत्र अपेक्षा गर्छन्। धेरैजसो आवेदन एउटै PDF मा अनलाइन पठाइन्छ।',
        'जर्मन नियोक्ता एक छोटा, तालिका वाला CV और नौकरी के लिए लिखा कवर लेटर चाहते हैं। ज़्यादातर आवेदन एक PDF में ऑनलाइन भेजे जाते हैं।',
      ),
      when: L('Before you apply for student jobs, internships or your first job.', 'विद्यार्थी काम, इन्टर्नसिप वा पहिलो कामका लागि आवेदन दिनुअघि।', 'छात्र नौकरी, इंटर्नशिप या पहली नौकरी के लिए आवेदन से पहले।'),
      deadline: L('Deadline in each job advert', 'हरेक विज्ञापनमा लेखिएको समयसीमा', 'हर नौकरी विज्ञापन में लिखी समयसीमा'),
    },
    steps: [
      {
        title: L('Build a tabular CV (1–2 pages)', 'तालिकाबद्ध CV बनाउनुहोस् (१–२ पाना)', 'तालिका वाला CV बनाएं (1–2 पेज)'),
        body: L(
          'Newest first: work experience, education, skills (languages with levels such as German B1), IT skills. Use a clear layout without nested tables or graphics — many companies scan CVs automatically.',
          'नयाँ पहिले: कामको अनुभव, शिक्षा, सीप (जर्मन B1 जस्ता तहसहित भाषा), IT सीप। जटिल तालिका वा ग्राफिक्सबिना सफा ढाँचा प्रयोग गर्नुहोस् — धेरै कम्पनीले CV स्वचालित रूपमा स्क्यान गर्छन्।',
          'नया पहले: कार्य अनुभव, शिक्षा, कौशल (जर्मन B1 जैसे स्तर के साथ भाषाएं), IT कौशल। जटिल टेबल या ग्राफ़िक्स के बिना साफ़ लेआउट रखें — कई कंपनियां CV अपने आप स्कैन करती हैं।',
        ),
        term: { term: 'tabellarischer Lebenslauf' },
      },
      {
        title: L('Decide about the photo', 'फोटोबारे निर्णय गर्नुहोस्', 'फ़ोटो के बारे में तय करें'),
        body: L(
          'A photo is not required by law. If you add one, use a professional photo — not a selfie. Some employers ask for anonymous CVs without a photo.',
          'कानुनले फोटो अनिवार्य गर्दैन। राख्नुहुन्छ भने व्यावसायिक फोटो प्रयोग गर्नुहोस् — सेल्फी होइन। केही रोजगारदाताले फोटोबिनाको अज्ञात CV माग्छन्।',
          'क़ानूनन फ़ोटो ज़रूरी नहीं है। लगाएं तो पेशेवर फ़ोटो लगाएं — सेल्फ़ी नहीं। कुछ नियोक्ता बिना फ़ोटो का गुमनाम CV मांगते हैं।',
        ),
        term: { term: 'Bewerbungsfoto' },
      },
      {
        title: L('Use this structure', 'यो ढाँचा प्रयोग गर्नुहोस्', 'यह ढांचा इस्तेमाल करें'),
        body: L(
          '1. Personal details: name, address in Germany, phone, email (date of birth, nationality and photo are optional). 2. Work experience: month/year – month/year, job title, company, city, 2–3 results. 3. Education: degree, university, city, years, grade or focus. 4. Skills: languages with levels (e.g. German B1, English C1, Nepali/Hindi native), software and tools. 5. Optional: projects, volunteering, interests that fit the job. End with place, date and your name.',
          '१. व्यक्तिगत विवरण: नाम, जर्मनीको ठेगाना, फोन, इमेल (जन्ममिति, राष्ट्रियता र फोटो ऐच्छिक)। २. कामको अनुभव: महिना/वर्ष – महिना/वर्ष, पद, कम्पनी, सहर, २–३ उपलब्धि। ३. शिक्षा: डिग्री, विश्वविद्यालय, सहर, वर्ष, ग्रेड वा विषय। ४. सीप: तहसहित भाषा (जस्तै जर्मन B1, अंग्रेजी C1, नेपाली/हिन्दी मातृभाषा), सफ्टवेयर र उपकरण। ५. ऐच्छिक: परियोजना, स्वयंसेवा, कामसँग मिल्ने रुचि। अन्त्यमा ठाउँ, मिति र आफ्नो नाम लेख्नुहोस्।',
          '1. व्यक्तिगत विवरण: नाम, जर्मनी का पता, फ़ोन, ईमेल (जन्मतिथि, राष्ट्रीयता और फ़ोटो वैकल्पिक)। 2. कार्य अनुभव: महीना/साल – महीना/साल, पद, कंपनी, शहर, 2–3 उपलब्धियां। 3. शिक्षा: डिग्री, विश्वविद्यालय, शहर, साल, ग्रेड या विषय। 4. कौशल: स्तर के साथ भाषाएं (जैसे जर्मन B1, अंग्रेज़ी C1, नेपाली/हिंदी मातृभाषा), सॉफ़्टवेयर और टूल। 5. वैकल्पिक: प्रोजेक्ट, स्वयंसेवा, नौकरी से जुड़ी रुचियां। अंत में जगह, तारीख और अपना नाम लिखें।',
        ),
        term: { term: 'Aufbau des Lebenslaufs' },
      },
      {
        title: L('Write a cover letter for this job', 'यो कामका लागि आवेदन पत्र लेख्नुहोस्', 'इस नौकरी के लिए कवर लेटर लिखें'),
        body: L(
          'At most one page. Say why this job and this company, with examples that match the advert. Avoid “würde” and “könnte” — write confidently.',
          'बढीमा एक पाना। किन यो काम र यो कम्पनी, विज्ञापनसँग मिल्ने उदाहरणसहित लेख्नुहोस्। “würde” र “könnte” नलेख्नुहोस् — आत्मविश्वासका साथ लेख्नुहोस्।',
          'ज़्यादा से ज़्यादा एक पेज। बताएं कि यही नौकरी और यही कंपनी क्यों, विज्ञापन से मेल खाते उदाहरणों के साथ। “würde” और “könnte” से बचें — आत्मविश्वास से लिखें।',
        ),
        term: { term: 'Anschreiben' },
      },
      {
        title: L('Send one PDF', 'एउटै PDF पठाउनुहोस्', 'एक PDF भेजें'),
        body: L(
          'Combine cover letter, CV, certificates and references (Arbeitszeugnisse) into one PDF, unless the company asks for something else. Follow the company’s instructions exactly.',
          'कम्पनीले अरू नमागेसम्म आवेदन पत्र, CV, प्रमाणपत्र र कार्य प्रमाणपत्र (Arbeitszeugnisse) एउटै PDF मा राख्नुहोस्। कम्पनीको निर्देशन ठ्याक्कै पालना गर्नुहोस्।',
          'कंपनी कुछ और न मांगे तो कवर लेटर, CV, प्रमाणपत्र और कार्य प्रमाणपत्र (Arbeitszeugnisse) एक PDF में जोड़ें। कंपनी के निर्देशों का ठीक-ठीक पालन करें।',
        ),
        term: { term: 'Bewerbungsunterlagen' },
      },
    ],
    documents: [
      L('CV (Lebenslauf)', 'CV (Lebenslauf)', 'CV (Lebenslauf)'),
      L('Cover letter (Anschreiben)', 'आवेदन पत्र (Anschreiben)', 'कवर लेटर (Anschreiben)'),
      DEGREE,
      L('Work references and language certificates', 'कार्य प्रमाणपत्र र भाषा प्रमाणपत्र', 'कार्य प्रमाणपत्र और भाषा प्रमाणपत्र'),
    ],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Your university’s careers service and the Federal Employment Agency check CVs for free.',
          'विश्वविद्यालयको करियर सेवा र संघीय रोजगार एजेन्सीले निःशुल्क CV जाँच्छन्।',
          'विश्वविद्यालय की करियर सेवा और संघीय रोज़गार एजेंसी मुफ़्त में CV जांचते हैं।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Don’t send the same letter to every company. Recruiters notice a generic letter at once.',
          'हरेक कम्पनीलाई उही पत्र नपठाउनुहोस्। भर्ती गर्नेले सामान्य पत्र तुरुन्तै चिन्छन्।',
          'हर कंपनी को एक ही पत्र न भेजें। भर्ती करने वाले सामान्य पत्र तुरंत पहचान लेते हैं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Find an internship', 'इन्टर्नसिप खोज्नुहोस्', 'इंटर्नशिप खोजें'), href: '/guides/find-an-internship' },
      { kind: 'guide', title: L('Get your degree recognised', 'डिग्री मान्यता लिनुहोस्', 'अपनी डिग्री की मान्यता लें'), href: '/guides/get-your-degree-recognised' },
    ],
    sources: [S.baApplicationDocs, S.baWriteApplication],
  },
  {
    slug: 'get-your-degree-recognised',
    title: L('Get your degree recognised', 'डिग्री मान्यता लिनुहोस्', 'अपनी डिग्री की मान्यता लें'),
    term: { term: 'Anerkennung' },
    stage: 'career',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A degree from Nepal or India can be compared with a German one. For regulated jobs (e.g. doctor, nurse, teacher) recognition is required; for most other jobs it helps employers and the immigration office.',
        'नेपाल वा भारतको डिग्रीलाई जर्मन डिग्रीसँग तुलना गर्न सकिन्छ। नियमित पेशा (जस्तै डाक्टर, नर्स, शिक्षक) का लागि मान्यता अनिवार्य हुन्छ; अन्य धेरैजसो कामका लागि यसले रोजगारदाता र विदेशी कार्यालयलाई सहयोग गर्छ।',
        'नेपाल या भारत की डिग्री की तुलना जर्मन डिग्री से की जा सकती है। विनियमित पेशों (जैसे डॉक्टर, नर्स, शिक्षक) के लिए मान्यता ज़रूरी है; ज़्यादातर दूसरी नौकरियों में यह नियोक्ताओं और विदेशी कार्यालय की मदद करती है।',
      ),
      when: L('Before you apply for a job with a degree from home.', 'देशको डिग्रीले काम खोज्नुअघि।', 'अपने देश की डिग्री से नौकरी के लिए आवेदन से पहले।'),
      deadline: L('Allow up to 3 months', '३ महिनासम्म समय राख्नुहोस्', '3 महीने तक का समय रखें'),
    },
    steps: [
      {
        title: L('Find out whether your job is regulated', 'तपाईंको पेशा नियमित हो कि पत्ता लगाउनुहोस्', 'पता करें कि आपका पेशा विनियमित है या नहीं'),
        body: L(
          'The official “Anerkennungs-Finder” tells you which office is responsible and what you need.',
          'आधिकारिक “Anerkennungs-Finder” ले कुन कार्यालय जिम्मेवार छ र के चाहिन्छ भन्छ।',
          'आधिकारिक “Anerkennungs-Finder” बताता है कि कौन-सा कार्यालय ज़िम्मेदार है और क्या चाहिए।',
        ),
        cost: FREE,
      },
      {
        title: L('Check anabin first', 'पहिले anabin जाँच्नुहोस्', 'पहले anabin जांचें'),
        body: L(
          'If your university is rated “H+” and your degree is listed in the anabin database, a free printout is often enough for employers.',
          'तपाईंको विश्वविद्यालय anabin मा “H+” छ र डिग्री सूचीमा छ भने, निःशुल्क प्रिन्टआउट प्रायः रोजगारदाताका लागि पुग्छ।',
          'अगर आपका विश्वविद्यालय anabin में “H+” है और डिग्री सूची में है, तो मुफ़्त प्रिंटआउट अक्सर नियोक्ताओं के लिए काफ़ी होता है।',
        ),
        term: { term: 'anabin' },
      },
      {
        title: L('Otherwise apply for a Statement of Comparability', 'नत्र तुलनात्मक प्रमाणपत्रका लागि आवेदन दिनुहोस्', 'वरना तुलनात्मक प्रमाणपत्र के लिए आवेदन करें'),
        body: L(
          'The Central Office for Foreign Education (ZAB) issues it online. It describes your degree in German terms.',
          'विदेशी शिक्षाको केन्द्रीय कार्यालय (ZAB) ले अनलाइन जारी गर्छ। यसले तपाईंको डिग्रीलाई जर्मन सर्तमा वर्णन गर्छ।',
          'विदेशी शिक्षा का केंद्रीय कार्यालय (ZAB) इसे ऑनलाइन जारी करता है। यह आपकी डिग्री को जर्मन संदर्भ में बताता है।',
        ),
        term: { term: 'Zeugnisbewertung' },
        cost: L('€208', '€२०८', '€208'),
        wait: L('Up to 3 months', '३ महिनासम्म', '3 महीने तक'),
      },
    ],
    documents: [DEGREE, L('Certified translations (if not in English or German)', 'प्रमाणित अनुवाद (अंग्रेजी वा जर्मनमा नभए)', 'प्रमाणित अनुवाद (अगर अंग्रेज़ी या जर्मन में न हो)'), L('Passport', 'राहदानी', 'पासपोर्ट')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Graduated from a German university? Then you don’t need recognition for your German degree.',
          'जर्मन विश्वविद्यालयबाट स्नातक गर्नुभयो? त्यसो भए जर्मन डिग्रीका लागि मान्यता चाहिँदैन।',
          'जर्मन विश्वविद्यालय से स्नातक हैं? तो आपकी जर्मन डिग्री के लिए मान्यता की ज़रूरत नहीं है।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Write a German CV and application', 'जर्मन CV र आवेदन लेख्नुहोस्', 'जर्मन CV और आवेदन लिखें'), href: '/guides/write-a-german-cv' },
      { kind: 'guide', title: L('Get an EU Blue Card', 'EU Blue Card लिनुहोस्', 'EU Blue Card लें'), href: '/guides/get-an-eu-blue-card' },
    ],
    sources: [S.anerkennung, S.zabFaq],
  },
  {
    slug: 'find-an-internship',
    title: L('Find an internship', 'इन्टर्नसिप खोज्नुहोस्', 'इंटर्नशिप खोजें'),
    term: { term: 'Praktikum' },
    stage: 'career',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Internships give German work experience for your CV. Whether one counts towards your work limit depends on whether your study programme requires it.',
        'इन्टर्नसिपले CV का लागि जर्मन कामको अनुभव दिन्छ। यो तपाईंको कामको सीमामा गनिन्छ कि गनिँदैन भन्ने कुरा तपाईंको पढाइ कार्यक्रमले यसलाई अनिवार्य गर्छ कि गर्दैन भन्नेमा भर पर्छ।',
        'इंटर्नशिप से CV के लिए जर्मन कार्य अनुभव मिलता है। यह आपकी काम की सीमा में गिनी जाएगी या नहीं, यह इस पर निर्भर है कि आपका कोर्स इसे अनिवार्य करता है या नहीं।',
      ),
      when: L('From your second or third semester — apply 3–6 months ahead.', 'दोस्रो वा तेस्रो सेमेस्टरदेखि — ३–६ महिनाअघि आवेदन दिनुहोस्।', 'दूसरे या तीसरे सेमेस्टर से — 3–6 महीने पहले आवेदन करें।'),
      deadline: L('Deadline in each advert', 'हरेक विज्ञापनमा लेखिएको समयसीमा', 'हर विज्ञापन में लिखी समयसीमा'),
    },
    steps: [
      {
        title: L('Check if it is compulsory', 'अनिवार्य हो कि जाँच्नुहोस्', 'जांचें कि यह अनिवार्य है या नहीं'),
        body: L(
          'A compulsory internship in your study regulations does not count towards the 140 full days. A voluntary internship does — even if it is unpaid.',
          'पढाइको नियममा अनिवार्य इन्टर्नसिप १४० पूरा दिनमा गनिँदैन। स्वैच्छिक इन्टर्नसिप गनिन्छ — निःशुल्क भए पनि।',
          'पढ़ाई के नियमों में अनिवार्य इंटर्नशिप 140 पूरे दिनों में नहीं गिनी जाती। स्वैच्छिक इंटर्नशिप गिनी जाती है — बिना वेतन हो तब भी।',
        ),
        term: { term: 'Pflichtpraktikum' },
      },
      {
        title: L('Search where companies post', 'कम्पनीहरूले राख्ने ठाउँमा खोज्नुहोस्', 'जहां कंपनियां पोस्ट करती हैं, वहां खोजें'),
        body: L(
          'Your university’s job portal and careers service, the Federal Employment Agency’s job board, and company websites.',
          'विश्वविद्यालयको जब पोर्टल र करियर सेवा, संघीय रोजगार एजेन्सीको जब बोर्ड, र कम्पनीका वेबसाइट।',
          'विश्वविद्यालय का जॉब पोर्टल और करियर सेवा, संघीय रोज़गार एजेंसी का जॉब बोर्ड, और कंपनियों की वेबसाइटें।',
        ),
      },
      {
        title: L('Know your pay rights', 'तलबसम्बन्धी अधिकार बुझ्नुहोस्', 'वेतन के अधिकार जानें'),
        body: L(
          'Voluntary internships longer than three months usually have to pay at least the minimum wage (€13.90 an hour in 2026). Compulsory internships don’t.',
          'तीन महिनाभन्दा लामो स्वैच्छिक इन्टर्नसिपमा प्रायः कम्तीमा न्यूनतम ज्याला (२०२६ मा प्रतिघण्टा €१३.९०) दिनुपर्छ। अनिवार्यमा पर्दैन।',
          'तीन महीने से लंबी स्वैच्छिक इंटर्नशिप में आमतौर पर कम से कम न्यूनतम वेतन (2026 में €13.90 प्रति घंटा) देना होता है। अनिवार्य में नहीं।',
        ),
        term: { term: 'Mindestlohn' },
      },
    ],
    documents: [L('CV and cover letter', 'CV र आवेदन पत्र', 'CV और कवर लेटर'), L('Enrolment certificate', 'भर्ना प्रमाणपत्र', 'दाख़िला प्रमाणपत्र'), L('Study regulations page showing a compulsory internship', 'अनिवार्य इन्टर्नसिप देखाउने पढाइ नियमको पाना', 'अनिवार्य इंटर्नशिप दिखाने वाला पढ़ाई नियम का पेज')],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'Voluntary internships use up your work days. Log them in the work-limit tool.',
          'स्वैच्छिक इन्टर्नसिपले तपाईंका कामका दिन खर्च गर्छ। कामको सीमा उपकरणमा लेख्नुहोस्।',
          'स्वैच्छिक इंटर्नशिप आपके काम के दिन ख़र्च करती है। उन्हें काम-सीमा टूल में दर्ज करें।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Work-limit tracker', 'कामको सीमा ट्र्याकर', 'काम-सीमा ट्रैकर'), href: '/tools/work-limit' },
      { kind: 'guide', title: L('Write a German CV and application', 'जर्मन CV र आवेदन लेख्नुहोस्', 'जर्मन CV और आवेदन लिखें'), href: '/guides/write-a-german-cv' },
    ],
    sources: [S.daadSideJobs, S.drvMinijob603],
  },
  {
    slug: 'register-as-job-seeker',
    title: L('Register with the employment agency', 'रोजगार एजेन्सीमा दर्ता गर्नुहोस्', 'रोज़गार एजेंसी में पंजीकरण करें'),
    term: { term: 'arbeitsuchend melden' },
    stage: 'career',
    readingMinutes: 3,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'The Federal Employment Agency helps you find work for free. If you have a job that is ending, registering in time is required by law.',
        'संघीय रोजगार एजेन्सीले निःशुल्क काम खोज्न सहयोग गर्छ। तपाईंको काम सकिँदै छ भने समयमै दर्ता गर्नु कानुनी रूपमा अनिवार्य छ।',
        'संघीय रोज़गार एजेंसी मुफ़्त में नौकरी खोजने में मदद करती है। अगर आपकी नौकरी ख़त्म हो रही है, तो समय पर पंजीकरण क़ानूनन ज़रूरी है।',
      ),
      when: L('When you start looking for work — or as soon as you know your job will end.', 'काम खोज्न थाल्दा — वा काम सकिने थाहा पाउनेबित्तिकै।', 'जब आप नौकरी खोजना शुरू करें — या जैसे ही पता चले कि नौकरी ख़त्म होगी।'),
      deadline: L('At least 3 months before a job ends (or within 3 days if you learn later)', 'काम सकिनुभन्दा कम्तीमा ३ महिनाअघि (पछि थाहा भए ३ दिनभित्र)', 'नौकरी ख़त्म होने से कम से कम 3 महीने पहले (बाद में पता चले तो 3 दिन में)'),
    },
    steps: [
      {
        title: L('Register online or by phone', 'अनलाइन वा फोनबाट दर्ता गर्नुहोस्', 'ऑनलाइन या फ़ोन से पंजीकरण करें'),
        body: L(
          'Register on arbeitsagentur.de or call 0800 4555 500 (free).',
          'arbeitsagentur.de मा दर्ता गर्नुहोस् वा ०८०० ४५५५ ५०० (निःशुल्क) मा फोन गर्नुहोस्।',
          'arbeitsagentur.de पर पंजीकरण करें या 0800 4555 500 (मुफ़्त) पर कॉल करें।',
        ),
        cost: FREE,
      },
      {
        title: L('Meet your advisor', 'आफ्नो सल्लाहकारलाई भेट्नुहोस्', 'अपने सलाहकार से मिलें'),
        body: L(
          'You get job offers, application checks and information on courses. Bring your CV.',
          'तपाईंले कामका प्रस्ताव, आवेदन जाँच र तालिमको जानकारी पाउनुहुन्छ। CV लैजानुहोस्।',
          'आपको नौकरी के ऑफ़र, आवेदन की जांच और कोर्स की जानकारी मिलती है। CV साथ लाएं।',
        ),
      },
      {
        title: L('Check what the job search means for your permit', 'काम खोजले अनुमतिपत्रमा के असर गर्छ जाँच्नुहोस्', 'जांचें कि नौकरी खोज का परमिट पर क्या असर है'),
        body: L(
          'After graduation you can get a job-search permit for up to 18 months. Tell the foreigners’ office if your job ends.',
          'स्नातकपछि १८ महिनासम्मको काम खोज अनुमति पाउन सकिन्छ। काम सकिएमा विदेशी कार्यालयलाई जानकारी दिनुहोस्।',
          'स्नातक के बाद 18 महीने तक का नौकरी खोज परमिट मिल सकता है। नौकरी ख़त्म हो तो विदेशी कार्यालय को बताएं।',
        ),
      },
    ],
    documents: [L('CV', 'CV', 'CV'), PASSPORT, L('Employment contract and notice of termination (if any)', 'रोजगार सम्झौता र अन्त्यको सूचना (भए)', 'रोज़गार अनुबंध और समाप्ति की सूचना (अगर हो)')],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'Registering too late can mean a blocking period for unemployment benefit.',
          'ढिलो दर्ता गर्दा बेरोजगारी भत्तामा रोक अवधि लाग्न सक्छ।',
          'देर से पंजीकरण करने पर बेरोज़गारी भत्ते पर रोक की अवधि लग सकती है।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Stay and look for work after graduation', 'स्नातकपछि बसेर काम खोज्नुहोस्', 'स्नातक के बाद रहकर नौकरी खोजें'), href: '/guides/job-search-after-graduation' },
      { kind: 'guide', title: L('Write a German CV and application', 'जर्मन CV र आवेदन लेख्नुहोस्', 'जर्मन CV और आवेदन लिखें'), href: '/guides/write-a-german-cv' },
    ],
    sources: [S.baJobseeker],
  },
  {
    slug: 'get-an-eu-blue-card',
    title: L('Get an EU Blue Card', 'EU Blue Card लिनुहोस्', 'EU Blue Card लें'),
    term: { term: 'Blaue Karte EU' },
    stage: 'career',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A residence permit for graduates with a qualified job and a minimum salary. It leads faster to a settlement permit.',
        'योग्यताअनुसारको काम र न्यूनतम तलब भएका स्नातकका लागि आवास अनुमतिपत्र। यसले छिटो स्थायी बसोबास अनुमतितर्फ लैजान्छ।',
        'योग्य नौकरी और न्यूनतम वेतन वाले स्नातकों के लिए निवास परमिट। इससे स्थायी निवास परमिट जल्दी मिलता है।',
      ),
      when: L('When you have a job offer that matches your degree.', 'डिग्रीअनुसारको कामको प्रस्ताव पाएपछि।', 'जब डिग्री के अनुरूप नौकरी का ऑफ़र मिले।'),
      deadline: L('Before your current permit ends', 'हालको अनुमतिपत्रको म्याद सकिनुअघि', 'मौजूदा परमिट ख़त्म होने से पहले'),
    },
    steps: [
      {
        title: L('Check the salary threshold', 'तलबको सीमा जाँच्नुहोस्', 'वेतन सीमा जांचें'),
        body: L(
          '2026: at least €50,700 gross a year. €45,934.20 is enough for shortage occupations and for graduates whose degree is less than three years old — then the Federal Employment Agency must agree.',
          '२०२६: वर्षमा कम्तीमा €५०,७०० कुल तलब। अभाव भएका पेशा र तीन वर्षभन्दा नयाँ डिग्री भएका स्नातकका लागि €४५,९३४.२० पुग्छ — त्यस अवस्थामा संघीय रोजगार एजेन्सीको सहमति चाहिन्छ।',
          '2026: साल में कम से कम €50,700 सकल वेतन। कमी वाले पेशों और तीन साल से नई डिग्री वाले स्नातकों के लिए €45,934.20 काफ़ी है — तब संघीय रोज़गार एजेंसी की सहमति ज़रूरी है।',
        ),
      },
      {
        title: L('Get the employer’s documents', 'रोजगारदाताका कागजात लिनुहोस्', 'नियोक्ता के दस्तावेज़ लें'),
        body: L(
          'You need the signed contract or a binding job offer, and often the form “Erklärung zum Beschäftigungsverhältnis” filled in by the employer.',
          'हस्ताक्षर गरिएको सम्झौता वा बाध्यकारी कामको प्रस्ताव, र प्रायः रोजगारदाताले भरेको “Erklärung zum Beschäftigungsverhältnis” फारम चाहिन्छ।',
          'आपको हस्ताक्षरित अनुबंध या बाध्यकारी नौकरी ऑफ़र चाहिए, और अक्सर नियोक्ता द्वारा भरा “Erklärung zum Beschäftigungsverhältnis” फ़ॉर्म।',
        ),
      },
      {
        title: L('Apply at the foreigners’ office', 'विदेशी कार्यालयमा आवेदन दिनुहोस्', 'विदेशी कार्यालय में आवेदन करें'),
        body: L(
          'In Leipzig you apply online for residence for employment. Apply before your current permit ends.',
          'लाइपजिगमा रोजगारीका लागि आवासको अनलाइन आवेदन दिनुहुन्छ। हालको अनुमतिपत्रको म्याद सकिनुअघि आवेदन दिनुहोस्।',
          'लाइपज़िग में आप रोज़गार के लिए निवास का ऑनलाइन आवेदन करते हैं। मौजूदा परमिट ख़त्म होने से पहले आवेदन करें।',
        ),
        where: L('Ausländerbehörde (online application)', 'Ausländerbehörde (अनलाइन आवेदन)', 'Ausländerbehörde (ऑनलाइन आवेदन)'),
      },
    ],
    documents: [PASSPORT, L('Employment contract or binding job offer', 'रोजगार सम्झौता वा बाध्यकारी कामको प्रस्ताव', 'रोज़गार अनुबंध या बाध्यकारी नौकरी ऑफ़र'), DEGREE, L('Proof of health insurance', 'स्वास्थ्य बीमाको प्रमाण', 'स्वास्थ्य बीमा का सबूत'), L('Rental contract', 'भाडा सम्झौता', 'किराया अनुबंध')],
    callouts: [
      {
        kind: 'tip',
        text: L('The salary thresholds change every year — check the current figure before you negotiate.', 'तलबको सीमा हरेक वर्ष बदलिन्छ — वार्ता गर्नुअघि हालको अंक जाँच्नुहोस्।', 'वेतन सीमा हर साल बदलती है — बातचीत से पहले मौजूदा आंकड़ा देखें।'),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Get a settlement permit', 'स्थायी बसोबास अनुमति लिनुहोस्', 'स्थायी निवास परमिट लें'), href: '/guides/get-a-settlement-permit' },
      { kind: 'tool', title: L('Net pay calculator', 'खुद तलब क्याल्कुलेटर', 'शुद्ध वेतन कैलकुलेटर'), href: '/tools/net-pay' },
    ],
    sources: [S.baBlueCard2026, S.mkigBlueCard, S.leipzigOnlineWork],
  },
  {
    slug: 'get-a-settlement-permit',
    title: L('Get a settlement permit', 'स्थायी बसोबास अनुमति लिनुहोस्', 'स्थायी निवास परमिट लें'),
    term: { term: 'Niederlassungserlaubnis' },
    stage: 'career',
    readingMinutes: 5,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A permanent residence permit: no end date and any job allowed. Graduates of German universities can get it after two years of qualified work.',
        'स्थायी आवास अनुमति: कुनै म्याद हुँदैन र जुनसुकै काम गर्न पाइन्छ। जर्मन विश्वविद्यालयका स्नातकले योग्यताअनुसारको दुई वर्षको कामपछि पाउन सक्छन्।',
        'स्थायी निवास परमिट: कोई अंतिम तारीख नहीं और कोई भी नौकरी करने की अनुमति। जर्मन विश्वविद्यालयों के स्नातक दो साल के योग्य काम के बाद इसे पा सकते हैं।',
      ),
      when: L('After two years of work with a German degree — earlier with a Blue Card and B1 German.', 'जर्मन डिग्रीसहित दुई वर्ष काम गरेपछि — Blue Card र B1 जर्मन भए अझ छिटो।', 'जर्मन डिग्री के साथ दो साल काम के बाद — Blue Card और B1 जर्मन से और जल्दी।'),
      deadline: L('No deadline', 'कुनै समयसीमा छैन', 'कोई समयसीमा नहीं'),
    },
    steps: [
      {
        title: L('Check the conditions', 'सर्तहरू जाँच्नुहोस्', 'शर्तें जांचें'),
        body: L(
          'With a German degree: two years with a residence permit for work, 24 months of pension contributions, a job that matches your degree and German at B1. With a Blue Card: after 21 months with B1 German.',
          'जर्मन डिग्रीसहित: कामका लागि आवास अनुमतिपत्रसहित दुई वर्ष, २४ महिनाको पेन्सन योगदान, डिग्रीअनुसारको काम र B1 जर्मन। Blue Card सहित: B1 जर्मनसहित २१ महिनापछि।',
          'जर्मन डिग्री के साथ: काम के निवास परमिट के साथ दो साल, 24 महीने का पेंशन योगदान, डिग्री के अनुरूप नौकरी और B1 जर्मन। Blue Card के साथ: B1 जर्मन के साथ 21 महीने बाद।',
        ),
      },
      {
        title: L('Collect the proofs', 'प्रमाणहरू जम्मा गर्नुहोस्', 'सबूत इकट्ठा करें'),
        body: L(
          'Your pension insurance statement shows the months of contributions. You also need a German B1 certificate and proof of basic knowledge of life in Germany (e.g. the “Leben in Deutschland” test).',
          'पेन्सन बीमाको विवरणले योगदानका महिना देखाउँछ। B1 जर्मन प्रमाणपत्र र जर्मनीको जीवनबारे आधारभूत ज्ञानको प्रमाण (जस्तै “Leben in Deutschland” परीक्षा) पनि चाहिन्छ।',
          'पेंशन बीमा का विवरण योगदान के महीने दिखाता है। B1 जर्मन प्रमाणपत्र और जर्मनी में जीवन के बुनियादी ज्ञान का सबूत (जैसे “Leben in Deutschland” टेस्ट) भी चाहिए।',
        ),
        term: { term: 'Versicherungsverlauf' },
      },
      {
        title: L('Apply at the foreigners’ office', 'विदेशी कार्यालयमा आवेदन दिनुहोस्', 'विदेशी कार्यालय में आवेदन करें'),
        body: L(
          'Apply before your current permit ends. If you apply in time, your current permit stays valid while they decide.',
          'हालको अनुमतिपत्रको म्याद सकिनुअघि आवेदन दिनुहोस्। समयमै आवेदन दिए निर्णय नहुँदासम्म हालको अनुमतिपत्र मान्य रहन्छ।',
          'मौजूदा परमिट ख़त्म होने से पहले आवेदन करें। समय पर आवेदन करें तो फ़ैसले तक मौजूदा परमिट मान्य रहता है।',
        ),
      },
    ],
    documents: [PASSPORT, L('Pension insurance statement', 'पेन्सन बीमा विवरण', 'पेंशन बीमा विवरण'), L('Employment contract and recent payslips', 'रोजगार सम्झौता र हालका तलब पर्ची', 'रोज़गार अनुबंध और हाल की वेतन पर्चियां'), L('German B1 certificate', 'B1 जर्मन प्रमाणपत्र', 'B1 जर्मन प्रमाणपत्र'), L('German degree certificate', 'जर्मन डिग्री प्रमाणपत्र', 'जर्मन डिग्री प्रमाणपत्र')],
    callouts: [
      {
        kind: 'tip',
        text: L('Start learning German early — B1 is the step most people need the most time for.', 'जर्मन चाँडै सिक्न सुरु गर्नुहोस् — धेरैलाई सबैभन्दा बढी समय B1 मा लाग्छ।', 'जर्मन जल्दी सीखना शुरू करें — ज़्यादातर लोगों को सबसे ज़्यादा समय B1 में लगता है।'),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Learn German', 'जर्मन भाषा सिक्नुहोस्', 'जर्मन सीखें'), href: '/guides/learn-german' },
      { kind: 'guide', title: L('Get an EU Blue Card', 'EU Blue Card लिनुहोस्', 'EU Blue Card लें'), href: '/guides/get-an-eu-blue-card' },
    ],
    sources: [S.mkigSettlement, S.bamfSettle],
  },
];
