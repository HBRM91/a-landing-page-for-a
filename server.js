const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/slydata';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Models
const PricingPlan = require('./models/PricingPlan');
const User = require('./models/User');

// Routes
app.get('/api/pricing', async (req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { email, name, plan } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }
    const newUser = new User({ email, name, plan: plan || 'free' });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));