const Twat = require('../models/twat');

exports.createTwat = function (req, res, next) {

    let twat = new Twat(
        {   
            user: req.body.userId,
            timeStamp: Date.now(),
            content: req.body.content,
            likedBy: req.body.likedBy,
            comments: req.body.comments,
        }
    );
    twat.save()
        .then(createdPost => {

            res.status(201).json({
            message: 'Twat added successfully',
            postId: createdPost._id
            });
        })
        .catch((err) => {

            res.status(400).json({
                message: 'Twat failed to be added',
                error: err
            });
        });
};

/* To get a Twat (Tweet) */
exports.getTwat = function (req, res, next) {

    Twat.findById(req.params.id)
            .populate('user')
            .then(documents => {
                res.status(200).json({
                    message: 'Twats fetched succesfully!',
                    post: documents
                });
            }).catch((err) => {
                res.status(400).json({
                    message: 'Failed at getting Posts',
                    error: err
                });
                res.status(500).json({
                    message: 'Failed at getting Posts',
                    error: err
                });
              });
};
/* Get the twats created by the user only (profile page) */
exports.getTwatsForUser = function(req, res, next){

        Twat.find({user: req.params.id})
            .sort({timeStamp: -1})
            .populate('user')
            .then(documents => {
                res.status(200).json({
                    message: 'Twats fetched succesfully!',
                    posts: documents
                });
            }).catch((err) => {
                res.status(400).json({
                    message: 'Failed at getting Posts',
                    error: err
                });
                res.status(500).json({
                    message: 'Failed at getting Posts',
                    error: err
                });
              });
}

/* Get the twats created by every users that the user follows (Twatline page)*/
exports.getTwats = (req, res, next) => {

    Twat.find()
    .sort({timeStamp: -1})
    .populate('user')
    .then(documents => {
        res.status(200).json({
            message: 'Twats fetched succesfully!',
            posts: documents
        });
    }).catch((err) => {
        res.status(400).json({
            message: 'Failed at getting Posts',
            error: err
        });
        res.status(500).json({
            message: 'Failed at getting Posts',
            error: err
        });
      });
};

/* Get Twats by matching words */
exports.getTwatsByMatch = async (req, res, next) => {
    try {
      let search = req.body.search;
      const regex = new RegExp(`${search}`, 'i');
      let twat = await Twat.find({'content': regex }).limit(20);
      if (twat.length > 0) {
        res.status(200).json(twat);
      } else {
        res.status(200).json({
          message: 'Twat not found.'
        });
      }
    } catch (error) {
      res.status(500).json({
          error: error,
          message: 'Could not get twat.'
      });
    }
  };

/* Updating the Twat for likedBy, comments and editing its content */
exports.updateTwat = function (req, res, next) {

   Twat.findByIdAndUpdate(req.params.id, {$set: {timeStamp: Date.now(), content: req.body.content, likedBy: req.body.likedBy, comments: req.body.comments}}, function (err, twat) {

        if (err){
            res.status(500).json({message: 'Update Failed.', error: err});
        }
        else {
            res.status(200).json({message: 'Post Updated'});
        }
    });
};
/* Deleting a Twat from DB*/
exports.deleteTwat = function (req, res, next) {

    Twat.findByIdAndRemove(req.params.id, function (err) {
        
        if (err) res.status(500).json({message: 'Delete Failed.', error: err});
        res.status(200).json({message: 'Deleted successfully!'});

    });
};
