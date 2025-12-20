const fs = require("fs");

module.exports = {
    name: "تحديث",
    run: async (api, event, { userRank }) => {
        if (userRank < 2) return api.sendMessage("🚫 هذا الأمر للمطور فقط.", event.threadID);

        const commandFiles = fs.readdirSync('./cmd').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            delete require.cache[require.resolve(`./${file}`)];
            const command = require(`./${file}`);
            global.client.commands.set(command.name, command);
        }
        api.sendMessage("✅ تم تحديث جميع الأوامر بنجاح دون إعادة تشغيل البوت!", event.threadID);
    }
};

