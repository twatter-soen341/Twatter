const Twat = require('../models/twat');

exports.getTwat = function (req, res) {
    console.log("got twat");
};

exports.createTwat = function (req, res, next) {

    let twat = new Twat(
        {   
            userId: req.body.userId,
            userName: req.body.userName,
            timeStamp: new Date().getTime(),
            content: req.body.content,
            likes: req.body.likes,
        }
    );
    twat.save().then(createdPost => {
        res.status(201).json({
          message: 'Twat added successfully',
          postId: createdPost._id
        });
      }).catch((result) => {console.log(result)});
}

exports.getTwat = function (req, res) {

    Twat.findById(req.params.id, function (err, twat) {
        if (err) return next(err);
        res.send(twat);
    })
};

exports.updateTwat = function (req, res) {

    Twat.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, twat) {
        if (err) return next(err);
        res.send('Twat updated.'+ twat.toString());
    });
};

exports.deleteTwat = function (req, res) {

    Twat.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};
