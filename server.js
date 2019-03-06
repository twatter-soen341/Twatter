
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors');
const passport = require('passport');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const twatRoute = require('./routes/twatRoute');

var uri = process.env.DEV_DATABASE

if (process.env.NODE_ENV === "prod") {
    uri = process.env.PROD_DATABASE
    console.log("ATTENTION: connected to production database. Please ensure 500 mb data limit with MongoClient")
}

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("connected to database")
})

// add functionalities
app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
/* Passport Middleware */
app.use(passport.initialize());
app.use(passport.session());

require('./middleware/passport')(passport);

//use routes
app.use('/api/auth', authRoute);
app.use('/api/user', passport.authenticate('jwt', { session: false }), userRoute);
app.use('/api/twat', passport.authenticate('jwt', { session: false }), twatRoute);

app.listen(8080, () => {
    console.log("connected on port 8080")
});


module.exports = app