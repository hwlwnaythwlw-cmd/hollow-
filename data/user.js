const fs = require('fs');
const path = require('path');

// مسار ملف حفظ البيانات
const filePath = path.join(__dirname, 'users.json');

// دالة لقراءة البيانات من الملف
function readData() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
        return {};
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// دالة لحفظ البيانات في الملف
function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function getUser(senderID) {
    let users = readData();

    // إذا كان المستخدم غير موجود، قم بإنشائه ببيانات افتراضية
    if (!users[senderID]) {
        users[senderID] = {
            id: senderID,
            character: {
                name: "محارب مبتدئ",
                level: 1,
                xp: 0
            },
            specialCharm: {
                name: "لا يوجد",
                power: 0
            },
            clan: "لا يوجد",
            money: 1000
        };
        saveData(users);
    }
    return users[senderID];
}

async function updateUser(senderID, newData) {
    let users = readData();
    if (users[senderID]) {
        // دمج البيانات القديمة مع الجديدة
        users[senderID] = { ...users[senderID], ...newData };
        saveData(users);
    }
    return users[senderID];
}

module.exports = { getUser, updateUser };

