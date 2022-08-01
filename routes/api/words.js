const express = require('express')
const router = express.Router()
const WordModel = require('../../models/Word')

//Get all words 
router.get('/', (req, res) => {
    const instance = WordModel.find()
        .then(data => {
            res.json(data)
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
    /** creating an instance (document) of WordModel */
    const instance = new WordModel({
        word: req.body.word,
        definitions: req.body.definitions,
        link: req.body.link,
    })
    instance.save()
        .then(data => {
            console.log("Added " + req.body.word)
            res.json(data)
        })
        .catch(err => {
            res.json(err)
        })
})

module.exports = router 