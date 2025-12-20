module.exports = {
    name: "اصلاح",
    rank: 2,
    run: async (api, event) => {
        api.sendMessage("🛠️ جاري إعادة هيكلة قاعدة البيانات وإصلاح الأسماء...", event.threadID);
        // كود برمجي يقوم بملء الحقول الناقصة بقيم افتراضية
        const { User } = require('../data/user');
        await User.updateMany({ "character.name": { $exists: false } }, { "character.name": "محارب مجهول" });
        api.sendMessage("✅ تم الإصلاح! كل اللاعبين لديهم أسماء الآن.", event.threadID);
    }
};

