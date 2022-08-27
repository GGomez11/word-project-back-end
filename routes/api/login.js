const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserModel = require('../../models/User')
const jwt = require('jsonwebtoken')
const token_functions = require('../../services/token_functions')

router.use((req, res, next) => {
    console.log('Time:', Date.now())
    if(!req.headers.authorization)
        res.status(401).json({"message": "Pass Authorization Header"})
    next()
})

router.post('/verify', async (req, res) => {
    const token = token_functions.extractToken(req)
    try {
        const isValid = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (isValid !== undefined) {
            res.json({"isValid": true})
        } else {
            res.status(403).json({"isValid": false})
        }
    } catch(err) {
        res.json({"error": 'Error verifying token'})
    }    
})

router.post('/login', async (req, res) => {
    extractCredentials(req)

    try {
        data = await UserModel.findOne({ 'email': email })
    } catch (error) {
        console.error(error) // from creation or business logic
    }

    if (data) {
        match = await bcrypt.compare(password, data.password)
        if (match) {
            accessToken = jwt.sign({"email": email}, process.env.ACCESS_TOKEN_SECRET)
            res.json({
                "isAuthenticated": true,
                "message": "Correct password",
                "accessToken": accessToken
            })
        } else {
            res.json({
                "isAuthenticated": false,
                "message": "Incorrect password"
            })
        }
    } else {
        res.json({
            "message": 'User does not exist with email: ' + email,
            "isAuthenticated": false
        })
    }
})

router.post('/register', async (req, res) => {
    extractCredentials(req)

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

function extractCredentials(req) {
    credentials = req.headers.authorization
    encodedCredentials = credentials.split(' ')[1]
    bufferObj = Buffer.from(encodedCredentials, "base64")
    decodedCredentials = bufferObj.toString('utf8')

    email = decodedCredentials.split(':')[0]
    password = decodedCredentials.split(':')[1]
}

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