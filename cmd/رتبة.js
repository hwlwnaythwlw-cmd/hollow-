const { getUser, updateUser } = require('../data/user')

module.exports = {
  name: 'رتبة',
  version: '1.0.1',
  rank: 2,
  info: 'ارفع رتبة الزول',
  usage: '',
  usageCount: 0,
  updatedAt: '2025/10/28',
  run: async (api, event) => {
    const senderId = event.senderID 
    const user = await getUser(senderId)

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

    if (user.id !== '61550124399416') {
      return api.sendMessage('🚫 | ما بتقدر ترفع زول يا عمك.', event.threadID, event.messageID)
    }

    const args = event.body.split(' ').slice(1)
    const newAdmin = args[0]
    const newRank = parseInt(args[1])

    if (!newAdmin || isNaN(newRank)) {
      return api.sendMessage('⚠️ | حدد الآيدي ثم الرتبة الجديدة (مثال: رتبة 123456789 5).', event.threadID, event.messageID)
    }

    if (newRank < 0 || newRank > 10) {
      return api.sendMessage('⚠️ | الرتبة لازم تكون رقم بين 0 و10.', event.threadID, event.messageID)
    }

    let newAdminAcc = await getUser(newAdmin)
    if (!newAdminAcc) {
      return api.sendMessage('❌ | دا زول ساي، ما عندو حساب.', event.threadID, event.messageID)
    }

    newAdminAcc.rank = newRank
    await updateUser(newAdminAcc.id, newAdminAcc)

    api.sendMessage(
      `✅ | تمت ترقية ${newAdminAcc.name || newAdminAcc.id} إلى رتبة ${newRank}.`,
      event.threadID,
      event.messageID
    )
  }
}
