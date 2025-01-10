const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Overenie existencie hlavičky
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Prístup zamietnutý. Žiadny alebo nesprávny token.' });
    }

    // Extrahovanie tokenu
    const token = authHeader.split(' ')[1];

    try {
        // Validácia tokenu
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Pridanie údajov používateľa do requestu
        next(); // Pokračovanie na ďalší middleware
    } catch (err) {
        console.error('Chyba pri validácii tokenu:', err.message);
        res.status(400).json({ message: 'Neplatný token.' });
    }
};

module.exports = verifyToken;