const charms = require('../data/charmsList');
const { getUser, updateUser } = require('../data/user');

module.exports = {
  name: "متجر",
  run: async (api, event, { userData }) => {
    let msg = "🏪 | **متجر الحروز الملكي** | 🏪\n━━━━━━━━━━━━━━━\n";
    charms.forEach(c => {
      msg += `🆔 ${c.id}. ${c.name}\n💰 السعر: ${c.cost}\n📜 ${c.desc}\n───────\n`;
    });
    msg += "\nللشراء اكتب: .شراء [الرقم]";
    api.sendMessage(msg, event.threadID);
  }
};

