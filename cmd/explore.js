// commands/explore.js
const { updateUser } = require("../data/user");
const charmsList = require("../data/charmsList");

module.exports = {
  name: "استكشاف",
  rank: 0,
  run: async (api, event, { userData }) => {
    const cooldown = 30 * 60 * 1000; // 30 دقيقة
    const now = Date.now();

    if (userData.lastExplore && now - userData.lastExplore < cooldown) {
      const remaining = Math.ceil((cooldown - (now - userData.lastExplore)) / (60 * 1000));
      return api.sendMessage(`⏳ شخصيتك في رحلة أو مرهقة. انتظر ${remaining} دقيقة.`, event.threadID);
    }

    // احتمالات النتائج
    const rand = Math.random() * 100;
    let msg = "🧭 | بدأت رحلة الاستكشاف في المناطق المجهولة...\n";
    let updateData = { lastExplore: now };

    if (rand < 40) { // مواجهة وحش
      const damage = Math.floor(Math.random() * 20) + 10;
      userData.character.HP -= damage;
      msg += `⚠️ تعرضت لهجوم من "ذئب الظل"! فقدت ${damage} HP لكنك وجدت 200 ذهبية.`;
      updateData["character.HP"] = userData.character.HP;
      updateData["money"] = userData.money + 200;
    } else if (rand < 80) { // العثور على غنائم
      const money = Math.floor(Math.random() * 1000) + 500;
      const crystals = Math.random() < 0.2 ? 1 : 0; // فرصة 20% لكريستال
      msg += `💰 وجدت كنزاً مخفياً! حصلت على ${money} ذهبية` + (crystals ? " و 1 كريستال!" : "!");
      updateData["money"] = userData.money + money;
      if (crystals) updateData["crystals"] = userData.crystals + 1;
    } else { // العثور على حرز (فرصة نادرة 20%)
      const randomCharm = charmsList[Math.floor(Math.random() * charmsList.length)];
      msg += `✨ ياللحظ! وجدت حرزاً أثرياً: [ ${randomCharm.name} ]!`;
      updateData["$push"] = { charms: randomCharm };
    }

    await updateUser(event.senderID, updateData);
    api.sendMessage(msg, event.threadID);
  }
};

