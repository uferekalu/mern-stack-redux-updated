const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/newMernPostRecord', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
    err => {
        if (!err)
            console.log('Mongodb connection succeeded')
        else
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
    })