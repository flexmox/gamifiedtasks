const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
