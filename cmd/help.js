// commands/help.js
module.exports = {
  name: "أوامر",
  rank: 0,
  run: async (api, event, { commands, config }) => {
    let msg = "📜 قائمة أوامر البوت:\n\n";
    commands.forEach(cmd => {
      msg += `🔹 ${config.prefix}${cmd.name}\n`;
    });
    api.sendMessage(msg, event.threadID);
  }
};

