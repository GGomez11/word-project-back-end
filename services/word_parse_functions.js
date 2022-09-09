const parse_word = (response) => {
    let parsedSyn = response.results.map(result => {
        /** Gets synonyms for the given definition, if a synonym for the definition exists  */
        if(result.synonyms){
            var synms = result.synonyms.map(synonym => {
                return synonym
            })
        }
        /** Returns one object */
        return {definition: result.definition, partsOfSpeech: result.partOfSpeech, synonym: synms}
    })
    /** Returns array of objects */
    return parsedSyn
}

module.exports = {
    parse_word: parse_word
}