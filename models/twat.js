const mongoose = require('mongoose');

const twatSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, required: true },
    timeStamp: Date,
    likes: [String],
});

module.exports = mongoose.model('Twat', twatSchema);