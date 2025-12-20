const { getUser } = require("../data/user");

module.exports = async function(api, event) {
    if (!event.body) return;

    const prefix = "."; 
    if (!event.body.startsWith(prefix)) return;

    const args = event.body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    // الإصلاح هنا: تحويل القيم لمصفوفة قبل استخدام find
    const command = global.client.commands.get(commandName) || 
                    Array.from(global.client.commands.values()).find(cmd => cmd.otherName && cmd.otherName.includes(commandName));

    if (!command) return;

    try {
        let userData = await getUser(event.senderID);
        const adminID = "61550124399416";
        const userRank = (event.senderID === adminID) ? 2 : 0;

        await command.run(api, event, { args, userData, userRank });
    } catch (error) {
        console.error("🔥 خطأ أثناء تنفيذ الأمر:", error);
    }
};

