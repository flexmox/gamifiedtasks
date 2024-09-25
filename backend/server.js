// backend/server.js
require('dotenv').config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('./models/User');
const Task = require('./models/Task');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  const userSchema = new mongoose.Schema({
    name: String,
    points: { type: Number, default: 0 }
  });
  
  
  module.exports = User;
  
  
  app.put('/api/tasks/:id', async (req, res) => {
    console.log('Received request to update task:', req.params.id);
    try {
      const task = await Task.findById(req.params.id);
      console.log('Found task:', task);
      if (!task) {
        console.log('Task not found');
        return res.status(404).json({ error: 'Task not found' });
      }
      
      task.completed = !task.completed;
      await task.save();
      console.log('Task updated:', task);
  
      const user = await User.findById(task.userId);
      console.log('Found user:', user);
      if (user) {
        user.points += task.completed ? task.points : -task.points;
        await user.save();
        console.log('User points updated:', user.points);
      }
  
      res.json({ task, userPoints: user.points });
    } catch (err) {
      console.error('Error updating task:', err);
      res.status(400).json({ error: err.message });
    }
  });
  
  app.post('/api/tasks', async (req, res) => {
    try {
      const { userId, name } = req.body;
      const task = new Task({ userId, name });
      await task.save();
      console.log('Task created:', task);
      res.json(task);
    } catch (err) {
      console.error('Error creating task:', err);
      res.status(400).json({ error: err.message });
    }
  });

  // Add a route to get user information
  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  app.post('/api/users', async (req, res) => {
    console.log('Received request to create user:', req.body);
    try {
      const user = new User({ name: req.body.name, points: 0 });
      await user.save();
      console.log('User created:', user);
      res.json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(400).json({ error: err.message });
    }
  });


  app.get('/api/tasks/:userId', async (req, res) => {
    try {
      const tasks = await Task.find({ userId: req.params.userId });
      res.json(tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      res.status(400).json({ error: err.message });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
