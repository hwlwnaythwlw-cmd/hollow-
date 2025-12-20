const { updateUser } = require("../data/user");
const charmsList = require("../data/charmsList");

module.exports = {
  name: "تجهيز",
  rank: 0,
  run: async (api, event, { args, userData }) => {
    if (userData.charms.length === 0) return api.sendMessage("❌ لا تملك أي حروز لتجهيزها.", event.threadID);

    let msg = "🎒 حروزك المتاحة:\n";
    userData.charms.forEach((c, i) => {
      msg += `${i + 1}. ${c.name} (يستهلك ${c.notchCost} معاليق)\n`;
    });
    
    if (!args[0]) return api.sendMessage(msg + "\nاكتب .تجهيز [الرقم] لتركيب الحرز.", event.threadID);

    const index = parseInt(args[0]) - 1;
    const selected = userData.charms[index];

    // حساب المعاليق المستخدمة حالياً
    const usedNotches = userData.equippedCharms.reduce((sum, c) => sum + c.notchCost, 0);

    if (usedNotches + selected.notchCost > userData.maxNotches) {
      return api.sendMessage(`❌ لا توجد معاليق كافية! متاح لك ${userData.maxNotches} فقط.`, event.threadID);
    }

    await updateUser(event.senderID, {
      $push: { equippedCharms: selected }
    });
    
    api.sendMessage(`⚔️ تم تجهيز [ ${selected.name} ] بنجاح!`, event.threadID);
  }
};

