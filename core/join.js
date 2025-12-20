// core/join.js
const { getGroup, saveGroup, updateGroup } = require('../data/thread');
const log = require('../logger');

// دالة للحصول على معلومات المجموعة
async function fetchThreadInfo(api, threadID) {
  return new Promise((resolve, reject) => {
    api.getThreadInfo(threadID, (err, info) => {
      if (err) {
        log.error(`❌ فشل في جلب معلومات المجموعة (${threadID}): ${err}`);
        return reject(err);
      }
      resolve(info);
    });
  });
}

module.exports = async (api, event) => {
  const botID = api.getCurrentUserID();
  const addedUsers = event.logMessageData?.addedParticipants || [];

  // 🧠 تحقق إذا البوت نفسه انضم
  const addedUserIDs = addedUsers.map(u => u.userFbId);
  if (addedUserIDs.includes(botID)) {
    log.info(`🤖 تم إضافة البوت إلى المجموعة ${event.threadID}`);

    try {
      let groupData = await getGroup(event.threadID);

      // إن لم يكن موجودًا في القاعدة نحفظه
      if (!groupData) {
        const threadInfo = await fetchThreadInfo(api, event.threadID);

        const newGroup = {
          id: event.threadID,
          name: threadInfo?.name || 'بدون اسم',
          img: threadInfo?.imageSrc || null,
          messageCount: threadInfo?.messageCount || 0,
          members: threadInfo?.participantIDs || [],
          admins: threadInfo?.adminIDs || [],
          status: false
        };

        groupData = await saveGroup(newGroup);
        log.info(`✅ تم حفظ مجموعة جديدة: ${groupData.name} (${groupData.id})`);
      }

      const devID = '100083602650172';

      // إرسال معلومات المجموعة للمطور
      if (!groupData.status) {
        await api.sendMessage('ضيفو المطور يا حشات 🗿', event.threadID);

        const memberCount = groupData.members?.length || 0;
        await api.sendMessage(
          `📦 Group Info:
🧭 Name: ${groupData.name}
🆔 ID: ${groupData.id}
👥 Members: ${memberCount}`,
          devID
        );

        // محاولة إضافة المطور للمجموعة
        api.addUserToGroup(devID, event.threadID, err => {
          if (err) log.warn(`⚠️ فشل في إضافة المطور للمجموعة: ${err.message}`);
        });
      }
    } catch (err) {
      log.error(`❌ خطأ أثناء انضمام البوت: ${err}`);
    }

    return;
  }

  // 👥 عند انضمام أعضاء جدد
  try {
    const group = await getGroup(event.threadID);

    // تحديث بيانات الأعضاء في القاعدة
    if (group) {
      const newMembers = [...new Set([...group.members, ...addedUserIDs])];
      await updateGroup(group.id, { members: newMembers });
      log.info(`🔁 تم تحديث أعضاء المجموعة (${group.name})`);
    }

    // الترحيب بالأعضاء الجدد
    for (const user of addedUsers) {
      const userId = user.userFbId;
      const fallbackName = user.fullName || 'عضو جديد';

      api.getUserInfo(userId, async (err, info) => {
        if (err || !info || !info[userId]) {
          log.warn(`⚠️ فشل في جلب بيانات المستخدم ${userId}`);
          return api.sendMessage(`⚠️ انضم ${fallbackName} للمجموعة.`, event.threadID);
        }

        const userInfo = info[userId];
        const userName = userInfo.name || fallbackName;

        // رسالة الترحيب
        const message = {
          body: `✨ | مرحبًا بـ ${userName} في المجموعة 🌙`,
        };

        // محاولة إرسال صورة الملف الشخصي
        if (userInfo.profileUrl) {
          try {
            const imgUrl = userInfo.profileUrl;
            const https = require('https');
            https.get(imgUrl, res => {
              const chunks = [];
              res.on('data', d => chunks.push(d));
              res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                message.attachment = [buffer];
                api.sendMessage(message, event.threadID);
              });
            }).on('error', e => {
              log.warn(`⚠️ لم يتم تحميل صورة ${userName}: ${e.message}`);
              api.sendMessage(message, event.threadID);
            });
          } catch {
            api.sendMessage(message, event.threadID);
          }
        } else {
          api.sendMessage(message, event.threadID);
        }
      });
    }
  } catch (err) {
    log.error(`❌ خطأ أثناء الترحيب بالمستخدمين الجدد: ${err}`);
  }
};
