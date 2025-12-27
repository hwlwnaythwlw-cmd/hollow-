module.exports = {
  name: "نشر",
  run: async (api, event, { args, userRank }) => {
    try {
      if (userRank < 2) return api.sendMessage("🚫 هذا الأمر للمطور فقط.", event.threadID);

      const content = args.join(" ");
      if (!content) return api.sendMessage("⚠️ اكتب الرسالة التي تريد نشرها.", event.threadID);

      const threads = await api.getThreadList(100, null, ["INBOX"]);
      const groupThreads = threads.filter(thread => thread.isGroup && thread.isSubscribed);

      if (groupThreads.length === 0) return api.sendMessage("⚠️ لا توجد مجموعات مشتركة لإرسال الرسالة إليها.", event.threadID);

      await Promise.all(groupThreads.map(thread => api.sendMessage(`📢 إعلان من المطور:\n\n${content}`, thread.threadID)));

      api.sendMessage(`✅ تم إرسال الرسالة إلى ${groupThreads.length} مجموعة.`, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("⚠️ حدث خطأ أثناء إرسال الرسالة.", event.threadID);
    }
  }
};
