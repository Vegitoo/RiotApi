const mongoose = require('mongoose')
const { database } = require('../config')

//db connect
async function db() {
    await mongoose.connect(database)
    console.log('Starting db...')
}

db()