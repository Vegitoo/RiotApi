const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        minLength: 5,
        required: true
    },
    password: {
        type: String,
        minLength: 5,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    InfoAboutRiotAcc: {
        type: Object,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
})

UserSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.setPassword = async function (password) {
    let hash = await bcrypt.hash(password, 10)
    this.password = hash
    return hash
}


const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel