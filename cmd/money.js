const { getUser, updateUser, getAllUsers } = require('../data/user');

module.exports = {
  name: 'هاك',
  otherName: ['شيل', 'كرامة'],
  version: '1.0.0',
  usageCount: 0,
  rank: 2, // أمر للأدمن فقط
  info: 'توزع قروش أو تحولها لشخص محدد',
  usage: 'هاك [ايدي أو "الكل"] [المبلغ]',
  updatedAt: '2025/10/27',
  
  run: async (api, event ) => {
    try {
      const senderID = event.senderID;
      const user = await getUser(senderID);
      
      // 🧱 تحقق من أن المستخدم عنده حساب
      if (!user) {
     return api.sendMessage(
       `⚠ | معندك حساب.
       ⚠ | ليس لديك حساب.
       ⚠ | You don't have an account.
       ⚠ | Vous n'avez pas de compte.
       ⚠ | ينغ يونغ ياينغ شينغ.`,
       event.threadID,
       event.messageID 
     )
   }      
      // 🔒 تحقق من أنه أدمن فعلاً
      if (user.rank !== '2' || senderID !== '61550124399416') {
        api.sendMessage('🚫 ناقصك رجولة، ما بتقدر تستخدم الأمر دا.', event.threadID, event.messageID);
        return;
      }
      
      // 🧩 تحليل الرسالة
      const args = event.body.split(' ').slice(1);
      const person = args[0];
      const money = parseInt(args[1]);
      
      if (!person || isNaN(money)) {
        api.sendMessage('⚠️ الصيغة الصحيحة: هاك [ايدي أو "الكل"] [المبلغ]', event.threadID, event.messageID);
        return;
      }
      
      // 💸 تحويل جماعي
      if (person === 'الكل') {
        const users = await getAllUsers();
        let count = 0;
        
        for (const u of users) {
          u.money = (u.money || 0) + money;
          await updateUser(u.id, { money: u.money });
          count++;
        }
        
        api.sendMessage(`✅ تم تحويل مبلغ ${money} لعدد ${count} مستخدم.`, event.threadID, event.messageID);
        return;
      }
      
      // 💰 تحويل لمستخدم واحد
      const target = await getUser(person);
      if (!target) {
        api.sendMessage('❌ المستخدم غير موجود في قاعدة البيانات.', event.threadID, event.messageID);
        return;
      }
      
      const newMoney = (target.money || 0) + money;
      await updateUser(person, { money: newMoney });
      
      api.sendMessage(
        `حولت مبلغ ${money} ل ${user.character.name || `للزول`}`,
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.error('❌ خطأ في أمر هاك:', err);
      api.sendMessage('⚠️ حدث خطأ أثناء تنفيذ الأمر.', event.threadID, event.messageID);
    }
  }
};
