const express = require('express')
const app = express()
const config = require('./config')
const apiRouter = require('./apiRouter')
const cors = require('cors')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)


let sessionStore = new MongoDBStore({
    url: config.database,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 90 // 90 days in milliseconds
})

app.use(cors())
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(express.json())
app.use(session({
    secret: config.secret,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 90
    }
}))

require('./db/mongoose')

app.use('/api/', apiRouter)

app.listen(config.port, () => console.log('Starting server...'))