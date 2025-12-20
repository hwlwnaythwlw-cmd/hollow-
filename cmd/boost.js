const { updateUser } = require("../data/user");

module.exports = {
  name: "اختراق",
  rank: 0,
  run: async (api, event, { userData }) => {
    const requiredQi = userData.character.level * 50;
    
    if (userData.qi < requiredQi) {
      return api.sendMessage(`⚠️ لرفع مستواك الروحاني تحتاج إلى ${requiredQi} من الـ Qi.\nلديك حالياً: ${userData.qi}`, event.threadID);
    }

    await updateUser(event.senderID, {
      qi: userData.qi - requiredQi,
      "character.level": userData.character.level + 1,
      "character.maxHP": userData.character.maxHP + 20,
      "character.ATK": userData.character.ATK + 5,
      maxNotches: userData.character.level % 5 === 0 ? userData.maxNotches + 1 : userData.maxNotches
    });

    api.sendMessage(`🌟 مبروك! لقد تجاوزت حدودك ووصلت للمستوى ${userData.character.level + 1}!\nتم زيادة هجومك وصحتك.`, event.threadID);
  }
};

