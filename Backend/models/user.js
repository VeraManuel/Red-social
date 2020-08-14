'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var UserSchema = Schema({
    name: String,
    lastname: String,
    nickname: String,
    password: String,
    email: String,
    role: String,
    image: String
});

module.exports = moongose.model('User', UserSchema);
