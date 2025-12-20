// cmd/ترقية.js
const { getUser, updateUser } = require('../data/user');
// تأكد من أن ملف المهارات موجود في المسار الصحيح
//const skills = require('../data/skills'); 

module.exports = {
  name: 'ترقية',
  otherName: ['ترقيه', 'up'],
  version: '1.6.0',
  rank: 0,
  info: 'ترفع مستواك وتزيد من قدراتك باستخدام الكريستال والـ Qi.',
  
  run: async (api, event) => {
    try {
      const user = await getUser(event.senderID);
      
      if (!user) return api.sendMessage('⚠ | ليس لديك حساب، استخدم أمر التسجيل أولاً.', event.threadID, event.messageID);
      
      // تكلفة الترقية (تزداد مع كل مستوى)
      const crystalCost = 100;
      const qiRequired = (user.character.level || 1) * 20;

      if (user.crystals < crystalCost)
        return api.sendMessage(`❌ تحتاج ${crystalCost} كريستالة للترقية.`, event.threadID, event.messageID);
      
      if (user.qi < qiRequired)
        return api.sendMessage(`❌ طاقتك الروحية (Qi) غير كافية! تحتاج ${qiRequired} Qi للارتقاء.`, event.threadID, event.messageID);

      // دالة عشوائية للزيادات
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      
      // الزيادات العشوائية
      const hpBoost = rand(30, 60);
      const atkBoost = rand(10, 25);
      const defBoost = rand(10, 20);
      
      // تنفيذ التحديثات
      let updateData = {
        crystals: user.crystals - crystalCost,
        qi: user.qi - 10, // استهلاك بسيط للـ Qi عند الترقية
        "character.level": (user.character.level || 1) + 1,
        "character.maxHP": (user.character.maxHP || 100) + hpBoost,
        "character.HP": (user.character.maxHP || 100) + hpBoost, // استعادة كامل الصحة عند الترقية
        "character.ATK": (user.character.ATK || 10) + atkBoost,
        "character.DEF": (user.character.DEF || 10) + defBoost,
      };

      // 🔮 احتمال الحصول على مهارة جديدة (30%)
      let newSkill = null;
      if (Math.random() < 0.30) {
        const ownedSkills = user.character.skills || [];
        // اختيار مهارة لا يملكها اللاعب من القائمة العامة
        const availableSkills = skills.filter(s => !ownedSkills.includes(s));
        
        if (availableSkills.length > 0) {
          newSkill = availableSkills[rand(0, availableSkills.length - 1)];
          updateData["$push"] = { "character.skills": newSkill };
        }
      }

      // حفظ التحديث في قاعدة البيانات
      await updateUser(event.senderID, updateData);
      
      // رسالة النتيجة بتنسيق فخم
      let message = `✨ | **ارتقاء مستوى جديد** | ✨\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `🆙 المستوى الحالي: ${updateData["character.level"]}\n\n` +
                    `❤️ الصحة القصوى: +${hpBoost}\n` +
                    `⚔️ الهجوم: +${atkBoost}\n` +
                    `🛡️ الدفاع: +${defBoost}\n` +
                    `━━━━━━━━━━━━━━━\n`;
      
      if (newSkill) {
        message += `🔥 **مذهل! لقد تعلمت مهارة جديدة:**\n` +
                   `📜 [ ${newSkill} ]\n` +
                   `━━━━━━━━━━━━━━━\n`;
      } 
      
      message += `💎 الكريستالات المتبقية: ${updateData.crystals}`;
      
      api.sendMessage(message, event.threadID, event.messageID);
      
    } catch (error) {
      console.error('خطأ في أمر الترقية:', error);
      api.sendMessage('❌ حدث خطأ داخلي أثناء محاولة الترقية.', event.threadID);
    }
  }
};

