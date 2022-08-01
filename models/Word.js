/** Describing how the documents look (schema) */

const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    word: String,
    definitions: mongoose.Schema.Types.Mixed,
    link: String
})

/** 
 *  Exporting a mongoose model that is used for creating/reading 
 *  documents from the MongoDB database
 */
module.exports = mongoose.model('Words', PostSchema);