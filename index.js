const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { login } = require("ws3-fca");
const { handleCommand } = require("./core/handler");
const { handleAutoReplies } = require("./core/autoReplies");
const handleJoin = require('./core/join')
const connectDB = require("./data/db");
const log = require("./logger");
const config = require("./main.json");

// متغير عالمي لحالة الكسوف
global.isEclipse = false;

// ربط قاعدة البيانات
connectDB();

// تحميل الأوامر
const commands = [];
const cmdFiles = fs.readdirSync(path.join(__dirname, "cmd")).filter(f => f.endsWith(".js"));
for (const file of cmdFiles) {
  const cmd = require(`./cmd/${file}`);
  commands.push(cmd);
}
log.system(`✅ Loaded ${commands.length} commands.`);

// --- نظام الكسوف العظيم الآلي ---
function runEclipseSystem(api) {
  const ECLIPSE_INTERVAL = 4 * 60 * 60 * 1000; // كل 4 ساعات
  const ECLIPSE_DURATION = 30 * 60 * 1000;    // مدته 30 دقيقة

  setInterval(() => {
    global.isEclipse = true;
    log.system("🌑 حدث الكسوف العظيم بدأ الآن!");
    
    const startMsg = `🌑 【 الكسوف العظيم بدأ 】 🌑\n──────────────────\n⚠️ تحذير: الطاقة المظلمة تملأ الأرجاء!\n👹 الوحوش أصبحت أقوى (x2) لكن الغنائم أسطورية!\n⏳ ينتهي الحدث بعد 30 دقيقة.`;
    
    // إرسال التنبيه للمجموعات النشطة (اختياري: يمكنك تحديد ID معين)
    // api.sendMessage(startMsg, "Thread_ID_Here"); 

    setTimeout(() => {
      global.isEclipse = false;
      log.system("☀️ انقشع الكسوف العظيم.");
      // api.sendMessage("☀️ انقشع الكسوف وعادت الشمس للإشراق..", "Thread_ID_Here");
    }, ECLIPSE_DURATION);

  }, ECLIPSE_INTERVAL);
}

// تسجيل الدخول
const APPSTATE_PATH = "./appstate.json";
const EMAIL = "اكتب بريدك";
const PASSWORD = "كلمة السر";
let options = fs.existsSync(APPSTATE_PATH) ? { appState: require(APPSTATE_PATH) } : { email: EMAIL, password: PASSWORD };

login(options, (err, api) => {
  if (err) return log.error("❌ Login error:", err);
  
  api.setOptions({
    listenEvents: true,
    selfListen: false,
    autoMarkRead: true
  });
  
  log.system(`🤖 ${config.botName} is running with prefix "${config.prefix}"`);
  
  // تشغيل نظام الكسوف بعد تسجيل الدخول بنجاح
  runEclipseSystem(api);
  
  api.listenMqtt(async (err, event) => {
    if (err) return log.error(err);
    if (!event) return;
    
    switch (event.type) {
      case "message":
      case "message_reply":
        await handleCommand(api, event, commands, config);
        await handleAutoReplies(api, event);
        break;
        
      case "event":
        handleJoin(api, event)
        break;
        
      default:
        break;
    }
  });
});

