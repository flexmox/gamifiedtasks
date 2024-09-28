const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completed: { type: Boolean, default: false },
  frequency: { type: String, default: 'day' },
  dueDate: { type: Date },
  lastCompleted: { type: Date }
});

module.exports = mongoose.model('Task', taskSchema);