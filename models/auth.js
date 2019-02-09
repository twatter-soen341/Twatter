const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

/* Adding unique validator plugin
 * to test that the email is unique */
authSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Auth', authSchema);
