const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

/**
 * Passport middleware to validate the token found inside a request's header.
 */
module.exports = passport => {
  /* extracting the token from the headers */
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY
  };

  /* Using passport to authenticate the token */
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      /* verify that the user from the token's payload exists */
      User.findOne({ _id: jwt_payload.userId }, (error, user) => {
        if (error) {
          /* If theres an error, return Not Authorized */
          return done(error, false);
        }
        if (user) {
          /* If user exists, return user data without password */
          return done(null, {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          });
        } else {
          /* If user doesnt exist, return Not Authorized */
          return done(null, false);
        }
      });
    })
  );
};