const User = require('../models/user');

exports.getUserByName = async (req, res, next) => {
  try {
    let search = req.body.search;
    const regex = new RegExp(`^${search}`, 'i');
    let user = await User.find({$or: [{ 'firstName': regex }, {'lastName': regex}]}).limit(20);
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
