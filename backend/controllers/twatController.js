/**
 * controller responsible for the implementation of the methods in the routes files.
 */
const Twat = require('../models/twat');
/* To create a Twat (post) */
exports.createTwat = function (req, res) {

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
            res.status(500).json({
                message: 'Twat failed to be added',
                error: err
            });
        });
};

/* To get a Twat (post) */
exports.getTwat = function (req, res) {

    Twat.findById(req.params.id)
        .populate('user')
        .then(documents => {
            res.status(200).json({
                message: 'Twats fetched succesfully!',
                twat: documents
            });
        }).catch((err) => {
            res.status(500).json({
                message: 'Failed at getting Posts',
                error: err
            });
        });
};

/* Get the twats created by the user only (profile page) */
exports.getTwatsForUser = function(req, res){

    Twat.find({user: req.params.id})
        .sort({timeStamp: -1})
        .populate('user')
        .then(documents => {
            res.status(200).json({
                message: 'Twats fetched succesfully!',
                twats: documents
            });
        }).catch((err) => {
            res.status(500).json({
                message: 'Failed at getting Posts',
                error: err
            });
        });
}

/* Get the twats created by every users that the user follows (Twatline page)*/
exports.getTwats = (req, res) => {

    Twat.find()
    .sort({timeStamp: -1})
    .populate('user')
    .then(documents => {
            res.status(200).json({
            message: 'Twats fetched succesfully!',
            twats: documents
        });
    }).catch((err) => {
        res.status(500).json({
            message: 'Failed at getting Posts',
            error: err
        });
    });
};

/* Get Twats by matching words */
exports.getTwatsByMatch = async (req, res) => {
  try {
    let search = req.body.search;
    const regex = new RegExp(`${search}`, 'i');
    let twats = await Twat.find({ content: regex })
      .sort({ timeStamp: -1 })
      .populate('user');
    if (twats.length > 0) {
      res.status(200).json(twats);
    } else {
      res.status(404).json({
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
exports.updateTwat = function (req, res) {

   Twat.findByIdAndUpdate(req.params.id, {$set: {timeStamp: Date.now(), content: req.body.content, likedBy: req.body.likedBy, comments: req.body.comments}}, function (err) {

        if (err){
            res.status(500).json({message: 'Update Failed.', error: err});
        }
        else {
            res.status(200).json({message: 'Post Updated'});
        }
    });
};
/* Deleting a Twat from DB*/
exports.deleteTwat = function (req, res) {

    Twat.findByIdAndRemove(req.params.id, function (err) {
        
        if (err) res.status(500).json({message: 'Delete Failed.', error: err});
        res.status(200).json({message: 'Deleted successfully!'});

    });
};
