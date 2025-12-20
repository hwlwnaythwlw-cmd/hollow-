const { updateUser, getUser } = require("../data/user");
//const skills = require("../data/skills"); // سنفترض وجود ملف المهارات

module.exports = {
  name: "قتال",
  rank: 0,
  run: async (api, event, { userData }) => {
    // التحقق من حالة اللاعب
    if (userData.character.HP <= 20) {
        return api.sendMessage("🚑 صحتك منخفضة جداً! استخدم أمر الاستراحة أو انتظر التعافي التلقائي.", event.threadID);
    }

    // إعداد الوحش مع نظام الكسوف
    let monster = {
      name: global.isEclipse ? "👹 غول الكسوف الملعون" : "🐗 خنزير الغابة الهائج",
      hp: global.isEclipse ? 250 : 100 + (userData.character.level * 15),
      atk: global.isEclipse ? 35 : 15 + (userData.character.level * 2),
      isBoss: global.isEclipse
    };

    let msg = `⚔️ | **مواجهة قتالية**\n` +
              `──────────────────\n` +
              `👤 البطل: ${userData.character.name || "محارب"}\n` +
              `❤️ الصحة: ${userData.character.HP}\n` +
              `👹 الخصم: ${monster.name}\n` +
              `❤️ صحة الوحش: ${monster.hp}\n` +
              `──────────────────\n` +
              `${global.isEclipse ? "🌑 【 تحذير: الكسوف نشط - الوحش مرعب! 】\n" : ""}` +
              `اضغط على التفاعلات للقتال:\n` +
              `⚔️ هجوم | ✨ مهارة | 🛡️ دفاع | 🏃 هروب`;

    api.sendMessage(msg, event.threadID, (err, info) => {
      global.client.handler.reaction.push({
        name: "قتال",
        messageID: info.messageID,
        author: event.senderID,
        monsterHP: monster.hp,
        playerHP: userData.character.HP,
        monster: monster
      });
    }, event.messageID);
  },

  onReaction: async ({ api, event, Reaction, userData }) => {
    if (event.userID !== Reaction.author) return;

    let { monsterHP, playerHP, monster, messageID } = Reaction;
    let log = "";
    let pDmg = userData.character.ATK + Math.floor(Math.random() * 10);
    let mDmg = Math.max(5, monster.atk - (userData.character.DEF / 2));

    // تنفيذ الحركة
    switch (event.reaction) {
      case "⚔️":
        monsterHP -= pDmg;
        log = `💥 ضربة سيف قوية سببت ${pDmg} ضرر!`;
        break;
      case "✨":
        if (userData.qi < 20) {
            api.unsendMessage(event.messageID);
            return api.sendMessage("⚠️ طاقة الـ Qi غير كافية!", event.threadID);
        }
        userData.qi -= 20;
        pDmg *= 2.5;
        monsterHP -= pDmg;
        log = `🔥 مهارة سرية! انفجار طاقة يسبب ${Math.floor(pDmg)} ضرر!`;
        break;
      case "🛡️":
        mDmg = Math.floor(mDmg / 4);
        log = `🛡️ وضعت دفاعاً كاملاً.. الوحش لم يخدشك تقريباً!`;
        break;
      case "🏃":
        api.unsendMessage(messageID);
        return api.sendMessage("🏃 انسحبت من المعركة.. الجبناء يعيشون طويلاً!", event.threadID);
    }

    // هجوم الوحش
    if (monsterHP > 0) {
        playerHP -= Math.floor(mDmg);
        log += `\n👹 رد ${monster.name} بضربة سببت ${Math.floor(mDmg)} ضرر!`;
    }

    // تفقد النتيجة
    if (monsterHP <= 0) {
        let gold = global.isEclipse ? 3000 : 500;
        let exp = global.isEclipse ? 100 : 20;
        await updateUser(Reaction.author, { 
            money: userData.money + gold, 
            exp: userData.exp + exp, 
            "character.HP": playerHP,
            qi: userData.qi,
            lastAttackTime: new Date()
        });
        api.unsendMessage(messageID);
        return api.sendMessage(`🏆 **نصر مؤزر!**\n💰 الذهب: +${gold}\n🌟 الخبرة: +${exp}\n❤️ صحتك: ${playerHP}`, event.threadID);
    }

    if (playerHP <= 0) {
        api.unsendMessage(messageID);
        let lostCharmMsg = "";
        if (userData.charms && userData.charms.length > 0) {
            const lost = userData.charms.pop(); // خسارة آخر حرز
            lostCharmMsg = `\n⚠️ سقط منك حرز [ ${lost.name} ] أثناء هربك!`;
        }
        await updateUser(Reaction.author, { charms: userData.charms, "character.HP": 20, lastAttackTime: new Date() });
        return api.sendMessage(`💀 **لقد سحقت!**\nتم إنقاذك بواسطة حراس الغابة.${lostCharmMsg}`, event.threadID);
    }

    // تعديل الرسالة للجولة القادمة
    const statusMsg = `${log}\n\n` +
                      `👤 بطلنا: ${playerHP} HP | ✨ طاقة: ${userData.qi}\n` +
                      `👹 الوحش: ${monsterHP} HP\n` +
                      `──────────────────\n` +
                      `⚔️ | ✨ | 🛡️ | 🏃`;
    
    api.editMessage(statusMsg, messageID, () => {
        Reaction.monsterHP = monsterHP;
        Reaction.playerHP = playerHP;
    });
  }
};

