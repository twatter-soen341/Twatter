const Twat = require('../models/twat');

exports.createTwat = function (req, res, next) {

    let twat = new Twat(
        {
            userName: req.body.userName,
            timeStamp: new Date().getTime(),
            content: req.body.content,
            likes: req.body.likes,
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

    Twat.findById(req.params.id, function (err, twat) {
        if (err) return next(err);
        res.send(twat);
    })
};

/* to get all Twats (Tweets) */
exports.getTwats = (req, res, next) => {
    Twat.find()
    .then(documents => {
      res.status(200).json({
        message: 'Twats fetched succesfully!',
        posts: documents
      });
    }).catch((err) => {
        res.status(500).json({
            message: 'Failed at getting Posts',
            error: err
        })
      });
};

exports.updateTwat = function (req, res, next) {

    Twat.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, twat) {
        if (err) return next(err);
        res.send('Twat updated.'+ twat.toString());
    });
};

exports.deleteTwat = function (req, res, next) {
    /* The following gives when there's an error:
    DeprecationWarning: collection.findAndModify is deprecated. 
    Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
    Otherwise, code doesn't complain.*/
    Twat.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};
