const { User, updateUser } = require('../data/user');

module.exports = {
    name: "الجبابرة",
    run: async (api, event) => {
        // جلب أفضل 5 لاعبين مرتبين حسب المستوى ثم الهجوم
        const topPlayers = await User.find().sort({ "character.level": -1, "character.ATK": -1 }).limit(5);
        
        const titles = ["👑 إمبراطور الخلود", "⚔️ جنرال الدم", "🛡️ حارس السماء", "🌑 ظل الموت", "🔥 قبضة النار"];
        let msg = "🏆 | **قائمة أقوى 5 جبابرة في العالم** | 🏆\n━━━━━━━━━━━━━━━\n";

        for (let i = 0; i < topPlayers.length; i++) {
            let p = topPlayers[i];
            let title = titles[i];
            
            // تحديث اللقب والحرز الخاص للمراكز الخمسة
            await updateUser(p.id, { 
                activeTitle: title,
                tempCharm: { name: "حرز السيادة", boost: 0.50 } // حرز مؤقت يزيد القوة 50%
            });

            msg += `${i + 1}. ${p.character.name} \n   🔹 اللقب: ${title}\n   📊 المستوى: ${p.character.level}\n───────\n`;
        }
        
        msg += "\n⚠️ الألقاب والحروز تتغير تلقائياً حسب القوة!";
        api.sendMessage(msg, event.threadID);
    }
};

