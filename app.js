/** Imports */
const express = require('express');
const app = express();
const wordRoutes = require('./routes/api/words');
const loginRoutes = require('./routes/api/login');
const mongoose = require('mongoose')
const bodyParser = require('body-parser',)
const cors = require('cors')

require('dotenv/config')

/** Parses incoming request bodies in a middleware before the handlers */
app.use(bodyParser.json())
app.use(cors())


/** Middleware functions that have access to the request and response object */
app.use('/words', wordRoutes);
app.use('/login', loginRoutes);

/** Port number decided by environment variable or defaulted to 5000 */
const PORT = process.env.PORT || 5000;

/** Connects to MongoDB database on Atlas */
mongoose.connect(process.env.NEW_DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }).then((result) => {
    console.log('Successfully connected to Atlas');
}).catch((err) => {
    console.log(err)
})

/** Start web server! */
app.listen(PORT, () => {
    console.log(`Web server listening at ${PORT}`)
})