// cmd/رهان.js
const { getUser, updateUser } = require('../data/user');
const log = require('../logger');

module.exports = {
  name: 'رهان',
  otherName: ['bet'],
  info: 'راهن بمبلغ',
  usage: 'رهان [المبلغ]',
  usageCount: 0,
  rank: 0,
  updatedAt: '2025/10/28',
  version: '1.0.1',
  run: async (api, event) => {
    try {
      const args = event.body.trim().split(/\s+/).slice(1);
      const betStr = args[0];
      const MIN_BET = 10; // الحد الأدنى
      
      if (!betStr) {
        return api.sendMessage(`اكتب معاهو رقم يا باطل 🦧.`, event.threadID, event.messageID);
      }
      
      const bet = Math.floor(Number(betStr));
      if (!bet || bet <= 0) {
        return api.sendMessage(`دا رقم جديد ولا شنو 🦧.`, event.threadID, event.messageID);
      }
      
      if (bet < MIN_BET) {
        return api.sendMessage(`اقل مبلغ ${MIN_BET} جنيه.`, event.threadID, event.messageID);
      }
      
      const user = await getUser(event.senderID);
      if (!user) {
        return api.sendMessage('⚠️ ما عندك حساب. استخدم "سجلني" أولاً.', event.threadID, event.messageID);
      }
      
      const balance = Number(user.money) || 0;
      if (balance < bet) {
        return api.sendMessage(`راجع قروشك يا باطل 🦧.`, event.threadID, event.messageID);
      }
      
      // 🎲 الرهان عشوائي بالكامل
      // نحدد احتمالية فوز من 20% إلى 60% عشوائياً
      const randomChance = Math.floor(Math.random() * 41) + 20; // 20 - 60%
      const roll = Math.random() * 100;
      const win = roll < randomChance;
      
      // مضاعف عشوائي بين 1.2x و 2.5x (لو فاز)
      const multiplier = Math.round((1.2 + Math.random() * 1.3) * 100) / 100;
      
      let newBalance;
      let profit = 0;
      
      if (win) {
        const payout = Math.floor(bet * multiplier);
        profit = payout - bet;
        newBalance = balance + profit;
      } else {
        newBalance = balance - bet;
      }
      
      if (newBalance < 0) newBalance = 0;
      
      await updateUser(user.id, { money: newBalance });
      
      const lines = [];
      lines.push(win ? 'ظووط ربحت بالرهان' : 'خخخخ خسرت الرهان.');
      lines.push(`- المبلغ: ${bet} جنيه`);
      lines.push(`- نسبة الحظ: ${randomChance}%`);
      if (win) {
        lines.push(`- المضاعف: ×${multiplier}`);
        lines.push(`- ربحك الصافي: +${profit} جنيه`);
      } else {
        lines.push(`- خسارتك: -${bet} جنيه`);
      }
      lines.push(`- رصيدك الحالي: ${newBalance} جنيه`);
      
      api.sendMessage(lines.join('\n'), event.threadID, event.messageID);
    } catch (err) {
      log.error('Error in رهان command: ' + err);
      api.sendMessage('⚠️ حدث خطأ أثناء تنفيذ أمر الرهان.', event.threadID, event.messageID);
    }
  }
};
