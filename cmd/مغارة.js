const { getUser, updateUser } = require('../data/user');

let currentBoss = null;
let participants = new Set();

module.exports = {
  name: 'مغارة',
  otherName: ['dungeon', 'raid'],
  version: '2.1.0',
  usageCount: 0,
  info: 'الهجوم على الوحش داخل المغارة مع خصائص كاملة لكل من الوحش واللاعبين',
  
  run: async (api, event) => {
    try {
      const senderId = event.senderID;
      const args = event.body.split(' ').slice(1);
      const action = args[0]?.toLowerCase();
      const skillName = args.slice(1).join(' ').trim();
      
      if (!action) {
        return api.sendMessage(
          `الخيارات المتاحة:\n- مغارة انشاء\n- مغارة هجوم [اسم المهارة]`,
          event.threadID,
          event.messageID
        );
      }
      
      if (action === 'انشاء') {
        if (currentBoss) {
          return api.sendMessage(
            `يوجد وحش بالفعل: ${currentBoss.name} (HP: ${currentBoss.HP}/${currentBoss.XHP})`,
            event.threadID,
            event.messageID
          );
        }
        
        currentBoss = {
          name: 'الكترةن',
          HP: 3000,
          XHP: 3000,
          DEF: 1500,
          SPD: 1500,
          skills: [
            { name: 'قوة الدفاع', effect: 'increaseDEF', amount: 20 },
            { name: 'سرعة الوحش', effect: 'increaseSPD', amount: 10 }
          ]
        };
        participants.clear();
        return api.sendMessage(
          `تم إنشاء الوحش ${currentBoss.name} (HP: ${currentBoss.HP})`,
          event.threadID,
          event.messageID
        );
      }
      
      if (action === 'هجوم') {
        if (!currentBoss) {
          return api.sendMessage(
            `لا يوجد وحش الآن. أنشئ وحش أولاً باستخدام: مغارة انشاء`,
            event.threadID,
            event.messageID
          );
        }
        
        const user = await getUser(senderId);
        if (!user || !user.character) {
          return api.sendMessage(
            'معندك شخصية، اكتب انشاء أولاً.',
            event.threadID,
            event.messageID
          );
        }
        
        participants.add(senderId);
        
        let baseDamage = Math.floor(user.character.ATK * 0.3 + Math.random() * 20);
        let skillUsed = null;
        
        if (skillName && Array.isArray(user.character.skills)) {
          skillUsed = user.character.skills.find(sk => sk.name?.toLowerCase() === skillName.toLowerCase());
          if (skillUsed && skillUsed.dmg) {
            const minDmg = skillUsed.dmg.min;
            const maxDmg = skillUsed.dmg.max;
            baseDamage = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
            
            // تحقق من التأثيرات الخاصة للمهارات
            if (skillUsed.effect === 'reduceDEF') {
              currentBoss.DEF -= skillUsed.amount || 20;
              if (currentBoss.DEF < 0) currentBoss.DEF = 0;
            } else if (skillUsed.effect === 'reduceSPD') {
              currentBoss.SPD -= skillUsed.amount || 10;
              if (currentBoss.SPD < 0) currentBoss.SPD = 0;
            } else if (skillUsed.effect === 'stealSkill') {
              if (Array.isArray(currentBoss.skills) && currentBoss.skills.length > 0) {
                const stolen = currentBoss.skills.pop();
                if (!Array.isArray(user.character.skills)) user.character.skills = [];
                user.character.skills.push(stolen);
              }
            } else if (skillUsed.effect === 'doubleDamage') {
              baseDamage *= 2;
            }
          } else if (skillUsed) {
            baseDamage = Math.floor(user.character.ATK * 0.5 + Math.random() * 10);
          } else {
            return api.sendMessage(`معندك مهارة باسم "${skillName}".`, event.threadID, event.messageID);
          }
        }
        
        // حساب الضرر النهائي مع DEF وSPD الوحش
        let multiplier = 1 + (user.character.SPEED > currentBoss.SPD ? 0.05 : -0.05);
        multiplier += (user.character.ATK > currentBoss.DEF ? 0.05 : -0.05);
        multiplier = Math.min(Math.max(multiplier, 0.2), 2);
        
        let totalDamage = Math.floor(baseDamage * multiplier);
        totalDamage = Math.max(totalDamage - currentBoss.DEF * 0.1, 0);
        
        currentBoss.HP -= totalDamage;
        if (currentBoss.HP < 0) currentBoss.HP = 0;
        
        let message = `${user.character.name} هاجم الوحش ${currentBoss.name}${skillUsed ? ` باستخدام مهارة "${skillUsed.name}"` : ''}.\nالضرر: ${totalDamage}\nHP الوحش المتبقي: ${currentBoss.HP}\nDEF: ${currentBoss.DEF}, SPD: ${currentBoss.SPD}`;
        
        // إذا تم القضاء على الوحش
        if (currentBoss.HP <= 0) {
          message += `\n\nتم القضاء على الوحش! سيتم توزيع المكافآت على المشاركين.`;
          
          for (let pid of participants) {
            const p = await getUser(pid);
            if (!p) continue;
            
            // مكافأة كرستالات عشوائية
            const crystalsReward = Math.floor(Math.random() * 50) + 10;
            p.crystals = (p.crystals || 0) + crystalsReward;
            
            // فرصة نادرة لاكتساب مهارة فعلية
            if (Math.random() < 0.15) {
              const possibleSkills = [
                { name: 'قبضة البعبع', dmg: { min: 50, max: 120 }, effect: 'doubleDamage', description: 'تضاعف الضرر مرة واحدة.' },
                { name: 'شينغكك', dmg: { min: 0, max: 0 }, effect: 'reduceDEF', amount: 20, description: 'تقلل دفاع الوحش 20 نقطة.' },
                { name: 'طلقة', dmg: { min: 0, max: 0 }, effect: 'reduceSPD', amount: 15, description: 'تقلل سرعة الوحش 15 نقطة.' },
  
                { name: 'تعزيز', dmg: { min: 30, max: 80 }, effect: 'increaseATK', description: 'يزيد الهجوم مؤقتًا.' },
                { name: 'صخر', dmg: { min: 20, max: 60 }, effect: 'increaseDEF', description: 'يزيد الدفاع مؤقتًا.' },
                { name: 'ضربة سريعة', dmg: { min: 20, max: 100 }, effect: 'increaseSPD', description: 'يزيد السرعة مؤقتًا.' }
              ];
              
              const newSkill = possibleSkills[Math.floor(Math.random() * possibleSkills.length)];
              if (!Array.isArray(p.character.skills)) p.character.skills = [];
              p.character.skills.push(newSkill);
              
              message += `\n${p.character.name} حصل على مهارة نادرة: ${newSkill.name} - ${newSkill.text}`;
            }
            
            await updateUser(pid, p); // تحديث بيانات كل مشارك
          }
          
          currentBoss = null;
          participants.clear();
        }
        
        await updateUser(senderId, user);
        
        return api.sendMessage(message, event.threadID, event.messageID);
      }
      
      return api.sendMessage('اختر خيارًا صحيحًا: انشاء أو هجوم', event.threadID, event.messageID);
      
    } catch (error) {
      console.error(error);
      api.sendMessage('حدث خطأ أثناء تنفيذ الأمر.', event.threadID, event.messageID);
    }
  }
};
