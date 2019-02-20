const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    text: { type: String, required: true }

});

module.exports = mongoose.model('Comment', userSchema);
