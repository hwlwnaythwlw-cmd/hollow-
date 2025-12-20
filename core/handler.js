const { getUser, updateUser } = require("../data/user");

module.exports = async function(api, event) {
    if (!event.body || !event.body.startsWith(".")) return;

    // معالجة المدخلات
    const args = event.body.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // البحث عن الأمر (الاسم الأصلي أو المستعار)
    const command = global.client.commands.get(commandName) || 
                    Array.from(global.client.commands.values()).find(cmd => cmd.otherName && cmd.otherName.includes(commandName));

    if (!command) return;

    try {
        // تحويل المعرفات لنص لضمان استقرار مكتبة fca
        const senderID = event.senderID.toString();
        const threadID = event.threadID.toString();

        // جلب بيانات المستخدم من القاعدة
        let userData = await getUser(senderID);

        // نظام الرتب (أضف الآيدي الخاص بك هنا)
        const adminID = "61550124399416";
        const userRank = (senderID === adminID) ? 2 : 0;

        // تنفيذ الأمر
        await command.run(api, event, { 
            args, 
            userData, 
            userRank, 
            updateUser 
        });

    } catch (error) {
        console.error(`🔥 خطأ في [${commandName}]:`, error);
        
        // إشعار المستخدم
        api.sendMessage(`⚠️ حدث خطأ تقني في أمر .${commandName}`, event.threadID);

        // إشعار المطور تلقائياً (أنت)
        const adminID = "61550124399416";
        if (event.senderID.toString() !== adminID) {
            api.sendMessage(
                `🚨 تنبيه خطأ!\n` +
                `🔹 الأمر: ${commandName}\n` +
                `🔹 المستخدم: ${event.senderID}\n` +
                `🔹 نص الخطأ: ${error.message}`, 
                adminID
            );
        }
    }
};

