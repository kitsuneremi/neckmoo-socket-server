const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
    memberId: Number,
    roomId: String,
    file: String,
    content: String,
    deletedAt: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('message', messageSchema)