const { getUser, updateUser } = require('../data/user');

module.exports = {
  name: "مهارة",
  run: async (api, event, { args }) => {
    const user = await getUser(event.senderID);
    const skillName = args.join(" ");
    const skill = user.character.skills.find(s => s.name === skillName);

    if (!skill) return api.sendMessage("❌ لا تملك هذه المهارة.", event.threadID);
    
    // تكلفة الـ Qi (الذكاء)
    const cost = skill.costQi || 15; 
    if (user.qi < cost) return api.sendMessage(`⚠️ طاقتك الروحية (Qi) غير كافية! تحتاج ${cost}.`, event.threadID);

    // تنفيذ المهارة (هنا نضع منطق الضرر)
    user.qi -= cost;
    await updateUser(event.senderID, { qi: user.qi });

    api.sendMessage(`✨ استخدمت [${skillName}]! استهلكت ${cost} من ذكاء روحك.`, event.threadID);
  }
};

