const { addReply, removeReply, getAllReplies } = require("../data/replice");

module.exports = {
  name: "ردود",
  otherName: ["reply", "رد"],
  usageCount: 0,
  rank: 0, // فقط للأدمن
  info: "إضافة أو حذف أو عرض الردود",
  usage: "ردود اضف|حذف <نص الرسالة> | <الرد>",

  run: async (api, event, commands, config) => {
    const args = event.body.split(" ").slice(1);
    const action = args.shift()?.toLowerCase();

    if (!action) {
      api.sendMessage("حدد الاجراء المطلوب.", event.threadID, event.messageID);
      return;
    }

    if (action === "اضف") {
      const [trigger, response] = args.join(" ").split("|").map(t => t.trim());
      if (!trigger || !response) {
        api.sendMessage("الصيغة الصحيحة: ردود اضف نص الرسالة | الرد", event.threadID, event.messageID);
        return;
      }
      await addReply(trigger, response);
      api.sendMessage(`✅ تم إضافة الرد: "${trigger}" => "${response}"`, event.threadID, event.messageID);
    } else if (action === "حذف") {
      const trigger = args.join(" ").trim();
      if (!trigger) {
        api.sendMessage("❌ الصيغة الصحيحة: ردود حذف نص الرسالة", event.threadID, event.messageID);
        return;
      }
      try {
        await removeReply(trigger);
        api.sendMessage(`✅ تم حذف الرد: "${trigger}"`, event.threadID, event.messageID);
      } catch (err) {
        api.sendMessage(err.message, event.threadID, event.messageID);
      }
    } else if (action === "قائمة") {
      const replies = await getAllReplies();
      if (!replies.length) {
        api.sendMessage("⚠️ لا توجد ردود محفوظة", event.threadID, event.messageID);
        return;
      }
      const list = replies.map(r => `${r.trigger} => ${r.response}`).join("\n");
      api.sendMessage(`📜 الردود المحفوظة:\n${list}`, event.threadID, event.messageID );
    } else {
      api.sendMessage("خيار غير معروف.", event.threadI, event.messageID );
    }
  }
};
