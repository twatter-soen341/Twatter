const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Auth = require('../models/auth');
const Twat = require('../models/twat');

exports.login = async (req, res, next) => {
  try {
    const authUser = await authenticatUser(req.body.email, req.body.password);

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
      following: [],
      followers: [],
      dateCreated: Date.now()
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

exports.changePassword = async (req, res, next) => {
  try {
    const authUser = await authenticatUser(req.body.email, req.body.password);
    /* Authorization is sucessful, so change password */

    /* Hashing password with salt length of 12*/
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
    
    await Auth.findByIdAndUpdate(authUser._id, {password: hashedPassword})

    /* send response */
    res.status(200).json({
      message: 'password changed successfully!'
    });
  } catch (error) {
    console.log(error)
    res.status(401).json({
      error
    });
  }
};

exports.changeEmail = async (req, res, next) => {
  try {
    const authUser = await authenticatUser(req.body.email, req.body.password);
    /* Authorization is sucessful, so change email */

    await Auth.findByIdAndUpdate(authUser._id, {email: req.body.newEmail})

    /* send response */
    res.status(200).json({
      message: 'email changed successfully!'
    });
  } catch (error) {
    console.log(error)
    res.status(401).json({
      error
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const authUser = await authenticatUser(req.body.email, req.body.password);
    
    /* delete the user and their posts only if auth is successful */
    await Auth.deleteOne({email: req.body.email});
    await User.deleteOne({_id: authUser.user});
    await Twat.deleteMany({user: authUser.user});

     /* Sending response */
     res.status(200).json({
      message: 'Deleted successfully!'
    });
  } catch (error) {
      console.log(error);
      res.status(401).json({
        error
      });
  }
};



async function authenticatUser(email, password) {
  const authUser = await Auth.findOne({ email: email });

    /* Verify user with that email exists */
    if (!authUser) {
      throw new Error('Invalid Credentials');
    }
    /* Verify password */
    const isMatch = await bcrypt.compare(password, authUser.password);
    if (!isMatch) {
      console.log('Invalid Credentials')
      throw new Error('Invalid Credentials');
    }

    return authUser;
};