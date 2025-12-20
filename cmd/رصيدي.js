const { getUser } = require('../data/user');
const log = require('../logger');

module.exports = {
  name: "محفظة",
  updatedAt: '2024/7/20',
  otherName: ["رصيدي", "رصيد", "قروشي"],
  usage: 'رصيدي',
  version: '1.2.1',
  usageCount: 0,
  info: 'عرض رصيدك الحالي',
  rank: 0,
  run: async (api, event) => {
    
    const userID = event.senderID
    const user = await getUser(userID)
    if (!user) {
      api.sendMessage(`⚠️ | معندك حساب.`, event.threadID, event.messageID)
      return
      
    }
    if (user.money === 0) {
      api.sendMessage(`بنصحك بالسمبك ما ممكن مفلس في الواقع والمواقع`, event.threadID, event.messageID)
      return
    }
    api.sendMessage(`𝙔𝙤𝙪 𝙝𝙖𝙫𝙚 ${user.money} 𝙥𝙤𝙪𝙣𝙙𝙨
𝙔𝙤𝙪 𝙝𝙖𝙫𝙚 ${user.crystals} 𝙘𝙧𝙮𝙨𝙩𝙖𝙡𝙨`, event.threadID, event.messageID);
    
  }
};
