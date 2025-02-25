const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');


const login = 
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
      
      res.json({ success: true, redirectUrl: '/' });
    } catch (error) {
      error.message = 'error during login';
                error.status = 500;
                next(error);
    }
  }
;


module.exports = {login};