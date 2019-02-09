const mongoose = require('mongoose');

const twatSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    content: { type: String, required: true },
    timeStamp: Date,
    likes: [String],
});

module.exports = mongoose.model('Twat', twatSchema);