const express = require("express");

const router = express.Router();

const GEMINI_API_KEY = (
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.API_KEY ||
  ""
).trim();
const GEMINI_API_BASE = (
  process.env.GEMINI_API_BASE ||
  "https://generativelanguage.googleapis.com/v1beta"
).replace(/\/+$/, "");
const GEMINI_MODEL = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();
const GEMINI_MODELS = [...new Set([
  GEMINI_MODEL,
  "gemini-2.5-flash",
].filter(Boolean))];

const cropGuides = {
  paddy: {
    label: "paddy",
    aliases: ["paddy", "rice", "dhan"],
    season: "Paddy usually grows in Kharif season.",
    sowing: "Best sowing or nursery time is June to July with monsoon start.",
    needs: "It needs warm weather, standing water, and good field leveling.",
    tips: [
      "Maintain 2-5 cm water after transplanting, but avoid long waterlogging.",
      "Transplant only healthy 20-25 day nursery seedlings.",
      "Keep drainage ready during heavy rain to reduce root and disease problems.",
    ],
  },
  wheat: {
    label: "wheat",
    aliases: ["wheat", "gehun", "gehu", "gehum"],
    season: "Wheat usually grows in Rabi season.",
    sowing: "Best sowing time is October to November in most North Indian areas.",
    needs: "It needs cool weather during growth and dry weather near harvest.",
    tips: [
      "Avoid very late sowing because yield can drop.",
      "Give first irrigation near crown root initiation, around 20-25 days after sowing.",
      "Use balanced NPK and keep weeds under control in the early stage.",
    ],
  },
  maize: {
    label: "maize",
    aliases: ["maize", "corn", "makka", "makkaa"],
    season: "Maize can be grown in Kharif, Rabi, or spring depending on the region.",
    sowing: "Kharif maize is generally sown in June to July.",
    needs: "It needs well-drained soil and does not tolerate waterlogging.",
    tips: [
      "Avoid standing water because roots get damaged quickly.",
      "Split nitrogen dose for better growth and cob filling.",
      "Monitor regularly for stem borer and fall armyworm.",
    ],
  },
  cotton: {
    label: "cotton",
    aliases: ["cotton", "kapas"],
    season: "Cotton is mainly grown in Kharif season.",
    sowing: "Sowing is usually done from April to July depending on irrigation and region.",
    needs: "It needs well-drained soil, warm weather, and good pest monitoring.",
    tips: [
      "Do not keep plant population too dense.",
      "Monitor sucking pests and pink bollworm regularly.",
      "Avoid excess nitrogen because it can increase pest pressure.",
    ],
  },
  sugarcane: {
    label: "sugarcane",
    aliases: ["sugarcane", "ganna", "cane"],
    season: "Sugarcane is grown as a long-duration crop with planting seasons varying by region.",
    sowing: "Planting is commonly done in spring or autumn depending on the state.",
    needs: "It needs good fertility, regular irrigation, and timely earthing up.",
    tips: [
      "Use healthy setts and proper seed treatment.",
      "Keep the field weed free during early growth.",
      "Plan irrigation carefully because sugarcane is a heavy water user.",
    ],
  },
};

const topicRules = [
  {
    topic: "pest",
    keywords: [
      "pest",
      "disease",
      "insect",
      "fungus",
      "worm",
      "leaf curl",
      "blight",
      "yellow spot",
      "stem borer",
      "armyworm",
      "attack",
      "keeda",
      "roga",
      "bimari",
      "weed",
      "herbicide",
    ],
  },
  {
    topic: "fertilizer",
    keywords: [
      "fertilizer",
      "fertiliser",
      "urea",
      "dap",
      "potash",
      "npk",
      "micronutrient",
      "zinc",
      "sulphur",
      "soil test",
      "manure",
      "compost",
      "khad",
      "khaad",
      "poshan",
    ],
  },
  {
    topic: "irrigation",
    keywords: [
      "irrigation",
      "drip",
      "sprinkler",
      "watering",
      "water management",
      "moisture",
      "pani",
      "sinchai",
      "irrigate",
    ],
  },
  {
    topic: "weather",
    keywords: [
      "weather",
      "rain",
      "rainfall",
      "heat",
      "temperature",
      "cold",
      "frost",
      "humid",
      "wind",
      "mausam",
    ],
  },
  {
    topic: "scheme",
    keywords: [
      "scheme",
      "pm kisan",
      "kisan credit",
      "subsidy",
      "insurance",
      "loan",
      "card",
      "yojana",
      "benefit",
      "registration",
    ],
  },
  {
    topic: "mandi",
    keywords: [
      "mandi",
      "price",
      "market",
      "rate",
      "sell",
      "selling",
      "buyer",
      "trader",
      "enam",
      "bhav",
    ],
  },
  {
    topic: "cropPlanning",
    keywords: [
      "sowing",
      "seed",
      "variety",
      "germination",
      "nursery",
      "spacing",
      "season",
      "grow",
      "cultivation",
      "harvest",
      "yield",
      "crop stage",
      "crop",
      "beej",
      "bovai",
      "bowai",
    ],
  },
  {
    topic: "livestock",
    keywords: [
      "cow",
      "buffalo",
      "goat",
      "dairy",
      "milk",
      "poultry",
      "animal",
      "livestock",
      "fodder",
      "cattle",
    ],
  },
];

const languageNames = {
  en: "English",
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
};

const queryReplacements = [
  [/fertisizer|fertlizer|fertilzer|fertizer|fertiliser/g, "fertilizer"],
  [/khaad|khad/g, "fertilizer"],
  [/mausam/g, "weather"],
  [/sinchai/g, "irrigation"],
  [/bimari|roga/g, "disease"],
];

const greetingKeywords = [
  "hi",
  "hello",
  "hey",
  "namaste",
  "namaskar",
  "salaam",
  "good morning",
  "good afternoon",
  "good evening",
];

function detectLanguagePreference(message, requestedLanguage) {
  if (requestedLanguage && requestedLanguage !== "en") {
    return "local";
  }

  return /[\u0900-\u097F]/.test(message) ? "local" : "english";
}

function getLanguageName(requestedLanguage, message) {
  if (requestedLanguage && languageNames[requestedLanguage]) {
    return languageNames[requestedLanguage];
  }

  return /[\u0900-\u097F]/.test(message) ? "Hindi" : "English";
}

function formatResponse(lines) {
  return lines.filter(Boolean).join("\n");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAiErrorMessage(error) {
  const status = error?.status ? `status ${error.status}` : null;
  return [status, error?.message].filter(Boolean).join(": ") || "Unknown AI provider error";
}

function isRetriableAiError(error) {
  const status = Number(error?.status);
  const message = (error?.message || "").toLowerCase();

  if ([429, 500, 502, 503, 504].includes(status)) {
    return true;
  }

  return (
    message.includes("overloaded") ||
    message.includes("rate limit") ||
    message.includes("temporar") ||
    message.includes("timeout") ||
    message.includes("deadline exceeded")
  );
}

function normalizeQuery(query) {
  let normalizedQuery = query.toLowerCase().trim();

  for (const [pattern, replacement] of queryReplacements) {
    normalizedQuery = normalizedQuery.replace(pattern, replacement);
  }

  normalizedQuery = normalizedQuery.replace(/[^\w\s]/g, " ");
  normalizedQuery = normalizedQuery.replace(/\s+/g, " ").trim();

  return normalizedQuery;
}

function tokenize(query) {
  return normalizeQuery(query).split(" ").filter(Boolean);
}

function getEditDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) {
    dp[i][0] = i;
  }

  for (let j = 0; j < cols; j += 1) {
    dp[0][j] = j;
  }

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }

  return dp[a.length][b.length];
}

function hasApproximateKeyword(query, keyword) {
  const normalizedQuery = normalizeQuery(query);
  const normalizedKeyword = normalizeQuery(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  if (normalizedQuery.includes(normalizedKeyword)) {
    return true;
  }

  if (normalizedKeyword.includes(" ")) {
    return false;
  }

  const tokens = tokenize(normalizedQuery);
  return tokens.some((token) => {
    if (Math.abs(token.length - normalizedKeyword.length) > 2) {
      return false;
    }

    return getEditDistance(token, normalizedKeyword) <= 2;
  });
}

function isGreetingMessage(query) {
  const normalizedQuery = normalizeQuery(query);

  return greetingKeywords.some(
    (keyword) =>
      normalizedQuery === keyword ||
      normalizedQuery.startsWith(`${keyword} `) ||
      normalizedQuery.endsWith(` ${keyword}`),
  );
}

function findCrop(query) {
  const normalizedQuery = normalizeQuery(query);

  return (
    Object.values(cropGuides).find((crop) =>
      crop.aliases.some((alias) => hasApproximateKeyword(normalizedQuery, alias)),
    ) || null
  );
}

function detectTopic(query) {
  const normalizedQuery = normalizeQuery(query);

  for (const rule of topicRules) {
    if (rule.keywords.some((keyword) => hasApproximateKeyword(normalizedQuery, keyword))) {
      return rule.topic;
    }
  }

  return "general";
}

function buildGreetingReply(languageStyle) {
  if (languageStyle === "local") {
    return formatResponse([
      "Namaste! Main aapka AI Farming Assistant hoon.",
      "Aap mujhse crop planning, fertilizer, pest control, weather, irrigation, government schemes, mandi prices, ya livestock ke baare me pooch sakte ho.",
      "Example:",
      "1. गेहूं में कौन सी खाद दें?",
      "2. Paddy me pest control kaise karein?",
      "3. Kal barish ho to spray kab karein?",
    ]);
  }

  return formatResponse([
    "Hello! I am your AI Farming Assistant.",
    "You can ask me about crop planning, fertilizer, pest control, weather, irrigation, government schemes, mandi selling, or livestock.",
    "Examples:",
    "1. Which fertilizer is best for wheat?",
    "2. How to control pests in paddy?",
    "3. When should I spray if rain is expected tomorrow?",
  ]);
}

function buildFertilizerTypesReply(languageStyle) {
  if (languageStyle === "local") {
    return formatResponse([
      "Fertilizer ke main types ye hote hain:",
      "1. Organic fertilizers: FYM, compost, vermicompost, green manure.",
      "2. Chemical fertilizers: urea, DAP, SSP, MOP, NPK mixtures.",
      "3. Biofertilizers: Rhizobium, Azotobacter, PSB jaise useful microbes.",
      "4. Micronutrients: zinc, boron, sulphur, magnesium jaise nutrients.",
      "Simple rule: organic se soil health improve hoti hai, chemical se fast nutrient supply milti hai, aur biofertilizers root zone ko support karte hain.",
      "Agar crop naam bataoge to main us crop ke liye kaunsi fertilizer category zyada useful hai, wo bata dunga.",
    ]);
  }

  return formatResponse([
    "The main types of fertilizers are:",
    "1. Organic fertilizers: FYM, compost, vermicompost, green manure.",
    "2. Chemical fertilizers: urea, DAP, SSP, MOP, and NPK mixtures.",
    "3. Biofertilizers: useful microbes such as Rhizobium, Azotobacter, and PSB.",
    "4. Micronutrients: zinc, boron, sulphur, magnesium, and similar nutrients.",
    "Simple rule: organic fertilizers improve soil health, chemical fertilizers supply nutrients quickly, and biofertilizers support the root zone.",
    "If you share the crop name, I can tell you which fertilizer type is more suitable for it.",
  ]);
}

function buildCropPlanningReply(languageStyle, crop) {
  const cropEntry = crop || cropGuides.paddy;

  if (languageStyle === "local") {
    return formatResponse([
      `${cropEntry.season}`,
      `Best time: ${cropEntry.sowing.replace(/^Best\s+/i, "")}`,
      `Needs: ${cropEntry.needs}`,
      "Practical tips:",
      `1. ${cropEntry.tips[0]}`,
      `2. ${cropEntry.tips[1]}`,
      `3. ${cropEntry.tips[2]}`,
      "Aap district, soil type, aur crop stage bata den to main aur exact planning de sakta hoon.",
    ]);
  }

  return formatResponse([
    cropEntry.season,
    cropEntry.sowing,
    `Needs: ${cropEntry.needs}`,
    "Practical tips:",
    `1. ${cropEntry.tips[0]}`,
    `2. ${cropEntry.tips[1]}`,
    `3. ${cropEntry.tips[2]}`,
    "Share your district, soil type, and crop stage and I will make the plan more specific.",
  ]);
}

function buildFertilizerReply(languageStyle, crop) {
  const cropLine = crop
    ? languageStyle === "local"
      ? `${crop.label} ke liye exact fertilizer dose soil test aur crop stage par depend karti hai.`
      : `For ${crop.label}, the exact fertilizer dose depends on soil test and crop stage.`
    : null;

  if (languageStyle === "local") {
    return formatResponse([
      cropLine,
      "Fertilizer plan banane se pehle soil test sabse best rahega.",
      "General guidance:",
      "1. Basal dose me compost ya FYM de sakte ho.",
      "2. Nitrogen ko 2-3 split dose me dena better hota hai.",
      "3. Urea dry soil par mat do; thodi moisture ho tab apply karo.",
      "4. Zinc, sulphur, ya micronutrient sirf deficiency ya soil report ke hisab se do.",
      "Crop, acre, irrigation type, aur soil report share karoge to main exact dose suggest kar dunga.",
    ]);
  }

  return formatResponse([
    cropLine,
    "A soil test is the best starting point before final fertilizer planning.",
    "General guidance:",
    "1. Add compost or FYM as a basal dose where available.",
    "2. Split nitrogen into 2-3 applications instead of applying everything at once.",
    "3. Do not apply urea on very dry soil; apply when moisture is available.",
    "4. Add zinc, sulphur, or other micronutrients only when deficiency or soil test supports it.",
    "Share the crop, acreage, irrigation type, and soil report and I can suggest a more exact dose.",
  ]);
}

function buildWeatherReply(languageStyle, crop) {
  const cropLine = crop
    ? languageStyle === "local"
      ? `${crop.label} crop ke liye weather ke hisab se irrigation aur spray timing bahut important hota hai.`
      : `For ${crop.label}, irrigation and spray timing should be adjusted with the weather.`
    : null;

  if (languageStyle === "local") {
    return formatResponse([
      cropLine,
      "Weather-based farming me timing sabse important hoti hai.",
      "1. Heavy rain ho to drainage open rakho aur waterlogging avoid karo.",
      "2. Garmi me subah ya shaam irrigation do aur mulch use karo agar possible ho.",
      "3. Frost ya thand ka risk ho to light irrigation useful ho sakti hai.",
      "4. Spray ko tez dhoop ya barish ke just pehle avoid karo.",
      "Location aur crop stage batao, main weather ke hisab se better action plan dunga.",
    ]);
  }

  return formatResponse([
    cropLine,
    "In weather-based farming, timing matters the most.",
    "1. Keep drainage open during heavy rain and avoid waterlogging.",
    "2. In hot weather, irrigate in the morning or evening and use mulch if possible.",
    "3. During frost risk, light irrigation can help reduce plant stress.",
    "4. Avoid spraying just before rain or under strong afternoon heat.",
    "Share your location and crop stage and I can suggest a more specific action plan.",
  ]);
}

function buildPestReply(languageStyle, crop) {
  const cropLine = crop
    ? languageStyle === "local"
      ? `${crop.label} me pest ya disease control ke liye symptom pehle sahi identify karna zaroori hai.`
      : `For ${crop.label}, correct symptom identification is the first step before treatment.`
    : languageStyle === "local"
      ? "Pest ya disease control ke liye symptom pehle sahi identify karna zaroori hai."
      : "For pest or disease control, correct symptom identification is the first step.";

  if (languageStyle === "local") {
    return formatResponse([
      cropLine,
      "Immediate steps:",
      "1. 5-10 plants ko dhyan se dekh kar damage level note karo.",
      "2. Bahut affected leaves ya plants ko alag karo agar spread fast ho raha ho.",
      "3. Early sucking pest attack me neem-based option useful ho sakta hai.",
      "4. Severe attack me sirf recommended pesticide use karo aur label dose follow karo.",
      "5. Agar weed issue hai to crop stage ke hisab se suitable herbicide ya manual weeding plan karo.",
      "Crop name, symptom, affected part, aur days-after-sowing bata do, main step-by-step treatment dunga.",
    ]);
  }

  return formatResponse([
    cropLine,
    "Immediate steps:",
    "1. Inspect 5-10 plants carefully and estimate how severe the damage is.",
    "2. Remove badly affected leaves or plants if spread is fast.",
    "3. Neem-based options can help in the early stage for many sucking pests.",
    "4. If the attack is severe, use only crop-specific recommended pesticide and follow the label dose.",
    "5. For weeds, choose manual weeding or a suitable herbicide based on crop stage.",
    "Share the crop, visible symptoms, affected plant part, and days after sowing and I will suggest a step-by-step treatment.",
  ]);
}

function buildIrrigationReply(languageStyle, crop) {
  const cropLine = crop
    ? languageStyle === "local"
      ? `${crop.label} ke liye irrigation schedule soil aur stage ke hisab se change hota hai.`
      : `For ${crop.label}, the irrigation schedule changes with soil type and crop stage.`
    : null;

  if (languageStyle === "local") {
    return formatResponse([
      cropLine,
      "Irrigation method crop aur water availability ke hisab se choose karo.",
      "1. Drip irrigation vegetables, fruits, cotton jaisi crops me water saving ke liye useful hai.",
      "2. Sprinkler wheat, fodder, aur uneven land me achha option hai.",
      "3. Flood irrigation tabhi karo jab leveling achhi ho aur pani sufficient ho.",
      "4. Har irrigation se pehle soil moisture check karo, routine se hi pani mat do.",
      "Crop, soil type, aur field size share karoge to better irrigation plan dunga.",
    ]);
  }

  return formatResponse([
    cropLine,
    "Choose irrigation based on crop type and water availability.",
    "1. Drip irrigation is useful for vegetables, fruits, cotton, and water saving.",
    "2. Sprinkler works well for wheat, fodder crops, and uneven land.",
    "3. Use flood irrigation only when field leveling is good and water is sufficient.",
    "4. Check soil moisture before each irrigation instead of watering only by routine.",
    "Share the crop, soil type, and field size and I can suggest a better irrigation plan.",
  ]);
}

function buildSchemeReply(languageStyle) {
  if (languageStyle === "local") {
    return formatResponse([
      "Farmer ke liye kuch common government schemes ye hain:",
      "1. PM-KISAN income support ke liye.",
      "2. Kisan Credit Card short-term crop loan ke liye.",
      "3. Soil Health Card fertilizer planning ke liye.",
      "4. PMFBY crop insurance ke liye.",
      "State aur scheme ka naam batao, main eligibility aur apply karne ka process simple steps me bata dunga.",
    ]);
  }

  return formatResponse([
    "Some common government schemes for farmers are:",
    "1. PM-KISAN for income support.",
    "2. Kisan Credit Card for short-term crop loans.",
    "3. Soil Health Card for fertilizer planning.",
    "4. PMFBY for crop insurance.",
    "Share your state and the scheme name and I can explain eligibility and how to apply.",
  ]);
}

function buildMandiReply(languageStyle, crop) {
  const cropLine = crop
    ? languageStyle === "local"
      ? `${crop.label} bechne se pehle 2-3 nearby mandis ka rate compare karna useful rahega.`
      : `Before selling ${crop.label}, compare rates in 2-3 nearby mandis.`
    : null;

  if (languageStyle === "local") {
    return formatResponse([
      cropLine,
      "Mandi selling ke liye general guidance:",
      "1. Produce ko clean, graded, aur dry condition me le jao.",
      "2. Local mandi, trader, FPO, aur eNAM options compare karo.",
      "3. Storage cost aur current demand compare karke selling decide karo.",
      "4. Quality, moisture, aur timing ka price par direct effect hota hai.",
      "Crop aur district batao, main selling timing par better suggestion dunga.",
    ]);
  }

  return formatResponse([
    cropLine,
    "General mandi guidance:",
    "1. Take clean, graded, and dry produce for better prices.",
    "2. Compare local mandi, trader, FPO, and eNAM options.",
    "3. Compare storage cost and current demand before deciding to sell.",
    "4. Quality, moisture, and timing directly affect the price.",
    "Share the crop and district and I can suggest better selling timing.",
  ]);
}

function buildLivestockReply(languageStyle) {
  if (languageStyle === "local") {
    return formatResponse([
      "Pashupalan ke question me pehle animal type aur symptom clear hona chahiye.",
      "1. Clean water, balanced feed, aur clean shed sabse basic zaroorat hai.",
      "2. Fever, no feeding, loose motion, ya milk drop ho to jaldi vet advice lena chahiye.",
      "3. Vaccination aur deworming schedule regular rakho.",
      "4. Sudden disease spread ho to affected animals ko alag rakho.",
      "Animal type, age, aur symptom batao, main practical guidance dunga.",
    ]);
  }

  return formatResponse([
    "For livestock questions, the animal type and symptoms should be clearly identified first.",
    "1. Clean water, balanced feed, and a clean shed are the basics.",
    "2. If there is fever, poor feeding, loose motion, or sudden milk drop, contact a veterinarian early.",
    "3. Keep vaccination and deworming on schedule.",
    "4. Isolate affected animals if the problem is spreading.",
    "Share the animal type, age, and symptoms and I will suggest practical next steps.",
  ]);
}

function buildGeneralReply(languageStyle, message, crop) {
  const cropLine = crop
    ? languageStyle === "local"
      ? `Agar aapka sawal ${crop.label} se related hai, to main crop planning, fertilizer, irrigation, disease, aur mandi guidance de sakta hoon.`
      : `If your question is about ${crop.label}, I can help with planning, fertilizer, irrigation, disease, and mandi guidance.`
    : null;

  if (languageStyle === "local") {
    return formatResponse([
      `Aapka sawal samajh gaya: "${message}".`,
      cropLine,
      "Main farming, weather, schemes, mandi, irrigation, pest, fertilizer, soil, aur livestock topics me detail me help kar sakta hoon.",
      "Best result ke liye ye details bhej do:",
      "1. Crop ya animal ka naam",
      "2. Location ya district",
      "3. Stage, symptom, ya exact problem",
      "4. Agar relevant ho to soil type, irrigation, ya recent weather",
      "Phir main direct answer ke saath step-by-step practical solution dunga.",
    ]);
  }

  return formatResponse([
    `I understood your query: "${message}".`,
    cropLine,
    "I can help in detail with farming, weather, schemes, mandi, irrigation, pest control, fertilizer, soil, and livestock topics.",
    "For a more accurate answer, share these details:",
    "1. Crop or animal name",
    "2. Location or district",
    "3. Current problem, symptom, or crop stage",
    "4. Soil type, irrigation method, or recent weather if relevant",
    "Then I will give a direct answer with a more practical step-by-step solution.",
  ]);
}

function buildConversationSummary(history) {
  const recentHistory = sanitizeHistory(history);

  if (recentHistory.length === 0) {
    return "No prior conversation context.";
  }

  return recentHistory
    .map((entry, index) => `${index + 1}. ${entry.role}: ${entry.text}`)
    .join("\n");
}

function detectAnswerStyle(message) {
  const normalizedMessage = normalizeQuery(message);

  if (
    normalizedMessage.includes("brief") ||
    normalizedMessage.includes("short") ||
    normalizedMessage.includes("summary")
  ) {
    return "brief";
  }

  return "detailed";
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((entry) => {
      const text = typeof entry?.text === "string" ? entry.text.trim() : "";
      const rawRole = typeof entry?.role === "string" ? entry.role : entry?.sender;
      const role =
        rawRole === "assistant" || rawRole === "model" || rawRole === "bot"
          ? "assistant"
          : rawRole === "user"
            ? "user"
            : null;

      if (!text || !role) {
        return null;
      }

      return { role, text };
    })
    .filter(Boolean)
    .slice(-8);
}

function buildContextQuery(message, history) {
  const historyText = sanitizeHistory(history)
    .map((entry) => entry.text)
    .join(" ");

  return [historyText, message].filter(Boolean).join(" ").trim();
}

function buildGeminiContents(history, prompt) {
  const conversation = sanitizeHistory(history).map((entry) => ({
    role: entry.role === "assistant" ? "model" : "user",
    parts: [{ text: entry.text }],
  }));

  conversation.push({
    role: "user",
    parts: [{ text: prompt }],
  });

  return conversation;
}

function buildLocalGuidance(message, requestedLanguage, history = []) {
  const contextualMessage = buildContextQuery(message, history);
  const query = normalizeQuery(contextualMessage || message);
  const languageStyle = detectLanguagePreference(message, requestedLanguage);
  const crop = findCrop(query);
  const topic = detectTopic(query);

  if (isGreetingMessage(query)) {
    return buildGreetingReply(languageStyle);
  }

  if (
    (query.includes("type of fertilizer") ||
      query.includes("types of fertilizer") ||
      query.includes("fertilizer type") ||
      query.includes("kind of fertilizer") ||
      query.includes("types fertilizer")) &&
    topic === "fertilizer"
  ) {
    return buildFertilizerTypesReply(languageStyle);
  }

  switch (topic) {
    case "pest":
      return buildPestReply(languageStyle, crop);
    case "fertilizer":
      return buildFertilizerReply(languageStyle, crop);
    case "irrigation":
      return buildIrrigationReply(languageStyle, crop);
    case "weather":
      return buildWeatherReply(languageStyle, crop);
    case "scheme":
      return buildSchemeReply(languageStyle);
    case "mandi":
      return buildMandiReply(languageStyle, crop);
    case "cropPlanning":
      return buildCropPlanningReply(languageStyle, crop);
    case "livestock":
      return buildLivestockReply(languageStyle);
    default:
      return buildGeneralReply(languageStyle, message, crop);
  }
}

async function generateAiReply(message, requestedLanguage, history = []) {
  if (!GEMINI_API_KEY) {
    return null;
  }

  const languageName = getLanguageName(requestedLanguage, message);
  const localGuidance = buildLocalGuidance(message, requestedLanguage, history);
  const answerStyle = detectAnswerStyle(message);
  const conversationSummary = buildConversationSummary(history);
  const systemPrompt = [
    "You are Mitra AI Farming Assistant for Indian farmers.",
    `Reply in simple ${languageName}.`,
    "Answer correctly, directly, and practically even when the user gives limited details.",
    "You can help with crops, pests, diseases, fertilizer, soil, irrigation, weather, mandi selling, livestock, machinery, government schemes, and related rural questions.",
    "Use the user's exact query and the recent conversation context to understand what they really want.",
    "If the user asks a follow-up question, continue from the earlier crop, location, or problem instead of restarting from zero.",
    "Prefer detailed answers with clear explanation, practical steps, what to avoid, and when needed, what extra information would improve accuracy.",
    "If the user asks for a brief answer, keep it short. Otherwise, give a detailed but easy-to-read answer.",
    "If important details are missing, first give the best useful guidance you can, then ask up to three focused follow-up questions.",
    "Use conversation history to resolve follow-up questions like 'what about this', 'for my crop', or 'and in Punjab?'.",
    "Never say service unavailable or ask the user to retry later.",
    "Do not invent live weather, live market prices, or government eligibility checks if the user has not provided them.",
    "Do not guess specific pesticide brands, exact medicine doses, or legal eligibility unless you are confident and it is generally safe.",
    "If the topic is not clearly agricultural, still answer helpfully and clearly.",
    "For pesticides or medicines, avoid unsafe exact dosing unless it is broadly safe; tell the user to follow the product label and local agriculture guidance.",
    "Use short paragraphs and numbered points when helpful.",
  ].join(" ");

  const prompt = [
    `Farmer query: ${message}`,
    `Language preference: ${languageName}`,
    `Preferred answer style: ${answerStyle}`,
    "Recent conversation summary:",
    conversationSummary,
    "Reference local farming guidance for this query:",
    localGuidance,
    "Answer the latest user query as accurately as possible.",
  ].join("\n\n");

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(
          `${GEMINI_API_BASE}/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
          {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: buildGeminiContents(history, prompt),
            generationConfig: {
              temperature: 0.3,
              topP: 0.8,
              maxOutputTokens: 800,
            },
          }),
        });

        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const apiMessage =
            payload?.error?.message ||
            payload?.message ||
            `Gemini request failed with status ${response.status}.`;
          const error = new Error(apiMessage);
          error.status = response.status;
          throw error;
        }

        const text = (
          payload?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text || "")
            .join("") || ""
        ).trim();

        if (text) {
          return text;
        }

        throw new Error(`Gemini returned an empty reply for model ${model}.`);
      } catch (error) {
        lastError = error;

        if (attempt === 0 && isRetriableAiError(error)) {
          await sleep(500);
          continue;
        }

        break;
      }
    }
  }

  throw lastError || new Error("Gemini did not return a usable reply.");
}

router.post("/", async (req, res) => {
  const message = req.body?.message?.trim();
  const requestedLanguage = req.body?.language;
  const history = sanitizeHistory(req.body?.history);

  if (!message) {
    const reply =
      requestedLanguage && requestedLanguage !== "en"
        ? "Kripya apna farming question bhejiye. Example: gehun me kaunsi khaad deni chahiye, ya paddy me pest control kaise karein."
        : "Please send your farming question. Example: which fertilizer should I use in wheat, or how to control pests in paddy.";

    return res.status(400).json({ reply, reply_hi: reply, reply_en: reply });
  }

  const localReply = buildLocalGuidance(message, requestedLanguage, history);

  try {
    const aiReply = await generateAiReply(message, requestedLanguage, history);
    const reply = aiReply || localReply;
    return res.json({ reply, reply_hi: reply, reply_en: reply });
  } catch (error) {
    console.error(
      "Chat error, using local farming guidance:",
      getAiErrorMessage(error),
    );
    return res.json({ reply: localReply, reply_hi: localReply, reply_en: localReply });
  }
});

router.post("/clear", (_req, res) => {
  res.json({ success: true });
});

module.exports = router;
