const express = require('express')
const apiRouter = express.Router()
const { checkUser, requireLogin } = require('./middleware')

apiRouter.use(checkUser)

const authController = require('./controllers/authController')
const mainController = require('./controllers/mainController')

apiRouter.post('/auth/login', authController.login)
apiRouter.post('/auth/register', authController.register)

apiRouter.get('/home/get-matches-ids', requireLogin, mainController.getMatchesIds)
apiRouter.get('/home/get-matches-history', requireLogin, mainController.getMatchesInfoByIds)
apiRouter.post('/home/changepass', requireLogin, mainController.changePass)
apiRouter.post('/home/logout', requireLogin, mainController.logout)



module.exports = apiRouter