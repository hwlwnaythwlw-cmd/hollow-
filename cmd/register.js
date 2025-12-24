const { updateUser } = require("../data/user");

module.exports = {
    name: "تسجيل",
    run: async (api, event, { args, userData }) => {
        if (userData.registered) return api.sendMessage("✅ أنت مسجل بالفعل!", event.threadID);

        const name = args.join(" ");
        if (!name) return api.sendMessage("⚠️ يرجى كتابة اسم لشخصيتك!\nمثال: .تسجيل غوكو", event.threadID);

        userData.character.name = name;
        userData.registered = true; // علامة التسجيل
        userData.money = 1000;

        await updateUser(event.senderID.toString(), userData);

        api.sendMessage(`✨ تمت عملية التسجيل بنجاح!\nمرحباً بك يا [ ${name} ] في عالم المغامرة.`, event.threadID);
    }
};

