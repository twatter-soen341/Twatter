const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    text: { type: String, required: true }

});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;