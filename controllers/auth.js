const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Auth = require('../models/auth');

exports.login = async (req, res, next) => {
  try {
    const authUser = await Auth.findOne({ email: req.body.email });

    /* Verify user with that email exists */
    if (!authUser) {
      throw new Error('Invalid Credentials');
    }
    /* Verify password */
    const isMatch = await bcrypt.compare(req.body.password, authUser.password);
    if (!isMatch) {
      throw new Error('Invalid Credentials');
    }
    /* Authorization is sucessful, so create token */
    const token = jwt.sign(
      {
        email: authUser.email,
        userId: authUser.user
      },
      process.env.JWT_KEY,
      { expiresIn: '6h' }
    );
    /* send response */
    res.status(200).json({
      message: 'User login successful!',
      token: token,
      expiresIn: 21600, //6h
      userId: authUser.user
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
    /* Start by creating the User */
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      // profilePicturePath: '',  // waiting to implement posts model 
      following: [],
      // likedBy: []  // waiting to implement posts model
    });
    
    /* When user is created, create the auth data with the new user's id */
    const auth = new Auth({
      email: req.body.email,
      password: hashedPassword,
      user: user._id
    });
    
    /* save the user only if auth is successful */
    await auth.save();  // may throw error
    await user.save();  // causing this to never run

     /* Sending response */
     res.status(200).json({
      message: 'Sign up success!',
      auth
    });
  } catch (error) {
    res.status(500).json({
      message: 'Sign up Failed.',
      error
    });
  }
};