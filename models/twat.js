const mongoose = require('mongoose');

const twatSchema = new mongoose.Schema({
    userId: {type: String, required: false},
    userName: { type: String, required: false },
    content: { type: String, required: true },
    timeStamp: Date,
    likes: [String],
});

module.exports = mongoose.model('Twat', twatSchema);