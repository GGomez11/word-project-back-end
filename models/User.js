const mongoose = require('mongoose')

const WordSchema = mongoose.Schema({
    word: String,
    definitions: mongoose.Schema.Types.Mixed,
    link: String
})

const UserSchema = mongoose.Schema({
    email: String,
    password: String,
    words: [WordSchema]
})

module.exports = mongoose.model('User', UserSchema);