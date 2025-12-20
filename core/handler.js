const { getUser } = require("../data/user");
const fs = require("fs");

module.exports = async (api, event) => {
    const prefix = "."; // البادئة
    if (!event.body || !event.body.startsWith(prefix)) return;

    const args = event.body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // البحث عن الأمر في مجلد cmd
    const command = global.client.commands.get(commandName) || 
                    global.client.commands.find(cmd => cmd.otherName && cmd.otherName.includes(commandName));

    if (!command) return;

    // جلب بيانات المستخدم
    let userData = await getUser(event.senderID);

    // التحقق من الرتبة (Rank)
    const adminID = "61550124399416";
    const userRank = (event.senderID === adminID) ? 2 : (userData ? 0 : 0);

    if (command.rank > userRank) {
        return api.sendMessage("❌ ليس لديك صلاحية لاستخدام هذا الأمر.", event.threadID);
    }

    try {
        await command.run(api, event, { args, userData, userRank });
    } catch (error) {
        console.error(error);
        api.sendMessage("⚠️ حدث خطأ داخلي أثناء تنفيذ الأمر.", event.threadID);
    }
};

