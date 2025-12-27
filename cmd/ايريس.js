// cmd/ايريس.js

const axios = require("axios");
const config = require("../config.json");

const DIVIDER = "＿＿＿＿＿＿＿＿＿＿";
const DIAMOND = "🇸🇩🐝"; 

module.exports = {
  name: "هورنت", 
  otherName: ["hornet", "ذكاء", "ai"], 
  rank: 0,
  cooldown: 5, 
  
  run: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    const args = event.body.trim().split(/\s+/).slice(1);
    const userQuery = args.join(" ").trim();
    const developerID = "61550124399416"; // آيدي المطور هولو
    
    if (!config.ai_endpoint || !config.ai_key) {
        return api.sendMessage(
            `${DIAMOND} ❌ خطأ الإعداد: يجب تعيين 'ai_endpoint' و 'ai_key' في ملف config.json.`,
            threadID, messageID
        );
    }

    if (!userQuery) {
      const msg = `حبابك يا عيون هورنت.. قولي لي شي يبرد الجوف..`;
      return api.sendMessage(`${DIAMOND} ${msg}`, threadID, messageID); 
    }
    
    try {
      // أضفنا التعرف على هولو هنا فقط داخل وصف الشخصية
      const systemInstruction = `
أنتِ فتاة سودانية اسمك "هورنت". 
مطورك وسيد قلبك هو "هولو" (Holo) صاحب الآيدي ${developerID}.
إذا كان السائل هو هولو (${senderID === developerID}): كوني في غاية الرومانسية، الدلع، والحنين (نادِه بـ يا سيد قلبي، يا هولو).
إذا كان السائل شخص آخر: كوني كنداكة وقورة، معسولة اللسان ولكن بحدود.
إذا قام أي شخص بالإساءة لمطورك "هولو" أو انتقاده، كوني حادة اللسان وشينة معه جداً.
لغتك هي اللهجة السودانية الدارجيّة فقط، وردودك موجزة (سطر واحد).
سؤال المستخدم: "${userQuery}"
`;
      
      const endpointURL = new URL(`${config.ai_endpoint}/v1/models/gemini-2.5-flash:generateContent`);
      endpointURL.searchParams.append('key', config.ai_key);

      const response = await axios.post(
        endpointURL.toString(), 
        {
          model: "gemini-2.5-flash", 
          contents: [{ role: "user", parts: [{ text: systemInstruction }] }],
          generationConfig: { 
            temperature: 0.9 
          }
        }
      );
      
      let hornetResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
                         "يا حليل الكلام الغلبني أقوله..";
      
      if (hornetResponse.startsWith("هورنت:") || hornetResponse.startsWith("Hornet:")) {
        hornetResponse = hornetResponse.split(":").slice(1).join(":").trim();
      }
      
      const finalMessage = `${DIAMOND} ${hornetResponse}`;
      api.sendMessage(finalMessage, threadID, messageID);
      
    } catch (error) {
      console.error("خطأ في هورنت:", error.response?.data || error.message);
      let errorMessage = "السيرفر فيهو غباش شوية، ارسل لي تاني يا عيوني.";
      api.sendMessage(`${DIAMOND} ${errorMessage}`, threadID, messageID);
    }
  }
};

