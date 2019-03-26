const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  bio: String,
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true

  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  dateCreated: {type: Number, required: true}
});

module.exports = mongoose.model('User', userSchema);
