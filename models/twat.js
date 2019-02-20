const mongoose = require('mongoose');
var comment = require('./comment');

const twatSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, required: true },
    timeStamp: Date,
    likes: [String],
    comment: {
    type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        required: true
    }

});

module.exports = mongoose.model('Twat', twatSchema);