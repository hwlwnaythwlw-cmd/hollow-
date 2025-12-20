module.exports = {
    name: "تنفيذ",
    run: async (api, event, { args, userRank }) => {
        if (userRank < 2) return; // للمطور فقط

        try {
            const code = args.join(" ");
            let evaled = eval(code);
            
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            
            api.sendMessage(`💻 النتيجة:\n${evaled}`, event.threadID);
        } catch (err) {
            api.sendMessage(`❌ خطأ في الكود:\n${err}`, event.threadID);
        }
    }
};

