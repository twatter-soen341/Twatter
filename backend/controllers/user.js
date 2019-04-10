const User = require('../models/user');

exports.getUserByName = async (req, res) => {
  try {
    let search = req.body.search;
    const regex = new RegExp(`^${search}`, 'i');
    let user = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }]
    }).limit(20);
    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: 'User not found.'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
      message: 'Could not get user.'
    });
  }
};
//http://localhost:8080/api/user/users/
exports.getUsersByIds = async (req, res) => {
  try {
    var users = [];
    const ids = req.body.ids;
    var userId;
    for (userId in ids) {
      var user = await User.findById(ids[userId]);
      if (user) {
        users.push(user);
      } else {
        res.status(404).json({
          message: 'Incorrect Id sent'
        });
      }
    }
    res.status(200).send(JSON.stringify(users));
  } catch (error) {
    res.status(500).json({
      error: error,
      message: 'Could not get user.'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        message: 'User not found.'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
      message: 'Could not get user.'
    });
  }
};

/* Follow a user A by adding user A from following array of current user and by adding current user to follower array of user A*/
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.body.wantToFollow); //User.findOne({ _id : req.body.wantToFollow}, (err, user) => {

    if (userToFollow) {
      userToFollow.followers.addToSet(req.body.user_id); // todo: get it from params and not from body
      userToFollow.save(err => {
        if (err) {
          res.status(500).json({
            message: 'could not follow user'
          });
        } else {
          User.findById(req.body.user_id, (err, user) => {
            user.following.addToSet(req.body.wantToFollow);

            user.save(err => {
              if (err) {
                res.status(500).json({
                  message: 'could not save user'
                });
              } else {
                res.status(200).json({
                  message: 'Followed Successfully',
                  user: user
                });
              }
            });
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'could not follow user'
    });
  }
};

/* Unfollow a user A by removing user A from following array and by removing current user from follower array of user A*/
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    if (userToUnfollow) {
      userToUnfollow.followers.pull(req.body.user_id);

      userToUnfollow.save(err => {
        if (err) {
          res.status(500).json({
            message: 'could not follow user'
          });
        } else {
          User.findById(req.body.user_id, (err, user) => {
            user.following.pull(req.params.id);

            user.save(err => {
              if (err) {
                res.status(500).json({
                message: 'could not save user'
                });
              } else {
                res.status(200).json({
                  message: 'Unfollowed successfully',
                  user: user
                });
              }
            });
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'could not follow user'
    });
  }
};

/* Get followers */
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers');
    if (user) {
      res.status(200).json({
        message: 'Found followers',
        followers: user.followers
      });
    } else {
      res.status(404).json({
        message: 'Followers cannot be found'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
      message: 'Could not get followers.'
    });
  }
};

/* Get users that id is following */
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following');

    res.status(200).json({
      message: 'Found following',
      following: user.following
    });
  } catch (error) {
    res.status(500).json({
      error: error,
      message: 'Could not get following.'
    });
  }
};
// Used to update the user
exports.updateUser = async (req, res) => {
  const updateQuery = {};

  /* Updating only the fields that are given */
  if (req.body.firstName) updateQuery.firstName = req.body.firstName;
  if (req.body.lastName) updateQuery.lastName = req.body.lastName;
  if (req.body.bio) updateQuery.bio = req.body.bio;
  if (req.body.following) updateQuery.following = req.body.following;
  if (req.body.followers) updateQuery.followers = req.body.followers;

  User.findByIdAndUpdate(req.params.id, { $set: updateQuery }, err => {
    if (err) {
      res.status(500).json({ message: 'Update Failed.', error: err });
    } else {
      res.status(200).json({ message: 'User Updated' });
    }
  });
};
