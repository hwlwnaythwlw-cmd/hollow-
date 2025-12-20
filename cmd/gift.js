// commands/gift.js
const { updateUser, getUser } = require("../data/user");

module.exports = {
  name: "اهدي",
  rank: 0,
  run: async (api, event, { args, userData }) => {
    if (!event.messageReply) return api.sendMessage("⚠️ قم بالرد على رسالة الشخص الذي تريد إهداءه!", event.threadID);
    
    const receiverID = event.messageReply.senderID;
    const targetIndex = parseInt(args[0]) - 1;

    if (isNaN(targetIndex) || !userData.charms[targetIndex]) {
      return api.sendMessage("⚠️ اختر رقم الحرز من حقيبتك. مثال: .اهدي 1", event.threadID);
    }

    const charmToGift = userData.charms[targetIndex];
    const receiverData = await getUser(receiverID);
    if (!receiverData) return api.sendMessage("❌ هذا الشخص غير مسجل في البوت.", event.threadID);

    // حذف من المرسل وإضافة للمستقبل
    userData.charms.splice(targetIndex, 1);
    await updateUser(event.senderID, { charms: userData.charms });
    await updateUser(receiverID, { $push: { charms: charmToGift } });

    api.sendMessage(`🎁 تم إرسال [ ${charmToGift.name} ] إلى صديقك بنجاح!`, event.threadID);
  }
};

