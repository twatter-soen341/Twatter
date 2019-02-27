const User = require('../models/user');

exports.getUserByName = async (req, res, next) => {
  try {
    let search = req.body.search;
    const regex = new RegExp(`^${search}`, 'i');
    let user = await User.find({$or: [{ 'firstName': regex }, {'lastName': regex}]}).limit(5);
    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(200).json({
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
exports.getUsersByIds = async (req, res, next) => {
    try {
        var users = [];
        const ids = req.body.ids;

        for(userId in ids){
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

exports.getUserById = async (req, res, next) => {
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


//TODO: need to fetch the user ID from the authService.getCurrentUserId
//Current body: 
// {
//   "user_id":"5c6b711a94db5f4bed34bc0f",
// 	"wantToFollow": "john"
// }
exports.followUser = (req, res, next) => {

  User.findOne({ firstName: req.body.wantToFollow }, (err, user) => {

    var wantToFollow = user._id

    user.followers.addToSet(req.body.user_id); // todo: get it from params and not from body

    user.save((err) => {
      if (err) {
        console.log(err)
      } else {

        User.findById(req.body.user_id, (err, user) => {

          user.following.addToSet(wantToFollow);

          user.save((err) => {
            if (err) {
              console.log(err)
            } else {
              res.status(200).json({
                message: 'ressource updated successfully'
              })
            }
          });

        });
      }
    });
  });
}

//TODO: need to fetch the user ID from the authService.getCurrentUserId
// {
//   "user_id":"5c6b711a94db5f4bed34bc0f",
// 	"wantToUnfollow": "john"
// }
exports.unfollowUser = (req, res, next) => {

  User.findOne({ firstName: req.body.wantToUnfollow }, (err, user) => {

    var wantToUnfollow = user._id

    user.followers.pull(req.body.user_id); // todo: get it from params and not from body

    user.save((err) => {
      if (err) {
        console.log(err)
      } else {

        User.findById(req.body.user_id, (err, user) => {

          user.following.pull(wantToUnfollow);

          user.save((err) => {
            if (err) {
              console.log(err)
            } else {
              res.status(200).json({
                message: 'ressource updated successfully'
              })
            }
          });

        });
      }
    });
  });
}

exports.getFollowers = (req, res, next) => {
  U

  // User.findOne({ firstName: req.body.wantToFollow }, (err, user) => {

  //   var wantToFollow = user._id

  //   user.save((err) => {
  //     if (err) {
  //       console.log(err)
  //     } else {

  //       User.findById(req.body.user_id, (err, user) => {

  //         user.following.addToSet(wantToFollow);

  //         user.save((err) => {
  //           if (err) {
  //             console.log(err)
  //           } else {
  //             res.status(200).json({
  //               message: 'ressource updated successfully'
  //             })
  //           }
  //         });

  //       });
  //     }
  //   });
  // });
}
exports.getFollowing = (req, res, next) => {

  // User.findOne({ firstName: req.body.wantToFollow }, (err, user) => {

  //   var wantToFollow = user._id

  //   user.save((err) => {
  //     if (err) {
  //       console.log(err)
  //     } else {

  //       User.findById(req.body.user_id, (err, user) => {

  //         user.following.addToSet(wantToFollow);

  //         user.save((err) => {
  //           if (err) {
  //             console.log(err)
  //           } else {
  //             res.status(200).json({
  //               message: 'ressource updated successfully'
  //             })
  //           }
  //         });

  //       });
  //     }
  //   });
  // });
}