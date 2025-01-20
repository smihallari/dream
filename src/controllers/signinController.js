const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');


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

      console.log('User logged in:', user.email);
      
      req.session.user = { id: user.id, email: user.email , username: user.username, role: user.role , profilePic: user.profilePic };
      res.locals.user = user;

      // req.session.user = { id: user._id, role: user.role, name: user.name };
      // res.status(200).json({ message: 'Login successful', user: req.session.user });

      
      res.json({ success: true, redirectUrl: '/' });
    } catch (err) {
      error.message = 'error during login';
                error.status = 500;
                next(error);
    }
  }
];


module.exports = login;