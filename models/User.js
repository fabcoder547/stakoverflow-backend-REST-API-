const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: true,
    }



});

module.exports = mongoose.model('myuser', userSchema);