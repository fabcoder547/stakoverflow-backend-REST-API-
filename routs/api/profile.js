const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Person = require('../../models/Person')
const Profile = require('../../models/ProfileSchema')
    // const Profile = mongoose.model('myprofile');
    //@GET -  /api/Profile/
    //@desc-  request for  users personal profile
    //@access- PRIVATE....


router.get('/', passport.authenticate('jwt', {
    session: false,
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (profile) {
                res.json({
                    msg: 'Profile found here',
                    profile: profile,
                })
            } else {
                res.json({
                    msg: 'profile not found here and create a profile',
                })
            }
        })
        .catch(err => {
            console.log('Profile not found ' + err);
        })
});

// @POST -  /api/Profile/
// @desc-  request for UPDATING/SAVING users personal profile
// @access- PRIVATE....

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    profileValues = {};
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.city) profileValues.city = req.body.city;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (req.body.languages) {
        profileValues.languages = req.body.languages.split(',');
    }
    profileValues.socialmedia = {};
    if (req.body.youtube) profileValues.socialmedia.youtube = req.body.youtube;
    if (req.body.instagram) profileValues.socialmedia.instagram = req.body.instagram;
    if (req.body.facebook) profileValues.socialmedia.facebook = req.body.facebook;
    //some database stuff 

    Profile.findOne({
            user: req.user.id
        }).then(profile => {
            if (profile) {
                Profile.findOneAndUpdate({
                        user: req.user.id
                    }, profileValues)
                    .then(profile => {
                        res.json({
                            msg: 'updated user',
                            profile: profile
                        })
                    })
                    .catch(err => {
                        console.log('error in updating users profile ' + err);
                    })
            } else {
                Profile.findOne({
                        username: req.body.username
                    })
                    .then(profile => {
                        if (profile) {
                            res.json({
                                msg: 'Username is already availabel please change it'
                            })
                        } else {
                            newprofile = new Profile(profileValues);
                            newprofile.save()
                                .then(profile => {
                                    res.json(profile)
                                })
                                .catch(err => {
                                    console.log('error in saving aprofile in database');
                                });
                        }


                    })
                    .catch(err => {
                        console.log('Error in finding user with same username' + err);
                    })
            }
        })
        .catch(err => {
            console.log('Error in finding a profile' + err);
        })

})

//@GET -  /api/Profile/:username:number
//@desc-  request for  users personal profile
//@access- PUBLIC

router.get('/:username', (req, res) => {
        Profile.findOne({
                username: req.params.username
            }).populate('user')
            .then(profile => {
                if (profile) {
                    res.json({
                        msg: 'user is found',
                        profile: profile
                    })
                } else {
                    res.json({
                        msg: 'user with this username is not found'
                    });
                }
            })
            .catch(err => {
                console.log('Error in finding user with username in params');

            })

    })
    // /@GET -  /api/profile/find/everyone
    //@desc-  request for ALL the profiles in database
    //@access- PUBLIC

router.get('/find/everyone', (req, res) => {
    Profile.find()
        .populate('user')
        .then(profiles => {
            if (profiles) {
                res.json(profiles


                )
            } else {
                res.json({
                    msg: 'no user with profile  is not found'
                });
            }
        })
        .catch(err => {
            console.log('Error in finding ALL THE profiles in DATABASE');

        })
})


// /@GET -  /api/profile/find/numberofprofiles
//@desc-  request for nUMBER OF PROFILES IN DATABASE
//@access- PUBLIC

router.get('/find/numberofprofiles', (req, res) => {
        Profile.find()
            .populate('user')
            .then(profiles => {
                if (profiles) {
                    res.json({
                        count: profiles.length
                    })
                } else {
                    res.json({
                        msg: 'No user profile is here'
                    });
                }
            })
            .catch(err => {
                console.log('Error in finding the number of profiles' + err);

            })
    })
    // @DELETE -  /api/profile/
    //@desc-  request for profile in Database
    //@access- PRIVATE


router.delete('/', passport.authenticate('jwt', {
        session: false
    }), (req, res) => {
        Profile.findOne({
                user: req.user.id
            }).then(profile => {
                if (!profile) {
                    res.json({
                        msg: 'No profile found'
                    })
                }
                Profile.findOneAndRemove({
                        user: req.user.id
                    })
                    .then(() => {
                        Person.findOneAndRemove({
                            _id: req.user.id
                        }).
                        then(() => {
                                res.json({
                                    msg: 'profile deleted successfully'
                                })
                            })
                            .catch(err => console.log('error in deleting persons registration form'))
                    })
                    .catch(err => {
                        'error in removing a profile'
                    })
            })
            .catch(err => console.log('error in finding a profile in delete request' + err))
    })
    // @POST -  /api/profile/workrole
    //@desc-  request creating a workrole Database
    //@access- PRIVATE

router.post('/workrole', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {


            if (!profile) {
                res.json('No profile for this user crete profile')
            } else {
                const newWork = {};
                if (req.body.role) newWork.role = req.body.role;
                if (req.body.from) newWork.role = req.body.from;
                if (req.body.to) newWork.role = req.body.to;
                if (req.body.company) newWork.role = req.body.company;
                if (req.body.details) newWork.role = req.body.details;

                profile.workrole.push(newWork);

                profile.save().then(profile => {
                    res.json({
                        msg: 'workrole added',
                        profile: profile
                    })
                }).catch(err => console.log(err))
            }

        })
        .catch(err => console.log('error in creating workrole'))





})



router.delete('/workrole/:w_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (!profile) {
                res.json({
                    msg: 'No profile found'
                })
            } else {
                removethis = profile.workrole.filter(data => {
                    data._id == req.params.w_id
                })
                index = profile.workrole.indexOf(removethis);
                profile.workrole.pop(index);
                profile.save().then(profile => {
                    res.json({
                        profile: profile
                    })
                }).catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})
module.exports = router;