// server.js - Backend for PUNJAB App
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Real Production Database)
mongoose.connect('mongodb+srv://punjab_admin:secure_password@cluster.mongodb.net/punjab_db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Database Connected Successfully')).catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  village: String,
  password: { type: String, required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const User = mongoose.model('User', UserSchema);

// Post Schema
const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  village: String,
  category: String,
  content: String,
  mediaUrl: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ username: String, text: String, createdAt: { type: Date, default: Date.now } }],
  createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, phone, village, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, phone, village, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: 'Account created successfully', user });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Phone number already registered or invalid data' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: 'Invalid phone number or password' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get Feed Route
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Create Post Route
app.post('/api/posts', async (req, res) => {
  try {
    const { userId, username, village, category, content, mediaUrl } = req.body;
    const newPost = new Post({ userId, username, village, category, content, mediaUrl });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Like/Unlike Route
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({ success: true, likes: post.likes });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
