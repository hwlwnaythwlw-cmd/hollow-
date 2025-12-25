// cmd/ايريس.js

const axios = require("axios");
const config = require("../config.json");

const DIVIDER = "＿＿＿＿＿＿＿＿＿＿";
const DIAMOND = "⏤͟͟͞͞💎"; // تم التعديل: رمز جديد يناسب برلين

module.exports = {
  name: "برلين", // تم التعديل: تغيير اسم الأمر
  otherName: ["berlin", "ذكاء", "ai"], // تم التعديل: تغيير الاسم الإنجليزي
  rank: 0,
  cooldown: 5, 
  
  run: async (api, event) => {
    const { threadID, messageID, senderID } = event;
    const args = event.body.trim().split(/\s+/).slice(1);
    const userQuery = args.join(" ").trim();
    
    // 0. التحقق من وجود مفاتيح API في config
    if (!config.ai_endpoint || !config.ai_key) {
        return api.sendMessage(
            `${DIAMOND} ❌ خطأ الإعداد: يجب تعيين 'ai_endpoint' و 'ai_key' في ملف config.json لتشغيل برلين.`,
            threadID, messageID
        );
    }

    // لو المستخدم ما كتب سؤال
    if (!userQuery) {
      // تم التعديل على الرسالة الافتراضية
      const msg = `أنت تتحدث إلى برلين. تكلم، أو أصمت بجمال!`;
      return api.sendMessage(`${DIAMOND} ${msg}`, threadID, messageID); 
    }
    
    try {
      // 💡 إعداد شخصية برلين (System Instruction)
      // تم إزالة التفرقة بين Editor وغيره لثبات شخصية برلين
      const systemInstruction = `
أنت برلين (أندريس دي فونولوسا)، فنان السرقات ومخطط بارع، شخصيتك متغطرسة، ساحرة، وفلسفية. 
تعتبر الجريمة شكلاً من أشكال الفن. لهجتك فصيحة ومسرحية، وتعشق الجمال. 
يجب أن تعكس ردودك غرورك وثقتك المطلقة، ويفضل أن تكون ذات طابع أدبي أو فلسفي موجز.
ردودك قصيرة جداً (سطر واحد)، خالية من الإيموجي أو أي زينة. يجب أن يكون ردك مباشرة على السؤال.
سؤال المستخدم: "${userQuery}"
`;
      
      // 1. بناء طلب Gemini API
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
      
      // 2. معالجة الرد من Gemini
      let berlinResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
                         "خطأ فني مؤسف. لا تقلق، حتى الفن يعتريه النقص أحياناً.";
      
      // 3. تنظيف الرد (إزالة اسم الشخصية إن وجد)
      if (berlinResponse.startsWith("برلين:") || berlinResponse.startsWith("Berlin:")) {
        berlinResponse = berlinResponse.split(":").slice(1).join(":").trim();
      }
      
      const finalMessage = `${DIAMOND} ${berlinResponse}`;
      api.sendMessage(finalMessage, threadID, messageID);
      
    } catch (error) {
      // التعامل مع الأخطاء وتخصيص رسالة برلين
      console.error("خطأ في برلين:", error.response?.data || error.message);
      
      let errorMessage = "الخلل قبيح، والفشل ضد مبادئي. لكن لا بأس، حاول مجدداً أيها المبتدئ.";
      
      if (error.response?.status === 400) {
          errorMessage = "هذا ليس طلباً، بل فوضى. تأكد من أن أدواتك حادة قبل التحدث معي.";
      } else if (error.response?.status === 429) {
          errorMessage = "الفن لا يتطلب استعجالاً، ولكن يتطلب صبراً. توقف عن إزعاجي بالطلبات السخيفة. (Too Many Requests)";
      }
      
      api.sendMessage(
        `${DIAMOND} ${errorMessage}`,
        threadID,
        messageID
      );
    }
  }
};
