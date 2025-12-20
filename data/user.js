const mongoose = require("mongoose");

// تعريف موديل المستخدم
const userSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    character: {
        name: { type: String, default: "محارب مبتدئ" },
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 }
    },
    money: { type: Number, default: 1000 },
    activeTitle: { type: String, default: "لا يوجد" },
    clan: { type: String, default: "بدون" }
});

// منع إعادة تعريف الموديل إذا كان موجوداً مسبقاً
const User = mongoose.models.User || mongoose.model("User", userSchema);

async function getUser(senderID) {
    try {
        let user = await User.findOne({ id: senderID });
        if (!user) {
            user = await User.create({ id: senderID });
        }
        return user;
    } catch (error) {
        console.error("❌ خطأ في قاعدة البيانات:", error);
        return { id: senderID, character: { name: "خطأ في البيانات", level: 0 }, money: 0 };
    }
}

async function updateUser(senderID, newData) {
    try {
        return await User.findOneAndUpdate({ id: senderID }, newData, { new: true });
    } catch (error) {
        console.error("❌ خطأ في تحديث البيانات:", error);
    }
}

module.exports = { User, getUser, updateUser };

