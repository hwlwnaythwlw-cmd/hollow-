const { User } = require("../data/user");

module.exports = {
    name: "فرمطة",
    otherName: ["تصفير", "reset"],
    run: async (api, event) => {
        const { threadID, senderID } = event;

        try {
            // حذف بيانات المستخدم نهائياً من MongoDB
            await User.deleteOne({ id: senderID.toString() });

            api.sendMessage("⚠️ تم تصفير حسابك بالكامل وإعادة بياناتك للوضع الافتراضي.", threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage("❌ فشل تنفيذ عملية الفرمطة.", threadID);
        }
    }
};

