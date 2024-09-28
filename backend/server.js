// Load environment variables from .env file
require('dotenv').config();

console.log('Starting server with configuration:');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const User = require('./models/User');
const Task = require('./models/Task');

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://149.248.5.175:3001';

console.log('Configuring CORS for origin:', FRONTEND_URL);
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());

console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/api/users', async (req, res) => {
  console.log('Received request to fetch all users');
  try {
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Route to create a new user
 * POST /api/users
 */
app.post('/api/users', async (req, res) => {
  console.log('Received request to create user:', req.body);
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = new User({ name: req.body.name, points: 0 });
    await user.save();
    console.log('User created:', user);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Route to fetch tasks
 * POST /api/tasks
 */
app.post('/api/tasks', async (req, res) => {
  console.log('Received request to create task:', req.body);
  try {
    const { name, userId, frequency, dueDate } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Name and userId are required' });
    }
    const task = new Task({ 
      name, 
      userId, 
      completed: false,
      frequency: frequency || 'day',
      dueDate: dueDate ? new Date(dueDate) : new Date()
    });
    await task.save();
    console.log('Task created:', task);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Route to fetch tasks for a specific user
 * GET /api/tasks/:userId
 */
app.get('/api/tasks/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const tasks = await Task.find({ userId });
    
    // If no tasks found, return an empty array instead of 404
    if (!tasks || tasks.length === 0) {
      return res.json([]);
    }

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Route to complete a task
 * PUT /api/tasks/:taskId/complete
 */
app.put('/api/tasks/:taskId/complete', async (req, res) => {
  console.log('Received request to complete task:', req.params.taskId);
  
  const { taskId } = req.params;

  if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    task.completed = true;
    await task.save();

    console.log('Task completed:', task);

    // Update user points
    const user = await User.findById(task.userId);
    if (user) {
      user.points += 1; // Or any point system you want to implement
      await user.save();
      console.log('User points updated:', user.points);
    }

    res.json({ task, userPoints: user ? user.points : null });
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const HOST = process.env.HOST || '149.248.5.175';
const PORT = process.env.PORT || 5001;

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});