const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const { User, updateUser } = require('../data/user');

// ضع مفتاحك هنا أو تأكد من وضعه في Environment Variables في Render باسم GOOGLE_API_KEY
const apiKey = process.env.GOOGLE_API_KEY || "AIzaSyC5WIdscOUIvJXpHek3OaofXzt52SqLpqE";
const genAI = new GoogleGenerativeAI(apiKey);

module.exports = {
    name: "مساعد",
    otherName: ["aiadmin", "ai"],
    run: async (api, event, { args, userRank }) => {
        // التحقق من الرتبة (2 تعني مطور)
        if (userRank < 2) return api.sendMessage("🚫 صلاحيات مطور فقط!", event.threadID);

        const prompt = args.join(" ");
        if (!prompt) return api.sendMessage("⚠️ اطلب مني شيئاً، مثال: .مساعد اعطني قائمة بأسماء الملفات في مجلد cmd", event.threadID);

        try {
            // استخدام الموديل المستقر لتجنب خطأ 404
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

            const systemContext = `
            أنت مساعد تقني لبوت فيسبوك ماسنجر. 
            لديك الصلاحيات التالية:
            1. قراءة وتعديل الملفات باستخدام fs.
            2. التعامل مع قاعدة بيانات MongoDB باستخدام User.
            3. إرسال رسائل باستخدام api.sendMessage.
            
            المطلوب:
            أجب بكود JavaScript فقط ليتم تنفيذه مباشرة. 
            - لا تضع علامات \`\`\` في بداية ونهاية الكود.
            - لا تكتب أي نص بشري.
            - المسار الحالي للمشروع: ${process.cwd()}
            `;

            const result = await model.generateContent(systemContext + "\n\nالطلب: " + prompt);
            const response = await result.response;
            let code = response.text().trim();

            // تنظيف الكود من أي علامات Markdown قد يضيفها الذكاء الاصطناعي
            code = code.replace(/^```javascript|^```js|^```|```$/gm, "").trim();

            api.sendMessage("⏳ جاري تحليل الطلب وتنفيذه برمجياً...", event.threadID);

            // تنفيذ الكود في بيئة معزولة
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
            const execute = new AsyncFunction('api', 'event', 'User', 'updateUser', 'fs', 'path', code);
            
            await execute(api, event, User, updateUser, fs, path);

            api.sendMessage("✅ تم تنفيذ المهمة بنجاح.", event.threadID);

        } catch (error) {
            console.error("AI Admin Error:", error);
            
            let errorMsg = error.message;
            if (errorMsg.includes("404")) {
                errorMsg = "خطأ 404: الموديل غير مدعوم في هذه المنطقة أو المفتاح قديم. حاول تحديث المكتبة.";
            } else if (errorMsg.includes("400")) {
                errorMsg = "خطأ 400: مفتاح API غير صالح. تأكد من نسخه بشكل صحيح.";
            }

            api.sendMessage(`❌ فشل المساعد:\n${errorMsg}`, event.threadID);
        }
    }
};

