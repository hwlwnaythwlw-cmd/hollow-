const { getUser, updateUser } = require('../data/user')

module.exports = {
  name: 'بدل',
  otherName: ['غير', 'تبديل'],
  version: '1.0.1',
  updatedAt: '2025/10/28',
  usageCount: 0,
  info: 'تحول القروش الي كرستالات',
  usage: '',
  run: async (api, event) => {
    const user = await getUser(event.senderID)
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
    
    const args = event.body.split(' ').slice(1);
    const money = parseInt(args[0])
    
    if (!money || isNaN(money)) {
      return api.sendMessage(
        `حدد مبلغ يا دنقل 🤦🏿‍♂️.`,
        event.threadID,
        event.messageID
      )
    }
    
    if (user.money <= 0) {
      return api.sendMessage(
        `م تفضحنا انت قروش معندك 🤦🏿‍♂️.`,
        event.threadID,
        event.messageID
      )
    }
    
    if (money > user.money) {
      return api.sendMessage(
        `قروشك ناقصة
       راجع حساباتك`,
        event.threadID,
        event.messageID
      )
    }
    
    if (money < 100) {
      return api.sendMessage(
        `اقل مبلغ ممكن تحويله هو 100 جنيه.`,
        event.threadID,
        event.messageID
      )
    }
    
    // نظام التحويل: كل 100 جنيه = 1 كرستالة
    const crystalsToAdd = Math.floor(money / 100)
    const usedMoney = crystalsToAdd * 100
    
    if (crystalsToAdd <= 0) {
      return api.sendMessage(
        `مافي كرستالات تتحول بي المبلغ دا 🤦🏿‍♂️.`,
        event.threadID,
        event.messageID
      )
    }
    
    user.money -= usedMoney
    user.crystals += crystalsToAdd
    await updateUser(user.id, user)
    
    api.sendMessage(
      `نجاح ✅️
      معاك حاليا ${user.money} جنيه.
      ${user.crystals} كرستالة.`,
      event.threadID,
      event.messageID
    )
  }
}
