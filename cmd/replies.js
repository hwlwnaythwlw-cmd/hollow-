const fs = require('fs');
const path = './data/replies.json';

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

module.exports = {
  name: 'ردود',
  rank: 1, // للمشرفين والمطور
  run: async (api, event, { args }) => {
    const action = args[0];
    let data = JSON.parse(fs.readFileSync(path));

    if (action === 'أضف') {
      const content = args.slice(1).join(" ").split("/");
      if (content.length < 2) return api.sendMessage("⚠️ الاستخدام: .ردود أضف الكلمة/الرد", event.threadID);
      data[content[0].trim()] = content[1].trim();
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ تم إضافة الرد: ${content[0]} -> ${content[1]}`, event.threadID);
    }

    if (action === 'حذف') {
      const key = args.slice(1).join(" ");
      if (!data[key]) return api.sendMessage("❌ هذا الرد غير موجود.", event.threadID);
      delete data[key];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage(`🗑️ تم حذف الرد الخاص بـ: ${key}`, event.threadID);
    }
    
    api.sendMessage("❓ استخدم: .ردود (أضف/حذف)", event.threadID);
  }
};

