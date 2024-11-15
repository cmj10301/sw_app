// database.js (mongoose 연결용)
const mongoose = require('mongoose');
const url = 'mongodb+srv://cmj10301:kRdBu9Pd3xp9CAqL@cluster0.drwdp.mongodb.net/forum?retryWrites=true&w=majority&appName=Cluster0';

let isConnected = false;

async function connect() {
    if (isConnected) {
        console.log('이미 MongoDB에 연결되어 있습니다.');
        return mongoose;
    }

    try {
        await mongoose.connect(url);
        isConnected = true;
        console.log('MongoDB에 연결되었습니다.');
    } catch (err) {
        console.error('MongoDB 연결 실패:', err);
        throw new Error('MongoDB 연결 실패');
    }
    return mongoose;
}

module.exports = { connect };
