const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const { User, updateUser } = require('../data/user');

// ضع مفتاح جوجل الخاص بك هنا
const genAI = new GoogleGenerativeAI("AIzaSyC5WIdscOUIvJXpHek3OaofXzt52SqLpqE");

module.exports = {
    name: "مساعد",
    otherName: ["aiadmin"],
    run: async (api, event, { args, userRank }) => {
        if (userRank < 2) return api.sendMessage("🚫 للمطور فقط.", event.threadID);

        const prompt = args.join(" ");
        if (!prompt) return api.sendMessage("⚠️ اشرح لي ماذا تريد أن أفعل؟\nمثال: .مساعد احذف المستخدم رقم 1234 وحدث ملف قتال ليصبح الربح 500", event.threadID);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // إعطاء الذكاء الاصطناعي سياق عن الأدوات المتاحة له
            const systemContext = `
            أنت مساعد مطور بوت فيسبوك. متاح لك الوصول للكائنات التالية:
            1. User (موديل المونجو): للحذف والبحث.
            2. fs: لتعديل الملفات.
            3. api: لإرسال الرسائل.
            المسار الحالي هو: ${process.cwd()}
            يجب أن تكون إجابتك عبارة عن كود JavaScript فقط لينفذه البوت عبر eval. 
            لا تكتب كلاماً إضافياً، فقط الكود بين علامتي \`\`\`.
            `;

            const result = await model.generateContent([systemContext, prompt]);
            const response = await result.response;
            let code = response.text().replace(/```javascript|```js|```/g, "").trim();

            // تنفيذ الكود الذي ولده الذكاء الاصطناعي
            api.sendMessage("⚙️ جاري تنفيذ تعليماتك البرمجية...", event.threadID);
            
            // بيئة التنفيذ (Context)
            const executeCode = async () => {
                return await eval(`(async () => { ${code} })()`);
            };

            await executeCode();
            api.sendMessage("✅ تم الانتهاء من تنفيذ المهمة بنجاح.", event.threadID);

        } catch (error) {
            api.sendMessage(`❌ فشل المساعد في التنفيذ:\n${error.message}`, event.threadID);
        }
    }
};

