const { User } = require("../data/user");

module.exports = {
    name: "فرمطة_شاملة",
    run: async (api, event, { userRank }) => {
        // تأكد من أن الآيدي الخاص بك في الهاندلر هو نفسه 61550124399416
        if (userRank < 2) return api.sendMessage("🚫 للمطور فقط", event.threadID);

        try {
            await User.deleteMany({}); // مسح شامل
            api.sendMessage("✅ تم مسح قاعدة البيانات بالكامل. اطلب من الجميع التسجيل الآن.", event.threadID);
        } catch (e) {
            api.sendMessage(`❌ فشل: ${e.message}`, event.threadID);
        }
    }
};

