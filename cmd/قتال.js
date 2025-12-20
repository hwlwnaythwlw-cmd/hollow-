const { getUser, updateUser } = require("../data/user");

module.exports = {
    name: "قتال",
    otherName: ["h"],
    run: async (api, event, { args }) => {
        const { threadID, senderID, messageID } = event;
        
        // جلب بيانات اللاعب
        let user = await getUser(senderID.toString());

        // قائمة وحوش عشوائية
        const monsters = [
            { name: "تنين صغير", hp: 100, reward: 200, xp: 50 },
            { name: "غول بري", hp: 80, reward: 150, xp: 30 },
            { name: "ذئب الظلام", hp: 50, reward: 80, xp: 20 }
        ];

        const monster = monsters[Math.floor(Math.random() * monsters.length)];
        
        // نظام قتال مبسط (احتمال فوز 70%)
        const win = Math.random() > 0.3;

        if (win) {
            user.money += monster.reward;
            user.character.xp += monster.xp;
            
            // التحقق من ارتقاء المستوى (Level Up)
            if (user.character.xp >= user.character.level * 100) {
                user.character.level += 1;
                user.character.xp = 0;
                api.sendMessage(`🆙 تهانينا! ارتقيت للمستوى ${user.character.level}`, threadID);
            }

            await updateUser(senderID.toString(), user);

            const winMsg = `⚔️ | لقد واجهت [ ${monster.name} ] وهزمته!\n💰 الجائزة: ${monster.reward} ذهب\n💠 الخبرة: +${monster.xp}`;
            return api.sendMessage(winMsg, threadID, messageID);
        } else {
            const lostMoney = 50;
            user.money = Math.max(0, user.money - lostMoney);
            await updateUser(senderID.toString(), user);

            return api.sendMessage(`💀 | لقد هزمتك الـ [ ${monster.name} ] وفقدت ${lostMoney} قطعة ذهبية!`, threadID, messageID);
        }
    }
};

