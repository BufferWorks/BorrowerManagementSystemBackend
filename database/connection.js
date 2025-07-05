const mongoose = require('mongoose');
require('dotenv').config();

// exports.connectToDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 30000, // try increasing to 30s
//             bufferCommands: false, // 💥 prevent waiting queries

//         });

//         console.log("✅ Connected to MongoDB successfully");
//     } catch (err) {
//         console.error("❌ MongoDB connection error:", err.message);
//     }
// };
exports.connectToDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000
        });

        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connected!');
            resolve(); // only resolve when DB is ready
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message);
            reject(err);
        });
    });
};
