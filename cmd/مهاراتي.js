const { getUser } = require('../data/user');

module.exports = {
  name: 'مهاراتي',
  otherName: ['مهارات', 'قدرات'],
  updatedAt: '2025/10/28',
  rank: 0,
  info: '',
  usage: '',
  usageCount: 0,
  version: '1.1.0',
  run: async (api, event) => {
    const senderId = event.senderID;
    const user = await getUser(senderId);
    
    // إذا ما عنده حساب
    if (!user) {
      return api.sendMessage(
        `⚠ | ليس لديك حساب.`,
        event.threadID,
        event.messageID
      );
    }

    // إذا ما عنده مهارات
    const skills = user.character?.skills;
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return api.sendMessage(
        `معندك مهارات حاليا.`,
        event.threadID,
        event.messageID
      );
    }

    // عرض المهارات
    const skillDetails = skills.map(sk => {
      const dmgMin = sk.dmg?.min ?? 0;
      const dmgMax = sk.dmg?.max ?? 0;
      const desc = sk.description || 'لا يوجد وصف';
      const eff = sk.effect || 'بدون تأثير';
      return `- ${sk.name} ┇ ضرر: ${dmgMin} ⚡︎ ${dmgMax} ┇ وصف: ${desc} ┇ تأثير: ${eff}\n════════════════`;
    }).join('\n');

    api.sendMessage(
      `مهاراتك المملوكة:\n${skillDetails}\n═════════════════`,
      event.threadID,
      event.messageID
    );
  }
};
