const { getUser, updateUser } = require("../data/user");

module.exports = async function(api, event) {
    // 1. فحص هل الرسالة تبدأ بنقطة؟
    if (!event.body || typeof event.body !== "string" || !event.body.startsWith(".")) return;

    // 2. تقطيع الرسالة للأمر والأوامر الفرعية
    const args = event.body.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // 3. البحث عن الأمر
    const command = global.client.commands.get(commandName) || 
                    Array.from(global.client.commands.values()).find(cmd => cmd.otherName && cmd.otherName.includes(commandName));

    // إذا لم يجد الأمر، يتوقف بصمت
    if (!command) return;

    try {
        const senderID = String(event.senderID);
        const adminID = "61550124399416";
        const userRank = (senderID === adminID) ? 2 : 0;

        // 4. جلب أو إنشاء بيانات المستخدم
        let userData = await getUser(senderID);

        // 5. تنفيذ الأمر وتمرير المتغيرات كـ Object
        await command.run(api, event, { 
            args, 
            userData, 
            userRank, 
            updateUser 
        });

    } catch (error) {
        console.error(`❌ خطأ في تنفيذ الأمر [${commandName}]:`, error);
        api.sendMessage(`🚨 حدث خطأ: ${error.message}`, event.threadID);
    }
};

