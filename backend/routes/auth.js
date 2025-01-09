const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Zabezpečený endpoint pre dashboard
router.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: `Vitaj na dashboarde, ${req.user.nickname}!` });
});


// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Registrácia používateľa
router.post('/register', async (req, res) => {
    try {
        const { nickname, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Používateľ už existuje' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const user = new User({
            nickname,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken: token
        });
        await user.save();

        // Posielanie e-mailu na overenie
        const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;
        try {
            await transporter.sendMail({
                to: email,
                subject: 'Overenie e-mailovej adresy',
                html: `<p>Overte svoj e-mail kliknutím na tento odkaz: <a href='${verificationLink}'>Overiť e-mail</a></p>`
            });
        } catch (mailError) {
            await User.deleteOne({ email });
            return res.status(500).json({ message: 'Nepodarilo sa odoslať overovací e-mail.' });
        }

        res.status(201).json({ message: 'Registrácia úspešná, skontrolujte svoj e-mail' });
    } catch (error) {
        res.status(500).json({ message: 'Chyba servera', error: error.message });
    }
});

// Overenie e-mailu
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: 'Neplatný token alebo používateľ neexistuje' });
        }
        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        res.send('E-mail bol úspešne overený!');
    } catch (error) {
        res.status(400).json({ message: 'Neplatný alebo expirovaný token' });
    }
});

// Prihlásenie používateľa
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Neplatný e-mail alebo heslo' });
        }
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Účet nie je overený' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hodina
        });
        res.json({ message: 'Prihlásenie úspešné' });
    } catch (error) {
        res.status(500).json({ message: 'Chyba servera', error: error.message });
    }
});



// Endpoint na kontrolu prihlásenia
router.get('/check-auth', verifyToken, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

module.exports = router;