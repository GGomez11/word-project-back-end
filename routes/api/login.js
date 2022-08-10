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
    email = req.body.email
    password = req.body.password

    const isEmailUsed = await checkIfEmailUsed()

    if (isEmailUsed) {
        res.json({
            "status": false,
            "message": "Email is already used"
        })
    } else {
        createUser(email)
        res.json({
            "status": true,
            "message": "Email created"
        })
    }

})
module.exports = router

function createUser(email) {
    const user = new UserModel({ email: email, password: password })
    user.save(err => {
        if (err) {
            console.log('Error in saving' + err)
            res.json({
                "status": false,
                "message": "Error creating user"
            })
        }
    })
    console.log('Created new user')
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
