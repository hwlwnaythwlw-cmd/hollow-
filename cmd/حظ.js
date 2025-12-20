
const { getUser, updateUser } = require('../data/user');
const log = require('../logger');

module.exports = {
  name: 'حظ',
  updatedAt: '2024/7/20',
  version: "6.2.2",
  otherName: ['luck', 'wheel'],
  usageCount: 0,
  info: 'لعبة عجلة الحظ المثيرة',
  rank: 0,
  run: async function(api, event) {
    const emojis = ['🥒', '🍒', '🍑', '🍓', '🍋'];
    const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const generateRandomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];
    const generateLuckPercentage = () => Math.floor(Math.random() * 101);
    
    try {
      const user = await getUser(event.senderID);
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
      user.money = Number(user.money) || 0;
      
      if (user.money < 100) {
        api.sendMessage('⚠️ | معندك قروش كفاية محتاج اقل شي 100 جنيه', event.threadID, event.messageID);
        return;
      }
      
      // توليد ثلاثة رموز عشوائية
      const emoji1 = generateRandomEmoji();
      const emoji2 = generateRandomEmoji();
      const emoji3 = generateRandomEmoji();
      const luckPercentage = generateLuckPercentage();
      
      let message = `| ${emoji1} | ${emoji2} | ${emoji3} |\n▬▬▬▬▬▬▬▬▬▬▬▬\n`;
      
      if (emoji1 === emoji2 && emoji2 === emoji3) {
        // المستخدم فائز كبير
        const prizeAmount = getRandomAmount(1000, 2000);
        user.money += prizeAmount;
        message += `ظوط ربحت الجائزة الكبيرة${prizeAmount} جنيه\n`;
      } else if ((emoji1 === emoji2 || emoji2 === emoji3 || emoji3 === emoji1)) {
        // المستخدم فائز بجائزة متوسطة
        const prizeAmount = getRandomAmount(100, 500);
        user.money += prizeAmount;
        message += `مبروك! ربحت ${prizeAmount} جنيه\n`;
      } else {
        // المستخدم خاسر
        const lossAmount = getRandomAmount(50, 100);
        user.money -= lossAmount;
        message += `خخخ خسرت ${lossAmount} جنيه\n`;
      }
      
      const randomChance = Math.random();
      if (randomChance < 0.05) {
        const bonusPrize = 1000;
        user.money += bonusPrize;
        message += `ظوط لقيت  ${bonusPrize} واقعة \n`;
      } else if (randomChance < 0.10) {
        const hugeLoss = getRandomAmount(100, 500);
        user.money -= hugeLoss;
        message += `خخخخخخ وانت ماشي في الشارع صادفت ستارك وسلم عليك وبعدين  ${hugeLoss} جنيه مافيشة\n`;
      } else if (randomChance < 0.15) {
        user.money *= 2;
        message += `ظوط قروشك اتضاعفت\n`;
      } else if (randomChance < 0.20) {
        user.money = 0;
        message += `خخخخ نيكول خسرتك قروشك كلها\n`;
      }
      
      message += `◈ قروشك حالياً: ${user.money} جنيه.`;
      
      await updateUser(event.senderID, { money: user.money });
      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      log.error(`Error in حظ command: ${error}`);
      api.sendMessage('حدث خطأ أثناء تنفيذ لعبة الحظ', event.threadID, event.messageID);
    }
  }
};
