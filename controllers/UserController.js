const User = require('../models/User');

const signup = async (req, res) => {
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
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, getUsers };