const mongoose = require("mongoose");

// تعريف شكل بيانات اللاعب في القاعدة
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

const User = mongoose.model("User", userSchema);

// دالة جلب المستخدم (سحابياً)
async function getUser(senderID) {
    try {
        let user = await User.findOne({ id: senderID });
        if (!user) {
            user = await User.create({ id: senderID });
        }
        return user;
    } catch (error) {
        console.error("❌ خطأ في جلب البيانات:", error);
        return null;
    }
}

// دالة تحديث بيانات المستخدم
async function updateUser(senderID, newData) {
    try {
        return await User.findOneAndUpdate({ id: senderID }, newData, { new: true });
    } catch (error) {
        console.error("❌ خطأ في تحديث البيانات:", error);
    }
}

module.exports = { User, getUser, updateUser };

