const mongoose = require('mongoose');

    var commentSchema = new mongoose.Schema({
        userId: {type: String, required: true},
        postId: {type: String, required: true},
        text: {type: String, required: true}
    });


    const twatSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: { type: String, required: true },
    timeStamp: Date,
    likedBy: [String],
    comments: [commentSchema]

});

module.exports = mongoose.model('Twat', twatSchema);