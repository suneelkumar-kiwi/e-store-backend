const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Register User
const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;
    // Input validation
    if (!username || !password || !email || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });

      const usernameExists = await User.findOne({ username });
      if (usernameExists) return res.status(400).json({ message: 'Username already taken' });

      const user = await User.create({ name, email, username, password });
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: username },
        { username: username }
      ]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
