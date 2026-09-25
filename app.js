/**
 * SHRI SAI HOMEO CURE CLINIC - INTERACTIVE & BILINGUAL APPLICATION
 * Dr. Amit Singh [BHMS, PGCPG] | Raipur, Chhattisgarh
 * Complete Hindi & English Dual Language System
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitch();
  initNavbar();
  initQuickAskAssistant();
  initTreatmentFilters();
  initBookingForms();
  initFaqAccordion();
  initScrollTop();
  initReviewModal();
  initDiseaseGallery();
  fetchVisitorCount();
});

function fetchVisitorCount() {
  fetch('/api/visitor-count', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      if (data.count) {
        const vc = document.getElementById('visitor-count');
        if (vc) vc.textContent = data.count;
      }
    })
    .catch(err => console.error('Error fetching visitor count:', err));
}

/* --------------------------------------------------------------------------
   1. BILINGUAL LANGUAGE SYSTEM (HINDI & ENGLISH)
   -------------------------------------------------------------------------- */
let currentLang = localStorage.getItem('sai_homeo_lang') || 'hi';

const translations = {
  hi: {
    // Top Bar
    top_location: "स्थान: रायपुर - पचपेड़ी नाका चौक | धमतरी - सिविल लाइन",
    top_timings: "सुबह 10:30 से 1:00 बजे | शाम 6:00 से 8:30 बजे (अपॉइंटमेंट द्वारा)",
    top_call: "9926974248 / 7999164270",
    top_whatsapp: "व्हाट्सएप परामर्श",

    // Navbar
    nav_home: "मुख्य पृष्ठ",
    nav_about: "डॉ. अमित सिंह",
    nav_treatments: "उपचार",
    nav_why: "होम्योपैथी क्यों",
    nav_reviews: "समीक्षाएं",
    nav_gallery: "क्लिनिक टूर",
    nav_faq: "सवाल-जवाब",
    nav_contact: "संपर्क",
    nav_call_doc: "कॉल करें",
    nav_book_btn: "अपॉइंटमेंट बुक करें",

    // Hero Section
    hero_title: "शाश्वत, सुरक्षित एवं <span class=\"highlight\">जड़ से संपूर्ण समाधान</span> • क्लासिकल होम्योपैथी",
    hero_hindi_subtitle: "🌿 श्री सांई होम्योपैथी क्योर क्लिनिक • स्कीन, थॉयराइड, इनफर्टिलिटी, चाईल्ड, मेंटल डिसऑर्डर",
    hero_desc: "हम पुरानी त्वचा संबंधी समस्याओं, थायरॉयड, बांझपन, बाल रोगों और सभी प्रणालीगत विकारों के लिए व्यक्तिगत संवैधानिक उपचार प्रदान करते हैं।",
    hero_btn_book: "📅 बुक अपोइन्टमेंट (परामर्श बुक करें)",
    hero_btn_wa: "💬 व्हाट्सएप डॉक्टर",
    hero_trust_1: "100% दुष्प्रभाव रहित",
    hero_trust_2: "शुद्ध जर्मन दवाइयां",
    hero_trust_3: "व्यक्तिगत केस स्टडी",
    storefront_live_badge: "पचपेड़ी नाका, रायपुर • सोम - शनि खुला",
    banner_btn_book: "बुक अपोइन्टमेंट",
    banner_btn_locator: "क्लीनिक लोकेटर",

    // Stats
    stat_1_val: "16+ वर्ष",
    stat_1_lbl: "चिकित्सा अनुभव",
    stat_2_val: "10,000+",
    stat_2_lbl: "स्वस्थ हुए मरीज",
    stat_3_val: "4.8 / 5.0",
    stat_3_lbl: "जस्टडायल रेटिंग (154+ रिव्यूज)",
    stat_4_val: "100%",
    stat_4_lbl: "प्राकृतिक एवं सुरक्षित दवाइयां",

    // Ask Doctor
    ask_header: "क्लिनिक या इलाज से संबंधित कोई भी सवाल पूछें",
    ask_sub: "अक्सर पूछे जाने वाले सवालों के तुरंत उत्तर पाएं",
    ask_input_ph: "अपना सवाल लिखें (जैसे: क्या आप दमा का इलाज करते हैं? फीस कितनी है?)",
    ask_chips_label: "मुख्य प्रश्न:",
    chip_1: "क्या आप दमा का इलाज करते हैं? →",
    chip_2: "परामर्श शुल्क कितना है? →",
    chip_3: "क्या दवाइयां शामिल हैं? →",
    chip_4: "स्किन रोग का इलाज →",
    chip_5: "क्लिनिक का समय क्या है? →",
    chip_6: "बच्चों के लिए सुरक्षित? →",

    // About Doctor
    about_label: "चिकित्सक परिचय",
    about_title: "डॉ. अमित सिंह",
    about_lead: "होम्योपैथ साइकोलॉजिस्ट • B.H.M.S. MA (Clinical Psycho) PGNAHI (Nagpur), CFN (Delhi)",
    about_text_1: "डॉ. अमित सिंह रायपुर के अत्यंत प्रतिष्ठित एवं अनुभवी होम्योपैथी चिकित्सक हैं, जिन्हें गंभीर, पुराने एवं जटिल रोगों के सफल उपचार में <strong>16 से अधिक वर्षों का क्लिनिकल अनुभव</strong> प्राप्त है।",
    about_text_2: "उनका चिकित्सा सिद्धांत है: <em>\"सिर्फ बीमारी के लक्षणों को दबाना नहीं, बल्कि मरीज को जड़ से स्वस्थ करना।\"</em> शारीरिक, मानसिक एवं व्यक्तिगत प्रवृत्तियों (Constitutional Study) के आधार पर वे शरीर की आंतरिक रोग-प्रतिरोधक शक्ति को जाग्रत कर बिना किसी दुष्प्रभाव के पूर्ण स्वास्थ्य लाभ प्रदान करते हैं।",
    qual_1_title: "16+ वर्षों का चिकित्सा अनुभव",
    qual_1_desc: "हजारों जटिल व पुराने रोगों में सफल उपचार का रिकॉर्ड",
    qual_2_title: "5.0 डॉक्टर संतुष्टि स्कोर",
    qual_2_desc: "धैर्यपूर्वक सुनने, सटीक निदान और नैतिक व्यवहार के लिए प्रसिद्ध",
    qual_3_title: "क्लासिकल कॉन्स्टिट्यूशनल विधि",
    qual_3_desc: "संपूर्ण केस हिस्ट्री लेकर स्थायी समाधान",
    qual_4_title: "पंजीकृत चिकित्सा व्यवसायी",
    qual_4_desc: "पंजीयन क्र.: 0926",
    qual_fee_title: "सुलभ परामर्श शुल्क: ₹500 मात्र",
    qual_fee_desc: "पारदर्शी, नैतिक एवं सुलभ चिकित्सा परामर्श",
    about_btn_schedule: "डॉ. अमित सिंह से परामर्श बुक करें",
    about_btn_wa: "व्हाट्सएप पर बात करें",

    // Treatments Section
    treat_label: "हमारी क्लिनिकल विशेषज्ञता",
    treat_title: "विशेषज्ञ उपचार एवं संपूर्ण स्वास्थ्य लाभ",
    treat_sub: "शरीर की आंतरिक रोग-प्रतिरोधक क्षमता को बढ़ाकर रोगों को जड़ से समाप्त करने वाली होम्योपैथिक चिकित्सा।",
    tab_all: "सभी उपचार",
    tab_skin: "स्कीन व एलर्जी",
    tab_digestive: "पाचन व IBS",
    tab_pain: "दर्द व माइग्रेन",
    tab_chronic: "थॉयराइड व क्रॉनिक",
    tab_family: "बाल रोग व निःसंतानता",
    btn_book_cond: "इलाज बुक करें →",

    // Treatment Cards
    t1_cat: "स्कीन व एलर्जी",
    t1_title: "चर्म रोग एवं एलर्जी (Skin Diseases)",
    t1_desc: "स्टेरॉयड के बिना जिद्दी चर्म रोगों का जड़ से इलाज। आंतरिक विषाक्तता एवं अतिसक्रिय इम्यून सिस्टम को संतुलित करता है।",
    t1_adv: "✓ स्टेरॉयड का कोई साइड-इफेक्ट नहीं",
    
    t2_cat: "पाचन स्वास्थ्य",
    t2_title: "आईबीएस व पेट के विकार (IBS & Digestion)",
    t2_desc: "आंतों की सूजन दूर करें, पाचन तंत्र को मजबूत बनाएं और प्राकृतिक औषधियों से पुरानी गैस, एसिडिटी व कब्ज से राहत पाएं।",
    t2_adv: "✓ प्राकृतिक पाचन क्रिया पुनर्स्थापित",

    t3_cat: "दर्द व न्यूरोलॉजिकल",
    t3_title: "माइग्रेन व पुराना सिरदर्द (Migraine)",
    t3_desc: "नसों की संवेदनशीलता, तनावजन्य सिरदर्द और साइनस के दर्द का स्थायी इलाज, पेनकिलर्स पर निर्भरता समाप्त।",
    t3_adv: "✓ भविष्य के दर्द हमलों से सुरक्षा",

    t4_cat: "जोड़ व रीढ़ की हड्डी",
    t4_title: "कमर दर्द, साइटिका व गठिया (Joint & Spine)",
    t4_desc: "सर्वाइकल स्पोंडिलाइटिस, स्लिप डिस्क, साइटिका और बढ़े हुए यूरिक एसिड (गाउट) का असरदार सूजनरोधी उपचार।",
    t4_adv: "✓ सुरक्षित तरीके से सूजन व दर्द में राहत",

    t5_cat: "मेटाबॉलिक केयर",
    t5_title: "थॉयराइड व डायबिटीज केयर (Thyroid & Diabetes)",
    t5_desc: "हार्मोनल संतुलन, थॉयराइड स्तर को सामान्य करने और डायबिटीज की जटिलताओं (कमजोरी, नसों की समस्या) में सहायक प्राकृतिक इलाज।",
    t5_adv: "✓ प्राकृतिक एंडोक्राइन संतुलन",

    t6_cat: "वजन एवं मेटाबॉलिज्म",
    t6_title: "मोटापा व वजन नियंत्रण (Weight Management)",
    t6_desc: "धीमे मेटाबॉलिज्म को गति देकर प्राकृतिक व स्वस्थ तरीके से वजन घटाने में मदद। कोई कृत्रिम सप्लीमेंट नहीं।",
    t6_adv: "✓ प्राकृतिक व सुरक्षित वेट लॉस",

    t7_cat: "शिशु एवं बाल रोग",
    t7_title: "बाल रोग व इम्युनिटी (Pediatric Care)",
    t7_desc: "बच्चों की प्रतिरोधक क्षमता बढ़ाने, बार-बार सर्दी, खांसी, बढ़े हुए टॉन्सिल व दांत निकलने की दिक्कतों का मीठी दवाओं से उपचार।",
    t7_adv: "✓ 100% मीठी व सुरक्षित दवाइयां",

    t8_cat: "बाल व स्कैल्प",
    t8_title: "बाल झड़ना व एलोपेसिया (Hair Fall & Scalp)",
    t8_desc: "जड़ों से पोषण देकर बालों का गिरना, पैची एलोपेसिया, रूसी और स्कैल्प सोरायसिस का अंदरूनी उपचार।",
    t8_adv: "✓ बालों की जड़ों को आंतरिक पोषण",

    t9_cat: "श्वसन स्वास्थ्य",
    t9_title: "दमा एवं सांस की एलर्जी (Asthma Care)",
    t9_desc: "फेफड़ों की ताकत बढ़ाएं, घबराहट और मौसम बदलने से होने वाली छींकों व एलर्जी से राहत पाएं, इनहेलर की आवश्यकता कम करें।",
    t9_adv: "✓ फेफड़ों को दीर्घकालिक राहत",

    // Why Homeopathy
    why_label: "क्लासिकल होम्योपैथी क्यों चुनें",
    why_title: "एक वैज्ञानिक, सौम्य एवं जड़ से रोगमुक्ति की चिकित्सा पद्धति",
    why_desc: "होम्योपैथी प्रकृति के मूल सिद्धांत 'समः समं शमयति' (Like cures like) पर कार्य करती है। यह केवल दर्द को दबाने के बजाय बीमारी के मूल कारण को दूर करती है।",
    pillar_1_title: "जड़ से इलाज, केवल लक्षणों का दमन नहीं",
    pillar_1_desc: "आनुवंशिक कारणों, प्रतिरोधक क्षमता और मानसिक तनाव की पहचान कर उपचार।",
    pillar_2_title: "100% नॉन-टॉक्सिक एवं शून्य साइड-इफेक्ट",
    pillar_2_desc: "नवजात शिशुओं, गर्भवती माताओं और बुजुर्गों के लिए पूर्णतः सुरक्षित।",
    pillar_3_title: "सर्जरी व आजीवन दवाओं से मुक्ति",
    pillar_3_desc: "सौम्य चिकित्सा जो कई मामलों में ऑपरेशन और महंगी दवाओं की निर्भरता खत्म करती है।",

    // Reviews
    reviews_label: "मरीजों के वास्तविक अनुभव",
    reviews_title: "हमारे मरीज क्या कहते हैं",
    reviews_sub: "श्री सांई होम्योपैथी क्योर क्लिनिक, रायपुर में स्वस्थ हुए मरीजों के वास्तविक विचार।",
    reviews_btn_write: "+ समीक्षा लिखें",
    rating_box_sub: "जस्टडायल पर 154+ सत्यापित रेटिंग्स",
    rev_1_text: "\"उपचार का अनुभव बहुत ही उत्कृष्ट रहा। मैं काफी लंबे समय से अपनी स्वास्थ्य समस्या से परेशान था, लेकिन डॉ. अमित सिंह के सही मार्गदर्शन और उपचार से मैं पूरी तरह ठीक हो गया। वे बहुत धैर्यवान हैं और सब कुछ विस्तार से समझाते हैं।\"",
    rev_2_text: "\"इस क्लिनिक में मुझे अपनी पुरानी चर्म रोग की समस्या और कमर दर्द से पूरी तरह राहत मिली। डॉ. अमित सिंह बहुत ही कुशल और मरीजों के प्रति अत्यंत विनम्र हैं। बिना किसी साइड इफेक्ट के दवाइयों ने कमाल का असर दिखाया!\"",
    rev_3_text: "\"श्री सांई होम्योपैथी क्योर क्लिनिक के डॉक्टर मरीजों की समस्याओं को बहुत ध्यान से सुनते हैं। दवा देने से पहले पूरी केस हिस्ट्री समझते हैं। रायपुर में होम्योपैथी के सबसे बेहतरीन डॉक्टर।\"",
    rev_4_text: "\"मुझे 3 साल से पुरानी आईबीएस और एसिडिटी की समस्या थी। डॉ. अमित सिंह का 2 महीने का कोर्स करने के बाद मेरा पेट बिल्कुल ठीक है और मैं अब सब कुछ खा-पी सकता हूँ। अत्यंत अनुशंसित!\"",
    rev_5_text: "\"माइग्रेन के गंभीर दौरों से मेरा ऑफिस में कंप्यूटर पर काम करना दूभर हो गया था। डॉ. अमित ने मूल कारण को समझकर दवा दी। कुछ ही हफ्तों में माइग्रेन के दौरे बंद हो गए।\"",
    rev_6_text: "\"मेरे 5 साल के बच्चे को हर 15 दिन में टॉन्सिल और जुकाम हो जाता था। डॉ. सिंह की मीठी दवाओं ने मेरे बेटे की इम्युनिटी इतनी मजबूत कर दी कि अब वह बीमार नहीं पड़ता। डॉ. अमित सिंह को बहुत-बहुत धन्यवाद!\"",

    // Gallery
    gallery_label: "क्लिनिक का माहौल",
    gallery_title: "शांतिपूर्ण, स्वच्छ एवं आधुनिक स्वास्थ्य केंद्र",
    gallery_sub: "पचपेड़ी नाका, रायपुर स्थित हमारे सुसज्जित होम्योपैथिक क्लिनिक में पधारें।",
    gal_1_title: "मुख्य रिसेप्शन एवं प्रतीक्षालय",
    gal_1_desc: "मरीजों के लिए आरामदायक, हवादार और शांतिपूर्ण प्रतीक्षा कक्ष",
    gal_2_title: "डॉ. अमित सिंह का परामर्श कक्ष",
    gal_2_desc: "गोपनीय एवं विस्तृत केस स्टडी हेतु निजी चैंबर",
    gal_3_title: "प्रमाणित होम्योपैथिक डिस्पेंसरी",
    gal_3_desc: "100% शुद्ध जर्मन एवं भारतीय होम्योपैथिक दवाइयां",

    // Booking Section
    book_badge: "आसान व त्वरित",
    book_title: "आज ही अपना परामर्श बुक करें",
    book_desc: "क्लासिकल होम्योपैथी के माध्यम से प्राकृतिक स्वास्थ्य लाभ प्राप्त करें। पचपेड़ी नाका क्लिनिक पर विजिट या ऑनलाइन वीडियो परामर्श हेतु नीचे दिया गया फॉर्म भरें।",
    book_point_1: "डॉ. अमित सिंह से प्रत्यक्ष व गोपनीय परामर्श",
    book_point_2: "समय की बचत — पहले से तय स्लॉट के साथ प्रतीक्षा नहीं",
    book_point_3: "क्लिनिक के व्हाट्सएप पर तुरंत कन्फर्मेशन",
    book_point_fee: "परामर्श शुल्क: केवल ₹500 (क्लिनिक / ऑनलाइन)",
    help_box_title: "तत्काल सहायता या आज की अपॉइंटमेंट चाहिए?",
    help_box_num: "कॉल करें: 9926974248 / 7999164270",
    form_title: "अपॉइंटमेंट अनुरोध फॉर्म",
    form_sub: "कृपया अपना विवरण दर्ज करें:",
    form_fee_text: "परामर्श शुल्क: <strong>₹500 मात्र</strong> (विस्तृत केस हिस्ट्री एवं परीक्षण)",
    label_consult_type: "परामर्श का प्रकार",
    type_clinic: "🏥 क्लिनिक पर (रायपुर)",
    type_online: "📱 ऑनलाइन वीडियो परामर्श",
    lbl_name: "मरीज का पूरा नाम *",
    lbl_phone: "मोबाइल / व्हाट्सएप नंबर *",
    lbl_condition: "मुख्य स्वास्थ्य समस्या / बीमारी *",
    lbl_date: "पसंदीदा तारीख",
    lbl_slot: "पसंदीदा समय स्लॉट",
    lbl_notes: "लक्षण अथवा संक्षिप्त संदेश (वैकल्पिक)",
    btn_submit_form: "अपॉइंटमेंट कन्फर्म करें (WhatsApp पर भेजें) →",
    name_ph: "उदा. राहुल शर्मा",
    phone_ph: "उदा. 98XXXXXXXX",
    notes_ph: "लक्षण कितने समय से हैं, पूर्व इलाज आदि संक्षेप में लिखें...",

    // FAQs
    faq_label: "सामान्य प्रश्न",
    faq_title: "अक्सर पूछे जाने वाले सवाल (FAQs)",
    faq_sub: "हमारे रायपुर क्लिनिक में होम्योपैथिक उपचार के संबंध में आवश्यक जानकारी।",
    faq_q1: "डॉ. अमित सिंह का होम्योपैथिक उपचार एलोपैथी से कैसे अलग है?",
    faq_a1: "एलोपैथी अक्सर पेनकिलर, एंटीहिस्टामाइन या स्टेरॉयड से लक्षणों को दबाती है जिससे दवा बंद होते ही बीमारी वापस आ जाती है। डॉ. अमित सिंह क्लासिकल होम्योपैथी द्वारा मरीज की शारीरिक व मानसिक प्रकृति के अनुसार आंतरिक रोग-प्रतिरोधक क्षमता को जाग्रत करते हैं, जिससे रोग जड़ से समाप्त होता है।",
    faq_q2: "क्या होम्योपैथिक दवाइयां काम करने में बहुत लंबा समय लेती हैं?",
    faq_a2: "यह एक आम भ्रम है। अचानक होने वाले बुखार, सर्दी, पेट दर्द या माइग्रेन में सही होम्योपैथिक दवा कुछ ही घंटों में असर दिखाती है। पुराने और जटिल रोगों (जैसे 5-10 साल पुराना सोरायसिस या आईबीएस) में जड़ से ठीक करने के लिए कुछ माह का समय लगता है।",
    faq_q3: "क्या होम्योपैथिक दवाओं में कोई स्टेरॉयड या भारी धातु होती है?",
    faq_a3: "बिल्कुल नहीं, कभी नहीं। श्री सांई होम्योपैथी क्योर क्लिनिक में केवल मान्यता प्राप्त जर्मन एवं भारतीय फार्माकोपिया से प्रमाणित शुद्ध दवाइयां दी जाती हैं। ये 100% गैर-विषाक्त और स्टेरॉयड-रहित हैं।",
    faq_q4: "क्या मैं बीपी या शुगर की एलोपैथिक दवाओं के साथ होम्योपैथी ले सकता हूँ?",
    faq_a4: "हाँ, बिल्कुल! होम्योपैथिक दवाइयां किसी एलोपैथिक दवा के साथ रिएक्शन नहीं करती हैं। आप ब्लड प्रेशर या शुगर की नियमित दवाओं के साथ 30-45 मिनट के अंतर पर इसे आसानी से ले सकते हैं।",
    faq_q5: "क्लिनिक रायपुर में कहाँ स्थित है? क्या पार्किंग उपलब्ध है?",
    faq_a5: "क्लिनिक लाल गंगा बिजनेस पार्क के ठीक सामने, न्यू धमतरी रोड, पचपेड़ी नाका, रायपुर (छ.ग.) - 492001 में स्थित है। यह मुख्य मार्ग पर है और यहाँ दोपहिया व चार पहिया वाहनों की पर्याप्त पार्किंग सुविधा है।",
    faq_q6: "क्या रायपुर से बाहर रहने वाले मरीजों के लिए ऑनलाइन परामर्श उपलब्ध है?",
    faq_a6: "हाँ! छत्तीसगढ़ के अन्य शहरों या बाहर के मरीजों के लिए डॉ. अमित सिंह व्हाट्सएप वीडियो/कॉल के माध्यम से विस्तृत परामर्श देते हैं और दवाइयां कोरियर द्वारा आपके पते पर भेजी जाती हैं।",
    faq_q7: "डॉ. अमित सिंह का परामर्श शुल्क (Consultation Fee) कितना है?",
    faq_a7: "श्री सांई होम्योपैथी क्योर क्लिनिक में डॉ. अमित सिंह का परामर्श शुल्क केवल ₹500 (500 रुपये) है। इसमें मरीज की संपूर्ण केस हिस्ट्री, रोग परीक्षण एवं विस्तृत व्यक्तिगत परामर्श शामिल है। दवाइयों का शुल्क निर्धारित कोर्स के अनुसार दिया जाता है।",

    // Contact
    contact_label: "क्लिनिक विजिट एवं संपर्क",
    contact_title: "हमसे संपर्क करें",
    cd_address_title: "क्लिनिक का पता",
    cd_address: "<strong>रायपुर:</strong> पचपेड़ी नाका चौक, धमतरी रोड, बैंक ऑफ इंडिया के सामने<br><strong>धमतरी:</strong> सिविल लाइन, जिला सरकारी अस्पताल के पीछे",
    cd_phone_title: "डॉक्टर हेल्पलाइन / मोबाइल",
    cd_wa_title: "व्हाट्सएप परामर्श",
    cd_time_title: "परामर्श का समय",
    cd_timings: "सुबह 10:30 बजे से दोपहर 1:00 बजे तक<br>शाम 6:00 बजे से रात 8:30 बजे तक<br>(अपॉइंटमेंट द्वारा)",
    map_landmark: "📍 लैंडमार्क: पचपेड़ी नाका चौक, धमतरी रोड, बैंक ऑफ इंडिया के सामने",
    map_open_btn: "गूगल मैप्स में खोलें →",
    direct_call_txt: "सीधे संपर्क करें: 9926974248 / 7999164270",
    btn_call_now: "कॉल करें",
    btn_directions: "रास्ता देखें (Maps)",

    // Footer
    footer_desc: "रायपुर में क्लासिकल होम्योपैथी का विश्वसनीय केंद्र। 16+ वर्षों से चर्म रोग, थॉयराइड, इनफर्टिलिटी, माइग्रेन एवं बाल रोगों का जड़ से स्थाई उपचार।",
    footer_quick_links: "त्वरित लिंक्स",
    footer_treatments: "प्रमुख उपचार",
    footer_timings: "क्लिनिक कार्य समय",
    footer_copy: "© 2026 श्री सांई होम्योपैथी क्योर क्लिनिक (डॉ. अमित सिंह). सर्वाधिकार सुरक्षित।",
    footer_loc: "पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492001 | क्लासिकल होम्योपैथी चिकित्सा",

    // Modals & Dock
    modal_book_title: "डॉ. अमित सिंह से परामर्श बुक करें",
    modal_book_sub: "व्हाट्सएप या क्लिनिक पर तुरंत अपॉइंटमेंट सुरक्षित करें।",
    modal_rev_title: "अपना उपचार अनुभव साझा करें",
    modal_rev_sub: "अन्य मरीजों को प्राकृतिक व स्थायी स्वास्थ्य लाभ पाने में मदद करें।",
    lbl_rev_name: "आपका नाम *",
    lbl_rev_rating: "आपकी रेटिंग *",
    lbl_rev_condition: "किस बीमारी का इलाज कराया *",
    lbl_rev_text: "आपका अनुभव / समीक्षा *",
    btn_rev_submit: "समीक्षा सबमिट करें",
    btn_modal_submit: "व्हाट्सएप पर अपॉइंटमेंट कन्फर्म करें →",
    dock_call: "कॉल: 9926974248 / 7999164270",
    dock_wa: "व्हाट्सएप डॉ. अमित सिंह"
  },

  en: {
    // Top Bar
    top_location: "Locations: Raipur - Pachpedi Naka Chowk | Dhamtari - Civil Line",
    top_timings: "Morning 10:30 AM to 1:00 PM | Evening 6:00 PM to 8:30 PM (By Appt)",
    top_call: "9926974248 / 7999164270",
    top_whatsapp: "WhatsApp Chat",

    // Navbar
    nav_home: "Home",
    nav_about: "Dr. Amit Singh",
    nav_treatments: "Treatments",
    nav_why: "Why Us",
    nav_reviews: "Reviews",
    nav_gallery: "Clinic Tour",
    nav_faq: "FAQs",
    nav_contact: "Contact",
    nav_call_doc: "Call Doctor",
    nav_book_btn: "Book Appointment",

    // Hero Section
    hero_title: "Gentle, Permanent & <span class=\"highlight\">Root-Cause Healing</span> with Classical Homeopathy",
    hero_hindi_subtitle: "🌿 Shri Sai Homeopathy Cure Clinic • Skin, Thyroid, Infertility, Child, Mental Disorder",
    hero_desc: "We provide personalized constitutional healing for chronic skin conditions, Thyroid, Infertility, Child disorder and All systemic disorders",
    hero_btn_book: "📅 Book In-Clinic Consultation",
    hero_btn_wa: "💬 WhatsApp Doctor",
    hero_trust_1: "100% Side-Effect Free",
    hero_trust_2: "Genuine German Remedies",
    hero_trust_3: "Constitutional Case Study",
    storefront_live_badge: "Pachpedi Naka, Raipur • Open Mon - Sat",
    banner_btn_book: "Book Appointment",
    banner_btn_locator: "Clinic Locator",

    // Stats
    stat_1_val: "16+ Years",
    stat_1_lbl: "Healthcare Experience",
    stat_2_val: "10,000+",
    stat_2_lbl: "Happy Recovered Patients",
    stat_3_val: "4.8 / 5.0",
    stat_3_lbl: "Ratings on Justdial (154+ Reviews)",
    stat_4_val: "100%",
    stat_4_lbl: "Natural & Safe Remedies",

    // Ask Doctor
    ask_header: "Ask anything about this clinic or treatment",
    ask_sub: "Instant answers to common patient questions",
    ask_input_ph: "Type your query (e.g., Do you treat asthma? What is the consultation fee?)",
    ask_chips_label: "Popular Questions:",
    chip_1: "Do you treat asthma? →",
    chip_2: "What is the consultation fee? →",
    chip_3: "Is medicine included? →",
    chip_4: "Skin diseases cure →",
    chip_5: "Clinic Timings →",
    chip_6: "Safe for kids? →",

    // About Doctor
    about_label: "Meet Your Doctor",
    about_title: "Dr. Amit Singh",
    about_lead: "Homoeopath Psychologist • B.H.M.S. MA (Clinical Psycho) PGNAHI (Nagpur), CFN (Delhi)",
    about_text_1: "Dr. Amit Singh is one of Raipur’s most trusted and experienced classical homeopathic practitioners, with over <strong>16 years of clinical excellence</strong> in curing chronic, recurring, and challenging health disorders.",
    about_text_2: "His philosophy is rooted in the true Hahnemannian principle: <em>\"Treat the patient, not just the disease.\"</em> By identifying the physical, emotional, and constitutional makeup of each individual, Dr. Singh activates the body's internal healing defense mechanism to achieve permanent recovery without dependence on heavy prescription drugs or steroids.",
    qual_1_title: "16+ Years in Healthcare",
    qual_1_desc: "Extensive experience across thousands of difficult chronic cases",
    qual_2_title: "5.0 Doctor Satisfaction",
    qual_2_desc: "Consistently praised for patient listening, empathy and ethical care",
    qual_3_title: "Classical Constitutional Care",
    qual_3_desc: "In-depth case taking for lasting root-cause resolution",
    qual_4_title: "Registered Medical Practitioner",
    qual_4_desc: "Regd. No.: 0926",
    qual_fee_title: "Affordable Consultation Fee: ₹500 Only",
    qual_fee_desc: "Transparent, ethical and accessible homeopathic care",
    about_btn_schedule: "Schedule Consultation with Dr. Amit Singh",
    about_btn_wa: "WhatsApp Direct",

    // Treatments Section
    treat_label: "Our Clinical Expertise",
    treat_title: "Specialized Treatments & Holistic Care",
    treat_sub: "Targeted constitutional homeopathic therapies designed to cure chronic ailments from their root source without invasive procedures.",
    tab_all: "All Treatments",
    tab_skin: "Skin & Allergies",
    tab_digestive: "Digestive & IBS",
    tab_pain: "Pain & Migraine",
    tab_chronic: "Lifestyle & Chronic",
    tab_family: "Pediatric & Family",
    btn_book_cond: "Book Treatment →",

    // Treatment Cards
    t1_cat: "Skin & Allergy",
    t1_title: "Skin Diseases & Allergies",
    t1_desc: "Holistic cure for stubborn skin conditions without steroid dependence. Treats inner toxicity and hyperactive immune reactions.",
    t1_adv: "✓ No Steroid Rebound",

    t2_cat: "Digestive Health",
    t2_title: "Irritable Bowel Syndrome (IBS)",
    t2_desc: "Restore healthy gut motility, soothe intestinal inflammation, and regulate digestive enzyme balance with gentle natural remedies.",
    t2_adv: "✓ Restores Natural Digestion",

    t3_cat: "Pain & Neurological",
    t3_title: "Migraine & Chronic Headaches",
    t3_desc: "Target neurovascular hypersensitivity, tension headaches, and sinusoidal pain to end chronic dependency on temporary pain killers.",
    t3_adv: "✓ Prevents Future Attacks",

    t4_cat: "Joint & Spine",
    t4_title: "Back Pain & Joint Disorders",
    t4_desc: "Effective anti-inflammatory treatment for cervical spondylosis, lumbar disc issues, sciatica, and elevated uric acid diathesis (gout).",
    t4_adv: "✓ Reduces Inflammation Safely",

    t5_cat: "Metabolic Care",
    t5_title: "Diabetes & Thyroid Management",
    t5_desc: "Supportive homeopathic care to stabilize endocrine functions, mitigate diabetes complications (neuropathy, weakness), and normalize thyroid levels.",
    t5_adv: "✓ Holistic Endocrine Balance",

    t6_cat: "Weight & Metabolism",
    t6_title: "Obesity & Weight Loss Counselling",
    t6_desc: "Stimulate sluggish basal metabolism and correct hormonal triggers that prevent fat loss. Safe, sustainable guidance with zero artificial crash diets.",
    t6_adv: "✓ Natural & Sustainable Weight Loss",

    t7_cat: "Pediatric Care",
    t7_title: "Child Health & Immunity",
    t7_desc: "Boost immunity against recurrent viral fever, tonsillitis, asthma, behavioral issues, and teething complaints with sweet, palatable pills.",
    t7_adv: "✓ 100% Sweet & Non-Traumatic",

    t8_cat: "Hair & Scalp",
    t8_title: "Hair Fall & Alopecia Care",
    t8_desc: "Nourish hair roots from within. Effective remedy for patchy alopecia areata, chronic dandruff, and stress-triggered hair loss.",
    t8_adv: "✓ Internal Cellular Nourishment",

    t9_cat: "Respiratory Health",
    t9_title: "Asthma & Respiratory Allergy",
    t9_desc: "Strengthen bronchial vitality, ease wheezing, and prevent allergy attacks triggered by climate change, dust, or cold food.",
    t9_adv: "✓ Long-term Bronchial Relief",

    // Why Homeopathy
    why_label: "Why Choose Classical Homeopathy",
    why_title: "A Scientific, Gentle & Permanent Medical Science",
    why_desc: "Homeopathy works on the fundamental biological law 'Similia Similibus Curentur' (Like cures like). Rather than merely masking pain, it triggers the body’s innate cellular intelligence to cure the root disturbance.",
    pillar_1_title: "Treats Root Cause, Not Just Symptoms",
    pillar_1_desc: "Identifies genetic predispositions, immune factors, and emotional stressors behind chronic illness.",
    pillar_2_title: "100% Non-Toxic & Zero Side-Effects",
    pillar_2_desc: "Safe for infants, expectant mothers, and senior citizens without chemical burden.",
    pillar_3_title: "Non-Invasive & Highly Economical",
    pillar_3_desc: "Gentle healing that often eliminates the requirement for risky surgeries and lifetime medicines.",

    // Reviews
    reviews_label: "Verified Patient Feedback",
    reviews_title: "What Our Patients Say",
    reviews_sub: "Real experiences from patients treated at Shri Sai Homeo Cure Clinic, Raipur.",
    reviews_btn_write: "+ Write a Review",
    rating_box_sub: "154+ Verified Ratings on Justdial",
    rev_1_text: "\"I had a great experience with treatment done. I was suffering from my health issue for a long time, but with his proper guidance and treatment, I recovered completely. Dr. Amit Singh is very patient and explains everything thoroughly.\"",
    rev_2_text: "\"I got rid of my severe skin condition and back pain at this clinic. Dr Amit Singh is a highly skilled doctor and very well behaved to his patients. The medicines worked wonder without any side-effects!\"",
    rev_3_text: "\"Shri Sai Homeo Cure Clinic doctor is very good with patient problems and treats everyone with special care and patience. He listens to the entire medical history before prescribing remedies. Truly best in Raipur.\"",
    rev_4_text: "\"I was suffering from chronic IBS and acidity for almost 3 years. After taking Dr. Amit Singh's homeopathic course for 2 months, my gut health is back to normal and I can eat normally again. Highly recommended!\"",
    rev_5_text: "\"My severe throbbing migraine attacks made working on the computer impossible. Dr. Amit diagnosed the root trigger and started constitutional treatment. Frequency decreased within weeks and now it's gone.\"",
    rev_6_text: "\"My 5-year-old child had continuous tonsillitis and cold every 15 days. Antibiotics gave only short relief. Dr. Singh's sweet pills boosted my son's immunity completely. Very grateful to Dr. Amit Singh!\"",

    // Gallery
    gallery_label: "Clinic Environment",
    gallery_title: "A Peaceful & Hygienic Sanctuary for Healing",
    gallery_sub: "Visit our state-of-the-art homeopathic clinic located conveniently at Pachpedi Naka, Raipur.",
    gal_1_title: "Main Consultation & Reception Area",
    gal_1_desc: "Comfortable, airy and peaceful waiting space for patients",
    gal_2_title: "Dr. Amit Singh’s Chamber",
    gal_2_desc: "Private, confidential and thorough patient case evaluation",
    gal_3_title: "In-House Medicine Dispensary",
    gal_3_desc: "Certified pure German & Indian homeopathic dilutions and globules",

    // Booking Section
    book_badge: "Fast & Easy",
    book_title: "Book Your Consultation Today",
    book_desc: "Experience the healing power of personalized classical homeopathy. Fill out the quick form to book an in-clinic consultation at Pachpedi Naka or request an online video consultation.",
    book_point_1: "Direct Case Discussion with Dr. Amit Singh",
    book_point_2: "Zero Long Waiting Times with Prior Slot Confirmation",
    book_point_3: "Instant Confirmation directly on Clinic WhatsApp",
    book_point_fee: "Consultation Fee: ₹500 Only (In-Clinic / Online)",
    help_box_title: "Need immediate assistance or same-day visit?",
    help_box_num: "Call: 9926974248 / 7999164270",
    form_title: "Appointment Request Form",
    form_sub: "Please enter your details below:",
    form_fee_text: "Consultation Fee: <strong>₹500 Only</strong> (In-depth Case Taking & Consultation)",
    label_consult_type: "Consultation Type",
    type_clinic: "🏥 In-Clinic (Raipur)",
    type_online: "📱 Online Video Consult",
    lbl_name: "Patient Full Name *",
    lbl_phone: "Mobile / WhatsApp Number *",
    lbl_condition: "Primary Health Issue *",
    lbl_date: "Preferred Date",
    lbl_slot: "Preferred Time Slot",
    lbl_notes: "Brief Symptoms / Notes (Optional)",
    btn_submit_form: "Confirm & Send to Clinic WhatsApp →",
    name_ph: "e.g. Rahul Sharma",
    phone_ph: "e.g. 98XXXXXXXX",
    notes_ph: "Describe how long you've had symptoms, past treatments, etc.",

    // FAQs
    faq_label: "Common Queries",
    faq_title: "Frequently Asked Questions",
    faq_sub: "Everything you need to know about homeopathic treatment at our Raipur clinic.",
    faq_q1: "How does Dr. Amit Singh's homeopathic treatment differ from allopathy?",
    faq_a1: "Allopathy typically suppresses symptoms using anti-histamines, pain killers, or steroids, which often causes the disease to bounce back once medicines stop. Dr. Amit Singh uses classical homeopathy to treat the patient constitutionally, stimulating your body's immune system to heal naturally and provide permanent, recurrence-free relief.",
    faq_q2: "Do homeopathic medicines take a very long time to work?",
    faq_a2: "This is a common myth. In acute conditions like sudden fever, cold, stomach upset, or migraine attacks, well-selected homeopathic remedies act remarkably fast—often within hours! For long-standing chronic conditions (such as 5-10 year-old psoriasis or IBS), it takes a few months to eradicate the deep-seated root cause safely.",
    faq_q3: "Do homeopathic medicines contain any steroids or heavy metals?",
    faq_a3: "No, absolutely never. Shri Sai Homeo Cure Clinic only dispenses 100% genuine potentized remedies procured from reputable German and Indian pharmacopoeias. They are completely safe, non-toxic, and free from all adulteration or harmful steroids.",
    faq_q4: "Can I take homeopathic medicines along with my existing allopathic BP/diabetes drugs?",
    faq_a4: "Yes, absolutely! Homeopathic medicines do not interfere with standard allopathic medications. You can safely continue your vital medicines for blood pressure, thyroid, or diabetes with a simple 30-45 minute gap between them, under Dr. Amit Singh's supervision.",
    faq_q5: "Where exactly is the clinic located in Raipur? Is parking available?",
    faq_a5: "The clinic is located right in front of Lal Ganga Business Park on New Dhamtari Road, Pachpedi Naka, Raipur, Chhattisgarh (PIN 492001). It is easily accessible by public transport and has ample parking for two-wheelers and cars.",
    faq_q6: "Are online video consultations available for patients living outside Raipur?",
    faq_a6: "Yes! For patients residing across Chhattisgarh, other states of India, or even abroad, Dr. Amit Singh provides detailed WhatsApp video/phone case consultations and couriers the prescribed medicines directly to your doorstep.",
    faq_q7: "What is the consultation fee for Dr. Amit Singh?",
    faq_a7: "The consultation fee at Shri Sai Homeo Cure Clinic is ₹500 (Rs. 500 only). This includes an in-depth constitutional case analysis and personalized clinical evaluation by Dr. Amit Singh. Medicine costs are provided as per the prescribed treatment course.",

    // Contact
    contact_label: "Clinic Visit & Contact",
    contact_title: "Get In Touch With Us",
    cd_address_title: "Clinic Address",
    cd_address: "<strong>RAIPUR:</strong> Pachpedi Naka Chowk, Dhamtari Road, Infront Bank of India<br><strong>DHAMTARI:</strong> Civil Line, Behind Dist. Govt. Hospital",
    cd_phone_title: "Doctor Phone / Helpline",
    cd_wa_title: "WhatsApp Consultation",
    cd_time_title: "Consultation Timings",
    cd_timings: "Morning 10:30 AM to 1:00 PM<br>Evening 6:00 PM to 8:30 PM<br>(Consultation by Appointment)",
    map_landmark: "📍 Landmark: Pachpedi Naka Chowk, Dhamtari Road, Infront Bank of India",
    map_open_btn: "Open in Google Maps →",
    direct_call_txt: "Call Directly: 9926974248 / 7999164270",
    btn_call_now: "Call Now",
    btn_directions: "Get Directions",

    // Footer
    footer_desc: "Trusted center for holistic classical homeopathy in Raipur. Delivering root-cause healing for 16+ years across chronic skin diseases, thyroid, infertility, migraines, and family health.",
    footer_quick_links: "Quick Links",
    footer_treatments: "Key Treatments",
    footer_timings: "Clinic Working Hours",
    footer_copy: "© 2026 Shri Sai Homeo Cure Clinic (Dr. Amit Singh). All Rights Reserved.",
    footer_loc: "Pachpedi Naka, Raipur, Chhattisgarh - 492001 | Classical Homeopathic Healthcare",

    // Modals & Dock
    modal_book_title: "Book Consultation with Dr. Amit Singh",
    modal_book_sub: "Confirm your appointment instantly via WhatsApp or in clinic.",
    modal_rev_title: "Share Your Treatment Experience",
    modal_rev_sub: "Help other patients find natural, permanent healing with Dr. Amit Singh.",
    lbl_rev_name: "Your Name *",
    lbl_rev_rating: "Your Rating *",
    lbl_rev_condition: "Condition Treated *",
    lbl_rev_text: "Your Experience / Review *",
    btn_rev_submit: "Submit Review",
    btn_modal_submit: "Confirm Appointment on WhatsApp →",
    dock_call: "Call 9926974248 / 7999164270",
    dock_wa: "WhatsApp Dr. Amit Singh"
  }
};

function initLanguageSwitch() {
  const langButtons = document.querySelectorAll('.lang-btn');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('sai_homeo_lang', lang);
    document.documentElement.lang = lang;

    // Toggle button active states
    langButtons.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const dict = translations[lang] || translations.hi;

    // Update text content for elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-lang');
      applyLanguage(selected);
    });
  });

  // Apply on startup
  applyLanguage(currentLang);
}

/* --------------------------------------------------------------------------
   2. NAVBAR & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.main-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. QUICK ASK DOCTOR / SMART QUERY ASSISTANT (Justdial Feature)
   -------------------------------------------------------------------------- */
function initQuickAskAssistant() {
  const input = document.getElementById('ask-query-input');
  const submitBtn = document.getElementById('ask-submit-btn');
  const answerBox = document.getElementById('ask-answer-box');
  const answerTitle = document.getElementById('ask-answer-title');
  const answerContent = document.getElementById('ask-answer-content');
  const chips = document.querySelectorAll('.chip-btn');

  const knowledgeBase = [
    {
      keywords: ['asthma', 'breath', 'cough', 'respiratory', 'allergy', 'दमा', 'सांस', 'खांसी'],
      title_en: 'Do you treat Asthma and Chronic Respiratory Allergies?',
      title_hi: 'क्या आप दमा (Asthma) और सांस की एलर्जी का इलाज करते हैं?',
      answer_en: 'Yes, Dr. Amit Singh provides specialized classical homeopathic constitutional therapy for bronchial asthma, dust/pollen allergies, and chronic bronchitis. The treatment strengthens lung vitality and reduces dependency on inhalers gradually without side effects.',
      answer_hi: 'हाँ, डॉ. अमित सिंह दमा (Asthma), धूल-धुएं की एलर्जी और ब्रोंकाइटिस का विशेष क्लासिकल होम्योपैथिक उपचार करते हैं। यह फेफड़ों की कार्यक्षमता को मजबूत कर धीरे-धीरे इनहेलर की निर्भरता को समाप्त करने में अत्यंत प्रभावी है।'
    },
    {
      keywords: ['fee', 'fees', 'cost', 'charge', 'consultation', '500', 'rs 500', '₹500', 'शुल्क', 'फीस', 'खर्चा', 'रुपये'],
      title_en: 'What is the consultation fee?',
      title_hi: 'परामर्श शुल्क (Consultation Fee) कितना है?',
      answer_en: 'The consultation fee at Shri Sai Homeo Cure Clinic is ₹500 (Rs. 500 only), which includes an in-depth constitutional case study, disease evaluation, and personalized advice by Dr. Amit Singh.',
      answer_hi: 'श्री सांई होम्योपैथी क्योर क्लिनिक में डॉ. अमित सिंह का परामर्श शुल्क केवल ₹500 (500 रुपये) है, जिसमें संपूर्ण केस हिस्ट्री, रोग परीक्षण एवं विस्तृत व्यक्तिगत परामर्श शामिल है।'
    },
    {
      keywords: ['medicine', 'included', 'pills', 'cost of medicine', 'दवा', 'दवाइयां'],
      title_en: 'Is medicine included in the consultation?',
      title_hi: 'क्या परामर्श में दवाइयां शामिल होती हैं?',
      answer_en: 'Standard genuine German and Indian homeopathic remedies are provided directly from our clinic’s dedicated dispensary according to the prescribed course (typically 15 to 30 days doses).',
      answer_hi: 'जी हाँ, क्लिनिक की अपनी डिस्पेंसरी से शुद्ध व प्रामाणिक जर्मन एवं भारतीय होम्योपैथिक दवाइयां निर्धारित कोर्स (15 से 30 दिनों की खुराक) के अनुसार उपलब्ध कराई जाती हैं।'
    },
    {
      keywords: ['skin', 'psoriasis', 'eczema', 'itching', 'allergy', 'fungal', 'स्किन', 'चर्म', 'खुजली', 'सोरायसिस', 'दाद'],
      title_en: 'How does homeopathy treat skin diseases?',
      title_hi: 'होम्योपैथी चर्म रोगों (Skin Diseases) को कैसे ठीक करती है?',
      answer_en: 'Skin conditions like Psoriasis, Eczema, and Urticaria arise from inner immune imbalances. Dr. Amit Singh uses root-cause constitutional remedies rather than steroid suppression, ensuring clear, glowing skin with long-lasting remission.',
      answer_hi: 'सोरायसिस, एक्जिमा, फंगल इन्फेक्शन एवं एलर्जी शरीर के अंदरूनी इम्यून असंतुलन से होते हैं। डॉ. अमित सिंह स्टेरॉयड द्वारा दबाने के बजाय बीमारी के मूल कारण को ठीक करते हैं जिससे त्वचा पूरी तरह साफ व स्वस्थ हो जाती है।'
    },
    {
      keywords: ['timing', 'hours', 'time', 'open', 'sunday', 'schedule', 'समय', 'टाइम', 'कब खुलता है'],
      title_en: 'What are the clinic timings?',
      title_hi: 'क्लिनिक खुलने का समय क्या है?',
      answer_en: 'The clinic is open Monday to Saturday: Morning 10:00 AM – 2:00 PM and Evening 5:00 PM – 8:30 PM. On Sundays, consultations are available from 10:30 AM to 2:00 PM (by prior appointment).',
      answer_hi: 'क्लिनिक सोमवार से शनिवार: सुबह 10:00 से दोपहर 2:00 बजे तक एवं शाम 5:00 से रात 8:30 बजे तक खुला रहता है। रविवार को सुबह 10:30 से दोपहर 2:00 बजे तक (पूर्व अपॉइंटमेंट द्वारा)।'
    },
    {
      keywords: ['address', 'location', 'where', 'reach', 'pachpedi naka', 'पता', 'कहाँ', 'लोकेशन', 'पचपेड़ी नाका'],
      title_en: 'Where is the clinic located in Raipur?',
      title_hi: 'रायपुर में क्लिनिक कहाँ स्थित है?',
      answer_en: 'We are situated Infront Of Lal Ganga Business Park, New Dhamtari Road, Pachpedi Naka, Raipur, Chhattisgarh - 492001. Very easily accessible with parking available.',
      answer_hi: 'क्लिनिक लाल गंगा बिजनेस पार्क के ठीक सामने, न्यू धमतरी रोड, पचपेड़ी नाका, रायपुर (छत्तीसगढ़) - 492001 में स्थित है। यहाँ पहुंचना बेहद आसान है और पार्किंग की सुविधा उपलब्ध है।'
    },
    {
      keywords: ['side effect', 'safe', 'children', 'kids', 'baby', 'बच्चे', 'नुकसान', 'साइड इफेक्ट'],
      title_en: 'Are homeopathic medicines safe for children?',
      title_hi: 'क्या होम्योपैथिक दवाइयां बच्चों के लिए सुरक्षित हैं?',
      answer_en: '100% safe, non-toxic, and non-habit forming. Children love the sweet sugar pills, and it is the safest natural medical system for boosting pediatric immunity, treating recurrent colds, tonsils, and dentition problems.',
      answer_hi: '100% सुरक्षित, प्राकृतिक और मीठी गोलियां जो बच्चे बहुत पसंद करते हैं। बच्चों की रोग-प्रतिरोधक क्षमता (Immunity) बढ़ाने, बार-बार होने वाले सर्दी-जुकाम, टॉन्सिल और दांत निकलने की समस्याओं में यह सबसे सुरक्षित चिकित्सा है।'
    }
  ];

  function searchAndDisplay(query) {
    if (!query || !query.trim()) return;
    const cleanQuery = query.toLowerCase().trim();

    let match = knowledgeBase.find(item => 
      item.keywords.some(kw => cleanQuery.includes(kw))
    );

    const isHi = currentLang === 'hi';

    if (!match) {
      match = {
        title_en: `Inquiry regarding "${query}"`,
        title_hi: `"${query}" के संबंध में जानकारी`,
        answer_en: `Dr. Amit Singh specializes in treating this and many chronic conditions safely. Please book a direct consultation or call us at 9926974248 / 7999164270 for immediate personalized advice.`,
        answer_hi: `डॉ. अमित सिंह इस समस्या के सटीक व सुरक्षित उपचार के विशेषज्ञ हैं। व्यक्तिगत सलाह व अपॉइंटमेंट के लिए कृपया 9926974248 / 7999164270 पर संपर्क करें या क्लिनिक पधारें।`
      };
    }

    if (answerTitle && answerContent && answerBox) {
      answerTitle.innerHTML = `🌿 ${isHi ? match.title_hi : match.title_en}`;
      answerContent.innerHTML = isHi ? match.answer_hi : match.answer_en;
      answerBox.classList.add('visible');
    }
  }

  // Handle chips click
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const query = chip.getAttribute('data-query');
      if (input) input.value = query;
      searchAndDisplay(query);
    });
  });

  // Handle input submit
  submitBtn?.addEventListener('click', () => {
    if (input) searchAndDisplay(input.value);
  });

  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchAndDisplay(input.value);
    }
  });
}

/* --------------------------------------------------------------------------
   4. TREATMENT FILTER TABS
   -------------------------------------------------------------------------- */
function initTreatmentFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.treatment-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category?.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Handle "Book for this condition" buttons inside treatment cards
  const conditionBookBtns = document.querySelectorAll('.btn-card-book');
  conditionBookBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const conditionName = btn.getAttribute('data-condition') || '';
      openBookingModal(conditionName);
    });
  });
}

/* --------------------------------------------------------------------------
   5. APPOINTMENT BOOKING FORMS & MODAL
   -------------------------------------------------------------------------- */
function initBookingForms() {
  // Modal trigger buttons
  const modalTriggers = document.querySelectorAll('.trigger-book-modal');
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  // Modal close
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  closeBtn?.addEventListener('click', () => closeModal());
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Forms handling (both page section form & popup modal form)
  const bookingForms = document.querySelectorAll('.appointment-form');
  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="patient_name"]')?.value || 'Patient';
      const phone = form.querySelector('[name="patient_phone"]')?.value || '';
      const condition = form.querySelector('[name="condition"]')?.value || 'General Consultation';
      const date = form.querySelector('[name="preferred_date"]')?.value || 'Earliest Available';
      const slot = form.querySelector('[name="preferred_slot"]')?.value || 'Morning (10AM - 2PM)';
      const consultType = form.querySelector('input[name="consult_type"]:checked')?.value || 'In-Clinic (Raipur)';
      const message = form.querySelector('[name="patient_message"]')?.value || 'None';

      if (!phone || phone.trim().length < 10) {
        showToast(currentLang === 'hi' ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.', 'error');
        return;
      }

      // Send to Backend API
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, condition, date: date || new Date().toISOString().split('T')[0], message })
      }).catch(console.error);

      // Build WhatsApp message
      const textMessage = `*New Appointment Request - Shri Sai Homeo Cure Clinic*%0A%0A` +
        `👤 *Patient Name:* ${encodeURIComponent(name)}%0A` +
        `📱 *Contact:* ${encodeURIComponent(phone)}%0A` +
        `🩺 *Condition:* ${encodeURIComponent(condition)}%0A` +
        `🏥 *Mode:* ${encodeURIComponent(consultType)}%0A` +
        `💰 *Consultation Fee:* ₹500%0A` +
        `📅 *Preferred Date:* ${encodeURIComponent(date)}%0A` +
        `⏰ *Preferred Slot:* ${encodeURIComponent(slot)}%0A` +
        `📝 *Notes:* ${encodeURIComponent(message)}%0A%0A` +
        `_Please confirm availability with Dr. Amit Singh._`;

      const whatsappUrl = `https://wa.me/919926974248?text=${textMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      const successMsg = currentLang === 'hi'
        ? `धन्यवाद ${name}! डॉ. अमित सिंह के व्हाट्सएप पर आपका अपॉइंटमेंट विवरण खुल रहा है।`
        : `Thank you ${name}! Opening WhatsApp to confirm your appointment with Dr. Amit Singh.`;

      showToast(successMsg, 'success');
      form.reset();
      closeModal();
    });
  });
}

function openBookingModal(preselectedCondition = '') {
  const modal = document.getElementById('booking-modal');
  if (!modal) return;

  if (preselectedCondition) {
    const select = modal.querySelector('[name="condition"]');
    if (select) {
      let optionFound = false;
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(preselectedCondition.toLowerCase())) {
          select.selectedIndex = i;
          optionFound = true;
          break;
        }
      }
      if (!optionFound) {
        const newOpt = new Option(preselectedCondition, preselectedCondition, true, true);
        select.add(newOpt);
      }
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('booking-modal');
  modal?.classList.remove('active');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   6. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. SCROLL TO TOP & DOCK
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   8. REVIEW MODAL & TOAST
   -------------------------------------------------------------------------- */
function initReviewModal() {
  const writeReviewBtn = document.getElementById('btn-write-review');
  const reviewModal = document.getElementById('review-modal');
  const closeReviewBtn = document.getElementById('review-modal-close');
  const reviewForm = document.getElementById('patient-review-form');
  const reviewsContainer = document.querySelector('.reviews-grid');

  writeReviewBtn?.addEventListener('click', () => {
    reviewModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeReviewBtn?.addEventListener('click', () => {
    reviewModal?.classList.remove('active');
    document.body.style.overflow = '';
  });

  reviewModal?.addEventListener('click', (e) => {
    if (e.target === reviewModal) {
      reviewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  reviewForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const reviewerName = document.getElementById('reviewer_name')?.value || 'Patient';
    const rating = document.getElementById('reviewer_rating')?.value || '5';
    const condition = document.getElementById('reviewer_condition')?.value || 'Treated Condition';
    const text = document.getElementById('reviewer_text')?.value || '';

    const starsHtml = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));

    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.style.animation = 'fadeIn 0.5s ease';
    newCard.innerHTML = `
      <div class="review-stars">${starsHtml}</div>
      <p class="review-text">"${text}"</p>
      <div class="review-author">
        <div class="author-avatar">${reviewerName.charAt(0).toUpperCase()}</div>
        <div class="author-info">
          <h5>${reviewerName}</h5>
          <p>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            ${currentLang === 'hi' ? 'सत्यापित मरीज' : 'Verified Patient'} • ${condition}
          </p>
        </div>
      </div>
    `;

    reviewsContainer?.prepend(newCard);
    showToast(currentLang === 'hi' ? 'धन्यवाद! आपकी समीक्षा सफलतापूर्वक जोड़ दी गई है।' : 'Thank you! Your review has been added successfully.', 'success');
    reviewForm.reset();
    reviewModal?.classList.remove('active');
    document.body.style.overflow = '';
  });
}

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.className = `toast-notice ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : 'ℹ'}</span>
    <div>${message}</div>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* --------------------------------------------------------------------------
   9. ADMIN LOGIN LOGIC
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const loginTriggers = document.querySelectorAll('.trigger-login-modal');
  const loginModal = document.getElementById('login-modal');
  const closeLoginBtn = document.getElementById('login-modal-close');
  const loginForm = document.getElementById('admin-login-form');
  const errorMsg = document.getElementById('login-error');

  loginTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      loginModal?.classList.add('active');
      if (errorMsg) errorMsg.style.display = 'none';
      document.body.style.overflow = 'hidden';
    });
  });

  closeLoginBtn?.addEventListener('click', () => {
    loginModal?.classList.remove('active');
    document.body.style.overflow = '';
  });

  loginModal?.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.username);
        window.location.href = 'admin.html';
      } else {
        if (errorMsg) {
          errorMsg.textContent = data.error || 'Login failed';
          errorMsg.style.display = 'block';
        }
      }
    } catch (err) {
      console.error(err);
      if (errorMsg) {
        errorMsg.textContent = 'Server error. Try again.';
        errorMsg.style.display = 'block';
      }
    }
  });

  // Load Site Settings
  loadSettings();
});

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) return;
    const settings = await res.json();
    
    if (settings.home_image) {
      const img = document.getElementById('site-home_image');
      if (img) img.src = settings.home_image;
    }
    if (settings.doctor_image) {
      const img = document.getElementById('site-doctor_image');
      if (img) img.src = settings.doctor_image;
    }
    if (settings.why_us_image) {
      const img = document.getElementById('site-why_us_image');
      if (img) img.src = settings.why_us_image;
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

async function initDiseaseGallery() {
  const slider = document.getElementById('disease-gallery-slider');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!slider) return;

  try {
    const res = await fetch('/api/gallery');
    if (!res.ok) return;
    const images = await res.json();
    
    if (images.length === 0) {
      // Hide the gallery section if no images
      slider.closest('.container').style.display = 'none';
      return;
    }

    images.forEach(img => {
      const slide = document.createElement('div');
      slide.className = 'disease-slide';
      slide.innerHTML = `<img src="${img.image_path}" alt="Clinical Gallery Image" loading="lazy">`;
      slider.appendChild(slide);
    });

    // Slider scroll logic
    const scrollAmount = 300; // approximate width of one slide + gap

    prevBtn?.addEventListener('click', () => {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

  } catch(err) {
    console.error('Failed to load gallery images', err);
  }
}
