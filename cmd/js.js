const { exec } = require('child_process');

module.exports = {
  name: "run",
  otherName: ['نود', 'node', 'js'],
  version: "1.0.0",
  info: "تنفيذ أكواد معينة",
  usageCount: 0,
  rank: 2,
  updatedAt: '2024/7/17',
  usages: "[code]",
  run: async (api, event) => {
    const allowedUsers = ["100083602650172"];
    if (!allowedUsers.includes(event.senderID)) {
      return api.sendMessage(`ِ      ِ`, event.threadID, event.messageID);
    }

    const code = event.body.split(' ').slice(1).join(' ');
    if (!code) {
      return api.sendMessage('⚠ | .اكتب كود', event.threadID, event.messageID);
    }

    exec(code, (error, stdout, stderr) => {
      if (error) {
        api.sendMessage(`\n${error.message}`, event.threadID, event.messageID);
        return;
      }
      if (stderr) {
        api.sendMessage(`${stderr}`, event.threadID, event.messageID);
        return;
      }
      api.sendMessage(`${stdout}`, event.threadID, event.messageID);
      setTimeout(() => {
        api.unsendMessage(event.messageID);
      }, 10000);
    });
  }
};
