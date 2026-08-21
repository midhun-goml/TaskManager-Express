require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const users = [];
const tasks = [];
let taskIdCounter = 1;

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. Missing or malformed token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      username: username,
      password: hashedPassword,
    };
    users.push(newUser);

    return res.status(201).json({
      message: 'User registered successfully.',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.status(200).json({
    message: 'Login successful.',
    token: token,
  });
});

app.get('/tasks', requireAuth, (req, res) => {
  return res.status(200).json(tasks);
});

app.post('/tasks', requireAuth, (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const newTask = {
    id: taskIdCounter++,
    title: title.trim(),
    done: req.body.done === true,
  };

  tasks.push(newTask);

  return res.status(201).json(newTask);
});

app.put('/tasks/:id', requireAuth, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const { title, done } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title cannot be empty.' });
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    task.done = Boolean(done);
  }

  return res.status(200).json(task);
});

app.delete('/tasks/:id', requireAuth, (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  tasks.splice(taskIndex, 1);

  return res.status(200).json({ message: 'Task deleted successfully.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
