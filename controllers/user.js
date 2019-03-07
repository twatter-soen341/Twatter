const User = require('../models/user');

exports.getUserByName = async (req, res, next) => {
    try {
        let search = req.body.search;
        const regex = new RegExp(`^${search}`, 'i');
        let user = await User.find({$or: [{'firstName': regex}, {'lastName': regex}]}).limit(20);
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
exports.getUsersByIds = async (req, res, next) => {
    try {
        var users = [];
        const ids = req.body.ids;

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

/* Follow a user A by adding user A from following array of current user and by adding current user to follower array of user A*/
exports.followUser = async (req, res, next) => {
    const userToFollow = await User.findById(req.body.wantToFollow); //User.findOne({ _id : req.body.wantToFollow}, (err, user) => {

    if (userToFollow) {
        userToFollow.followers.addToSet(req.body.user_id); // todo: get it from params and not from body
        userToFollow.save((err) => {
            if (err) {
                console.log(err)
            } else {

                User.findById(req.body.user_id, (err, user) => {
                    user.following.addToSet(req.body.wantToFollow);

                    user.save((err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.status(200).json({
                                message: 'Followed Successfully'
                            })
                        }
                    });

                });
            }
        });
    }
}

//TODO: need to fetch the user ID from the authService.getCurrentUserId
// {
//   "user_id":"5c6b711a94db5f4bed34bc0f",
// 	"wantToUnfollow": "john"
// }

/* Unfollow a user A by removing user A from following array and by removing current user from follower array of user A*/
exports.unfollowUser = async (req, res, next) => {

    const userToUnfollow = await User.findById(req.params.id);
    if (userToUnfollow) {
        userToUnfollow.followers.pull(req.body.user_id);

        userToUnfollow.save((err) => {
            if (err) {
                console.log(err)
            } else {

                User.findById(req.body.user_id, (err, user) => {

                    user.following.pull(req.params.id);

                    user.save((err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.status(200).json({
                                message: 'Unfollowed successfully',
                                user: user
                            })
                        }
                    });

                });
            }
        });
    }
}

/* Get followers */
exports.getFollowers = async (req, res, next) => {
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
}

/* Get users that id is following */
exports.getFollowing = async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('following');
    try {
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
}
// Used to update the user
exports.updateUser = async (req, res, next) => {
    console.log('here');
    User.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            following: req.body.following,
            followers: req.body.followers
        }
    }, function (err) {
        if (err) {
            res.status(500).json({message: 'Update Failed.', error: err});
        } else {
            res.status(200).json({message: 'User Updated'});
        }
    });
};
