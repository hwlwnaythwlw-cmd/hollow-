const { User } = require('../data/user');

module.exports = {
  name: 'تصفير_الكل',
  rank: 2,
  run: async (api, event) => {
    const adminID = "61550124399416";
    if (event.senderID !== adminID) return api.sendMessage("❌ أمر للمطور فقط!", event.threadID);

    try {
      await User.deleteMany({});
      api.sendMessage("🗑️ تم مسح جميع المستخدمين من قاعدة البيانات بنجاح!", event.threadID);
    } catch (e) {
      api.sendMessage("❌ فشل المسح: " + e.message, event.threadID);
    }
  }
};

