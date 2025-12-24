const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const { User, updateUser } = require('../data/user');

// استبدل النص أدناه بمفتاح Google API الخاص بك
const genAI = new GoogleGenerativeAI("YOUR_GOOGLE_API_KEY");

module.exports = {
    name: "مساعد",
    otherName: ["aiadmin", "ai"],
    run: async (api, event, { args, userRank }) => {
        // التحقق من رتبة المطور (رتبة 2 تعني أدمن)
        if (userRank < 2) return api.sendMessage("🚫 هذا الأمر مخصص للمطور الرئيسي فقط.", event.threadID);

        const prompt = args.join(" ");
        if (!prompt) return api.sendMessage("⚠️ كيف يمكنني مساعدتك برمجياً؟\nمثال: .مساعد احذف المستخدم ذو الآيدي 123456", event.threadID);

        try {
            // استخدام موديل gemini-1.5-flash أو gemini-pro حسب المتوفر في منطقتك
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const systemContext = `
            أنت "عقل البوت". متاح لك التحكم الكامل.
            البيئة الحالية:
            - قاعدة البيانات (User): يمكنك استخدام User.deleteOne, User.findOne, User.updateMany.
            - الملفات (fs): يمكنك قراءة وكتابة الملفات في مجلد البوت.
            - التواصل (api): يمكنك إرسال رسائل عبر api.sendMessage.
            - المسار الحالي: ${process.cwd()}

            المطلوب منك:
            تقديم كود JavaScript فقط لينفذه البوت. 
            لا تكتب أي نص بشري أو مقدمات. فقط الكود البرمجي داخل علامات الكود.
            إذا طلب المستخدم حذف شخص، استخدم String(id) للبحث في المونجو.
            `;

            const result = await model.generateContent([systemContext, prompt]);
            const response = await result.response;
            let code = response.text().replace(/```javascript|```js|```/g, "").trim();

            // إرسال إشعار قبل التنفيذ
            api.sendMessage("⚙️ جاري معالجة طلبك وتنفيذ الكود...", event.threadID);

            // وظيفة التنفيذ الفوري
            const executeCommand = async (codeToRun) => {
                const context = { api, event, User, updateUser, fs, path };
                // إنشاء دالة من النص المنفذ
                const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
                const fn = new AsyncFunction('api', 'event', 'User', 'updateUser', 'fs', 'path', codeToRun);
                return await fn(api, event, User, updateUser, fs, path);
            };

            await executeCommand(code);
            api.sendMessage("✅ تم تنفيذ المهمة بنجاح كما طلبت.", event.threadID);

        } catch (error) {
            console.error(error);
            api.sendMessage(`❌ فشل في التنفيذ:\nالسبب: ${error.message}\nتأكد من صلاحية مفتاح API أو اسم الموديل.`, event.threadID);
        }
    }
};

