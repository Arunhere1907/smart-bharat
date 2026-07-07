/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  // Global / Navigation
  appName: string;
  appSubtitle: string;
  navChat: string;
  navReport: string;
  navDashboard: string;

  // CivicChat.tsx
  welcomeText: string;
  findScheme: string;
  findSchemeDesc: string;
  docChecklist: string;
  docChecklistDesc: string;
  reportCivic: string;
  reportCivicDesc: string;
  checkEligibilityBtn: string;
  viewChecklistsBtn: string;
  uploadPhotoBtn: string;
  speakToAi: string;
  listeningPlaceholder: string;
  typePlaceholder: string;
  send: string;
  supportedLanguages: string;
  listeningTranscription: string;
  readAloud: string;
  routedLive: string;
  routingText: string;

  // ComplaintFiler.tsx
  filerTitle: string;
  filerSubtitle: string;
  gpsPosition: string;
  acquiringGps: string;
  gpsFallback: string;
  refreshGps: string;
  haversineWait: string;
  dupDetected: string;
  successFiled: string;
  idLabel: string;
  recordDetails: string;
  categoryLabel: string;
  severityLabel: string;
  aiDescription: string;
  totalUpvotes: string;
  municipalStatus: string;
  reportAnother: string;
  viewMap: string;
  snapSelectPhoto: string;
  clickToBrowse: string;
  confirmCategory: string;
  estimatedUrgency: string;
  low: string;
  medium: string;
  high: string;
  addShortDescription: string;
  aiAutoGenerate: string;
  submitComplaint: string;

  // Categories
  pothole: string;
  garbage: string;
  streetlight: string;
  water_leak: string;
  other: string;

  // CivicDashboard.tsx
  totalReports: string;
  resolved: string;
  inProgress: string;
  openFiles: string;
  municipalWardArea: string;
  resolutionRate: string;
  assignedWardOfficers: string;
  awaitingAudit: string;
  filterLabel: string;
  verifiedProblemDetails: string;
  upvoteBtn: string;
  simulateOpen: string;
  simulateInProgress: string;
  simulateResolved: string;
  selectMapPin: string;
  exploreActiveCivic: string;
  noReportsCategory: string;
}

export const translations: Record<string, TranslationSet> = {
  en: {
    appName: "Smart Bharat",
    appSubtitle: "AI Civic Companion",
    navChat: "AI Companion",
    navReport: "Report Issue",
    navDashboard: "Dashboard",

    welcomeText: "Namaste! I am your Smart Bharat Companion. I can help you find government schemes, understand required document checklists, report local issues like potholes or garbage, or check your complaint status. Feel free to speak or type in your language!",
    findScheme: "Check Govt Schemes",
    findSchemeDesc: "Eligibility for PM-KISAN, Ayushman Bharat, subsidies & support.",
    docChecklist: "Document Checklists",
    docChecklistDesc: "Required files for Passport, Driving License, Ration Card or PAN.",
    reportCivic: "Report Civic Issue",
    reportCivicDesc: "Directly upload a photo of potholes, garbage, or streetlights.",
    checkEligibilityBtn: "Check Eligibility",
    viewChecklistsBtn: "View Checklists",
    uploadPhotoBtn: "Upload Photo",
    speakToAi: "Speak to AI",
    listeningPlaceholder: "Listening... Speak now...",
    typePlaceholder: "Ask: 'Am I eligible for PM-Kisan?' or 'passport documents'...",
    send: "Send",
    supportedLanguages: "Supported: English, Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali",
    listeningTranscription: "Speak now! AI companion is writing transcription...",
    readAloud: "Read Aloud",
    routedLive: "routed live",
    routingText: "Civic agent routing...",

    filerTitle: "Report a Civic Issue",
    filerSubtitle: "Simply upload a photo. Our AI scans, dedups nearby reports, and registers complaints instantly.",
    gpsPosition: "GPS Position",
    acquiringGps: "Acquiring accurate GPS fix...",
    gpsFallback: "Location block fallback loaded",
    refreshGps: "Refresh GPS",
    haversineWait: "Please do not close. Computing haversine proximity...",
    dupDetected: "Nearby Duplicate Detected!",
    successFiled: "Complaint Filed Successfully!",
    idLabel: "ID:",
    recordDetails: "Complaint Record details",
    categoryLabel: "Category",
    severityLabel: "Severity Priority",
    aiDescription: "AI Verified Description",
    totalUpvotes: "Total Upvote Weight",
    municipalStatus: "Municipal Status",
    reportAnother: "Report Another",
    viewMap: "View Map",
    snapSelectPhoto: "Snap or Select Photo",
    clickToBrowse: "Tap to browse or drop image file here",
    confirmCategory: "Confirm or Select Category",
    estimatedUrgency: "Estimated Urgency",
    low: "Low",
    medium: "Medium",
    high: "High",
    addShortDescription: "Add Short Description (Optional)",
    aiAutoGenerate: "AI will auto-generate if empty",
    submitComplaint: "Submit Complaint",

    pothole: "Pothole",
    garbage: "Garbage",
    streetlight: "Streetlights",
    water_leak: "Water Leaks",
    other: "Others",

    totalReports: "Total Reports",
    resolved: "Resolved",
    inProgress: "In Progress",
    openFiles: "Open Files",
    municipalWardArea: "Municipal Ward Area",
    resolutionRate: "Resolution Rate",
    assignedWardOfficers: "Assigned Ward Officers",
    awaitingAudit: "Awaiting AI/Officer audit",
    filterLabel: "FILTER:",
    verifiedProblemDetails: "Verified Problem Details",
    upvoteBtn: "Upvote",
    simulateOpen: "Simulate Open",
    simulateInProgress: "Simulate In Progress",
    simulateResolved: "Simulate Resolved",
    selectMapPin: "Select map pin or card",
    exploreActiveCivic: "Explore active civic files and upvote to elevate priority",
    noReportsCategory: "No reports in this category"
  },
  hi: {
    appName: "स्मार्ट भारत",
    appSubtitle: "एआई नागरिक साथी",
    navChat: "एआई साथी",
    navReport: "शिकायत दर्ज करें",
    navDashboard: "डैशबोर्ड",

    welcomeText: "नमस्ते! मैं आपका स्मार्ट भारत साथी हूँ। मैं आपको सरकारी योजनाओं को खोजने, आवश्यक दस्तावेज़ों की जांच करने, स्थानीय समस्याओं जैसे गड्ढे या कचरे की रिपोर्ट करने, या आपकी शिकायत की स्थिति की जांच करने में मदद कर सकता हूँ। अपनी भाषा में बात करें या लिखें!",
    findScheme: "सरकारी योजनाएं",
    findSchemeDesc: "पीएम-किसान, आयुष्मान भारत, सब्सिडी और सरकारी सहायता की पात्रता।",
    docChecklist: "दस्तावेज़ सूची",
    docChecklistDesc: "पासपोर्ट, ड्राइविंग लाइसेंस, राशन कार्ड या पैन के लिए आवश्यक दस्तावेज़।",
    reportCivic: "समस्या की रिपोर्ट",
    reportCivicDesc: "गड्ढों, कचरे या स्ट्रीटलाइट्स की फोटो सीधे अपलोड करें।",
    checkEligibilityBtn: "पात्रता जांचें",
    viewChecklistsBtn: "सूचियां देखें",
    uploadPhotoBtn: "फोटो अपलोड करें",
    speakToAi: "एआई से बात करें",
    listeningPlaceholder: "सुन रहा हूँ... अब बोलें...",
    typePlaceholder: "पूछें: 'क्या मैं पीएम-किसान के लिए पात्र हूँ?' या 'पासपोर्ट दस्तावेज़'...",
    send: "भेजें",
    supportedLanguages: "समर्थित: अंग्रेजी, हिंदी, हिंग्लिश, तमिल, तेलुगु, कन्नड़, बंगाली",
    listeningTranscription: "अभी बोलें! एआई साथी प्रतिलेखन लिख रहा है...",
    readAloud: "सुनें",
    routedLive: "लाइव भेजा गया",
    routingText: "नागरिक एजेंट रूटिंग...",

    filerTitle: "नागरिक समस्या की रिपोर्ट करें",
    filerSubtitle: "बस एक फोटो अपलोड करें। हमारा एआई फोटो को स्कैन करता है, आसपास की शिकायतों को डुप्लीकेट होने से बचाता है और तुरंत शिकायत दर्ज करता है।",
    gpsPosition: "जीपीएस स्थिति",
    acquiringGps: "सटीक जीपीएस स्थिति प्राप्त की जा रही है...",
    gpsFallback: "स्थान अवरुद्ध फ़ॉलबैक लोड किया गया",
    refreshGps: "जीपीएस रीफ्रेश करें",
    haversineWait: "कृपया बंद न करें। निकटता की गणना की जा रही है...",
    dupDetected: "आसपास डुप्लिकेट शिकायत मिली!",
    successFiled: "शिकायत सफलतापूर्वक दर्ज की गई!",
    idLabel: "आईडी:",
    recordDetails: "शिकायत रिकॉर्ड विवरण",
    categoryLabel: "श्रेणी",
    severityLabel: "गंभीरता प्राथमिकता",
    aiDescription: "एआई सत्यापित विवरण",
    totalUpvotes: "कुल वोट भार",
    municipalStatus: "नगरपालिका स्थिति",
    reportAnother: "एक और रिपोर्ट करें",
    viewMap: "नक्शा देखें",
    snapSelectPhoto: "फोटो लें या चुनें",
    clickToBrowse: "ब्राउज़ करने के लिए टैप करें या यहाँ इमेज फ़ाइल छोड़ें",
    confirmCategory: "श्रेणी की पुष्टि करें या चुनें",
    estimatedUrgency: "अनुमानित तात्कालिकता",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    addShortDescription: "संक्षिप्त विवरण जोड़ें (वैकल्पिक)",
    aiAutoGenerate: "खाली होने पर एआई स्वचालित रूप से विवरण बनाएगा",
    submitComplaint: "शिकायत दर्ज करें",

    pothole: "गड्ढा",
    garbage: "कचरा",
    streetlight: "स्ट्रीटलाइट",
    water_leak: "पानी का रिसाव",
    other: "अन्य",

    totalReports: "कुल रिपोर्ट",
    resolved: "सुलझाया गया",
    inProgress: "प्रगति पर",
    openFiles: "लंबित मामले",
    municipalWardArea: "नगरपालिका वार्ड क्षेत्र",
    resolutionRate: "समाधान दर",
    assignedWardOfficers: "सौंपे गए वार्ड अधिकारी",
    awaitingAudit: "एआई/अधिकारी ऑडिट लंबित",
    filterLabel: "फ़िल्टर:",
    verifiedProblemDetails: "सत्यापित समस्या विवरण",
    upvoteBtn: "वोट दें",
    simulateOpen: "लंबित स्थिति दर्शाएं",
    simulateInProgress: "प्रगति स्थिति दर्शाएं",
    simulateResolved: "सुलझाया हुआ दर्शाएं",
    selectMapPin: "नक्शा पिन या कार्ड चुनें",
    exploreActiveCivic: "सक्रिय नागरिक फाइलों का अन्वेषण करें और प्राथमिकता बढ़ाने के लिए वोट करें",
    noReportsCategory: "इस श्रेणी में कोई रिपोर्ट नहीं है"
  },
  hinglish: {
    appName: "Smart Bharat",
    appSubtitle: "AI Civic Companion",
    navChat: "AI Companion",
    navReport: "Report Issue",
    navDashboard: "Dashboard",

    welcomeText: "Namaste! Main aapka Smart Bharat Companion hoon. Main aapki help kar sakta hoon government schemes dhoodhne mein, document checklists samajhne mein, pothole ya garbage report karne mein, aur complaint status check karne mein. Apni language mein type ya speak karein!",
    findScheme: "Govt Schemes Check",
    findSchemeDesc: "PM-KISAN, Ayushman Bharat aur subsidies ki eligibility check karein.",
    docChecklist: "Document Checklists",
    docChecklistDesc: "Passport, Driving License, Ration Card ya PAN ke liye zaroori documents.",
    reportCivic: "Civic Issue Report",
    reportCivicDesc: "Potholes, garbage, ya streetlights ki photo directly upload karein.",
    checkEligibilityBtn: "Eligibility Check",
    viewChecklistsBtn: "Checklists Dekhein",
    uploadPhotoBtn: "Photo Upload",
    speakToAi: "AI se baat karein",
    listeningPlaceholder: "Sunaayi de raha hai... Ab bolein...",
    typePlaceholder: "Puchhein: 'Kya main PM-Kisan ke liye eligible hoon?' ya 'passport documents'...",
    send: "Bhejein",
    supportedLanguages: "Supported: English, Hindi, Hinglish, Tamil, Telugu, Kannada, Bengali",
    listeningTranscription: "Bolein! AI companion transcription likh raha hai...",
    readAloud: "Bolkar sunein",
    routedLive: "routed live",
    routingText: "Civic agent routing...",

    filerTitle: "Civic Issue Report Karein",
    filerSubtitle: "Bas ek photo upload karein. Humara AI scan karega, nearby duplicate check karega, aur complaint register karega instantly.",
    gpsPosition: "GPS Position",
    acquiringGps: "Accurate GPS fix le rahe hain...",
    gpsFallback: "Location block fallback loaded",
    refreshGps: "Refresh GPS",
    haversineWait: "Please close na karein. Proximity check ho rahi hai...",
    dupDetected: "Nearby Duplicate Detected!",
    successFiled: "Complaint successfully file ho gayi!",
    idLabel: "ID:",
    recordDetails: "Complaint Details",
    categoryLabel: "Category",
    severityLabel: "Severity Priority",
    aiDescription: "AI Verified Description",
    totalUpvotes: "Total Upvote Weight",
    municipalStatus: "Municipal Status",
    reportAnother: "Ek aur report karein",
    viewMap: "Map Dekhein",
    snapSelectPhoto: "Photo lein ya select karein",
    clickToBrowse: "Tap karein browse karne ke liye ya photo drop karein",
    confirmCategory: "Category Confirm ya Select karein",
    estimatedUrgency: "Estimated Urgency",
    low: "Low",
    medium: "Medium",
    high: "High",
    addShortDescription: "Short Description Add Karein (Optional)",
    aiAutoGenerate: "Khali rehne par AI auto-generate karega",
    submitComplaint: "Complaint Submit Karein",

    pothole: "Pothole",
    garbage: "Garbage",
    streetlight: "Streetlights",
    water_leak: "Water Leak",
    other: "Others",

    totalReports: "Total Reports",
    resolved: "Resolved",
    inProgress: "In Progress",
    openFiles: "Open Files",
    municipalWardArea: "Municipal Ward Area",
    resolutionRate: "Resolution Rate",
    assignedWardOfficers: "Assigned Ward Officers",
    awaitingAudit: "Awaiting AI/Officer audit",
    filterLabel: "FILTER:",
    verifiedProblemDetails: "Verified Problem Details",
    upvoteBtn: "Upvote",
    simulateOpen: "Simulate Open",
    simulateInProgress: "Simulate In Progress",
    simulateResolved: "Simulate Resolved",
    selectMapPin: "Map pin ya card select karein",
    exploreActiveCivic: "Active civic files explore karein aur priority badhane ke liye upvote karein",
    noReportsCategory: "Is category mein koi reports nahi hain"
  },
  ta: {
    appName: "ஸ்மார்ட் பாரத்",
    appSubtitle: "AI குடிமைத் தோழன்",
    navChat: "AI தோழன்",
    navReport: "பிரச்சினையைப் புகாரளி",
    navDashboard: "டாஷ்போர்டு",

    welcomeText: "வணக்கம்! நான் உங்கள் ஸ்மார்ட் பாரத் தோழன். அரசுத் திட்டங்களைக் கண்டறியவும், தேவையான ஆவணப் பட்டியல்களைப் புரிந்துகொள்ளவும், குண்டும் குழியும் அல்லது குப்பைகள் போன்ற உள்ளூர் பிரச்சினைகளைப் புகாரளிக்கவும் அல்லது உங்கள் புகாரின் நிலையைச் சரிபார்க்கவும் நான் உங்களுக்கு உதவ முடியும். உங்கள் மொழியில் பேசவும் அல்லது தட்டச்சு செய்யவும்!",
    findScheme: "அரசுத் திட்டங்கள்",
    findSchemeDesc: "PM-KISAN, ஆயுஷ்மான் பாரத், மானியங்கள் மற்றும் ஆதரவிற்கான தகுதி.",
    docChecklist: "ஆவணப் பட்டியல்கள்",
    docChecklistDesc: "கடவுச்சீட்டு, ஓட்டுநர் உரிமம், குடும்ப அட்டை அல்லது பான் கார்டுக்குத் தேவையான கோப்புகள்.",
    reportCivic: "குடிமைப் பிரச்சினை",
    reportCivicDesc: "குண்டும் குழியும், குப்பை அல்லது தெருவிளக்குகளின் புகைப்படத்தை நேரடியாகப் பதிவேற்றவும்.",
    checkEligibilityBtn: "தகுதியைச் சரிபார்",
    viewChecklistsBtn: "பட்டியல்களைப் பார்",
    uploadPhotoBtn: "புகைப்படத்தைப் பதிவேற்று",
    speakToAi: "AI உடன் பேசுங்கள்",
    listeningPlaceholder: "கேட்கிறது... இப்போது பேசுங்கள்...",
    typePlaceholder: "கேளுங்கள்: 'நான் PM-Kisan திட்டத்திற்குத் தகுதியானவரா?' அல்லது 'கடவுச்சீட்டு ஆவணங்கள்'...",
    send: "அனுப்பு",
    supportedLanguages: "ஆதரவு: ஆங்கிலம், இந்தி, இங்கிலிஷ், தமிழ், தெலுங்கு, கன்னடம், பெங்காலி",
    listeningTranscription: "இப்போது பேசுங்கள்! AI துணைவி எழுத்துப்பெயர்ப்பு எழுதுகிறது...",
    readAloud: "சத்தமாக வாசி",
    routedLive: "நேரடியாக அனுப்பப்பட்டது",
    routingText: "குடிமை முகவர் அனுப்புகிறார்...",

    filerTitle: "குடிமைப் பிரச்சினையைப் புகாரளிக்கவும்",
    filerSubtitle: "ஒரு புகைப்படத்தைப் பதிவேற்றவும். எங்கள் AI அதை ஸ்கேன் செய்து, அருகிலுள்ள நகல் புகார்களைக் களைந்து, உடனடியாகப் புகாரைப் பதிவு செய்யும்.",
    gpsPosition: "ஜி.பி.எஸ் நிலை",
    acquiringGps: "துல்லியமான ஜிபிஎஸ் நிலையைப் பெறுகிறது...",
    gpsFallback: "இருப்பிடத் தடுப்பு மாற்றுத் திட்டம் ஏற்றப்பட்டது",
    refreshGps: "ஜிபிஎஸ் புதுப்பி",
    haversineWait: "தயவுசெய்து மூட வேண்டாம். தூரத்தைக் கணக்கிடுகிறது...",
    dupDetected: "அருகில் நகல் புகார் கண்டறியப்பட்டது!",
    successFiled: "புகார் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!",
    idLabel: "அடையாள எண்:",
    recordDetails: "புகார் பதிவு விவரங்கள்",
    categoryLabel: "வகை",
    severityLabel: "தீவிரத்தன்மை முன்னுரிமை",
    aiDescription: "AI சரிபார்க்கப்பட்ட விளக்கம்",
    totalUpvotes: "மொத்த வாக்குகள்",
    municipalStatus: "நகராட்சி நிலை",
    reportAnother: "மற்றொன்றைப் புகாரளி",
    viewMap: "வரைபடத்தைப் பார்",
    snapSelectPhoto: "புகைப்படம் எடு அல்லது தேர்ந்தெடு",
    clickToBrowse: "தேட தட்டவும் அல்லது புகைப்படக் கோப்பை இங்கே இழுக்கவும்",
    confirmCategory: "வகையை உறுதிசெய் அல்லது தேர்ந்தெடு",
    estimatedUrgency: "மதிப்பிடப்பட்ட அவசரம்",
    low: "குறைவு",
    medium: "நடுத்தரம்",
    high: "அதிகம்",
    addShortDescription: "குறுகிய விளக்கம் சேர்க்கவும் (விருப்பத்தேர்வு)",
    aiAutoGenerate: "காலியாக இருந்தால் AI தானாகவே உருவாக்கும்",
    submitComplaint: "புகாரைச் சமர்ப்பி",

    pothole: "குண்டும்குழி",
    garbage: "குப்பை",
    streetlight: "தெருவிளக்கு",
    water_leak: "நீர் கசிவு",
    other: "மற்றவை",

    totalReports: "மொத்த புகார்கள்",
    resolved: "தீர்க்கப்பட்டவை",
    inProgress: "செயல்பாட்டில்",
    openFiles: "திறந்த கோப்புகள்",
    municipalWardArea: "நகராட்சி வார்டு பகுதி",
    resolutionRate: "தீர்வு விகிதம்",
    assignedWardOfficers: "ஒதுக்கப்பட்ட வார்டு அதிகாரிகள்",
    awaitingAudit: "AI/அதிகாரியின் தணிக்கைக்காகக் காத்திருக்கிறது",
    filterLabel: "வடிகட்டி:",
    verifiedProblemDetails: "சரிபார்க்கப்பட்ட பிரச்சினை விவரங்கள்",
    upvoteBtn: "வாக்களி",
    simulateOpen: "திறந்த நிலையை உருவகப்படுத்து",
    simulateInProgress: "செயல்பாட்டு நிலையை உருவகப்படுத்து",
    simulateResolved: "தீர்க்கப்பட்ட நிலையை உருவகப்படுத்து",
    selectMapPin: "வரைபட ஊசி அல்லது அட்டையைத் தேர்ந்தெடுக்கவும்",
    exploreActiveCivic: "செயலில் உள்ள குடிமைக் கோப்புகளை ஆராய்ந்து, முன்னுரிமையை உயர்த்த வாக்களிக்கவும்",
    noReportsCategory: "இந்த பிரிவில் புகார்கள் ஏதுமில்லை"
  },
  te: {
    appName: "స్మార్ట్ భారత్",
    appSubtitle: "AI పౌర సహచరుడు",
    navChat: "AI సహచరుడు",
    navReport: "సమస్యను నివేదించండి",
    navDashboard: "డ్యాష్‌బోర్డ్",

    welcomeText: "నమస్తే! నేను మీ స్మార్ట్ భారత్ సహచరుడిని. ప్రభుత్వ పథకాలను కనుగొనడంలో, అవసరమైన పత్రాల చెక్‌లిస్ట్‌లను అర్థం చేసుకోవడంలో, రోడ్డు గుంతలు లేదా చెత్త వంటి స్థానిక సమస్యలను నివేదించడంలో లేదా మీ ఫిర్యాదు స్థితిని తనిఖీ చేయడంలో నేను మీకు సహాయపడగలను. మీ భాషలో మాట్లాడండి లేదా టైప్ చేయండి!",
    findScheme: "ప్రభుత్వ పథకాలు",
    findSchemeDesc: "PM-KISAN, ఆయుష్మాన్ భారత్, సబ్సిడీలు & మద్దతు కోసం అర్హత.",
    docChecklist: "పత్రాల చెక్‌లిస్ట్‌లు",
    docChecklistDesc: "పాస్‌పోర్ట్, డ్రైవింగ్ లైసెన్స్, రేషన్ కార్డ్ లేదా పాన్ కోసం అవసరమైన ఫైల్‌లు.",
    reportCivic: "పౌర సమస్య నివేదిక",
    reportCivicDesc: "రోడ్డు గుంతలు, చెత్త లేదా వీధి దీపాల ఫోటోను నేరుగా అప్‌లోడ్ చేయండి.",
    checkEligibilityBtn: "అర్హతను తనిఖీ చేయండి",
    viewChecklistsBtn: "చెక్‌లిస్ట్‌లను వీక్షించండి",
    uploadPhotoBtn: "ఫోటో అప్‌లోడ్ చేయండి",
    speakToAi: "AIతో మాట్లాడండి",
    listeningPlaceholder: "వింటోంది... ఇప్పుడు మాట్లాడండి...",
    typePlaceholder: "అడగండి: 'నేను పీఎం-కిసాన్‌కు అర్హుడినా?' లేదా 'పాస్‌పోర్ట్ పత్రాలు'...",
    send: "పంపండి",
    supportedLanguages: "మద్దతు ఉన్న భాషలు: ఇంగ్లీష్, హిందీ, హింగ్లీష్, తమిళం, తెలుగు, కన్నడ, బెంగాలీ",
    listeningTranscription: "ఇప్పుడు మాట్లాడండి! AI సహచరుడు లిప్యంతరీకరణ రాస్తున్నారు...",
    readAloud: "గట్టిగా చదవండి",
    routedLive: "प्रत्यక్షంగా రూట్ చేయబడింది",
    routingText: "పౌర ఏజెంట్ రూటింగ్...",

    filerTitle: "పౌర సమస్యను నివేదించండి",
    filerSubtitle: "కేవలం ఒక ఫోటోను అప్‌లోడ్ చేయండి. మా AI స్కాన్ చేస్తుంది, సమీపంలోని నకిలీ నివేదికలను తొలగిస్తుంది మరియు ఫిర్యాదులను తక్షణమే నమోదు చేస్తుంది.",
    gpsPosition: "GPS స్థానం",
    acquiringGps: "ఖచ్చితమైన GPS స్థానాన్ని పొందుతోంది...",
    gpsFallback: "స్థాన బ్లాక్ ఫాల్‌బ్యాక్ లోడ్ చేయబడింది",
    refreshGps: "GPSని రిఫ్రెష్ చేయండి",
    haversineWait: "దయచేసి మూసివేయవద్దు. దూరాన్ని గుర్తిస్తోంది...",
    dupDetected: "సమీపంలో నకిలీ ఫిర్యాదు కనుగొనబడింది!",
    successFiled: "ఫిర్యాదు విజయవంతంగా నమోదైంది!",
    idLabel: "ఐడీ:",
    recordDetails: "ఫిర్యాదు రికార్డు వివరాలు",
    categoryLabel: "వర్గం",
    severityLabel: "తీవ్రత ప్రాధాన్యత",
    aiDescription: "AI ధృవీకరించిన వివరణ",
    totalUpvotes: "మొత్తం మద్దతు బరువు",
    municipalStatus: "మున్సిపల్ స్థితి",
    reportAnother: "మరొకటి నివేదించండి",
    viewMap: "మ్యాప్ చూడండి",
    snapSelectPhoto: "ఫోటో తీయండి లేదా ఎంచుకోండి",
    clickToBrowse: "బ్రౌజ్ చేయడానికి ట్యాప్ చేయండి లేదా ఇమేజ్ ఫైల్‌ను ఇక్కడ వదలండి",
    confirmCategory: "వర్గాన్ని ధృవీకరించండి లేదా ఎంచుకోండి",
    estimatedUrgency: "అంచనా వేసిన అత్యవసరం",
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "ఎక్కువ",
    addShortDescription: "చిన్న వివరణను జోడించండి (ఐచ్ఛికం)",
    aiAutoGenerate: "ఖాళీగా ఉంటే AI స్వయంచాలకంగా సృష్టిస్తుంది",
    submitComplaint: "ఫిర్యాదును సమర్పించండి",

    pothole: "గుంత",
    garbage: "చెత్త",
    streetlight: "వీధి దీపాలు",
    water_leak: "నీటి లీకేజీ",
    other: "ఇతరాలు",

    totalReports: "మొత్తం నివేదికలు",
    resolved: "పరిష్కరించబడినవి",
    inProgress: "ప్రగతిలో ఉంది",
    openFiles: "తెరిచిన ఫైల్‌లు",
    municipalWardArea: "మున్సిపల్ వార్డు ప్రాంతం",
    resolutionRate: "పరిష్కార రేటు",
    assignedWardOfficers: "కేటాయించిన వార్డు అధికారులు",
    awaitingAudit: "AI/అధికారి ఆడిట్ కోసం వేచి ఉంది",
    filterLabel: "ఫిల్టర్:",
    verifiedProblemDetails: "ధృవీకరించబడిన సమస్య వివరాలు",
    upvoteBtn: "మద్దతు ఇవ్వండి",
    simulateOpen: "ఓపెన్ స్థితిని అనుకరించండి",
    simulateInProgress: "ప్రగతి స్థితిని అనుకరించండి",
    simulateResolved: "పరిష్కరించబడిన స్థితిని అనుకరించండి",
    selectMapPin: "మ్యాప్ పిన్ లేదా కార్డ్‌ని ఎంచుకోండి",
    exploreActiveCivic: "క్రియాశీల పౌర ఫైళ్లను అన్వేషించండి మరియు ప్రాధాన్యతను పెంచడానికి మద్దతు ఇవ్వండి",
    noReportsCategory: "ఈ వర్గంలో నివేదికలు లేవు"
  },
  kn: {
    appName: "ಸ್ಮಾರ್ಟ್ ಭಾರತ್",
    appSubtitle: "AI ನಾಗರಿಕ ಒಡನಾಡಿ",
    navChat: "AI ಒಡನಾಡಿ",
    navReport: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    navDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",

    welcomeText: "ನಮಸ್ತೆ! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಭಾರತ್ ಒಡನಾಡಿ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು, ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು, ರಸ್ತೆ ಗುಂಡಿ ಅಥವಾ ಕಸದಂತಹ ಸ್ಥಳೀಯ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಲು ಅಥವಾ ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಲು ಅಥವಾ ಟೈಪ್ ಮಾಡಲು ಮುಕ್ತವಾಗಿರಿ!",
    findScheme: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    findSchemeDesc: "PM-KISAN, ಆಯುಷ್ಮಾನ್ ಭಾರತ್, ಸಬ್ಸಿಡಿಗಳು ಮತ್ತು ಬೆಂಬಲದ ಅರ್ಹತೆ.",
    docChecklist: "ದಾಖಲೆಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ",
    docChecklistDesc: "ಪಾಸ್‌ಪೋರ್ಟ್, ಚಾಲನಾ ಪರವಾನಗಿ, ಪಡಿತರ ಚೀಟಿ ಅಥವಾ ಪ್ಯಾನ್ ಕಾರ್ಡ್‌ಗಾಗಿ ಅಗತ್ಯವಿರುವ ದಾಖಲೆಗಳು.",
    reportCivic: "ನಾಗರಿಕ ಸಮಸ್ಯೆ ವರದಿ",
    reportCivicDesc: "ರಸ್ತೆ ಗುಂಡಿಗಳು, ಕಸ ಅಥವಾ ಬೀದಿ ದೀಪಗಳ ಫೋಟೋವನ್ನು ನೇರವಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    checkEligibilityBtn: "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ",
    viewChecklistsBtn: "ಪರಿಶೀಲನಾ ಪಟ್ಟಿ ವೀಕ್ಷಿಸಿ",
    uploadPhotoBtn: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    speakToAi: "AI ನೊಂದಿಗೆ ಮಾತನಾಡಿ",
    listeningPlaceholder: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ...",
    typePlaceholder: "ಕೇಳಿ: 'ನಾನು ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಯೋಜನೆಗೆ ಅರ್ಹನೇ?' ಅಥವಾ 'ಪಾಸ್‌ಪೋರ್ಟ್ ದಾಖಲೆಗಳು'...",
    send: "ಕಳುಹಿಸಿ",
    supportedLanguages: "ಬೆಂಬಲಿತ ಭಾಷೆಗಳು: ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ, ಹಿಂಗ್ಲಿಷ್, ತಮಿಳು, ತೆಲುಗು, ಕನ್ನಡ, ಬೆಂಗಾಲಿ",
    listeningTranscription: "ಈಗ ಮಾತನಾಡಿ! AI ಒಡನಾಡಿ ಲಿಪ್ಯಂತರವನ್ನು ಬರೆಯುತ್ತಿದೆ...",
    readAloud: "ಗಟ್ಟಿಯಾಗಿ ಓದು",
    routedLive: "ಲೈವ್ ರೂಟ್ ಮಾಡಲಾಗಿದೆ",
    routingText: "ನಾಗರಿಕ ಏಜೆಂಟ್ ರೂಟಿಂಗ್...",

    filerTitle: "ನಾಗರಿಕ ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    filerSubtitle: "ಕೇವಲ ಒಂದು ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ನಮ್ಮ AI ಸ್ಕ್ಯಾನ್ ಮಾಡುತ್ತದೆ, ಹತ್ತಿರದ ನಕಲಿ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸುತ್ತದೆ ಮತ್ತು ತಕ್ಷಣವೇ ದೂರುಗಳನ್ನು ನೋಂದಾಯಿಸುತ್ತದೆ.",
    gpsPosition: "ಜಿಪಿಎಸ್ ಸ್ಥಾನ",
    acquiringGps: "ನಿಖರವಾದ ಜಿಪಿಎಸ್ ಸ್ಥಾನವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    gpsFallback: "ಸ್ಥಳ ನಿರ್ಬಂಧದ ಪರ್ಯಾಯ ವಿಧಾನ ಲೋಡ್ ಆಗಿದೆ",
    refreshGps: "ಜಿಪಿಎಸ್ ರಿಫ್ರೆಶ್ ಮಾಡಿ",
    haversineWait: "ದಯವಿಟ್ಟು ಮುಚ್ಚಬೇಡಿ. ಹತ್ತಿರದ ದೂರವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...",
    dupDetected: "ಹತ್ತಿರದಲ್ಲಿ ನಕಲಿ ದೂರು ಪತ್ತೆಯಾಗಿದೆ!",
    successFiled: "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!",
    idLabel: "ಐಡಿ:",
    recordDetails: "ದೂರಿನ ದಾಖಲೆಯ ವಿವರಗಳು",
    categoryLabel: "ವರ್ಗ",
    severityLabel: "ತೀವ್ರತೆಯ ಆದ್ಯತೆ",
    aiDescription: "AI ಪರಿಶೀಲಿಸಿದ ವಿವರಣೆ",
    totalUpvotes: "ಒಟ್ಟು ಮತಗಳ ತೂಕ",
    municipalStatus: "ನಗರಸಭೆಯ ಸ್ಥಿತಿ",
    reportAnother: "ಮತ್ತೊಂದು ವರದಿ ಮಾಡಿ",
    viewMap: "ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ",
    snapSelectPhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಆಯ್ಕೆ ಮಾಡಿ",
    clickToBrowse: "ಹುಡುಕಲು ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ ಚಿತ್ರದ ಫೈಲ್ ಅನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ",
    confirmCategory: "ವರ್ಗವನ್ನು ಖಚಿತಪಡಿಸಿ ಅಥವಾ ಆಯ್ಕೆ ಮಾಡಿ",
    estimatedUrgency: "ಅಂದಾಜು ತುರ್ತು",
    low: "ಕಡಿಮೆ",
    medium: "ಮಧ್ಯಮ",
    high: "ಹೆಚ್ಚು",
    addShortDescription: "ಸಣ್ಣ ವಿವರಣೆಯನ್ನು ಸೇರಿಸಿ (ಐಚ್ಛಿಕ)",
    aiAutoGenerate: "ಖಾಲಿ ಇದ್ದರೆ AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ರಚಿಸುತ್ತದೆ",
    submitComplaint: "ದೂರು ಸಲ್ಲಿಸಿ",

    pothole: "ರಸ್ತೆ ಗುಂಡಿ",
    garbage: "ಕಸ",
    streetlight: "ಬೀದಿ ದೀಪ",
    water_leak: "ನೀರಿನ ಸೋರಿಕೆ",
    other: "ಇತರೇ",

    totalReports: "ಒಟ್ಟು ವರದಿಗಳು",
    resolved: "ಬಗೆಹರಿದವು",
    inProgress: "ಪ್ರಗತಿಯಲ್ಲಿವೆ",
    openFiles: "ತೆರೆದ ಕಡತಗಳು",
    municipalWardArea: "ನಗರಸಭೆಯ ವಾರ್ಡ್ ಪ್ರದೇಶ",
    resolutionRate: "ಪರಿಹಾರದ ದರ",
    assignedWardOfficers: "ನಿಯೋಜಿತ ವಾರ್ಡ್ ಅಧಿಕಾರಿಗಳು",
    awaitingAudit: "AI/ಅಧಿಕಾರಿಯ ಪರಿಶೀಲನೆಗೆ ಕಾಯಲಾಗುತ್ತಿದೆ",
    filterLabel: "ಫಿಲ್ಟರ್:",
    verifiedProblemDetails: "ಪರಿಶೀಲಿಸಿದ ಸಮಸ್ಯೆಯ ವಿವರಗಳು",
    upvoteBtn: "ಮತ ನೀಡಿ",
    simulateOpen: "ತೆರೆದ ಸ್ಥಿತಿಯನ್ನು ಅನುಕರಿಸಿ",
    simulateInProgress: "ಪ್ರಗತಿಯ ಸ್ಥಿತಿಯನ್ನು ಅನುಕರಿಸಿ",
    simulateResolved: "ಪರಿಹಾರದ ಸ್ಥಿತಿಯನ್ನು ಅನುಕರಿಸಿ",
    selectMapPin: "ನಕ್ಷೆಯ ಪಿನ್ ಅಥವಾ ಕಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",
    exploreActiveCivic: "ಸಕ್ರಿಯ ನಾಗರಿಕ ಕಡತಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಆದ್ಯತೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ಮತ ನೀಡಿ",
    noReportsCategory: "ಈ ವರ್ಗದಲ್ಲಿ ಯಾವುದೇ ವರದಿಗಳಿಲ್ಲ"
  },
  bn: {
    appName: "স্মার্ট ভারত",
    appSubtitle: "AI নাগরিক সাথী",
    navChat: "AI সাথী",
    navReport: "অভিযোগ জানান",
    navDashboard: "ড্যাশবোর্ড",

    welcomeText: "নমস্কার! আমি আপনার স্মার্ট ভারত সাথী। আমি আপনাকে সরকারি প্রকল্পগুলি খুঁজে পেতে, প্রয়োজনীয় কাগজপত্রের তালিকা বুঝতে, রাস্তার গর্ত বা আবর্জনা ফেলার মতো স্থানীয় সমস্যাগুলির অভিযোগ জানাতে অথবা আপনার অভিযোগের স্থিতি পরীক্ষা করতে সাহায্য করতে পারি। নিজের ভাষায় কথা বলুন বা লিখুন!",
    findScheme: "সরকারি প্রকল্পসমূহ",
    findSchemeDesc: "PM-KISAN, আয়ুষ্মান ভারত,ভর্তুকি ও সহায়তার যোগ্যতা পরীক্ষা করুন।",
    docChecklist: "নথিপত্রের তালিকা",
    docChecklistDesc: "পাসপোর্ট, ড্রাইভিং লাইসেন্স, রেশন কার্ড বা প্যান কার্ডের জন্য প্রয়োজনীয় কাগজপত্র।",
    reportCivic: "নাগরিক সমস্যা অভিযোগ",
    reportCivicDesc: "রাস্তার গর্ত, আবর্জনা বা স্ট্রিটলাইটের ছবি সরাসরি আপলোড করুন।",
    checkEligibilityBtn: "যোগ্যতা পরীক্ষা করুন",
    viewChecklistsBtn: "তালিকাগুলি দেখুন",
    uploadPhotoBtn: "ছবি আপলোড করুন",
    speakToAi: "AI এর সাথে কথা বলুন",
    listeningPlaceholder: "শুনছি... এখন বলুন...",
    typePlaceholder: "জিজ্ঞাসা করুন: 'আমি কি PM-Kisan এর যোগ্য?' বা 'পাসপোর্ট সংক্রান্ত কাগজপত্র'...",
    send: "পাঠান",
    supportedLanguages: "সমর্থিত ভাষা: ইংরেজি, হিন্দি, হিংলিশ, তামিল, তেলুগু, কন্নড়, বাংলা",
    listeningTranscription: "এখন বলুন! AI সাথী প্রতিলিপি লিখছে...",
    readAloud: "জোরে পড়ুন",
    routedLive: "লাইভ পাঠানো হয়েছে",
    routingText: "নাগরিক এজেন্ট পাঠানো হচ্ছে...",

    filerTitle: "নাগরিক সমস্যা অভিযোগ করুন",
    filerSubtitle: "কেবল একটি ছবি আপলোড করুন। আমাদের AI ছবি স্ক্যান করবে, আশেপাশের একই অভিযোগগুলি বাদ দেবে এবং সঙ্গে সঙ্গে অভিযোগ নথিভুক্ত করবে।",
    gpsPosition: "GPS অবস্থান",
    acquiringGps: "সঠিক GPS অবস্থান খোঁজা হচ্ছে...",
    gpsFallback: "লোকেশন ব্লক ফলব্যাক লোড করা হয়েছে",
    refreshGps: "GPS রিফ্রেশ করুন",
    haversineWait: "অনুগ্রহ করে বন্ধ করবেন না। দূরত্ব পরিমাপ করা হচ্ছে...",
    dupDetected: "আশেপাশে একই অভিযোগ পাওয়া গেছে!",
    successFiled: "অভিযোগ সফলভাবে নথিভুক্ত করা হয়েছে!",
    idLabel: "ID:",
    recordDetails: "অভিযোগের নথির বিবরণ",
    categoryLabel: "বিভাগ",
    severityLabel: "গুরুত্ব",
    aiDescription: "AI যাচাইকৃত বিবরণ",
    totalUpvotes: "মোট ভোটের সংখ্যা",
    municipalStatus: "পৌরসভার স্থিতি",
    reportAnother: "অন্য অভিযোগ জানান",
    viewMap: "ম্যাপ দেখুন",
    snapSelectPhoto: "ছবি তুলুন বা বাছুন",
    clickToBrowse: "খুঁজতে এখানে স্পর্শ করুন বা ছবি এখানে ফেলুন",
    confirmCategory: "বিভাগ নিশ্চিত করুন বা বাছুন",
    estimatedUrgency: "আনুমানিক গুরুত্ব",
    low: "কম",
    medium: "মাঝারি",
    high: "উচ্চ",
    addShortDescription: "সংক্ষিপ্ত বিবরণ লিখুন (ঐচ্ছিক)",
    aiAutoGenerate: "ফাঁকা থাকলে AI নিজে থেকে বিবরণ লিখবে",
    submitComplaint: "অভিযোগ জমা দিন",

    pothole: "রাস্তার গর্ত",
    garbage: "আবর্জনা",
    streetlight: "স্ট্রিটলাইট",
    water_leak: "জল অপচয়/লিক",
    other: "অন্যান্য",

    totalReports: "মোট অভিযোগ",
    resolved: "মীমাংসিত",
    inProgress: "চলতি কাজ",
    openFiles: "অমীমাংসিত",
    municipalWardArea: "পৌরসভা ওয়ার্ড এলাকা",
    resolutionRate: "সমাধানের হার",
    assignedWardOfficers: "নিযুক্ত ওয়ার্ড আধিকারিক",
    awaitingAudit: "AI/আধিকারিকের যাচাইয়ের অপেক্ষায়",
    filterLabel: "ফিল্টার:",
    verifiedProblemDetails: "যাচাইকৃত সমস্যার বিবরণ",
    upvoteBtn: "ভোট দিন",
    simulateOpen: "অমীমাংসিত স্থিতি সিমুলেট করুন",
    simulateInProgress: "চলতি কাজ স্থিতি সিমুলেট করুন",
    simulateResolved: "মীমাংসিত স্থিতি সিমুলেট করুন",
    selectMapPin: "ম্যাপ পিন বা কার্ড বাছুন",
    exploreActiveCivic: "সক্রিয় অভিযোগগুলি দেখুন এবং গুরুত্ব বাড়াতে ভোট দিন",
    noReportsCategory: "এই বিভাগে কোনো অভিযোগ নেই"
  }
};
