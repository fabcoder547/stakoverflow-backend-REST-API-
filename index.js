const express = require('express');
const passport = require("passport");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const app = express();
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const questionRoutes = require('./routes/api/question');
const PORT = process.env.PORT || 5000;

//Connecting to the DATABASE.....
mongoose.connect("mongodb+srv://atharv:atharv123@cluster1-jkf7y.mongodb.net/test?retryWrites=true&w=majority", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('Connected successfully');

    })
    .catch(err => {
        console.log('Not connected ' + err)
    })
    //Middlewares...
app.use(passport.initialize());
require('./strategies/JwtStratagy').stratagy;

app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json())
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/questions', questionRoutes)





app.get('/', (req, res) => {
        res.send("I am at home page");
    })
    //Listening to a port
app.listen(PORT, () => {
    console.log("server is running");

})