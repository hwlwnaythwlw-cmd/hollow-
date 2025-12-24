const { getUser, updateUser } = require("../data/user");

module.exports = async function(api, event) {
    // تجاهل الرسائل التي لا تبدأ بنقطة
    if (!event.body || !event.body.startsWith(".")) return;

    // معالجة المدخلات
    const args = event.body.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // البحث عن الأمر بالاسم الأصلي أو الأسماء المستعارة
    const command = global.client.commands.get(commandName) || 
                    Array.from(global.client.commands.values()).find(cmd => cmd.otherName && cmd.otherName.includes(commandName));

    if (!command) return;

    try {
        const senderID = String(event.senderID);
        const adminID = "61550124399416";
        const userRank = (senderID === adminID) ? 2 : 0;

        // جلب بيانات المستخدم (سيقوم بإنشاء حساب تلقائياً إذا لم يوجد)
        let userData = await getUser(senderID);

        // --- تم إزالة شرط التحقق من التسجيل من هنا ---
        // الآن أي شخص يكتب أمراً سيعمل معه فوراً وسيحصل على حساب تلقائي

        // تنفيذ الأمر
        await command.run(api, event, { 
            args, 
            userData, 
            userRank, 
            updateUser 
        });

    } catch (error) {
        console.error(`🔥 خطأ في [${commandName}]:`, error);
        api.sendMessage(`⚠️ حدث خطأ تقني في أمر .${commandName}`, event.threadID);
    }
};

