import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type LanguageCode =
  | "en"
  | "hi"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  buttonLabel: string;
}

type DashboardCopy = {
  greeting: (name: string) => string;
  subtitle: string;
  locationLabel: string;
  emailLabel: string;
  phoneLabel: string;
  defaultFarmer: string;
  defaultDistrict: string;
  defaultState: string;
  quickStats: {
    weatherTitle: string;
    weatherTrend: string;
    queriesTitle: string;
    queriesDescription: string;
    queriesTrend: string;
    schemesTitle: string;
    schemesDescription: string;
    schemesTrend: string;
    healthTitle: string;
    healthDescription: string;
    healthTrend: string;
  };
  aiAssistantTitle: string;
  quickActionsTitle: string;
  actionWeather: string;
  actionSchemes: string;
  actionMandi: string;
  weatherCardTitle: string;
  weatherCondition: string;
  humidityLabel: string;
  windLabel: string;
  forecastButton: string;
  recentAlertsTitle: string;
  viewAllAlerts: string;
  alerts: {
    rain: string;
    scheme: string;
    advisory: string;
    timeTwoHours: string;
    timeOneDay: string;
    timeTwoDays: string;
  };
};

type ChatCopy = {
  title: string;
  welcomeMessage: string;
  placeholder: string;
  send: string;
  open: string;
  typing: string;
  helper: string;
  errorMessage: string;
  fallbackReply: string;
};

type NavCopy = {
  home: string;
  login: string;
  dashboard: string;
  schemes: string;
  weather: string;
  mandiPrices: string;
  profile: string;
  logout: string;
  language: string;
  languageMenu: string;
  chooseLanguage: string;
};

type LanguageCopy = {
  nav: NavCopy;
  dashboard: DashboardCopy;
  chat: ChatCopy;
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  languageOptions: LanguageOption[];
  copy: LanguageCopy;
}

const LANGUAGE_STORAGE_KEY = "krishimitra-language";

export const languageOptions: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", buttonLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी", buttonLabel: "हिंदी" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", buttonLabel: "বাংলা" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", buttonLabel: "தமிழ்" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", buttonLabel: "తెలుగు" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", buttonLabel: "मराठी" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", buttonLabel: "ગુજરાતી" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", buttonLabel: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം", buttonLabel: "മലയാളം" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", buttonLabel: "ਪੰਜਾਬੀ" },
];

const languageCopy: Record<LanguageCode, LanguageCopy> = {
  en: {
    nav: {
      home: "Home",
      login: "Login",
      dashboard: "Dashboard",
      schemes: "Schemes",
      weather: "Weather",
      mandiPrices: "Mandi Prices",
      profile: "Profile",
      logout: "Logout",
      language: "Language",
      languageMenu: "Change language",
      chooseLanguage: "Choose language",
    },
    dashboard: {
      greeting: (name) => `Hello, ${name}!`,
      subtitle:
        "Welcome back to your farming dashboard. Here's what's happening with your farm today.",
      locationLabel: "Location",
      emailLabel: "Email",
      phoneLabel: "Phone",
      defaultFarmer: "Farmer",
      defaultDistrict: "District",
      defaultState: "State",
      quickStats: {
        weatherTitle: "Today's Weather",
        weatherTrend: "+2°C from yesterday",
        queriesTitle: "Queries This Month",
        queriesDescription: "AI responses",
        queriesTrend: "+12 from last month",
        schemesTitle: "Active Schemes",
        schemesDescription: "Available for you",
        schemesTrend: "3 new this week",
        healthTitle: "Farm Health",
        healthDescription: "Overall score",
        healthTrend: "+5% improvement",
      },
      aiAssistantTitle: "AI Farming Assistant",
      quickActionsTitle: "Quick Actions",
      actionWeather: "Check Weather",
      actionSchemes: "Browse Schemes",
      actionMandi: "Live Mandi Prices",
      weatherCardTitle: "Today's Weather",
      weatherCondition: "Partly Cloudy",
      humidityLabel: "Humidity",
      windLabel: "Wind",
      forecastButton: "View Full Forecast",
      recentAlertsTitle: "Recent Alerts",
      viewAllAlerts: "View All Alerts",
      alerts: {
        rain: "Light rain expected tomorrow. Good for wheat watering.",
        scheme: "New PM-KISAN installment available for verification.",
        advisory: "Optimal time for fertilizer application in sugarcane.",
        timeTwoHours: "2 hours ago",
        timeOneDay: "1 day ago",
        timeTwoDays: "2 days ago",
      },
    },
    chat: {
      title: "AI Agriculture Assistant",
      welcomeMessage:
        "Hello! I am your AI assistant. Ask me about agriculture, government schemes, weather, or mandi prices in India.",
      placeholder: "Type your question here...",
      send: "Send",
      open: "Open",
      typing: "Typing...",
      helper:
        "Ask about agriculture, government schemes, weather, or mandi prices in India.",
      errorMessage: "Sorry, the service is currently unavailable.",
      fallbackReply: "Sorry, I could not generate a response.",
    },
  },
  hi: {
    nav: {
      home: "होम",
      login: "लॉगिन",
      dashboard: "डैशबोर्ड",
      schemes: "योजनाएं",
      weather: "मौसम",
      mandiPrices: "मंडी भाव",
      profile: "प्रोफाइल",
      logout: "लॉगआउट",
      language: "भाषा",
      languageMenu: "भाषा बदलें",
      chooseLanguage: "भाषा चुनें",
    },
    dashboard: {
      greeting: (name) => `नमस्ते, ${name}!`,
      subtitle:
        "आपके खेती डैशबोर्ड में फिर से स्वागत है। आज आपकी खेती से जुड़ी मुख्य जानकारी यहां है।",
      locationLabel: "स्थान",
      emailLabel: "ईमेल",
      phoneLabel: "फोन",
      defaultFarmer: "किसान",
      defaultDistrict: "जिला",
      defaultState: "राज्य",
      quickStats: {
        weatherTitle: "आज का मौसम",
        weatherTrend: "कल से +2°C",
        queriesTitle: "इस महीने के प्रश्न",
        queriesDescription: "एआई उत्तर",
        queriesTrend: "पिछले महीने से +12",
        schemesTitle: "सक्रिय योजनाएं",
        schemesDescription: "आपके लिए उपलब्ध",
        schemesTrend: "इस सप्ताह 3 नई",
        healthTitle: "फार्म स्वास्थ्य",
        healthDescription: "कुल स्कोर",
        healthTrend: "+5% सुधार",
      },
      aiAssistantTitle: "एआई खेती सहायक",
      quickActionsTitle: "त्वरित कार्य",
      actionWeather: "मौसम देखें",
      actionSchemes: "योजनाएं देखें",
      actionMandi: "लाइव मंडी भाव",
      weatherCardTitle: "आज का मौसम",
      weatherCondition: "आंशिक बादल",
      humidityLabel: "नमी",
      windLabel: "हवा",
      forecastButton: "पूरा पूर्वानुमान देखें",
      recentAlertsTitle: "हाल की सूचनाएं",
      viewAllAlerts: "सभी सूचनाएं देखें",
      alerts: {
        rain: "कल हल्की बारिश की संभावना है। गेहूं की सिंचाई के लिए अच्छा समय है।",
        scheme: "नई पीएम-किसान किस्त सत्यापन के लिए उपलब्ध है।",
        advisory: "गन्ने में उर्वरक डालने का यह उपयुक्त समय है।",
        timeTwoHours: "2 घंटे पहले",
        timeOneDay: "1 दिन पहले",
        timeTwoDays: "2 दिन पहले",
      },
    },
    chat: {
      title: "एआई कृषि सहायक",
      welcomeMessage:
        "नमस्ते! मैं आपका एआई सहायक हूं। भारत में कृषि, सरकारी योजनाओं, मौसम या मंडी भाव के बारे में पूछें।",
      placeholder: "अपना प्रश्न यहां लिखें...",
      send: "भेजें",
      open: "खोलें",
      typing: "टाइप हो रहा है...",
      helper: "कृषि, सरकारी योजनाओं, मौसम या मंडी भाव के बारे में पूछें।",
      errorMessage: "क्षमा करें, सेवा अभी उपलब्ध नहीं है।",
      fallbackReply: "क्षमा करें, मैं उत्तर तैयार नहीं कर सका।",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      login: "লগইন",
      dashboard: "ড্যাশবোর্ড",
      schemes: "স্কিম",
      weather: "আবহাওয়া",
      mandiPrices: "মंडी দর",
      profile: "প্রোফাইল",
      logout: "লগআউট",
      language: "ভাষা",
      languageMenu: "ভাষা পরিবর্তন করুন",
      chooseLanguage: "ভাষা বেছে নিন",
    },
    dashboard: {
      greeting: (name) => `নমস্কার, ${name}!`,
      subtitle:
        "আপনার কৃষি ড্যাশবোর্ডে আবার স্বাগতম। আজ আপনার খামারের গুরুত্বপূর্ণ আপডেট এখানে রয়েছে।",
      locationLabel: "অবস্থান",
      emailLabel: "ইমেল",
      phoneLabel: "ফোন",
      defaultFarmer: "কৃষক",
      defaultDistrict: "জেলা",
      defaultState: "রাজ্য",
      quickStats: {
        weatherTitle: "আজকের আবহাওয়া",
        weatherTrend: "গতকালের তুলনায় +2°C",
        queriesTitle: "এই মাসের প্রশ্ন",
        queriesDescription: "এআই উত্তর",
        queriesTrend: "গত মাসের তুলনায় +12",
        schemesTitle: "সক্রিয় স্কিম",
        schemesDescription: "আপনার জন্য উপলব্ধ",
        schemesTrend: "এই সপ্তাহে 3টি নতুন",
        healthTitle: "খামারের স্বাস্থ্য",
        healthDescription: "মোট স্কোর",
        healthTrend: "+5% উন্নতি",
      },
      aiAssistantTitle: "এআই কৃষি সহকারী",
      quickActionsTitle: "দ্রুত কাজ",
      actionWeather: "আবহাওয়া দেখুন",
      actionSchemes: "স্কিম দেখুন",
      actionMandi: "লাইভ মণ্ডি দর",
      weatherCardTitle: "আজকের আবহাওয়া",
      weatherCondition: "আংশিক মেঘলা",
      humidityLabel: "আর্দ্রতা",
      windLabel: "বাতাস",
      forecastButton: "পূর্ণ পূর্বাভাস দেখুন",
      recentAlertsTitle: "সাম্প্রতিক সতর্কতা",
      viewAllAlerts: "সব সতর্কতা দেখুন",
      alerts: {
        rain: "আগামীকাল হালকা বৃষ্টির সম্ভাবনা আছে। গম সেচের জন্য ভালো সময়।",
        scheme: "নতুন PM-KISAN কিস্তি যাচাইয়ের জন্য উপলব্ধ।",
        advisory: "আখে সার প্রয়োগের জন্য এটি উপযুক্ত সময়।",
        timeTwoHours: "2 ঘণ্টা আগে",
        timeOneDay: "1 দিন আগে",
        timeTwoDays: "2 দিন আগে",
      },
    },
    chat: {
      title: "এআই কৃষি সহকারী",
      welcomeMessage:
        "নমস্কার! আমি আপনার এআই সহকারী। ভারতে কৃষি, সরকারি স্কিম, আবহাওয়া বা মণ্ডি দর সম্পর্কে জিজ্ঞাসা করুন।",
      placeholder: "আপনার প্রশ্ন এখানে লিখুন...",
      send: "পাঠান",
      open: "খুলুন",
      typing: "টাইপ করা হচ্ছে...",
      helper: "কৃষি, সরকারি স্কিম, আবহাওয়া বা মণ্ডি দর সম্পর্কে জিজ্ঞাসা করুন।",
      errorMessage: "দুঃখিত, পরিষেবাটি এখন উপলব্ধ নয়।",
      fallbackReply: "দুঃখিত, আমি উত্তর তৈরি করতে পারিনি।",
    },
  },
  ta: {
    nav: {
      home: "முகப்பு",
      login: "உள்நுழை",
      dashboard: "டாஷ்போர்டு",
      schemes: "திட்டங்கள்",
      weather: "வானிலை",
      mandiPrices: "மண்டி விலை",
      profile: "சுயவிவரம்",
      logout: "வெளியேறு",
      language: "மொழி",
      languageMenu: "மொழியை மாற்று",
      chooseLanguage: "மொழியை தேர்வு செய்யவும்",
    },
    dashboard: {
      greeting: (name) => `வணக்கம், ${name}!`,
      subtitle:
        "உங்கள் விவசாய டாஷ்போர்டுக்கு மீண்டும் வரவேற்கிறோம். இன்று உங்கள் பண்ணையில் நடப்பவை இங்கே உள்ளன.",
      locationLabel: "இடம்",
      emailLabel: "மின்னஞ்சல்",
      phoneLabel: "தொலைபேசி",
      defaultFarmer: "விவசாயி",
      defaultDistrict: "மாவட்டம்",
      defaultState: "மாநிலம்",
      quickStats: {
        weatherTitle: "இன்றைய வானிலை",
        weatherTrend: "நேற்றைவிட +2°C",
        queriesTitle: "இந்த மாத கேள்விகள்",
        queriesDescription: "ஏஐ பதில்கள்",
        queriesTrend: "கடந்த மாதத்தைவிட +12",
        schemesTitle: "செயலில் உள்ள திட்டங்கள்",
        schemesDescription: "உங்களுக்கு கிடைக்கும்",
        schemesTrend: "இந்த வாரம் 3 புதியவை",
        healthTitle: "பண்ணை நலம்",
        healthDescription: "மொத்த மதிப்பெண்",
        healthTrend: "+5% முன்னேற்றம்",
      },
      aiAssistantTitle: "ஏஐ விவசாய உதவியாளர்",
      quickActionsTitle: "விரைவு செயல்கள்",
      actionWeather: "வானிலை பார்க்க",
      actionSchemes: "திட்டங்களை பார்க்க",
      actionMandi: "நேரடி மண்டி விலை",
      weatherCardTitle: "இன்றைய வானிலை",
      weatherCondition: "பகுதி மேகமூட்டம்",
      humidityLabel: "ஈரப்பதம்",
      windLabel: "காற்று",
      forecastButton: "முழு முன்னறிவிப்பைப் பார்க்க",
      recentAlertsTitle: "சமீபத்திய எச்சரிக்கைகள்",
      viewAllAlerts: "அனைத்து எச்சரிக்கைகளையும் பார்க்க",
      alerts: {
        rain: "நாளை லேசான மழை எதிர்பார்க்கப்படுகிறது. கோதுமைக்கு நீர்ப்பாய்ச்ச நல்ல நேரம்.",
        scheme: "புதிய PM-KISAN தவணை சரிபார்ப்புக்கு கிடைக்கிறது.",
        advisory: "கரும்பில் உரம் இட இது சிறந்த நேரம்.",
        timeTwoHours: "2 மணி நேரத்திற்கு முன்பு",
        timeOneDay: "1 நாள் முன்பு",
        timeTwoDays: "2 நாட்கள் முன்பு",
      },
    },
    chat: {
      title: "ஏஐ வேளாண்மை உதவியாளர்",
      welcomeMessage:
        "வணக்கம்! நான் உங்கள் ஏஐ உதவியாளர். இந்தியாவில் வேளாண்மை, அரசு திட்டங்கள், வானிலை அல்லது மண்டி விலை பற்றி கேளுங்கள்.",
      placeholder: "உங்கள் கேள்வியை இங்கே எழுதுங்கள்...",
      send: "அனுப்பு",
      open: "திற",
      typing: "தட்டச்சு செய்கிறது...",
      helper: "வேளாண்மை, அரசு திட்டங்கள், வானிலை அல்லது மண்டி விலை பற்றி கேளுங்கள்.",
      errorMessage: "மன்னிக்கவும், சேவை தற்போது கிடைக்கவில்லை.",
      fallbackReply: "மன்னிக்கவும், நான் பதிலை உருவாக்க முடியவில்லை.",
    },
  },
  te: {
    nav: {
      home: "హోమ్",
      login: "లాగిన్",
      dashboard: "డాష్‌బోర్డ్",
      schemes: "పథకాలు",
      weather: "వాతావరణం",
      mandiPrices: "మండి ధరలు",
      profile: "ప్రొఫైల్",
      logout: "లాగౌట్",
      language: "భాష",
      languageMenu: "భాష మార్చండి",
      chooseLanguage: "భాషను ఎంచుకోండి",
    },
    dashboard: {
      greeting: (name) => `నమస్కారం, ${name}!`,
      subtitle:
        "మీ వ్యవసాయ డాష్‌బోర్డ్‌కు తిరిగి స్వాగతం. ఈ రోజు మీ వ్యవసాయం గురించి ముఖ్య సమాచారం ఇక్కడ ఉంది.",
      locationLabel: "ప్రాంతం",
      emailLabel: "ఈమెయిల్",
      phoneLabel: "ఫోన్",
      defaultFarmer: "రైతు",
      defaultDistrict: "జిల్లా",
      defaultState: "రాష్ట్రం",
      quickStats: {
        weatherTitle: "ఈరోజు వాతావరణం",
        weatherTrend: "నిన్నటి కంటే +2°C",
        queriesTitle: "ఈ నెల ప్రశ్నలు",
        queriesDescription: "ఏఐ సమాధానాలు",
        queriesTrend: "గత నెల కంటే +12",
        schemesTitle: "క్రియాశీల పథకాలు",
        schemesDescription: "మీకు అందుబాటులో ఉన్నవి",
        schemesTrend: "ఈ వారం 3 కొత్తవి",
        healthTitle: "పంట స్థితి",
        healthDescription: "మొత్తం స్కోర్",
        healthTrend: "+5% మెరుగుదల",
      },
      aiAssistantTitle: "ఏఐ వ్యవసాయ సహాయకుడు",
      quickActionsTitle: "త్వరిత చర్యలు",
      actionWeather: "వాతావరణం చూడండి",
      actionSchemes: "పథకాలు చూడండి",
      actionMandi: "ప్రత్యక్ష మండి ధరలు",
      weatherCardTitle: "ఈరోజు వాతావరణం",
      weatherCondition: "భాగంగా మేఘావృతం",
      humidityLabel: "తేమ",
      windLabel: "గాలి",
      forecastButton: "పూర్తి అంచనాను చూడండి",
      recentAlertsTitle: "తాజా హెచ్చరికలు",
      viewAllAlerts: "అన్ని హెచ్చరికలు చూడండి",
      alerts: {
        rain: "రేపు తేలికపాటి వర్షం వచ్చే అవకాశం ఉంది. గోధుమకు నీరు పెట్టడానికి మంచిది.",
        scheme: "కొత్త PM-KISAN విడత ధృవీకరణ కోసం అందుబాటులో ఉంది.",
        advisory: "చెరకు పంటలో ఎరువు వేయడానికి ఇది సరైన సమయం.",
        timeTwoHours: "2 గంటల క్రితం",
        timeOneDay: "1 రోజు క్రితం",
        timeTwoDays: "2 రోజుల క్రితం",
      },
    },
    chat: {
      title: "ఏఐ వ్యవసాయ సహాయకుడు",
      welcomeMessage:
        "నమస్కారం! నేను మీ ఏఐ సహాయకుడిని. భారతదేశంలో వ్యవసాయం, ప్రభుత్వ పథకాలు, వాతావరణం లేదా మండి ధరల గురించి అడగండి.",
      placeholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
      send: "పంపండి",
      open: "తెరవండి",
      typing: "టైప్ చేస్తోంది...",
      helper: "వ్యవసాయం, ప్రభుత్వ పథకాలు, వాతావరణం లేదా మండి ధరల గురించి అడగండి.",
      errorMessage: "క్షమించండి, సేవ ప్రస్తుతం అందుబాటులో లేదు.",
      fallbackReply: "క్షమించండి, నేను సమాధానం రూపొందించలేకపోయాను.",
    },
  },
  mr: {
    nav: {
      home: "मुख्यपृष्ठ",
      login: "लॉगिन",
      dashboard: "डॅशबोर्ड",
      schemes: "योजना",
      weather: "हवामान",
      mandiPrices: "मंडी भाव",
      profile: "प्रोफाइल",
      logout: "लॉगआउट",
      language: "भाषा",
      languageMenu: "भाषा बदला",
      chooseLanguage: "भाषा निवडा",
    },
    dashboard: {
      greeting: (name) => `नमस्कार, ${name}!`,
      subtitle:
        "तुमच्या शेती डॅशबोर्डवर पुन्हा स्वागत आहे. आज तुमच्या शेतातील महत्त्वाची माहिती येथे आहे.",
      locationLabel: "स्थान",
      emailLabel: "ईमेल",
      phoneLabel: "फोन",
      defaultFarmer: "शेतकरी",
      defaultDistrict: "जिल्हा",
      defaultState: "राज्य",
      quickStats: {
        weatherTitle: "आजचे हवामान",
        weatherTrend: "कालपेक्षा +2°C",
        queriesTitle: "या महिन्यातील प्रश्न",
        queriesDescription: "एआय उत्तरे",
        queriesTrend: "मागील महिन्यापेक्षा +12",
        schemesTitle: "सक्रिय योजना",
        schemesDescription: "तुमच्यासाठी उपलब्ध",
        schemesTrend: "या आठवड्यात 3 नवीन",
        healthTitle: "शेती आरोग्य",
        healthDescription: "एकूण गुण",
        healthTrend: "+5% सुधारणा",
      },
      aiAssistantTitle: "एआय शेती सहाय्यक",
      quickActionsTitle: "जलद कृती",
      actionWeather: "हवामान पहा",
      actionSchemes: "योजना पहा",
      actionMandi: "थेट मंडी भाव",
      weatherCardTitle: "आजचे हवामान",
      weatherCondition: "अंशतः ढगाळ",
      humidityLabel: "आर्द्रता",
      windLabel: "वारा",
      forecastButton: "संपूर्ण अंदाज पहा",
      recentAlertsTitle: "अलिकडील सूचना",
      viewAllAlerts: "सर्व सूचना पहा",
      alerts: {
        rain: "उद्या हलक्या पावसाची शक्यता आहे. गव्हाला पाणी देण्यासाठी योग्य वेळ आहे.",
        scheme: "नवीन PM-KISAN हप्ता पडताळणीसाठी उपलब्ध आहे.",
        advisory: "ऊस पिकात खत टाकण्यासाठी हा योग्य काळ आहे.",
        timeTwoHours: "2 तासांपूर्वी",
        timeOneDay: "1 दिवसापूर्वी",
        timeTwoDays: "2 दिवसांपूर्वी",
      },
    },
    chat: {
      title: "एआय कृषी सहाय्यक",
      welcomeMessage:
        "नमस्कार! मी तुमचा एआय सहाय्यक आहे. भारतातील शेती, सरकारी योजना, हवामान किंवा मंडी भाव याबद्दल विचारा.",
      placeholder: "तुमचा प्रश्न येथे टाइप करा...",
      send: "पाठवा",
      open: "उघडा",
      typing: "टाइप करत आहे...",
      helper: "शेती, सरकारी योजना, हवामान किंवा मंडी भाव याबद्दल विचारा.",
      errorMessage: "माफ करा, सेवा सध्या उपलब्ध नाही.",
      fallbackReply: "माफ करा, मी उत्तर तयार करू शकलो नाही.",
    },
  },
  gu: {
    nav: {
      home: "મુખપૃષ્ઠ",
      login: "લોગિન",
      dashboard: "ડેશબોર્ડ",
      schemes: "યોજનાઓ",
      weather: "હવામાન",
      mandiPrices: "મંડી ભાવ",
      profile: "પ્રોફાઇલ",
      logout: "લૉગઆઉટ",
      language: "ભાષા",
      languageMenu: "ભાષા બદલો",
      chooseLanguage: "ભાષા પસંદ કરો",
    },
    dashboard: {
      greeting: (name) => `નમસ્તે, ${name}!`,
      subtitle:
        "તમારા ખેતી ડેશબોર્ડમાં ફરી સ્વાગત છે. આજે તમારી ખેતી વિશેની મુખ્ય માહિતી અહીં છે.",
      locationLabel: "સ્થાન",
      emailLabel: "ઇમેઇલ",
      phoneLabel: "ફોન",
      defaultFarmer: "ખેડૂત",
      defaultDistrict: "જિલ્લો",
      defaultState: "રાજ્ય",
      quickStats: {
        weatherTitle: "આજનું હવામાન",
        weatherTrend: "ગઈકાલ કરતા +2°C",
        queriesTitle: "આ મહિનાના પ્રશ્નો",
        queriesDescription: "એઆઈ જવાબો",
        queriesTrend: "ગયા મહિનાથી +12",
        schemesTitle: "સક્રિય યોજનાઓ",
        schemesDescription: "તમારા માટે ઉપલબ્ધ",
        schemesTrend: "આ અઠવાડિયે 3 નવી",
        healthTitle: "ખેતરનું સ્વાસ્થ્ય",
        healthDescription: "કુલ સ્કોર",
        healthTrend: "+5% સુધારો",
      },
      aiAssistantTitle: "એઆઈ ખેતી સહાયક",
      quickActionsTitle: "ઝડપી પગલાં",
      actionWeather: "હવામાન જુઓ",
      actionSchemes: "યોજનાઓ જુઓ",
      actionMandi: "લાઇવ મંડી ભાવ",
      weatherCardTitle: "આજનું હવામાન",
      weatherCondition: "આંશિક વાદળછાયું",
      humidityLabel: "ભેજ",
      windLabel: "પવન",
      forecastButton: "પૂર્ણ આગાહી જુઓ",
      recentAlertsTitle: "તાજેતરના સૂચનો",
      viewAllAlerts: "બધા સૂચનો જુઓ",
      alerts: {
        rain: "કાલે હળવો વરસાદ આવી શકે છે. ઘઉંને પાણી આપવા માટે સારો સમય છે.",
        scheme: "નવી PM-KISAN કિસ્ત ચકાસણી માટે ઉપલબ્ધ છે.",
        advisory: "ઉસમાં ખાતર આપવા માટે આ ઉત્તમ સમય છે.",
        timeTwoHours: "2 કલાક પહેલાં",
        timeOneDay: "1 દિવસ પહેલાં",
        timeTwoDays: "2 દિવસ પહેલાં",
      },
    },
    chat: {
      title: "એઆઈ કૃષિ સહાયક",
      welcomeMessage:
        "નમસ્તે! હું તમારો એઆઈ સહાયક છું. ભારતની ખેતી, સરકારી યોજનાઓ, હવામાન અથવા મંડી ભાવ વિશે પૂછો.",
      placeholder: "તમારો પ્રશ્ન અહીં લખો...",
      send: "મોકલો",
      open: "ખોલો",
      typing: "ટાઇપ થઈ રહ્યું છે...",
      helper: "ખેતી, સરકારી યોજનાઓ, હવામાન અથવા મંડી ભાવ વિશે પૂછો.",
      errorMessage: "માફ કરશો, સેવા હાલમાં ઉપલબ્ધ નથી.",
      fallbackReply: "માફ કરશો, હું જવાબ બનાવી શક્યો નથી.",
    },
  },
  kn: {
    nav: {
      home: "ಮುಖಪುಟ",
      login: "ಲಾಗಿನ್",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      schemes: "ಯೋಜನೆಗಳು",
      weather: "ಹವಾಮಾನ",
      mandiPrices: "ಮಂಡಿ ಬೆಲೆಗಳು",
      profile: "ಪ್ರೊಫೈಲ್",
      logout: "ಲಾಗ್‌ಔಟ್",
      language: "ಭಾಷೆ",
      languageMenu: "ಭಾಷೆ ಬದಲಿಸಿ",
      chooseLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    },
    dashboard: {
      greeting: (name) => `ನಮಸ್ಕಾರ, ${name}!`,
      subtitle:
        "ನಿಮ್ಮ ಕೃಷಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮತ್ತೆ ಸ್ವಾಗತ. ಇಂದು ನಿಮ್ಮ ಕೃಷಿಯ ಪ್ರಮುಖ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.",
      locationLabel: "ಸ್ಥಳ",
      emailLabel: "ಇಮೇಲ್",
      phoneLabel: "ಫೋನ್",
      defaultFarmer: "ರೈತ",
      defaultDistrict: "ಜಿಲ್ಲೆ",
      defaultState: "ರಾಜ್ಯ",
      quickStats: {
        weatherTitle: "ಇಂದಿನ ಹವಾಮಾನ",
        weatherTrend: "ನಿನ್ನೆಗಿಂತ +2°C",
        queriesTitle: "ಈ ತಿಂಗಳ ಪ್ರಶ್ನೆಗಳು",
        queriesDescription: "ಎಐ ಉತ್ತರಗಳು",
        queriesTrend: "ಹಿಂದಿನ ತಿಂಗಳಿಗಿಂತ +12",
        schemesTitle: "ಸಕ್ರಿಯ ಯೋಜನೆಗಳು",
        schemesDescription: "ನಿಮಗಾಗಿ ಲಭ್ಯ",
        schemesTrend: "ಈ ವಾರ 3 ಹೊಸದು",
        healthTitle: "ಕೃಷಿ ಆರೋಗ್ಯ",
        healthDescription: "ಒಟ್ಟು ಅಂಕ",
        healthTrend: "+5% ಸುಧಾರಣೆ",
      },
      aiAssistantTitle: "ಎಐ ಕೃಷಿ ಸಹಾಯಕ",
      quickActionsTitle: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      actionWeather: "ಹವಾಮಾನ ನೋಡಿ",
      actionSchemes: "ಯೋಜನೆಗಳನ್ನು ನೋಡಿ",
      actionMandi: "ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು",
      weatherCardTitle: "ಇಂದಿನ ಹವಾಮಾನ",
      weatherCondition: "ಭಾಗಶಃ ಮೋಡ",
      humidityLabel: "ಆರ್ದ್ರತೆ",
      windLabel: "ಗಾಳಿ",
      forecastButton: "ಪೂರ್ಣ ಮುನ್ಸೂಚನೆ ನೋಡಿ",
      recentAlertsTitle: "ಇತ್ತೀಚಿನ ಎಚ್ಚರಿಕೆಗಳು",
      viewAllAlerts: "ಎಲ್ಲಾ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನೋಡಿ",
      alerts: {
        rain: "ನಾಳೆ ತುಸು ಮಳೆಯ ಸಾಧ್ಯತೆ ಇದೆ. ಗೋಧಿಗೆ ನೀರು ಹಾಯಿಸಲು ಒಳ್ಳೆಯ ಸಮಯ.",
        scheme: "ಹೊಸ PM-KISAN ಕಂತು ಪರಿಶೀಲನೆಗೆ ಲಭ್ಯವಿದೆ.",
        advisory: "ಕರಿಬೇಲೆಗೆ ರಸಗೊಬ್ಬರ ಹಾಕಲು ಇದು ಸೂಕ್ತ ಸಮಯ.",
        timeTwoHours: "2 ಗಂಟೆಗಳ ಹಿಂದೆ",
        timeOneDay: "1 ದಿನ ಹಿಂದೆ",
        timeTwoDays: "2 ದಿನಗಳ ಹಿಂದೆ",
      },
    },
    chat: {
      title: "ಎಐ ಕೃಷಿ ಸಹಾಯಕ",
      welcomeMessage:
        "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಎಐ ಸಹಾಯಕ. ಭಾರತದಲ್ಲಿ ಕೃಷಿ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಹವಾಮಾನ ಅಥವಾ ಮಂಡಿ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
      placeholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
      send: "ಕಳುಹಿಸಿ",
      open: "ತೆರೆಯಿರಿ",
      typing: "ಟೈಪ್ ಆಗುತ್ತಿದೆ...",
      helper: "ಕೃಷಿ, ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಹವಾಮಾನ ಅಥವಾ ಮಂಡಿ ಬೆಲೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
      errorMessage: "ಕ್ಷಮಿಸಿ, ಸೇವೆ ಈಗ ಲಭ್ಯವಿಲ್ಲ.",
      fallbackReply: "ಕ್ಷಮಿಸಿ, ನಾನು ಉತ್ತರವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },
  ml: {
    nav: {
      home: "ഹോം",
      login: "ലോഗിൻ",
      dashboard: "ഡാഷ്‌ബോർഡ്",
      schemes: "പദ്ധതികൾ",
      weather: "കാലാവസ്ഥ",
      mandiPrices: "മണ്ടി വിലകൾ",
      profile: "പ്രൊഫൈൽ",
      logout: "ലോഗ്ഔട്ട്",
      language: "ഭാഷ",
      languageMenu: "ഭാഷ മാറ്റുക",
      chooseLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
    },
    dashboard: {
      greeting: (name) => `നമസ്കാരം, ${name}!`,
      subtitle:
        "നിങ്ങളുടെ കാർഷിക ഡാഷ്‌ബോർഡിലേക്ക് വീണ്ടും സ്വാഗതം. ഇന്ന് നിങ്ങളുടെ കൃഷിയെക്കുറിച്ചുള്ള പ്രധാന വിവരങ്ങൾ ഇവിടെ കാണാം.",
      locationLabel: "സ്ഥലം",
      emailLabel: "ഇമെയിൽ",
      phoneLabel: "ഫോൺ",
      defaultFarmer: "കർഷകൻ",
      defaultDistrict: "ജില്ല",
      defaultState: "സംസ്ഥാനം",
      quickStats: {
        weatherTitle: "ഇന്നത്തെ കാലാവസ്ഥ",
        weatherTrend: "ഇന്നലെയെക്കാൾ +2°C",
        queriesTitle: "ഈ മാസത്തെ ചോദ്യങ്ങൾ",
        queriesDescription: "എഐ മറുപടികൾ",
        queriesTrend: "കഴിഞ്ഞ മാസത്തേക്കാൾ +12",
        schemesTitle: "സജീവ പദ്ധതികൾ",
        schemesDescription: "നിങ്ങൾക്കായി ലഭ്യം",
        schemesTrend: "ഈ ആഴ്ച 3 പുതിയവ",
        healthTitle: "ഫാം ആരോഗ്യനില",
        healthDescription: "ആകെ സ്കോർ",
        healthTrend: "+5% പുരോഗതി",
      },
      aiAssistantTitle: "എഐ കാർഷിക സഹായി",
      quickActionsTitle: "വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ",
      actionWeather: "കാലാവസ്ഥ പരിശോധിക്കുക",
      actionSchemes: "പദ്ധതികൾ കാണുക",
      actionMandi: "തത്സമയ മണ്ടി വിലകൾ",
      weatherCardTitle: "ഇന്നത്തെ കാലാവസ്ഥ",
      weatherCondition: "ഭാഗികമായി മേഘാവൃതം",
      humidityLabel: "ആർദ്രത",
      windLabel: "കാറ്റ്",
      forecastButton: "പൂർണ്ണ പ്രവചനം കാണുക",
      recentAlertsTitle: "സമീപകാല അറിയിപ്പുകൾ",
      viewAllAlerts: "എല്ലാ അറിയിപ്പുകളും കാണുക",
      alerts: {
        rain: "നാളെ ചെറിയ മഴയ്ക്ക് സാധ്യതയുണ്ട്. ഗോതമ്പിന് വെള്ളം നൽകാൻ നല്ല സമയം.",
        scheme: "പുതിയ PM-KISAN ഗഡു പരിശോധനയ്ക്കായി ലഭ്യമാണ്.",
        advisory: "കരിമ്പിൽ വളം ഇടാൻ ഇത് അനുയോജ്യമായ സമയമാണ്.",
        timeTwoHours: "2 മണിക്കൂർ മുമ്പ്",
        timeOneDay: "1 ദിവസം മുമ്പ്",
        timeTwoDays: "2 ദിവസം മുമ്പ്",
      },
    },
    chat: {
      title: "എഐ കാർഷിക സഹായി",
      welcomeMessage:
        "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ എഐ സഹായി ആണ്. ഇന്ത്യയിലെ കൃഷി, സർക്കാർ പദ്ധതികൾ, കാലാവസ്ഥ, അല്ലെങ്കിൽ മണ്ടി വിലകൾ സംബന്ധിച്ച് ചോദിക്കൂ.",
      placeholder: "നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യൂ...",
      send: "അയക്കുക",
      open: "തുറക്കുക",
      typing: "ടൈപ്പ് ചെയ്യുന്നു...",
      helper: "കൃഷി, സർക്കാർ പദ്ധതികൾ, കാലാവസ്ഥ, അല്ലെങ്കിൽ മണ്ടി വിലകൾ സംബന്ധിച്ച് ചോദിക്കൂ.",
      errorMessage: "ക്ഷമിക്കണം, സേവനം ഇപ്പോൾ ലഭ്യമല്ല.",
      fallbackReply: "ക്ഷമിക്കണം, എനിക്ക് മറുപടി സൃഷ്ടിക്കാനായില്ല.",
    },
  },
  pa: {
    nav: {
      home: "ਘਰ",
      login: "ਲੌਗਇਨ",
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      schemes: "ਯੋਜਨਾਵਾਂ",
      weather: "ਮੌਸਮ",
      mandiPrices: "ਮੰਡੀ ਭਾਅ",
      profile: "ਪ੍ਰੋਫਾਈਲ",
      logout: "ਲੌਗਆਉਟ",
      language: "ਭਾਸ਼ਾ",
      languageMenu: "ਭਾਸ਼ਾ ਬਦਲੋ",
      chooseLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    },
    dashboard: {
      greeting: (name) => `ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ${name}!`,
      subtitle:
        "ਤੁਹਾਡੇ ਖੇਤੀਬਾੜੀ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਮੁੜ ਸੁਆਗਤ ਹੈ। ਅੱਜ ਤੁਹਾਡੇ ਖੇਤ ਨਾਲ ਜੁੜੀਆਂ ਮੁੱਖ ਜਾਣਕਾਰੀਆਂ ਇੱਥੇ ਹਨ।",
      locationLabel: "ਟਿਕਾਣਾ",
      emailLabel: "ਈਮੇਲ",
      phoneLabel: "ਫੋਨ",
      defaultFarmer: "ਕਿਸਾਨ",
      defaultDistrict: "ਜ਼ਿਲ੍ਹਾ",
      defaultState: "ਰਾਜ",
      quickStats: {
        weatherTitle: "ਅੱਜ ਦਾ ਮੌਸਮ",
        weatherTrend: "ਕੱਲ੍ਹ ਨਾਲੋਂ +2°C",
        queriesTitle: "ਇਸ ਮਹੀਨੇ ਦੇ ਸਵਾਲ",
        queriesDescription: "ਏਆਈ ਜਵਾਬ",
        queriesTrend: "ਪਿਛਲੇ ਮਹੀਨੇ ਨਾਲੋਂ +12",
        schemesTitle: "ਸਰਗਰਮ ਯੋਜਨਾਵਾਂ",
        schemesDescription: "ਤੁਹਾਡੇ ਲਈ ਉਪਲਬਧ",
        schemesTrend: "ਇਸ ਹਫ਼ਤੇ 3 ਨਵੀਆਂ",
        healthTitle: "ਖੇਤ ਦੀ ਸਿਹਤ",
        healthDescription: "ਕੁੱਲ ਸਕੋਰ",
        healthTrend: "+5% ਸੁਧਾਰ",
      },
      aiAssistantTitle: "ਏਆਈ ਖੇਤੀ ਸਹਾਇਕ",
      quickActionsTitle: "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
      actionWeather: "ਮੌਸਮ ਵੇਖੋ",
      actionSchemes: "ਯੋਜਨਾਵਾਂ ਵੇਖੋ",
      actionMandi: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
      weatherCardTitle: "ਅੱਜ ਦਾ ਮੌਸਮ",
      weatherCondition: "ਅੰਸ਼ਿਕ ਬੱਦਲ",
      humidityLabel: "ਨਮੀ",
      windLabel: "ਹਵਾ",
      forecastButton: "ਪੂਰਾ ਅਨੁਮਾਨ ਵੇਖੋ",
      recentAlertsTitle: "ਹਾਲੀਆ ਚੇਤਾਵਨੀਆਂ",
      viewAllAlerts: "ਸਾਰੀਆਂ ਚੇਤਾਵਨੀਆਂ ਵੇਖੋ",
      alerts: {
        rain: "ਕੱਲ੍ਹ ਹਲਕੀ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਗੰਹੂੰ ਨੂੰ ਪਾਣੀ ਦੇਣ ਲਈ ਵਧੀਆ ਸਮਾਂ ਹੈ।",
        scheme: "ਨਵੀਂ PM-KISAN ਕਿਸ਼ਤ ਜਾਂਚ ਲਈ ਉਪਲਬਧ ਹੈ।",
        advisory: "ਗੰਨੇ ਵਿੱਚ ਖਾਦ ਪਾਉਣ ਲਈ ਇਹ ਵਧੀਆ ਸਮਾਂ ਹੈ।",
        timeTwoHours: "2 ਘੰਟੇ ਪਹਿਲਾਂ",
        timeOneDay: "1 ਦਿਨ ਪਹਿਲਾਂ",
        timeTwoDays: "2 ਦਿਨ ਪਹਿਲਾਂ",
      },
    },
    chat: {
      title: "ਏਆਈ ਖੇਤੀ ਸਹਾਇਕ",
      welcomeMessage:
        "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। ਭਾਰਤ ਵਿੱਚ ਖੇਤੀਬਾੜੀ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਮੌਸਮ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।",
      placeholder: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ...",
      send: "ਭੇਜੋ",
      open: "ਖੋਲ੍ਹੋ",
      typing: "ਟਾਈਪ ਹੋ ਰਿਹਾ ਹੈ...",
      helper: "ਖੇਤੀਬਾੜੀ, ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਮੌਸਮ ਜਾਂ ਮੰਡੀ ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ।",
      errorMessage: "ਮਾਫ਼ ਕਰਨਾ, ਸੇਵਾ ਇਸ ਵੇਲੇ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
      fallbackReply: "ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਜਵਾਬ ਤਿਆਰ ਨਹੀਂ ਕਰ ਸਕਿਆ।",
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getInitialLanguage(): LanguageCode {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  const isSupportedLanguage = languageOptions.some(
    (option) => option.code === storedLanguage,
  );

  return isSupportedLanguage ? (storedLanguage as LanguageCode) : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languageOptions,
        copy: languageCopy[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
