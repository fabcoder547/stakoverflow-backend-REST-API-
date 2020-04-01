const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Key = require('../../setup/private');
var passport = require('passport');


const User = require('../../models/User');

//@POST ::  /api/auth/signup
//@Des ::  request for registerign a new user
//@ACCESS :: PUBLIC

router.post('/signup', (req, res) => {
    console.log(req.body);

    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                const newuser = new User(req.body);

                bcrypt.genSalt(10, function(err, salt) {
                    if (err) throw err;

                    bcrypt.hash(newuser.password, salt, function(err, hash) {
                        if (err) throw err;
                        newuser.password = hash;
                        newuser.save()
                            .then(user => {
                                res.json({
                                    msg: "User saved succesfully",
                                    user: user,
                                })
                            })
                            .catch(err => {
                                res.json({
                                    msg: 'error in saving a user',
                                    err: err,
                                })
                            })
                    });
                });

            } else {
                res.json({
                    msg: 'User with this email ID already exits'
                })
            }
        })
        .catch(err => {
            res.json({
                msg: 'ERRor in finding user in signup route'
            })

        })


})


//@POST ::  /api/auth/login
//@Des ::  request for login of user
//@ACCESS :: PUBLIC

router.post('/login', (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.json({
                    msg: "No user found"
                });
            }
            bcrypt.compare(req.body.password, user.password)
                .then((result) => {
                    if (result) {


                        payload = {
                            id: user._id,
                            email: user.email,
                            name: user.name,
                        }
                        jwt.sign(payload, Key.secret, {
                            expiresIn: 60 * 60
                        }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                msg: "Login Successful",
                                token: 'bearer ' + token,
                            })
                        })

                        return;

                    }
                    res.json({
                        msg: "Invalid PASSWORD"
                    })
                }).catch(err => {
                    res.json({
                        msg: "Error in comaparing passwords"
                    })
                })
        })
        .catch(err => {
            res.json({
                msg: "ERror in finding a user in database"
            })
        })
})



router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log(req.user);
    res.json({

        msg: "DONE DONE DONE",
        user: req.user,
    })
})




module.exports = router