const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // profilePicturePath: { type: String, required: true },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  }
  /*
  likedBy: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Post',
    required: true
  }
  */
});

module.exports = mongoose.model('User', userSchema);
