const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

/* Adding unique validator plugin 
 * to test that the email is unique */
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
