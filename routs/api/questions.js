const express = require('express');
const router = express.Router();
const passport = require('passport');

const Person = require('../../models/Person')
const Profile = require('../../models/ProfileSchema')
const Question = require('../../models/Questionschema');


//@POST -  /api/questions
//@desc-  request for posting a question
//@access- PRIVATE....


router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    myq = {}
    var myusername;
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (profile) {
                myusername = profile.username;


            } else {
                myusername = undefined;
            }

        })
        .catch(err => {


            console.log(err + 'error in finding a profile in posting a question')
        })


    if (typeof myusername != undefined) {
        myq.username = myusername;
    }
    myq.user = req.user.id;
    myq.textone = req.body.textone;
    myq.texttwo = req.body.texttwo;

    newquestion = new Question(myq)
    newquestion.save()

    .then(question => {
            res.json({
                msg: 'saved success',
                username: myusername,
                question: question,
            })


        })
        .catch(err => console.log('error in saving a question' + err))



})


//@POST -  /api/questions/all
//@desc-  request for posting a question
//@access- PUBLIC....

router.get('/allquestions', (req, res) => {

    Question.find()
        .sort('-date')
        .then(questions => {
            res.json(questions)
        })
        .catch(err => {
            console.log(
                'Error for showing all the questions'
            );

        })

})

// /@POST -  /api / questions/answer/:id
// //@desc-  request for answering a question
//@access- PRIVATE

router.post('/answer/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {


    Question.findOne({
            _id: req.params.id
        })
        .then(question => {
            if (!question) {
                return res.json({
                    msg: 'No question found with this id'
                })
            }

            myanswer = {
                user: req.user.id,
                text: req.body.text,

            };
            question.answers.push(myanswer);
            question.save().then(question => {
                    res.json({
                        question: question
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => {
            console.log(err);
        })

})

// /@POST -  /api / questions/upvote/:id
// //@desc-  request for upvoting the question
//@access- PRIVATE
router.post('/upvote/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Question.findOne({
            _id: req.params.id
        })
        .then(question => {

            if (!question) {
                return res.json({
                    msg: 'question not found '
                })
            }
            removethis = question.upvotes.filter(data => data.user.toString() === req.user.id.toString())
            index = question.upvotes.indexOf(removethis);
            if (removethis.length > 0) {
                question.upvotes.pop(index);

            } else {
                upvote = {
                    user: req.user.id,
                }
                question.upvotes.push(upvote);
            }
            console.log(removethis);
            question.save().then(question => {
                res.json(question)
            }).catch(err => {
                console.log(err);
            })



        })
        .catch(err => {
            console.log(err);

        })

})

// /@DELETE -  /api / questions/delete/:id
// //@desc-  request for deleting one question of loggedin user
//@access- PRIVATE


router.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {


    Question.findOne({
            _id: req.params.id
        }).then(question => {

            if (question.user.toString() === req.user.id.toString()) {
                Question.findOneAndRemove({
                        _id: req.params.id
                    })
                    .then(() => {
                        res.json({
                            msg: 'deleted successfully'
                        })
                    })
                    .catch(err => console.log(err))
            } else {
                res.json({
                    msg: 'You dont have right to delete this '
                })
            }




        })
        .catch(err => console.log(err))

})



// /@DELETE -  /api / questions/delete/:id
// //@desc-  request deleting all the questions of users
//@access- PRIVATE

router.delete('/delete/all/questions', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    Question.deleteMany({
            user: req.user.id
        })
        .then((result) => {
            res.json({
                msg: 'all questions deleted successfully',
                result: result
            })
        })
        .catch(err => {
            console.log(err);
        })


})





module.exports = router;