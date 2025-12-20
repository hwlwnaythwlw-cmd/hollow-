const { updateUser } = require('../data/user');
const charmsList = require('../data/charmsList');

module.exports = {
  name: "استراحة",
  run: async (api, event, { userData, args }) => {
    const cooldown = 30 * 60 * 1000; // 30 دقيقة
    const now = Date.now();

    if (userData.lastRest && (now - userData.lastRest < cooldown)) {
      const remain = Math.ceil((cooldown - (now - userData.lastRest)) / 60000);
      return api.sendMessage(`⏳ جسدك لا يزال قوياً! استرح بعد ${remain} دقيقة.`, event.threadID);
    }

    if (args[0] === "تركيب") {
      const charmID = parseInt(args[1]);
      const charm = charmsList.find(c => c.id === charmID);
      
      if (!charm) return api.sendMessage("❌ حرز غير معروف.", event.threadID);

      // تطبيق النسبة المئوية
      let bonus = 0;
      if (charm.type === "ATK") {
          bonus = userData.character.maxATK * charm.value;
          await updateUser(event.senderID, { "character.ATK": userData.character.maxATK + bonus });
      }

      await updateUser(event.senderID, { 
        activeCharm: charm.name, 
        lastRest: now,
        "character.HP": userData.character.maxHP 
      });

      return api.sendMessage(`🧘 استرحت قليلاً.. تم استعادة صحتك وتركيب [ ${charm.name} ] بنجاح!\n⚡ القوة الإضافية: +${(charm.value * 100)}%`, event.threadID);
    }

    api.sendMessage("🛌 أنت الآن في حالة استراحة.. اكتب [.استراحة تركيب (رقم الحرز)] لتعزيز قوتك.", event.threadID);
  }
};

