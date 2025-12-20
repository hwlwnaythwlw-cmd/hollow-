const { getUser } = require("../data/user");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  name: "بروفايل",
  run: async (api, event, { args }) => {
    const targetID = event.messageReply ? event.messageReply.senderID : (args[0] || event.senderID);
    const userData = await getUser(targetID);

    if (!userData) return api.sendMessage("❌ هذا المستخدم غير مسجل.", event.threadID);

    const devIcon = (targetID === "61550124399416") ? " 👑 [المطور]" : "";
    const eclipseStatus = global.isEclipse ? "🌑 (نشط)" : "☀️ (هادئ)";

    let msg = `✨ | بـطـاقـة الـبـطـل | ✨\n` +
              `━━━━━━━━━━━━━━━\n` +
              `👤 الاسم: ${userData.character.name} ${devIcon}\n` +
              `🎖️ اللقب: « ${userData.activeTitle} »\n` +
              `📊 المستوى: ${userData.character.level}\n` +
              `━━━━━━━━━━━━━━━\n` +
              `❤️ الصحة: [ ${userData.character.HP} / ${userData.character.maxHP} ]\n` +
              `⚔️ الهجوم: ${userData.character.ATK}\n` +
              `✨ الطاقة: ${userData.qi} Qi\n` +
              `━━━━━━━━━━━━━━━\n` +
              `💰 الذهب: ${userData.money.toLocaleString()}\n` +
              `💎 الكريستال: ${userData.crystals}\n` +
              `🌍 العالم: ${eclipseStatus}\n` +
              `━━━━━━━━━━━━━━━`;

    const cachePath = path.join(__dirname, "cache", `p_${targetID}.png`);
    
    // إذا كان هناك رابط صورة مخزن
    if (userData.character.img) {
      try {
        const res = await axios.get(userData.character.img, { responseType: "arraybuffer" });
        fs.writeFileSync(cachePath, Buffer.from(res.data, "utf-8"));
        
        return api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(cachePath)
        }, event.threadID, () => fs.unlinkSync(cachePath));
      } catch (e) {
        return api.sendMessage(msg, event.threadID); // إرسال نص فقط إذا فشل الرابط
      }
    }
    
    api.sendMessage(msg, event.threadID);
  }
};

