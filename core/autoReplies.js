const fs = require('fs');
const path = './data/replies.json';

module.exports.handleAutoReplies = async (api, event) => {
  if (!event.body) return;
  if (!fs.existsSync(path)) return;
  
  const data = JSON.parse(fs.readFileSync(path));
  const userMsg = event.body.trim();

  if (data[userMsg]) {
    api.sendMessage(data[userMsg], event.threadID);
  }
};

