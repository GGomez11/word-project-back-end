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


router.post('/register', async (req, res) => {
    credentials = req.headers.authorization
    encodedCredentials = credentials.split(' ')[1]
    bufferObj = Buffer.from(encodedCredentials, "base64")
    decodedCredentials = bufferObj.toString('utf8')

    email = decodedCredentials.split(':')[0]
    password = decodedCredentials.split(':')[1]

    const isEmailUsed = await checkIfEmailUsed()

    if (isEmailUsed) {
        res.json({
            "createdUser": false,
            "message": "Email is already used"
        })
    } else {
        createUser()
        res.json({
            "createdUser": true,
            "message": "User created"
        })
    }
})
module.exports = router

function createUser() {
    saltRounds = 10

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            const user = new UserModel({ email: email, password: hash })
            user.save(err => {
                if (err) {
                    console.log('Error in saving' + err)
                    res.json({
                        "createdUser": false,
                        "message": "Error creating user"
                    })
                }
                console.log('Created new user')
            })
        });
    });
}

async function checkIfEmailUsed() {
    return await UserModel.findOne({ 'email': email })
        .then(data => {
            if (data) {
                console.log('User with ' + email + ' already exists!')
                return true
            } else {
                return false
            }
        })
        .catch(err => {
            console.error(err)
        })
}
