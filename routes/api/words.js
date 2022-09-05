const express = require('express')
const router = express.Router()
const WordModel = require('../../models/Word')
const token_functions = require('../../services/token_functions')
const word_parse_functions = require('../../services/word_parse_functions')
const jwt = require('jsonwebtoken')
const axios = require('axios')

router.use( async(req, res, next) => {
    console.log('Time:', Date.now())
    
    if(!req.headers.authorization) {
        res.status(401).json({"message": "Pass Authorization Header"})
    }
    
    const token = token_functions.extractToken(req)
    try {
        const isValid = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (isValid === undefined) {
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
})

//Get all words 
router.get('/', (req, res) => {
    const instance = WordModel.find()
        .then(data => {
            res.json({words: data, isValid: true})
        })
        .catch(err => {
            res.json({ message: "Error" })
        })
})

//Get a word by word
router.get('/:word', (req, res) => {
    const instance = WordModel.find({ word: req.params.word })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        })
})

//Kept for future reference
// //Delete a word by id
// router.delete('/:id', (req,res) => {
//     const instance = WordModel.remove({_id: req.params.id})
//     .then(data => {
//         res.json(instance)
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })

//Delete a word by word param
router.delete('/:word', (req, res) => {
    /** creating an instance (document) of WordModel */
    const instance = WordModel.deleteOne({ word: req.params.word })
        .then(data => {
            console.log("Deleted " + req.params.word)
            res.json(instance)
        })
        .catch(err => {
            res.json(err)
        })
})

/** Post a word */
router.post('/', (req, res) => {
    word = req.body.word

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
            const instance = new WordModel({
                word: word,
                definitions: record,
                link: 'https://translate.google.com/?hl=en&sl=auto&tl=es&text='+word+'&op=translate',
            })

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