const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: false,
    },
    profilepic: {
        type: String,
        required: false,

    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('myperson', PersonSchema);