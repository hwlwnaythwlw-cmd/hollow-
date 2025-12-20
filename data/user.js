const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  crystals: { type: Number, default: 0 },
  money: { type: Number, default: 0 },
  lastJobDay: { type: String },
  exp: { type: Number, default: 0 },
  rank: { type: String, default: "مبتدئ" },
  qi: { type: Number, default: 10 }, 
  clan: { type: String, default: null }, 
  isClanLeader: { type: Boolean, default: false },
  isClanDeputy: { type: Boolean, default: false },
  
  // --- إضافة نظام الألقاب ---
  titles: { type: Array, default: ["المستكشف المبتدئ"] }, // قائمة الألقاب التي يملكها
  activeTitle: { type: String, default: "مستكشف" }, // اللقب الذي يظهر للناس
  
  charms: [{
    name: String,
    notchCost: Number,
    isBroken: { type: Boolean, default: false },
    lastUse: { type: Date, default: Date.now }
  }],
  maxNotches: { type: Number, default: 2 }, 
  equippedCharms: { type: Array, default: [] },
  lastBenchUse: { type: Date, default: 0 }, 
  lastAttackTime: { type: Date, default: Date.now }, // حقل ضروري لنظام التعافي

  character: {
    name: { type: String },
    class: { type: String }, 
    level: { type: Number, default: 1 },
    ATK: { type: Number, default: 10 },
    DEF: { type: Number, default: 10 },
    HP: { type: Number, default: 100 },
    maxHP: { type: Number, default: 100 }, 
    SPEED: { type: Number, default: 10 },
    skills: { type: Array, default: [] },
    img: { type: String },
  }
});

// دالة التعافي التدريجي
userSchema.methods.regenerateHP = function() {
    const now = new Date();
    // إذا مر أكثر من 3 دقائق (180000ms) على آخر قتال
    if ((now - this.lastAttackTime) > 180000) {
        if (this.character.HP < this.character.maxHP) {
            this.character.HP = Math.min(this.character.maxHP, this.character.HP + 5);
        }
    }
};

const User = mongoose.model('User', userSchema);

// دوال المساعدة (تأكد من وجودها)
const getUser = async (id) => {
    let user = await User.findOne({ id });
    if (user) user.regenerateHP(); // تفعيل التعافي عند طلب البيانات
    return user;
};

const updateUser = async (id, data) => {
    return await User.findOneAndUpdate({ id }, data, { new: true });
};

const saveUser = async (userData) => {
    const newUser = new User(userData);
    return await newUser.save();
};

module.exports = { User, getUser, updateUser, saveUser };

