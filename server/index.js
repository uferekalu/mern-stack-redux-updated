require('./db')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require("passport");

var postRecordRoutes = require('./controllers/postRecordControllers')

var app = express()
app.use(bodyParser.json())
app.use(cors({origin: 'http://localhost:3000'}))
app.listen(process.env.PORT || 4000, () => console.log('Server started at: 4000'))

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);


app.use('/postrecord', postRecordRoutes)