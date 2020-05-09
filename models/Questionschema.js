const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'myperson'
    },

    textone: {
        type: String,
        required: true,
    },
    texttwo: {
        type: String,

    },
    upvotes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'myperson'
        },
    }],
    answers: [

        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'myperson'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,

    }


})

module.exports = mongoose.model('myquestion', QuestionSchema);