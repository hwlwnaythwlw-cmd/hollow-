const { getUser, updateUser } = require("../data/user");

module.exports = async function(api, event) {
    if (!event.body || !event.body.startsWith(".")) return;

    const args = event.body.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = global.client.commands.get(commandName) || 
                    Array.from(global.client.commands.values()).find(cmd => cmd.otherName?.includes(commandName));

    if (!command) return;

    try {
        const senderID = String(event.senderID);
        const adminID = "61550124399416";
        const userRank = (senderID === adminID) ? 2 : 0;

        let userData = await getUser(senderID);

        // منطق المنع الصارم
        if (command.name !== "تسجيل" && command.name !== "أوامر" && !userData.registered) {
            return api.sendMessage("⚠️ حسابك غير مفعل! يجب التسجيل أولاً.\nاكتب: .تسجيل [اسمك]", event.threadID);
        }

        await command.run(api, event, { args, userData, userRank, updateUser });

    } catch (error) {
        console.error(error);
        api.sendMessage(`🚨 خطأ: ${error.message}`, event.threadID);
    }
};

