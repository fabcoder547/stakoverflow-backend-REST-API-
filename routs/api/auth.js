const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const passport = require('passport');

const key = require('../../setup/myUrl');


//@GET -  /api/auth
//@desc-  request for authentication
//@access- PUBLIC


router.get('/', (req, res) => {
    res.json({
        msg: "I am done with authentication"
    })
})

//@POST -  /api/auth/register
//@desc-  request for registration
//@access- PUBLIC

let Person = require('../../models/Person');

router.post('/register', (req, res) => {
    Person.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res
                    .status(400)
                    .json({
                        msg: 'this email id is already in system please login'
                    });
            } else {
                const newPerson = new Person({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                    })
                    //encrypting password with bcrypt js

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {

                        newPerson.password = hash;
                        newPerson
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });

            }
        })
        .catch(err => console.log(err))
})

//@POST -  /api/auth/login
//@desc-  request for login
//@access- PUBLIC

router.post('/login', (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        Person
            .findOne({
                email: email
            })
            .then(person => {
                if (!person) {
                    res.status(404).json({
                        msgerror: "hey user is not found"
                    })
                    return;
                }
                bcrypt.compare(password, person.password)
                    .then(isCorrect => {
                        if (isCorrect) {
                            // res.json({
                            //     msg: 'login successfully'
                            // })

                            //use payload and create token


                            payload = {
                                id: person.id,
                                name: person.name,
                                email: person.email
                            }

                            jwt.sign(payload, key.secret, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if (err) throw err;
                                res.json({
                                    token: 'bearer ' + token,
                                    msg: 'successfully given  token'
                                })

                            })
                        } else {
                            res.status(404).json({
                                passworderror: 'Incorrect password'
                            });
                        }
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => {
                console.log(err);
            })

    })
    //@GET -  /api/auth/Profile
    //@desc-  request for profile
    //@access- PRIVATE....

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    console.log(req);
})









module.exports = router;