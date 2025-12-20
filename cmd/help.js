module.exports = {
    name: "أوامر",
    otherName: ["المساعدة", "help"],
    run: async (api, event, { args }) => {
        const commands = global.client.commands;
        let msg = "📜 **قائمة أوامر البوت** 📜\n━━━━━━━━━━━━━━━\n";
        
        // تحويل الـ Map إلى مصفوفة لعرض الأسماء
        const commandList = Array.from(commands.values()).map(cmd => cmd.name);
        
        commandList.forEach((name, index) => {
            msg += `┃ ${index + 1}. .${name}\n`;
        });

        msg += "━━━━━━━━━━━━━━━\n💡 اكتب (.) قبل أي أمر لتشغيله.";
        
        api.sendMessage(msg, event.threadID);
    }
};

