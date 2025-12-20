const login = require("ws3-fca").default || require("ws3-fca").login || require("ws3-fca");
const fs = require("fs");
const handleCommand = require("./core/handler");

global.client = {
    commands: new Map(),
    handler: { reply: [] }
};

// تحميل الأوامر
const commandFiles = fs.readdirSync('./cmd').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./cmd/${file}`);
    global.client.commands.set(command.name, command);
}

// قراءة appstate
const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

// بدء الجلسة
login({ appState }, (err, api) => {
    if (err) return console.error("❌ خطأ في الدخول:", err);

    api.setOptions({ listenEvents: true, selfListen: false });

    api.listenMqtt(async (err, event) => {
        if (err) return;
        
        // تشغيل الهاندلر
        await handleCommand(api, event);

        // نظام الردود للقصة
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

