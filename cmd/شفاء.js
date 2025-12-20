const { getUser, updateUser } = require('../data/user');

module.exports = {
  name: 'ايدوتينسي',
  otherName: ['يدوتينسي', 'heal', 'شفاء'],
  version: '1.1.0',
  usage: 'يعيد كل القيم الأساسية إلى الحد الأقصى مقابل 20 كرستالة',
  info: 'يعيد HP، ATK، DEF، SPEED وكل القيم إلى أقصى حد X الخاص بها',
  rank: 0,
  usageCount: 0,
  run: async (api, event) => {
    try {
      const senderId = event.senderID;
      const user = await getUser(senderId);

      if (!user || !user.character) {
        return api.sendMessage('معندك شخصية، اكتب انشاء أولاً.', event.threadID, event.messageID);
      }

      const cost = 20;

      if (user.crystals < cost) {
        return api.sendMessage(`ما عندك كفاية كرستالات! تحتاج ${cost} كرستالة.`, event.threadID, event.messageID);
      }

      // خصم الكرستالات
      user.crystals -= cost;

      // استعادة كل القيم إلى حدها الأقصى
      if (typeof user.character.XHP === 'number') user.character.HP = user.character.XHP;
      if (typeof user.character.XATK === 'number') user.character.ATK = user.character.XATK;
      if (typeof user.character.XDEF === 'number') user.character.DEF = user.character.XDEF;
      if (typeof user.character.XSPEED === 'number') user.character.SPEED = user.character.XSPEED;

      await updateUser(senderId, user);

      api.sendMessage(
        `شدو لباساتكم! ${user.character.name} استعاد كل قدراته إلى الحد الأقصى.`,
        event.threadID,
        event.messageID
      );

    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء تنفيذ الأمر.', event.threadID, event.messageID);
    }
  }
};
