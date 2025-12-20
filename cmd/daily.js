module.exports = {
  name: "يومي",
  run: async (api, event, { userData }) => {
    const rewards = [
        { n: "كيس ذهب صغير", m: 500, q: 5 },
        { n: "جرعة طاقة زرقاء", m: 100, q: 50 },
        { n: "كنز الملوك", m: 5000, q: 10 }
    ];
    const gift = rewards[Math.floor(Math.random() * rewards.length)];
    await updateUser(event.senderID, { money: userData.money + gift.m, qi: userData.qi + gift.q });
    api.sendMessage(`🎁 حصلت على [ ${gift.n} ]!\n💰 +${gift.m} ذهب | ✨ +${gift.q} Qi`, event.threadID);
  }
};

