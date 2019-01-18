
require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const indexRoutes = require('./routes/index');

var uri

if (process.env.NODE_ENV === "dev") {
    uri = process.env.DEV_DATABASE
    console.log("connected to development database")
} else if (process.env.NODE_ENV === "prod") {
    uri = process.env.PROD_DATABASE
    console.log("connected to production database. Please ensure 500 mb data limit with MongoClient")
}

mongoose.connect(uri, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected to database")
});


// add functionalities
app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//use routes
app.use(indexRoutes)

app.listen(8080, () => {
    console.log("connected on port 8080")
});