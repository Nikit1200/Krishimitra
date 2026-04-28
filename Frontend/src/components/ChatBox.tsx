import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatHistoryEntry {
  role: "user" | "assistant";
  text: string;
}

const chatApiBaseUrl = (
  import.meta.env.VITE_BACKEND_URL ?? (import.meta.env.DEV ? "http://localhost:3000" : "")
).replace(/\/$/, "");
const chatApiUrl = `${chatApiBaseUrl}/api/chat`;
const maxHistoryMessages = 8;

function normalizeQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/fertisizer|fertlizer|fertilzer|fertizer|fertiliser/g, "fertilizer")
    .replace(/khaad|khad/g, "fertilizer")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildClientFallbackReply(query: string, language: string) {
  const lower = normalizeQuery(query);

  if (
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey" ||
    lower === "namaste"
  ) {
    return language === "en"
      ? "Hello! I am your AI Farming Assistant. You can ask me about fertilizer, pest control, weather, irrigation, schemes, mandi prices, or crop planning. Try asking: what are the types of fertilizer for farming?"
      : "Namaste! Main aapka AI Farming Assistant hoon. Aap mujhse fertilizer, pest control, weather, irrigation, schemes, mandi prices, ya crop planning ke baare me pooch sakte ho. Example: farming me fertilizer ke types kya hote hain?";
  }

  if (
    lower.includes("type of fertilizer") ||
    lower.includes("types of fertilizer") ||
    lower.includes("fertilizer type") ||
    lower.includes("kind of fertilizer")
  ) {
    return language === "en"
      ? "The main types of fertilizers are:\n1. Organic fertilizers like FYM, compost, and vermicompost.\n2. Chemical fertilizers like urea, DAP, SSP, MOP, and NPK.\n3. Biofertilizers like Rhizobium and Azotobacter.\n4. Micronutrients like zinc, boron, and sulphur.\nShare your crop name if you want the best fertilizer type for that crop."
      : "Fertilizer ke main types hote hain:\n1. Organic fertilizer jaise FYM, compost, aur vermicompost.\n2. Chemical fertilizer jaise urea, DAP, SSP, MOP, aur NPK.\n3. Biofertilizer jaise Rhizobium aur Azotobacter.\n4. Micronutrients jaise zinc, boron, aur sulphur.\nCrop naam bataoge to us crop ke liye best fertilizer type bata dunga.";
  }

  if (
    lower.includes("pest") ||
    lower.includes("disease") ||
    lower.includes("leaf") ||
    lower.includes("spot") ||
    lower.includes("worm") ||
    lower.includes("weed")
  ) {
    return language === "en"
      ? "For pest or disease issues, first inspect 5-10 plants carefully.\n1. Remove badly affected leaves if spread is fast.\n2. Track which part of the plant is affected.\n3. Neem-based options may help in early sucking pest stages.\n4. Use only crop-specific recommended pesticide and follow the label dose.\nShare crop name and symptoms for a more exact treatment plan."
      : "Pest ya disease issue me pehle 5-10 plants dhyan se check karo.\n1. Agar spread fast ho raha hai to zyada affected leaves hata do.\n2. Dekho plant ka kaunsa part affected hai.\n3. Early sucking pest stage me neem-based option useful ho sakta hai.\n4. Sirf crop-specific recommended pesticide use karo aur label dose follow karo.\nCrop naam aur symptom bataoge to main aur exact treatment plan dunga.";
  }

  if (
    lower.includes("fertilizer") ||
    lower.includes("urea") ||
    lower.includes("dap") ||
    lower.includes("soil")
  ) {
    return language === "en"
      ? "For fertilizer planning, start with soil testing if possible.\n1. Add FYM or compost as a basal dose.\n2. Give nitrogen in split doses.\n3. Apply urea only when moisture is present.\n4. Use micronutrients only when deficiency is visible or confirmed.\nShare crop name and acreage for an exact recommendation."
      : "Fertilizer planning ke liye soil test best hota hai.\n1. Basal dose me FYM ya compost do.\n2. Nitrogen split dose me do.\n3. Urea tab do jab soil me moisture ho.\n4. Micronutrient tabhi do jab deficiency dikhe ya report me aaye.\nCrop aur area bataoge to exact recommendation de dunga.";
  }

  if (lower.includes("paddy") || lower.includes("rice")) {
    return language === "en"
      ? "Paddy is usually grown in Kharif season.\n1. Best time is June-July with monsoon start.\n2. Keep 2-5 cm water after transplanting.\n3. Use a healthy nursery and avoid water stagnation in heavy rain areas.\nShare your state if you want region-specific timing."
      : "Paddy ya dhan aam taur par Kharif season me ugaya jata hai.\n1. Best time June-July hota hai, jab monsoon start hota hai.\n2. Transplanting ke baad 2-5 cm pani maintain karo.\n3. Healthy nursery use karo aur heavy rain area me extra water nikalne ka system rakho.\nState bataoge to main aur exact timing de dunga.";
  }

  return language === "en"
    ? `I understood your farming query: "${query}".\nPlease share crop name, location, and crop stage so I can give step-by-step advice.`
    : `Aapka farming query samajh gaya: "${query}".\nKripya crop name, location, aur crop stage batao, phir main step-by-step advice dunga.`;
}

const ChatBox = () => {
  const { copy, language } = useLanguage();
  const chatCopy = copy.chat;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: chatCopy.welcomeMessage,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === "welcome"
          ? { ...message, text: chatCopy.welcomeMessage }
          : message,
      ),
    );
  }, [chatCopy.welcomeMessage]);

  const buildHistoryPayload = (): ChatHistoryEntry[] =>
    messages
      .filter((message) => message.id !== "welcome")
      .slice(-maxHistoryMessages)
      .map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        text: message.text,
      }));

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!inputText.trim()) {
      return;
    }

    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    const history = buildHistoryPayload();

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    try {
      const res = await fetch(chatApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          language,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed with status ${res.status}`);
      }

      const data = await res.json();
      const resolvedReply =
        data.reply ||
        (language === "en" ? data.reply_en : data.reply_hi) ||
        data.reply_hi ||
        data.reply_en ||
        buildClientFallbackReply(userMessage.text, language);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: resolvedReply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: buildClientFallbackReply(userMessage.text, language),
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRedirect = () => {
    if (inputText.trim()) {
      window.location.href = `https://chatbot-zw8a.onrender.com/?q=${encodeURIComponent(
        inputText,
      )}`;
      return;
    }

    window.location.href = "https://chatbot-zw8a.onrender.com/";
  };

  return (
    <div className="flex h-screen flex-col items-center bg-gray-100 p-4 font-sans text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div className="w-full max-w-2xl">
        <div className="flex h-[85vh] flex-col rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center space-x-2 rounded-t-xl border-b bg-green-600 p-4 text-white">
            <h3 className="text-lg font-semibold">{chatCopy.title}</h3>
          </div>

          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-3 shadow-md ${
                    message.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-xl bg-gray-200 p-3 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  <span>{chatCopy.typing}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={chatCopy.placeholder}
                className="flex-1 rounded-full border border-gray-300 bg-gray-100 p-3 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                disabled={isLoading}
                aria-label={chatCopy.placeholder}
              />

              <button
                type="submit"
                className="rounded-full bg-green-600 p-3 text-white shadow-lg transition-colors duration-300 hover:bg-green-700"
                disabled={isLoading}
              >
                {chatCopy.send}
              </button>

              <button
                type="button"
                onClick={handleRedirect}
                className="rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors duration-300 hover:bg-blue-700"
              >
                {chatCopy.open}
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              {chatCopy.helper}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
