const { getUser, updateUser, getAllUsers } = require('../data/user');
const log = require('../logger');

module.exports = {
  name: 'شفشفة',
  otherName: ['steal', 'سرقة'],
  info: 'تشفشف ليك زول عشوائي',
  usage: 'شفشفة',
  usageCount: 0,
  rank: 2,
  updatedAt: '2025/10/27',
  
  run: async (api, event) => {
    try {
      const senderID = event.senderID;
      
      const sender = await getUser(senderID);
      if (!sender) return api.sendMessage('معندك حساب يا حبيب ماما', event.threadID, event.messageID);
      
      let users = await getAllUsers();
      users = users.filter(u => u.id && u.id !== senderID && Number(u.money) > 0);
      if (users.length === 0) return api.sendMessage('ياخ اكسر الحنك كلهم مفلسين زيك.', event.threadID, event.messageID);
      
      const target = users[Math.floor(Math.random() * users.length)];
      const targetMoney = Number(target.money) || 0;
      
      let amount = 1;
      if (targetMoney <= 50) {
        amount = Math.max(1, Math.floor(Math.random() * targetMoney));
      } else {
        const pct = Math.random() * (0.20 - 0.05) + 0.05;
        amount = Math.floor(targetMoney * pct);
        if (amount < 10) amount = 10;
        if (amount > 200) amount = 200;
      }
      if (amount > targetMoney) amount = targetMoney;
      
      const newTargetMoney = Math.max(0, targetMoney - amount);
      const newSenderMoney = (Number(sender.money) || 0) + amount;
      
      await updateUser(target.id, { money: newTargetMoney });
      await updateUser(senderID, { money: newSenderMoney });
      
      let targetName = target.character?.name || 'الزول';
      
      const funnyMessages = [
        `صم ${targetName} ما حس بيك وانت سرقت ${amount}`,
        `ركززز  ${amount} جنيه من ${targetName}`,
        `حنكت ${targetName}  (${amount} جنيه)`,
        `شفشفت ${amount} من 
        ${targetName}`,
        `وقع من الصدمة${targetName} وانت غنجت ب ${amount}`
      ];
      const randomIndex = Math.floor(Math.random() * funnyMessages.length);
      const replyMsg = `${funnyMessages[randomIndex]}\n\n◈ رصيدك الآن: ${newSenderMoney} جنيه\n◈ رصيد الضحية الآن: ${newTargetMoney} جنيه`;
      
      api.sendMessage(replyMsg, event.threadID, event.messageID);
      
    } catch (err) {
      log.error('Error in شفشفة command: ' + err);
      api.sendMessage('⚠️ حدث خطأ أثناء تنفيذ شفشفة.', event.threadID, event.messageID);
    }
  }
};
