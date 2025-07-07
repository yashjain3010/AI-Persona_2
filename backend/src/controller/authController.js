const User = require('../models/User');
const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = await authService.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ message: 'Registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const valid = await authService.comparePassword(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });
    const token = authService.generateJWT(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // For simplicity, just respond with a message. Implement email reset link if needed.
    res.status(501).json({ error: 'Forgot password not implemented in normal auth mode.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // For simplicity, just respond with a message. Implement email reset link if needed.
    res.status(501).json({ error: 'Reset password not implemented in normal auth mode.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
}; 