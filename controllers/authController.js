const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    /* Verify user with that email exists */
    if (!user) {
      throw new Error('Invalid Credentials');
    }
    /* Verify password */
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid Credentials');
    }
    /* Authorization is sucessful, so create token */
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userId: user._id
      },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
    /* send response */
    res.status(200).json({
      message: 'User login successful!',
      token: `Bearer ${token}`,
      expiresIn: '1h'
    });
  } catch (error) {
    res.status(401).json({
      error
    });
  }
};

exports.signup = async (req, res) => {
  try {
    /* Hashing password with salt length of 12*/
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    /* Persist user to database */
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    });
    const newUser = await user.save();
    /* Sending response */
    res.status(200).json({
      message: 'Sign up success!',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'Sign up Failed.',
      error
    });
  }
};

/* Gets the user from the token payload */
exports.getUser = (req, res, next) => {
    res.status(200).json({user: req.user})
};
