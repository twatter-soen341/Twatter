const Twat = require('../models/twat');

exports.getTwat = function (req, res) {
    console.log("got twat");
};

exports.createTwat = function (req, res) {

    let twat = new Twat(
        {
            userName: req.body.userName,
            timeStamp: req.body.timeStamp,
            content: req.body.content,
            likes: req.body.likes,
        }
    );
    twat.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('Twat Created successfully').json(JSON.parse(twat));
    })
};

exports.getTwat = function (req, res) {

    Twat.findById(req.params.id, function (err, twat) {
        if (err) return next(err);
        res.send(twat);
    })
};

exports.updateTwat = function (req, res) {

    Twat.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, twat) {
        if (err) return next(err);
        res.send('Twat udpated.');
    });
};

exports.deleteTwat = function (req, res) {

    Twat.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};