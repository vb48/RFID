const mongoose = require('mongoose')
const Schema = mongoose.Schema
 

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Company: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Img: {
        type: String, 
        required: true
    },
    RFID: {
        type: String, 
        required: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User