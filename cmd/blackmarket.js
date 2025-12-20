// commands/blackmarket.js
module.exports = {
  name: "سوق_سوداء",
  rank: 0,
  run: async (api, event, { userData }) => {
    const hour = new Date().getHours();
    // يفتح فقط في الساعة 12 ليلاً و 12 ظهراً لمدة ساعة
    if (hour !== 12 && hour !== 0) {
        return api.sendMessage("🌑 السوق السوداء تفتح فقط عند اكتمال القمر (الساعة 12)! تيقظ.", event.threadID);
    }

    const legendaryCharm = { name: "حرز خلود التنين", cost: 150000, notches: 4, boost: { ATK: 100, maxHP: 500 } };
    
    api.sendMessage(
      `💀 | مرحباً بك في السوق السوداء...\n` +
      `المعروض اليوم: [ ${legendaryCharm.name} ]\n` +
      `💰 الثمن: ${legendaryCharm.cost} ذهبية\n` +
      `للشراء اكتب: .سوق_سوداء شراء`, 
      event.threadID
    );
  }
};

