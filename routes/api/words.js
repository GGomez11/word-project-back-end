const express = require('express')
const router = express.Router()
const UserModel = require('../../models/User')
const token_functions = require('../../services/token_functions')
const word_parse_functions = require('../../services/word_parse_functions')
const jwt = require('jsonwebtoken')
const axios = require('axios')

router.use( async(req, res, next) => {
    console.log('Time:', Date.now())
    
    if(!req.headers.authorization) {
        res.status(401).json({"message": "Pass Authorization Header"})
    } else {
        const token = token_functions.extractToken(req)
    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        email = decoded.email
        res.locals.email = email
        if (decoded === undefined) {
            res.status(403).json({"isValid": false})
        } else {
            next()
        }
    } catch(err) {
        res.json({
                "isValid": false,
                "message": 'Error verifying token'
            })
    }       
    }
})

//Get all words 
router.get('/', (req, res) => {
    email = res.locals.email

    console.log('hit')
    const instance = UserModel.findOne({email: email})
        .then(data => {
            res.json({words: data.words, isValid: true})
        })
        .catch(err => {
            res.json({ message: "Error" })
        })
})

//Delete a word by word param
router.delete('/:word', async (req, res) => {
    email = res.locals.email
    wordP = req.params.word

    const instance = await UserModel.findOne({email: email})
    if (!instance) {
        res.json({'error': true})
    } 
    const newWords = instance.words.filter(word => word.word !== wordP)
    instance.words = newWords
    await instance.save()
    res.json({'isSuccess': true, 'message': 'Deleted ' + wordP})
})

/** Post a word */
router.post('/word', (req, res) => {
    word = req.body.word
    email = res.locals.email

    let options = {
        method: 'GET',
        url: 'https://wordsapiv1.p.rapidapi.com/words/'+word,
        headers: {
          'x-rapidapi-key': process.env.WORD_API_KEY,
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com'
        }
    }

    axios.request(options)
        .then(async data => {
            record = word_parse_functions.parse_word(data.data)
            
            const newWord = {
                word: word,
                definitions: record,
                link: 'https://translate.google.com/?hl=en&sl=auto&tl=es&text='+word+'&op=translate',
            }

            const instance = await UserModel.findOne({
                email: email
            })
            
            instance.words = [...instance.words, newWord]
            console.log(instance)
            await instance.save()
                .then(data => {
                    console.log("Added " + req.body.word)
                    res.json({isAdded: true, message: 'Added word' + word})
                })
                .catch(err => {
                    res.json(err)
                })
        })
        .catch(err => {
            res.json({isAdded: false, message: 'Word not found'})
        })
})

module.exports = router 


/**
 * Format of the object being sent to database
 * const example = {
 *     word: response.word,
 *     definitions: [{
 *         definition: '',
 *         partsOfSpeech: '',
 *         synonym: [],    
 *     }],
 *     link: ''  
 * }
 */ 