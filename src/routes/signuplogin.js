const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup magic
router.post('/signup',[
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
    ], 
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    try {
        const existingUserEmail = await User.findOne({ email });
        const existingUserName = await User.findOne({ username });
        if (existingUserEmail) return res.status(400).json({ message: 'Email already in use' });
        else if (existingUserName) return res.status(400).json({ message: 'Username already in use' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

// Login magic
router.post('/login',[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
    ]
    ,async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User non existent' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

module.exports = router;
