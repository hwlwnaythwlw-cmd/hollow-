// commands/pvp.js
const { getUser, updateUser } = require("../data/user");

module.exports = {
  name: "تحدي",
  rank: 0,
  run: async (api, event, { args, userData }) => {
    if (!event.messageReply) return api.sendMessage("⚠️ رد على رسالة الشخص لتتحداه!", event.threadID);
    
    const opponentID = event.messageReply.senderID;
    const opponentData = await getUser(opponentID);
    
    if (!opponentData) return api.sendMessage("❌ الخصم غير مسجل!", event.threadID);
    if (opponentData.character.HP < 30) return api.sendMessage("❌ الخصم ضعيف جداً الآن.", event.threadID);

    // نظام تبادل الضربات
    let p1Dmg = Math.max(10, userData.character.ATK - opponentData.character.DEF/2);
    let p2Dmg = Math.max(10, opponentData.character.ATK - userData.character.DEF/2);

    // إذا استخدم مهارة (مثال: .تحدي 1)
    if (args[0]) {
        p1Dmg += 20; // زيادة ضرر المهارة
        userData.qi -= 15;
    }

    opponentData.character.HP -= p1Dmg;
    userData.character.HP -= p2Dmg;

    await updateUser(event.senderID, { "character.HP": userData.character.HP, qi: userData.qi });
    await updateUser(opponentID, { "character.HP": opponentData.character.HP });

    api.sendMessage(
      `🤺 | نتيجة المبارزة:\n` +
      `💥 وجهت لـ @${opponentID} ضرراً: ${Math.floor(p1Dmg)}\n` +
      `🥊 تلقيت ضرراً مضاداً: ${Math.floor(p2Dmg)}\n` +
      `❤️ صحتك: ${userData.character.HP} | ❤️ صحته: ${opponentData.character.HP}`,
      event.threadID
    );
  }
};

