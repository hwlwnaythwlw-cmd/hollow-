module.exports = {
  name: 'بادئة',
  otherName: ['prefix', 'بادئه'],
  info: 'غير بادئة البوت',
  updatedAt: '2025/10/31',
  usageCount: 0,
  rank: 0,
  run : async (api, event, commands, config) => {
    const args = event.body.split(' ').slice(1);
    const newPrefix = args[0]
    if (!newPrefix) {
      config.prefix = ''
      api.sendMessage(
        'طيب ح اشتغل بدون بادئة 🚶🏿‍♂️.',
        event.threadID,
        event.messageID 
      )
      return
    }
    config.prefix = newPrefix
    api.sendMessage(
      `تم تعيين البادئة الي ${newPrefix}`,
      event.threadID,
      event.messageID 
    )
  }
}
