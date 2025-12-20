module.exports = {
    name: "كلان",
    run: async (api, event, { args, userData }) => {
        const clans = [
            { name: "قبيلة التنين", element: "النار", leader: "لوفي" },
            { name: "نخبة الظلال", element: "الظلام", leader: "إيتاتشي" },
            { name: "فرسان النور", element: "البرق", leader: "غوين" },
            { name: "قبيلة الأرض", element: "الصخر", leader: "غارا" },
            { name: "مقدسي الجليد", element: "الثلج", leader: "إيسدث" }
        ];

        if (!args[0]) {
            let msg = "🏘️ | **القبائل الخمس العظمى** | 🏘️\n━━━━━━━━━━━━━━━\n";
            clans.forEach((c, i) => {
                msg += `${i + 1}. ${c.name} \n   🔥 العنصر: ${c.element} | 👑 القائد: ${c.leader}\n───────\n`;
            });
            msg += "\nاستخدم: .كلان انضمام [الرقم]";
            return api.sendMessage(msg, event.threadID);
        }

        if (args[0] === "انضمام") {
            const index = parseInt(args[1]) - 1;
            if (!clans[index]) return api.sendMessage("❌ رقم القبيلة غير صحيح.", event.threadID);
            
            await updateUser(event.senderID, { clan: clans[index].name });
            api.sendMessage(`✅ مرحباً بك في [ ${clans[index].name} ]! لقد أصبحت الآن فرداً من العائلة.`, event.threadID);
        }
    }
};

