const UserModel = require('./db/models/users')

module.exports.checkUser = async (req, res, next) => {
    let userId = req.session.userId

    if (userId) {
        let user

        try {
            user = await UserModel.findById(userId)
        } catch (err) {
            console.log(err)
            return res.json({ success: false, code: 19, message: 'General error' })
        }

        if (user === null) {
            req.session.destroy()
        } else {
            res.locals.user = user
        }

    }

    next()
}

module.exports.requireLogin = async (req, res, next) => {
    if (!res.locals.user) {
        return res.json({ success: false, code: 18, message: 'Unauthorized' })
    }

    next()
}