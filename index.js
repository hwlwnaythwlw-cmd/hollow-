const login = require("ws3-fca").default || require("ws3-fca").login || require("ws3-fca");
const fs = require("fs");
const mongoose = require("mongoose");
const { getUser, updateUser } = require("./data/user");

// رابط MongoDB الخاص بك
const mongoURI = "mongodb+srv://ahmedaltwm555_db_user:PaslZZmgX7VXRzlw@ber1.jn7kisv.mongodb.net/?appName=ber1";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ [DATABASE] متصل بسحابة MongoDB بنجاح!"))
    .catch(err => console.error("❌ [DATABASE] فشل الاتصال:", err));

global.client = {
    commands: new Map(),
    handler: { reply: [] }
};

// تحميل الأوامر من مجلد cmd
const commandFiles = fs.readdirSync('./cmd').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    try {
        const command = require(`./cmd/${file}`);
        global.client.commands.set(command.name, command);
    } catch (e) {
        console.error(`❌ فشل تحميل الأمر ${file}:`, e);
    }
}

if (!fs.existsSync('./appstate.json')) {
    console.error("❌ ملف appstate.json غير موجود!");
    process.exit(1);
}
const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

login({ appState }, (err, api) => {
    if (err) return console.error("❌ خطأ في الدخول:", err);

    api.setOptions({ listenEvents: true, selfListen: false });

    api.listenMqtt(async (err, event) => {
        if (err || !event.body || !event.body.startsWith('.')) return;

        try {
            const args = event.body.slice(1).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();

            const command = global.client.commands.get(commandName) || 
                            Array.from(global.client.commands.values()).find(cmd => cmd.otherName && cmd.otherName.includes(commandName));

            if (!command) return;

            const senderID = String(event.senderID);
            const adminID = "61550124399416";
            const userRank = (senderID === adminID) ? 2 : 0;

            // جلب البيانات (ستنشئ حساباً تلقائياً إذا لم يوجد)
            let userData = await getUser(senderID);

            // --- [تعديل هام] تم إزالة شرط "يجب التسجيل أولاً" لفتح البوت للجميع ---
            // إذا كنت تريد تحديث حالة التسجيل تلقائياً عند أول استخدام:
            if (!userData.registered) {
                userData.registered = true;
                await updateUser(senderID, userData);
            }

            // تنفيذ الأمر مباشرة
            await command.run(api, event, { args, userData, userRank, updateUser });

        } catch (error) {
            console.error(`🚨 خطأ في التنفيذ:`, error);
            api.sendMessage(`🚨 حدث خطأ أثناء تنفيذ الأمر: ${error.message}`, event.threadID);
        }

        // نظام الردود
        if (event.type === "message_reply") {
            const replyObj = global.client.handler.reply.find(r => r.messageID === event.messageReply.messageID);
            if (replyObj) {
                const cmd = global.client.commands.get(replyObj.name);
                if (cmd && cmd.onReply) {
                    let userData = await getUser(event.senderID);
                    cmd.onReply({ api, event, Reply: replyObj, userData });
                }
            }
        }
    });
});

