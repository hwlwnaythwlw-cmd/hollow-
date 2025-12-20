const { getUser, saveUser } = require('../data/user');

module.exports = {
  name: 'تسجيل',
  run: async (api, event, { args }) => {
    const senderId = event.senderID;
    const name = args.join(' ');

    if (!name) return api.sendMessage('❗ اكتب اسمك بعد الأمر. مثال: .تسجيل لوفي', event.threadID);

    const user = await getUser(senderId);
    if (user) return api.sendMessage(`⚠️ أنت مسجل بالفعل باسم [ ${user.character.name} ]`, event.threadID);

    const newUser = {
      id: senderId,
      money: 500,
      qi: 50,
      activeTitle: "مستكشف",
      character: {
        name: name,
        level: 1,
        HP: 100, maxHP: 100,
        ATK: 100, DEF: 100,
        img: "https://i.imgur.com/8P6Z2Xm.png"
      }
    };

    await saveUser(newUser);
    api.sendMessage(`✅ تم تسجيلك بنجاح يا [ ${name} ]!`, event.threadID);
  }
};

