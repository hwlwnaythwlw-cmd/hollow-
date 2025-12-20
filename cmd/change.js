// cmd/change.js
const { updateUser } = require("../data/user");

module.exports = {
  name: "تعديل",
  rank: 2, 
  run: async (api, event, { args }) => {
    const adminID = "61550124399416"; 
    if (event.senderID !== adminID) return api.sendMessage("❌ هذا الأمر للمطور فقط!", event.threadID);

    let targetID = event.messageReply ? event.messageReply.senderID : args[0];
    if (!targetID) return api.sendMessage("⚠️ رد على الشخص أو ضع الآيدي الخاص به.", event.threadID);

    const prop = event.messageReply ? args[0] : args[1];
    const val = event.messageReply ? args.slice(1).join(" ") : args.slice(2).join(" ");

    if (!prop || !val) return api.sendMessage("⚠️ الاستخدام: .تعديل [الميزة] [القيمة الجديدة]", event.threadID);

    let updateData = {};
    const key = prop.toLowerCase();

    // إضافة منطق تغيير الاسم هنا
    if (key === "name" || key === "اسم") {
        updateData["character.name"] = val;
    } 
    else if (key === "atk") updateData["character.ATK"] = parseInt(val);
    else if (key === "hp") {
        updateData["character.HP"] = parseInt(val);
        updateData["character.maxHP"] = parseInt(val);
    }
    else if (key === "money") updateData["money"] = parseInt(val);
    else if (key === "title") updateData["activeTitle"] = val;
    else if (key === "img") updateData["character.img"] = val;
    else return api.sendMessage("❌ ميزة غير مدعومة!", event.threadID);

    try {
        await updateUser(targetID, updateData);
        api.sendMessage(`✅ تم تغيير ${key} إلى: [ ${val} ] بنجاح!`, event.threadID);
    } catch (e) {
        api.sendMessage("❌ فشل التعديل في قاعدة البيانات.", event.threadID);
    }
  }
};

