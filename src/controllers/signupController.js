const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup controller

const signup = [
  check('name', 'Name is required').not().isEmpty(),
  check('surname', 'Surrname is required').not().isEmpty(),
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name,surname,username, email, password } = req.body;
    try {
      const existingUserEmail = await User.findOne({ email });
      const existingUserName = await User.findOne({ username });
      
      if (existingUserName) return res.status(400).json({ message: 'Username already in use' });
      if (existingUserEmail) return res.status(400).json({ message: 'Email already in use' });
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(password, salt);
      // for some reason, even without the salt,
      //  the password is being hashed. IF i salt it, then its like
      // double salting it, then I can't access it?????
      const user = new User({
        name,
        surname,
        username,
        email,
        password: password
      });

      await user.save();
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).send('Server error');
    }
  }
];


module.exports = signup;