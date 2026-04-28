import React, { useState } from "react";

const LanguageSelector = () => {
  const [language, setLanguage] = useState("en");

  const handleChange = async (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);

    // Page ke saare headings + paragraphs
    const elements = document.querySelectorAll("h1, h2, h3, h4, h5, h6, p");

    // Original text ko ek string me convert karna
    const textToTranslate = Array.from(elements)
      .map((el) => el.innerText)
      .join("\n");

    // Free MyMemory API call
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      textToTranslate
    )}&langpair=en|${selectedLang}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const translatedLines = data.responseData.translatedText.split("\n");

      // Replace text in DOM
      elements.forEach((el, i) => {
        if (translatedLines[i]) {
          el.innerText = translatedLines[i];
        }
      });
    } catch (err) {
      console.error("Translation failed:", err);
      alert("Translation failed, please try again!");
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <label htmlFor="languageSelect">🌐 Select Language: </label>
      <select id="languageSelect" value={language} onChange={handleChange}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="bn">Bengali</option>
        <option value="ta">Tamil</option>
        <option value="te">Telugu</option>
        <option value="ml">Malayalam</option>
        <option value="kn">Kannada</option>
        <option value="mr">Marathi</option>
        <option value="gu">Gujarati</option>
        <option value="pa">Punjabi</option>
        <option value="or">Odia</option>
      </select>
    </div>
  );
};

export default LanguageSelector;