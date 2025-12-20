const login = require("ws3-fca").default || require("ws3-fca").login || require("ws3-fca");
const fs = require("fs");
const mongoose = require("mongoose");
const handleCommand = require("./core/handler");

// إعداد الرابط التجريبي (MongoDB)
const mongoURI = "mongodb+srv://testUser:testPass123@cluster0.free.mongodb.net/myGameDB?retryWrites=true&w=majority";

// الاتصال بقاعدة البيانات
mongoose.connect(mongoURI)
    .then(() => console.log("✅ [DATABASE] تم الاتصال بالسحابة بنجاح!"))
    .catch(err => console.error("❌ [DATABASE] فشل الاتصال:", err));

global.client = {
    commands: new Map(),
    handler: { reply: [] }
};

// تحميل الأوامر من مجلد cmd
const commandFiles = fs.readdirSync('./cmd').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./cmd/${file}`);
    global.client.commands.set(command.name, command);
}

// قراءة appstate
if (!fs.existsSync('./appstate.json')) {
    console.error("❌ ملف appstate.json غير موجود!");
    process.exit(1);
}
const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

// بدء الجلسة
login({ appState }, (err, api) => {
    if (err) return console.error("❌ خطأ في الدخول:", err);

    api.setOptions({ listenEvents: true, selfListen: false });

    api.listenMqtt(async (err, event) => {
        if (err) return;

        // تشغيل الهاندلر (السطر المصلح)
        try {
            await handleCommand(api, event);
        } catch (e) {
            console.error("🔥 خطأ في تنفيذ الهاندلر:", e);
        }

        // نظام الردود (القصة)
        if (event.type === "message_reply") {
            const replyObj = global.client.handler.reply.find(r => r.messageID === event.messageReply.messageID);
            if (replyObj) {
                const cmd = global.client.commands.get(replyObj.name);
                if (cmd && cmd.onReply) {
                    const { getUser } = require("./data/user");
                    let userData = await getUser(event.senderID);
                    cmd.onReply({ api, event, Reply: replyObj, userData });
                }
            }
        }
    });
});

