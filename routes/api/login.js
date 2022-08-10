const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserModel = require('../../models/User')

router.get('', (req, res) => {
    const saltRounds = 10;
    const myPlaintextPassword = 's0/\/\P4$$w0rD';
    const someOtherPlaintextPassword = 'not_bacon';

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
            res.json({ 'salt': salt, 'hash': hash })
        });
    });
})

router.post('/register', (req, res) => {
    email = req.body.email
    password = req.body.password

    console.log(checkIfEmailUsed(email))
    if (checkIfEmailUsed(email)) {
        console.log('User with ' + email + ' already exists!')
    } else {
        const user = new UserModel({ email: email, password: password })
        user.save(err => {
            if (err) {
                console.log(err)
            }
        })
        console.log('Created new user')
    }


})

const checkIfEmailUsed = (email) => {
    UserModel.find({ 'email': email }, (err, users) => {
        if (err) {
            console.log(err)
        }
        if (users.length) {
            console.log('true')
            return true
        } else {
            console.log('false')
            return false
        }

    })
}

module.exports = router