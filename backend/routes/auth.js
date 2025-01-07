const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Registrácia užívateľa
router.post('/register', async (req, res) => {
    const { nickname, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email už existuje' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            nickname,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Úspešná registrácia!' });
    } catch (error) {
        res.status(500).json({ message: 'Chyba servera' });
    }
});

// Prihlásenie užívateľa
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Nesprávny email alebo heslo' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Nesprávny email alebo heslo' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, nickname: user.nickname });
    } catch (error) {
        res.status(500).json({ message: 'Chyba servera' });
    }
});

module.exports = router;