const { getUser, updateUser } = require('../data/user')
module.exports = {
  name: 'بنكك',
  otherName: ['تحويل', 'حول'],
  version: '1.0.0',
  usageCount: 0,
  updatedAt: '2025/10/28',
  rank: 0,
  run : async (api, event) => {
    const user = await getUser(event.senderID)
    if (!user) {
      return api.sendMessage(
        `يا صم اعمل ليك حساب 🗿.`,
        event.threadID,
        event.messageID
      )
    }
    const args = event.body.split(' ').slice(1);
    const money = parseInt(args[0])
    if (!event.messageReply || !event.messageReply.senderID) {
      return api.sendMessage(`رد علي زول يا باطل.`, event.threadID, event.messageID)
    }
    const personId = event.messageReply.senderID
    const person = await getUser(personId)
    if (!person) {
      return api.sendMessage(
        'دا كائن ساي 🗿',
        event.threadID,
        event.messageID
      )
    }
    if (!money || isNaN(money)) {
      return api.sendMessage(
        'صيغة المبلغ غلط 🗿.',
        event.threadID,
        event.messageID
      )
    }
    if (user.money < money ) {
      return api.sendMessage(
        `قروشك كلها ${user.money} داير تجيب ${money} من طيبة قلبك يعني.`,
        event.threadID,
        event.messageID
      )
    }
    user.money -= money
    person.money += money
    updateUser(user.id, user)
    updateUser(person.id, person)
    api.sendMessage(
      `𝙏𝙧𝙖𝙣𝙨𝙛𝙚𝙧𝙧𝙚𝙙 ${money} 𝙥𝙤𝙪𝙣𝙙𝙨.
𝙔𝙤𝙪 𝙝𝙖𝙫𝙚 ${user.money}  𝙥𝙤𝙪𝙣𝙙𝙨 𝙡𝙚𝙛𝙩.`,
      event.threadID,
      event.messageID
    )
    
  }
}
