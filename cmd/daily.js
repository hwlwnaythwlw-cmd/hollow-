const { getUser, updateUser } = require("../data/user");

module.exports = {
    name: "يومية",
    otherName: ["daily"],
    run: async (api, event) => {
        const { threadID, senderID } = event;
        let userData = await getUser(senderID.toString());

        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 ساعة
        const lastDaily = userData.lastDaily || 0;

        if (now - lastDaily < cooldown) {
            const remaining = cooldown - (now - lastDaily);
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            return api.sendMessage(`⏳ لقد استلمت جائزتك اليومية بالفعل! عد بعد ${hours} ساعة.`, threadID);
        }

        const reward = 500; // مبلغ الجائزة
        userData.money += reward;
        userData.lastDaily = now;

        await updateUser(senderID.toString(), userData);

        return api.sendMessage(`🎁 | مطالبات يومية:\n💰 لقد حصلت على ${reward} قطعة ذهبية!`, threadID);
    }
};
	
