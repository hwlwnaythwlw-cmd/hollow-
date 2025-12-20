// data/clan.js
const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  leaderID: String,
  deputyID: String,
  treasury: { type: Number, default: 0 },
  members: [{
    id: String,
    totalDeposited: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 }
  }],
  pendingRequests: [{
    userID: String,
    userName: String,
    amount: Number,
    reason: String
  }]
});

module.exports = mongoose.model('Clan', clanSchema);

