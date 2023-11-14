const mongoose = require('mongoose')


const liveChatSchema = new mongoose.Schema({
    accountId: Number,
    name: String,
    image: String,
    content: String,
    room: Number,
    deletedAt: Date
},{
    timestamps: true
})

module.exports = mongoose.model('liveChats', liveChatSchema)