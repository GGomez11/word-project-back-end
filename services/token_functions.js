const extractToken = (req) => {
    encodedToken = req.headers.authorization 
    bufferObj = Buffer.from(encodedToken, "base64")
    decodedCredentials = bufferObj.toString('utf8').split(' ')[1]
    return decodedCredentials
}

module.exports = {
    extractToken: extractToken
}