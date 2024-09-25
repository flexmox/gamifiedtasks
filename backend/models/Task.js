const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  completed: { type: Boolean, default: false },
  points: { type: Number, default: 10 }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
