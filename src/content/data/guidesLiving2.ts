import type { Guide } from '../types';
import { CHECKED, FREE, L, NOT_ADVICE, S } from './util';

const PASSPORT = L('Passport', 'राहदानी', 'पासपोर्ट');

export const guidesLiving2: Guide[] = [
  {
    slug: 'get-liability-insurance',
    title: L('Get liability insurance', 'दायित्व बीमा लिनुहोस्', 'देयता बीमा लें'),
    term: { term: 'Privathaftpflichtversicherung' },
    stage: 'living',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Pays when you accidentally damage someone else’s things or hurt someone — for example a flooded flat below yours or a broken laptop. It is not compulsory, but consumer advice centres call it a must.',
        'तपाईंले गल्तीले अरूको सामान बिगार्दा वा कसैलाई चोट पुर्‍याउँदा तिर्छ — जस्तै तलको फ्ल्याटमा पानी पस्दा वा ल्यापटप फुट्दा। यो अनिवार्य होइन, तर उपभोक्ता परामर्श केन्द्रहरू यसलाई अत्यावश्यक मान्छन्।',
        'जब आप गलती से किसी और का सामान ख़राब करते हैं या किसी को चोट पहुंचाते हैं, तब यह भुगतान करता है — जैसे नीचे वाले फ़्लैट में पानी भरना या लैपटॉप टूटना। यह अनिवार्य नहीं है, लेकिन उपभोक्ता सलाह केंद्र इसे ज़रूरी मानते हैं।',
      ),
      when: L('As soon as you live in your own room or flat.', 'आफ्नै कोठा वा फ्ल्याटमा बस्न थालेपछि तुरुन्तै।', 'जैसे ही आप अपने कमरे या फ़्लैट में रहने लगें।'),
      deadline: L('No deadline — but damage before you are insured is not covered', 'कुनै समयसीमा छैन — तर बीमा हुनुअघिको क्षति कभर हुँदैन', 'कोई समयसीमा नहीं — लेकिन बीमा से पहले का नुकसान कवर नहीं होता'),
    },
    steps: [
      {
        title: L('Check whether you are already covered', 'पहिले नै कभर हुनुहुन्छ कि जाँच्नुहोस्', 'जांचें कि आप पहले से कवर हैं या नहीं'),
        body: L(
          'Some landlords or rental contracts ask for it. Parents’ policies in Germany can cover children in their first training — but only if your parents have a German policy, which is rare for newcomers.',
          'केही घरधनी वा भाडा सम्झौताले यो माग्छन्। जर्मनीमा आमाबुबाको बीमाले पहिलो तालिममा रहेका सन्तानलाई कभर गर्न सक्छ — तर आमाबुबासँग जर्मन बीमा भएमा मात्र, जुन नयाँ आउनेहरूमा विरलै हुन्छ।',
          'कुछ मकान मालिक या किराया अनुबंध इसे मांगते हैं। जर्मनी में माता-पिता की पॉलिसी पहली ट्रेनिंग में बच्चों को कवर कर सकती है — लेकिन तभी जब माता-पिता की जर्मन पॉलिसी हो, जो नए आने वालों में कम होता है।',
        ),
      },
      {
        title: L('Compare a few offers', 'केही प्रस्ताव तुलना गर्नुहोस्', 'कुछ ऑफ़र की तुलना करें'),
        body: L(
          'A single-person policy is usually enough. Choose cover of at least €10 million (better €50 million). Paying once a year is usually cheaper than monthly.',
          'एक व्यक्तिको बीमा प्रायः पर्याप्त हुन्छ। कम्तीमा €१ करोड (राम्रो €५ करोड) को कभर छान्नुहोस्। वर्षमा एकपटक तिर्नु प्रायः मासिकभन्दा सस्तो हुन्छ।',
          'अकेले व्यक्ति की पॉलिसी आमतौर पर काफ़ी है। कम से कम €1 करोड़ (बेहतर €5 करोड़) का कवर चुनें। साल में एक बार भुगतान आमतौर पर मासिक से सस्ता होता है।',
        ),
        cost: L('A good basic policy: about €60–80 a year', 'राम्रो आधारभूत बीमा: वर्षको करिब €६०–८०', 'अच्छी बुनियादी पॉलिसी: साल के लगभग €60–80'),
      },
      {
        title: L('Sign up online', 'अनलाइन दर्ता गर्नुहोस्', 'ऑनलाइन साइन अप करें'),
        body: L(
          'You need your German address and bank account. Cover starts on the date in your policy — keep the policy document.',
          'जर्मन ठेगाना र बैंक खाता चाहिन्छ। बीमामा लेखिएको मितिदेखि कभर सुरु हुन्छ — बीमा कागजात राख्नुहोस्।',
          'आपको जर्मन पता और बैंक खाता चाहिए। कवर पॉलिसी में लिखी तारीख से शुरू होता है — पॉलिसी का दस्तावेज़ रखें।',
        ),
        term: { term: 'Versicherungsschein' },
      },
    ],
    documents: [PASSPORT, L('German address', 'जर्मन ठेगाना', 'जर्मन पता'), L('German bank account (IBAN)', 'जर्मन बैंक खाता (IBAN)', 'जर्मन बैंक खाता (IBAN)')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Check that “damage to rented property” (Mietsachschäden) is included — that is the most common case for tenants.',
          '“भाडाको सम्पत्तिमा क्षति” (Mietsachschäden) समावेश छ कि जाँच्नुहोस् — भाडावालका लागि यो सबैभन्दा सामान्य अवस्था हो।',
          'जांचें कि “किराए की संपत्ति को नुकसान” (Mietsachschäden) शामिल है — किरायेदारों के लिए यह सबसे आम मामला है।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Liability insurance doesn’t cover your own things. For theft or fire in your room you need household contents insurance (Hausratversicherung).',
          'दायित्व बीमाले तपाईंको आफ्नै सामान कभर गर्दैन। कोठामा चोरी वा आगलागीका लागि घरायसी सामान बीमा (Hausratversicherung) चाहिन्छ।',
          'देयता बीमा आपके अपने सामान को कवर नहीं करता। कमरे में चोरी या आग के लिए घरेलू सामान बीमा (Hausratversicherung) चाहिए।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Find a room in Leipzig', 'लाइपजिगमा कोठा खोज्नुहोस्', 'लाइपज़िग में कमरा खोजें'), href: '/guides/find-housing-leipzig' },
      { kind: 'tool', title: L('Plan your monthly budget', 'मासिक बजेट योजना बनाउनुहोस्', 'मासिक बजट की योजना बनाएं'), href: '/tools/budget' },
    ],
    sources: [S.vzLiability, S.vzStudentInsurance],
  },
  {
    slug: 'separate-your-waste',
    title: L('Separate your waste', 'फोहोर छुट्याउनुहोस्', 'कचरा अलग करें'),
    term: { term: 'Mülltrennung' },
    stage: 'living',
    city: 'leipzig',
    readingMinutes: 3,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'In Germany each kind of waste has its own bin. Neighbours and landlords take it seriously, and wrong sorting can cost your building extra.',
        'जर्मनीमा हरेक प्रकारको फोहोरको आफ्नै बिन हुन्छ। छिमेकी र घरधनी यसलाई गम्भीर रूपमा लिन्छन्, र गलत छुट्याउँदा भवनलाई थप खर्च लाग्न सक्छ।',
        'जर्मनी में हर तरह के कचरे का अपना डिब्बा होता है। पड़ोसी और मकान मालिक इसे गंभीरता से लेते हैं, और गलत छंटाई से इमारत पर अतिरिक्त ख़र्च आ सकता है।',
      ),
      when: L('From your first day in the flat.', 'फ्ल्याटमा पहिलो दिनदेखि।', 'फ़्लैट में पहले दिन से।'),
      deadline: L('No deadline', 'कुनै समयसीमा छैन', 'कोई समयसीमा नहीं'),
    },
    steps: [
      {
        title: L('Yellow bin: packaging', 'पहेँलो बिन: प्याकेजिङ', 'पीला डिब्बा: पैकेजिंग'),
        body: L(
          'Plastic, metal and drink cartons — empty, no need to wash. In Leipzig the “Gelbe Tonne PLUS” also takes other items made of plastic or metal. No electrical devices.',
          'प्लास्टिक, धातु र पेय पदार्थका कार्टुन — खाली गरेर, धुनु पर्दैन। लाइपजिगमा “Gelbe Tonne PLUS” मा प्लास्टिक वा धातुका अन्य सामान पनि हाल्न मिल्छ। बिजुली उपकरण होइन।',
          'प्लास्टिक, धातु और पेय कार्टन — ख़ाली करके, धोने की ज़रूरत नहीं। लाइपज़िग में “Gelbe Tonne PLUS” में प्लास्टिक या धातु की दूसरी चीज़ें भी डाल सकते हैं। बिजली के उपकरण नहीं।',
        ),
        term: { term: 'Gelbe Tonne' },
      },
      {
        title: L('Blue bin: paper and cardboard', 'निलो बिन: कागज र कार्डबोर्ड', 'नीला डिब्बा: काग़ज़ और गत्ता'),
        body: L(
          'Clean, dry paper and boxes. A pizza box only if it is lightly soiled — otherwise it goes in the general waste.',
          'सफा, सुक्खा कागज र बाकस। पिज्जा बाकस थोरै फोहोर भए मात्र — नत्र सामान्य फोहोरमा।',
          'साफ़, सूखा काग़ज़ और डिब्बे। पिज़्ज़ा बॉक्स केवल हल्का गंदा हो तो — वरना सामान्य कचरे में।',
        ),
        term: { term: 'Blaue Tonne' },
      },
      {
        title: L('Brown bin: food waste', 'खैरो बिन: खानाको फोहोर', 'भूरा डिब्बा: खाने का कचरा'),
        body: L(
          'Food leftovers, coffee grounds, tea bags, plant cuttings. No plastic bags — not even “compostable” ones.',
          'बाँकी खाना, कफीको धुलो, चियाको झोला, बिरुवाका पात। प्लास्टिक झोला होइन — “कम्पोस्ट हुने” भनिएका पनि होइन।',
          'बचा हुआ खाना, कॉफ़ी का चूरा, टी-बैग, पौधों की कटाई। प्लास्टिक की थैली नहीं — “कम्पोस्ट होने वाली” भी नहीं।',
        ),
        term: { term: 'Biotonne' },
      },
      {
        title: L('Glass containers and general waste', 'सिसाको कन्टेनर र सामान्य फोहोर', 'कांच के कंटेनर और सामान्य कचरा'),
        body: L(
          'Bottles and jars go into the street containers by colour (unclear colours into green). Everything else — hygiene items, vacuum bags, porcelain — into the grey general waste bin.',
          'बोतल र भाँडा रङअनुसार सडकका कन्टेनरमा (अस्पष्ट रङ हरियोमा)। बाँकी सबै — सरसफाइ सामग्री, भ्याकुम झोला, पोर्सिलेन — खैरो-कालो सामान्य फोहोर बिनमा।',
          'बोतलें और जार रंग के अनुसार सड़क के कंटेनर में (अस्पष्ट रंग हरे में)। बाक़ी सब — स्वच्छता सामग्री, वैक्यूम बैग, पोर्सिलेन — धूसर सामान्य कचरे के डिब्बे में।',
        ),
        term: { term: 'Restabfall' },
      },
    ],
    documents: [L('Nothing needed', 'केही चाहिँदैन', 'कुछ नहीं चाहिए')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Bottles and cans with the “Pfand” logo are worth money: return them at any supermarket machine and get 8–25 cents each.',
          '“Pfand” चिन्ह भएका बोतल र क्यानको पैसा फिर्ता आउँछ: जुनसुकै सुपरमार्केटको मेसिनमा फिर्ता गर्नुहोस् र प्रत्येकमा ८–२५ सेन्ट पाउनुहोस्।',
          '“Pfand” निशान वाली बोतलें और कैन पैसे वापस दिलाते हैं: किसी भी सुपरमार्केट की मशीन में लौटाएं और हर एक पर 8–25 सेंट पाएं।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Old electronics and batteries never go in the household bins. Take them to a recycling centre (Wertstoffhof) or back to the shop.',
          'पुराना इलेक्ट्रोनिक सामान र ब्याट्री घरायसी बिनमा कहिल्यै नहाल्नुहोस्। पुनःप्रयोग केन्द्र (Wertstoffhof) वा पसलमा फिर्ता लैजानुहोस्।',
          'पुराने इलेक्ट्रॉनिक सामान और बैटरी कभी घरेलू डिब्बों में न डालें। उन्हें रीसाइक्लिंग केंद्र (Wertstoffhof) या दुकान पर वापस ले जाएं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Find a room in Leipzig', 'लाइपजिगमा कोठा खोज्नुहोस्', 'लाइपज़िग में कमरा खोजें'), href: '/guides/find-housing-leipzig' },
      { kind: 'guide', title: L('Check your utility bill', 'उपयोगिता बिल जाँच्नुहोस्', 'उपयोगिता बिल जांचें'), href: '/guides/check-your-utility-bill' },
    ],
    sources: [S.srlSorting, S.leipzigSorting],
  },
  {
    slug: 'learn-german',
    title: L('Learn German', 'जर्मन भाषा सिक्नुहोस्', 'जर्मन सीखें'),
    term: { term: 'Deutschkurs' },
    stage: 'living',
    city: 'leipzig',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'German opens doors: student jobs, flats, friends — and later a settlement permit, which needs B1 German.',
        'जर्मन भाषाले ढोका खोल्छ: विद्यार्थी काम, फ्ल्याट, साथी — र पछि स्थायी बसोबास अनुमति, जसका लागि B1 जर्मन चाहिन्छ।',
        'जर्मन भाषा दरवाज़े खोलती है: छात्र नौकरी, फ़्लैट, दोस्त — और बाद में स्थायी निवास परमिट, जिसके लिए B1 जर्मन चाहिए।',
      ),
      when: L('Start in your first semester — even with an English-taught programme.', 'पहिलो सेमेस्टरमै सुरु गर्नुहोस् — अंग्रेजी माध्यमको कार्यक्रम भए पनि।', 'पहले सेमेस्टर में शुरू करें — अंग्रेज़ी माध्यम का कोर्स हो तब भी।'),
      deadline: L('No deadline', 'कुनै समयसीमा छैन', 'कोई समयसीमा नहीं'),
    },
    steps: [
      {
        title: L('Take a course at your university', 'विश्वविद्यालयमा कक्षा लिनुहोस्', 'विश्वविद्यालय में कोर्स करें'),
        body: L(
          'Leipzig University offers German courses alongside your studies (Studienkolleg Sachsen) and at the Language Centre. Students often pay reduced prices — check the current fees.',
          'लाइपजिग विश्वविद्यालयले पढाइसँगै जर्मन कक्षा (Studienkolleg Sachsen) र भाषा केन्द्रमा कक्षा दिन्छ। विद्यार्थीले प्रायः छुट मूल्य तिर्छन् — हालको शुल्क जाँच्नुहोस्।',
          'लाइपज़िग विश्वविद्यालय पढ़ाई के साथ जर्मन कोर्स (Studienkolleg Sachsen) और भाषा केंद्र में कोर्स देता है। छात्र अक्सर कम कीमत देते हैं — मौजूदा फ़ीस देखें।',
        ),
      },
      {
        title: L('Need it faster? Take an intensive course', 'छिटो चाहियो? गहन कक्षा लिनुहोस्', 'जल्दी चाहिए? गहन कोर्स करें'),
        body: L(
          'interDaF at Leipzig University runs paid intensive courses from A1 to C1, about two months each.',
          'लाइपजिग विश्वविद्यालयको interDaF ले A1 देखि C1 सम्म सशुल्क गहन कक्षा चलाउँछ, प्रत्येक करिब दुई महिनाको।',
          'लाइपज़िग विश्वविद्यालय का interDaF A1 से C1 तक शुल्क वाले गहन कोर्स चलाता है, हर एक लगभग दो महीने का।',
        ),
      },
      {
        title: L('Practise for free', 'निःशुल्क अभ्यास गर्नुहोस्', 'मुफ़्त अभ्यास करें'),
        body: L(
          'Find a tandem partner at the Language Centre: you teach Nepali, Hindi or English, they teach German. Use the phrasebook in this app for everyday situations.',
          'भाषा केन्द्रमा ट्यान्डम साथी खोज्नुहोस्: तपाईं नेपाली, हिन्दी वा अंग्रेजी सिकाउनुहुन्छ, उनीहरू जर्मन। दैनिक अवस्थाका लागि यो एपको वाक्यपुस्तिका प्रयोग गर्नुहोस्।',
          'भाषा केंद्र में टैंडम पार्टनर खोजें: आप नेपाली, हिंदी या अंग्रेज़ी सिखाएं, वे जर्मन। रोज़मर्रा की स्थितियों के लिए इस ऐप की वाक्य-पुस्तिका इस्तेमाल करें।',
        ),
        cost: FREE,
        term: { term: 'Sprachtandem' },
      },
      {
        title: L('Get a certificate', 'प्रमाणपत्र लिनुहोस्', 'प्रमाणपत्र लें'),
        body: L(
          'For jobs and permits you need proof, for example a Goethe, telc or TestDaF certificate at B1 or higher.',
          'काम र अनुमतिका लागि प्रमाण चाहिन्छ, जस्तै B1 वा माथिको Goethe, telc वा TestDaF प्रमाणपत्र।',
          'नौकरी और परमिट के लिए सबूत चाहिए, जैसे B1 या उससे ऊपर का Goethe, telc या TestDaF प्रमाणपत्र।',
        ),
        term: { term: 'Sprachzertifikat' },
      },
    ],
    documents: [L('Student ID or enrolment certificate (for student prices)', 'विद्यार्थी परिचयपत्र वा भर्ना प्रमाणपत्र (विद्यार्थी मूल्यका लागि)', 'छात्र पहचान-पत्र या दाख़िला प्रमाणपत्र (छात्र कीमत के लिए)'), PASSPORT],
    callouts: [
      {
        kind: 'tip',
        text: L('Even A2 German makes calls with offices, landlords and doctors much easier.', 'A2 जर्मनले पनि कार्यालय, घरधनी र डाक्टरसँगका कुरा धेरै सजिलो बनाउँछ।', 'A2 जर्मन से भी दफ़्तरों, मकान मालिकों और डॉक्टरों से बात बहुत आसान हो जाती है।'),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'tool', title: L('Phrasebook', 'वाक्यपुस्तिका', 'वाक्य-पुस्तिका'), href: '/tools/phrasebook' },
      { kind: 'guide', title: L('Get a settlement permit', 'स्थायी बसोबास अनुमति लिनुहोस्', 'स्थायी निवास परमिट लें'), href: '/guides/get-a-settlement-permit' },
    ],
    sources: [S.uniGermanCourses, S.uniSprachenzentrum, S.interDaf],
  },
  {
    slug: 'check-your-utility-bill',
    title: L('Check your utility bill', 'उपयोगिता बिल जाँच्नुहोस्', 'उपयोगिता बिल जांचें'),
    term: { term: 'Nebenkostenabrechnung' },
    stage: 'living',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'Once a year your landlord settles the advance payments for heating, water and building costs. You either get money back or have to pay extra.',
        'वर्षमा एकपटक घरधनीले तताउने, पानी र भवन खर्चको अग्रिम भुक्तानी हिसाब मिलाउँछ। तपाईंले पैसा फिर्ता पाउनुहुन्छ वा थप तिर्नुपर्छ।',
        'साल में एक बार मकान मालिक हीटिंग, पानी और इमारत के ख़र्चों के अग्रिम भुगतान का हिसाब करता है। या तो पैसा वापस मिलता है या ज़्यादा देना पड़ता है।',
      ),
      when: L('When the yearly statement arrives.', 'वार्षिक हिसाब आएपछि।', 'जब सालाना हिसाब आए।'),
      deadline: L('Objections within 12 months of receiving it', 'पाएको १२ महिनाभित्र आपत्ति', 'मिलने के 12 महीने के अंदर आपत्ति'),
    },
    steps: [
      {
        title: L('Check the date', 'मिति जाँच्नुहोस्', 'तारीख जांचें'),
        body: L(
          'The landlord must send the statement within 12 months after the end of the billing period. If it arrives later, they can usually no longer ask you to pay extra.',
          'घरधनीले बिलिङ अवधि सकिएको १२ महिनाभित्र हिसाब पठाउनुपर्छ। पछि आएमा प्रायः थप रकम माग्न पाउँदैनन्।',
          'मकान मालिक को बिलिंग अवधि ख़त्म होने के 12 महीने के अंदर हिसाब भेजना होता है। बाद में आए तो आमतौर पर अतिरिक्त भुगतान नहीं मांग सकते।',
        ),
      },
      {
        title: L('Compare it with your contract', 'सम्झौतासँग तुलना गर्नुहोस्', 'अनुबंध से तुलना करें'),
        body: L(
          'Only costs agreed in your rental contract may be charged. Check how costs are split (by m², people or meter readings) and that the period is right.',
          'भाडा सम्झौतामा तय भएका खर्च मात्र लिन पाइन्छ। खर्च कसरी बाँडिएको छ (वर्गमिटर, मान्छे वा मिटर रिडिङअनुसार) र अवधि सही छ कि जाँच्नुहोस्।',
          'केवल किराया अनुबंध में तय ख़र्च ही लिए जा सकते हैं। देखें कि ख़र्च कैसे बांटे गए हैं (वर्ग मीटर, लोग या मीटर रीडिंग से) और अवधि सही है।',
        ),
      },
      {
        title: L('Ask to see the receipts', 'रसिद हेर्न माग्नुहोस्', 'रसीदें देखने को कहें'),
        body: L(
          'You may look at the bills behind the statement. Write to your landlord if something looks wrong — keep a copy.',
          'हिसाबपछाडिका बिल हेर्ने अधिकार छ। केही गलत देखिए घरधनीलाई लेखेर पठाउनुहोस् — प्रतिलिपि राख्नुहोस्।',
          'आप हिसाब के पीछे के बिल देख सकते हैं। कुछ ग़लत लगे तो मकान मालिक को लिखें — एक कॉपी रखें।',
        ),
        term: { term: 'Belegeinsicht' },
      },
    ],
    documents: [L('Rental contract', 'भाडा सम्झौता', 'किराया अनुबंध'), L('The yearly statement', 'वार्षिक हिसाब', 'सालाना हिसाब'), L('Your own meter readings, if you have them', 'आफ्नै मिटर रिडिङ, छ भने', 'आपकी अपनी मीटर रीडिंग, अगर हो')],
    callouts: [
      {
        kind: 'tip',
        text: L(
          'Not sure? The Mieterverein checks statements for members — often worth it for one bill alone.',
          'शंका छ? Mieterverein ले सदस्यका लागि हिसाब जाँच्छ — एउटै बिलका लागि पनि प्रायः फाइदाजनक।',
          'पक्का नहीं? Mieterverein सदस्यों के लिए हिसाब जांचता है — अक्सर एक ही बिल के लिए भी फ़ायदेमंद।',
        ),
      },
      {
        kind: 'mistake',
        text: L(
          'Pay an extra amount on time even if you object — otherwise you risk reminders and fees. Your objection still counts.',
          'आपत्ति गरे पनि थप रकम समयमै तिर्नुहोस् — नत्र रिमाइन्डर र शुल्क लाग्न सक्छ। तपाईंको आपत्ति मान्य रहन्छ।',
          'आपत्ति करें तब भी अतिरिक्त रकम समय पर भरें — वरना रिमाइंडर और शुल्क लग सकते हैं। आपकी आपत्ति मान्य रहती है।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Find a room in Leipzig', 'लाइपजिगमा कोठा खोज्नुहोस्', 'लाइपज़िग में कमरा खोजें'), href: '/guides/find-housing-leipzig' },
      { kind: 'tool', title: L('Where to get help', 'सहयोग कहाँ पाउने', 'मदद कहाँ मिलेगी'), href: '/get-help' },
    ],
    sources: [S.bgb556, S.mietervereinFaq],
  },
  {
    slug: 'convert-your-driving-licence',
    title: L('Use or convert your driving licence', 'ड्राइभिङ लाइसेन्स प्रयोग वा रूपान्तरण गर्नुहोस्', 'ड्राइविंग लाइसेंस इस्तेमाल करें या बदलवाएं'),
    term: { term: 'Führerschein umschreiben' },
    stage: 'living',
    readingMinutes: 4,
    lastVerified: CHECKED,
    summary: {
      what: L(
        'A licence from Nepal or India is valid in Germany for 6 months after you move here. After that you need a German licence.',
        'नेपाल वा भारतको लाइसेन्स जर्मनी सरेपछि ६ महिनासम्म मान्य हुन्छ। त्यसपछि जर्मन लाइसेन्स चाहिन्छ।',
        'नेपाल या भारत का लाइसेंस जर्मनी आने के बाद 6 महीने तक मान्य है। उसके बाद जर्मन लाइसेंस चाहिए।',
      ),
      when: L('Only if you want to drive in Germany.', 'जर्मनीमा गाडी चलाउन चाहनुहुन्छ भने मात्र।', 'केवल अगर आप जर्मनी में गाड़ी चलाना चाहते हैं।'),
      deadline: L('6 months after you register your address', 'ठेगाना दर्ता गरेको ६ महिनापछि', 'पता पंजीकरण के 6 महीने बाद'),
    },
    steps: [
      {
        title: L('Drive with your licence for the first 6 months', 'पहिलो ६ महिना आफ्नै लाइसेन्सले चलाउनुहोस्', 'पहले 6 महीने अपने लाइसेंस से चलाएं'),
        body: L(
          'Carry your original licence and an international driving permit or a German translation.',
          'सक्कली लाइसेन्स र अन्तर्राष्ट्रिय ड्राइभिङ अनुमति वा जर्मन अनुवाद साथमा राख्नुहोस्।',
          'असली लाइसेंस और अंतरराष्ट्रीय ड्राइविंग परमिट या जर्मन अनुवाद साथ रखें।',
        ),
      },
      {
        title: L('Apply at the driving licence office', 'ड्राइभिङ लाइसेन्स कार्यालयमा आवेदन दिनुहोस्', 'ड्राइविंग लाइसेंस कार्यालय में आवेदन करें'),
        body: L(
          'Apply at the Fahrerlaubnisbehörde of your city. Nepal and India are not on the list of countries with simplified conversion, so you usually have to pass the theory and practical test — without the full number of driving lessons.',
          'आफ्नो सहरको Fahrerlaubnisbehörde मा आवेदन दिनुहोस्। नेपाल र भारत सजिलो रूपान्तरण हुने देशको सूचीमा छैनन्, त्यसैले प्रायः लिखित र व्यावहारिक परीक्षा पास गर्नुपर्छ — तर पूरा ड्राइभिङ कक्षा लिनु पर्दैन।',
          'अपने शहर के Fahrerlaubnisbehörde में आवेदन करें। नेपाल और भारत आसान रूपांतरण वाले देशों की सूची में नहीं हैं, इसलिए आमतौर पर लिखित और व्यावहारिक परीक्षा पास करनी होती है — पूरी ड्राइविंग क्लास के बिना।',
        ),
        term: { term: 'Fahrerlaubnisbehörde' },
      },
      {
        title: L('Prepare with a driving school', 'ड्राइभिङ स्कुलमार्फत तयारी गर्नुहोस्', 'ड्राइविंग स्कूल के साथ तैयारी करें'),
        body: L(
          'A driving school registers you for the tests. The theory test is available in several languages.',
          'ड्राइभिङ स्कुलले परीक्षाका लागि दर्ता गराउँछ। लिखित परीक्षा धेरै भाषामा दिन सकिन्छ।',
          'ड्राइविंग स्कूल आपको परीक्षाओं के लिए पंजीकृत करता है। लिखित परीक्षा कई भाषाओं में उपलब्ध है।',
        ),
        term: { term: 'Fahrschule' },
      },
    ],
    documents: [
      L('Foreign driving licence (original) and translation', 'विदेशी ड्राइभिङ लाइसेन्स (सक्कली) र अनुवाद', 'विदेशी ड्राइविंग लाइसेंस (असली) और अनुवाद'),
      PASSPORT,
      L('Registration certificate (date you moved in)', 'दर्ता प्रमाणपत्र (सरेको मिति)', 'पंजीकरण प्रमाणपत्र (आने की तारीख)'),
      L('Biometric photo, eye test and first-aid course certificate', 'बायोमेट्रिक फोटो, आँखा जाँच र प्राथमिक उपचार तालिम प्रमाणपत्र', 'बायोमेट्रिक फ़ोटो, आंखों की जांच और प्राथमिक चिकित्सा कोर्स प्रमाणपत्र'),
    ],
    callouts: [
      {
        kind: 'warning',
        text: L(
          'Driving after the 6 months without a German licence counts as driving without a licence.',
          '६ महिनापछि जर्मन लाइसेन्सबिना गाडी चलाउनु लाइसेन्सविना चलाएको मानिन्छ।',
          '6 महीने के बाद जर्मन लाइसेंस के बिना गाड़ी चलाना बिना लाइसेंस चलाना माना जाता है।',
        ),
      },
      {
        kind: 'tip',
        text: L(
          'You may not need a car: the Deutschlandticket and car sharing cover most trips in cities.',
          'तपाईंलाई कार नचाहिन सक्छ: सहरमा धेरैजसो यात्रा Deutschlandticket र कार सेयरिङले पुग्छ।',
          'हो सकता है आपको कार की ज़रूरत न हो: शहरों में ज़्यादातर सफ़र Deutschlandticket और कार शेयरिंग से हो जाते हैं।',
        ),
      },
      NOT_ADVICE,
    ],
    related: [
      { kind: 'guide', title: L('Get a monthly transit pass', 'मासिक यातायात पास लिनुहोस्', 'मासिक परिवहन पास लें'), href: '/guides/monthly-transit-pass' },
      { kind: 'guide', title: L('Register your address', 'आफ्नो ठेगाना दर्ता गर्नुहोस्', 'अपना पता पंजीकृत करें'), href: '/guides/register-your-address' },
    ],
    sources: [S.fev29, S.fevAnlage11, S.adacLicence],
  },
];
