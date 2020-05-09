const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profileschema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'myperson',
    },
    username: {
        type: String,
        required: true,
    },
    country: {
        type: String
    },
    city: {
        type: String,
    },
    languages: [String],
    portfolio: {
        type: String,
    },
    workrole: [{
        role: {
            type: String,
        },
        company: {
            type: String,
        },
        from: {
            type: Date,
        },
        to: {
            type: Date,
        },
        details: {
            type: String,
        }

    }],
    socialmedia: {
        youtube: {
            type: String,

        },
        instagram: {
            type: String,

        },
        facebook: {
            type: String,

        }
    }



});

module.exports = mongoose.model("myprofile", Profileschema);