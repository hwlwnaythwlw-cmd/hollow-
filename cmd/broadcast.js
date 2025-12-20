module.exports = {
    name: "نشر",
    run: async (api, event, { args, userRank }) => {
        if (userRank < 2) return api.sendMessage("🚫 هذا الأمر للمطور فقط.", event.threadID);
        
        const content = args.join(" ");
        if (!content) return api.sendMessage("⚠️ اكتب الرسالة التي تريد نشرها.", event.threadID);

        const list = await api.getThreadList(100, null, ["INBOX"]);
        let count = 0;

        list.forEach(thread => {
            if (thread.isGroup || thread.isSubscribed) {
                api.sendMessage(`📢 إعلان من المطور:\n\n${content}`, thread.threadID);
                count++;
            }
        });

        api.sendMessage(`✅ تم إرسال الرسالة إلى ${count} محادثة/مجموعة.`, event.threadID);
    }
};

