// data/db.js
const mongoose = require("mongoose");
const config = require("../main.json"); // استدعاء ملف main.json

async function connectDB() {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
