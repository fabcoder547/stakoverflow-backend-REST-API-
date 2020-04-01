var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')

const Key = require('../setup/private');
const mongoose = require('mongoose');
// const User = require('../models/User')
const User = mongoose.model('myuser')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Key.secret;



module.exports = {
    stratagy: passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({
            _id: jwt_payload.id
        }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);

            }
        });
    }))
}