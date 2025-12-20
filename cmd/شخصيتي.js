const { getUser } = require('../data/user');

module.exports = {
  name: 'شخصيتي',
  otherName: ['شخصية', 'انا'],
  rank: 0,
  run: async (api, event) => {
    const senderId = event.messageReply ? event.messageReply.senderID : event.senderID;
    const user = await getUser(senderId);
    
    if (!user) return api.sendMessage('⚠️ لا يوجد حساب.', event.threadID);

    const char = user.character;
    const qi = user.qi || 0;
    const notches = user.maxNotches || 3;
    const clan = user.clan || "بدون قبيلة";

    let msg = `─── { 👤 الشخصية } ───\n`;
    msg += `📝 الاسم: ${char.name}\n`;
    msg += `🎭 الفئة: ${char.class}\n`;
    msg += `🏰 القبيلة: ${clan}\n`;
    msg += `🌟 المستوى: ${char.level}\n`;
    msg += `─── { 📊 الإحصائيات } ───\n`;
    msg += `❤️ الصحة: ${char.HP} / ${char.maxHP}\n`;
    msg += `⚔️ الهجوم: ${char.ATK}\n`;
    msg += `🛡️ الدفاع: ${char.DEF}\n`;
    msg += `🧠 ذكاء الروح (Qi): ${qi}\n`;
    msg += `💠 فتحات الحروز: ${notches} / 8\n`;
    msg += `─── { 💰 المحفظة } ───\n`;
    msg += `🪙 قروش: ${user.money}\n`;
    msg += `💎 كرستال: ${user.crystals}\n`;

    api.sendMessage(msg, event.threadID, event.messageID);
  }
};

