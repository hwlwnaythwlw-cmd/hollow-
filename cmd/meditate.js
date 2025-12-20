module.exports = {
  name: "تأمل",
  run: async (api, event, { userData }) => {
    if (userData.character.HP < 50) return api.sendMessage("🤕 جسدك متألم جداً للتأمل، استرح أولاً.", event.threadID);
    
    api.sendMessage("🧘 بدأت في التأمل لجمع طاقة الطبيعة...", event.threadID);
    setTimeout(async () => {
        await updateUser(event.senderID, { qi: userData.qi + 30 });
        api.sendMessage("✨ انتهى التأمل! شعرت بتدفق الطاقة في عروقك (+30 Qi).", event.threadID);
    }, 10000); // يستغرق 10 ثواني
  }
};

