const mongoose = require('mongoose')

var PostRecord = mongoose.model('PostRecord',
{
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    textarea: {
        type: String,
        required: true
    },
    dept: {
        type: String,
        required: true
    },
    courses: [{
        type: String,
        required: true
    }],
    panel: {
        type: String,
        required: true
    }
}, 'PostRecords')

module.exports = { PostRecord }