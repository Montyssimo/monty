const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '/uploads/avatars/default.png' },
    isVerified: { type: Boolean, default: false }, // Pridaný parameter
    verificationToken: { type: String }
});

module.exports = mongoose.model('User', UserSchema);