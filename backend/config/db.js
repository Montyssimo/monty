const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Pripojenie k MongoDB bolo úspešné');
    } catch (error) {
        console.error('❌ Chyba pri pripájaní k MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;