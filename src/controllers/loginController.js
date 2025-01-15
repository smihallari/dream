const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');


// Login controller
const login = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // Set up the session
      req.session.user = { id: user.id, email: user.email };
      
      res.json({ success: true, redirectUrl: '/' });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).send('Server error');
    }
  }
];

module.exports = login;