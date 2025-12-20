module.exports = {
  name: "رابط",
  run: async (api, event) => {
    if (event.type !== "message_reply") return api.sendMessage("⚠️ رد على صورة للحصول على رابطها.", event.threadID);
    if (!event.messageReply.attachments[0]) return api.sendMessage("❌ لا توجد صورة في هذه الرسالة.", event.threadID);

    const url = event.messageReply.attachments[0].url;
    api.sendMessage(`🔗 رابط الصورة المباشر:\n${url}`, event.threadID);
  }
};

