const UserModel = require('../db/models/users')
const { riotApiKey, authEmail, authPass } = require('../config')
const Utils = require('../Utils')

class AuthController {
    async login(req, res) {
        const { login, password } = req.body

        if (!login || !password) {
            return res.json({ success: false, code: 1, message: 'All fields are required.' })
        }

        if (login.length < 5) {
            return res.json({ success: false, code: 2, message: 'Login must be at least 5 characters long.' })
        }

        let user = await UserModel.findOne({
            login: {
                $regex: new RegExp("^" + login + "$", "i")
            }
        })

        if (!user) {
            return res.json({ success: false, code: 3, message: 'User not found' })
        }

        let checkPassword = await user.checkPassword(password)

        if (!checkPassword) {
            return res.json({ success: false, code: 4, message: 'Invalid password' })
        }

        req.session.userId = user._id

        res.json({
            success: true,
            user: {
                id: req.session.userId,
                login: user.login,
                created: user.created
            }
        })


        let response
        try {
            response = await Utils.getAxios().get(`https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${user.InfoAboutRiotAcc.id}?${riotApiKey}`)

        } catch(err) {
            console.log(err)
            return res.json({ success: false, code: 5, message: 'Summoner not found' })
        }
    }

    async register(req, res) {
        const { login, password, email, InfoAboutRiotAcc } = req.body

        if (!login || !password || !email) {
            return res.json({ success: false, code: 1, message: 'All fields are required.' })
        }

        if (typeof InfoAboutRiotAcc !== 'object') {
            return res.json({ success: false, code: 6, message: 'InfoAboutRiotAcc must be a object. (invalid type)' })
        }

        if (!(InfoAboutRiotAcc.hasOwnProperty('summonerName'))) {
            return res.json({ success: false, code: 7, message: 'InfoAboutRiotAcc must have key summonerName' })
        }

        if (login.length < 5) {
            return res.json({ success: false, code: 2, message: 'Minimum login length: 5' })
        }

        if (InfoAboutRiotAcc.summonerName.length < 3) {
            return res.json({ success: false, code: 8, message: 'Minimum summoner name length: 3' })
        }

        if (!Utils.validateEmail(email)) {
            return res.json({ success: false, code: 9, message: 'Email is not correct.' })
        }

        if (password.length < 5) {
            return res.json({ success: false, code: 10, message: 'Minimum password length: 5' })
        }

        let findUser = await UserModel.findOne({ login: login })

        if (findUser) {
            return res.json({ success: false, code: 11, message: 'User with given data already exists' })
        }

        let response
        try {
            response = await Utils.getAxios().get(`https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${InfoAboutRiotAcc.summonerName}?${riotApiKey}`)
            console.log(response.data)
        } catch (err) {
            console.log(err)
            return res.json({ success: false, code: 3, message: 'Summoner not found' })
        }

        if (response.status !== 200) {
            return res.json({ success: false, code: 12, message: 'Invalid status' })
        }

        let user = new UserModel({ login: login, email: email })

        user.InfoAboutRiotAcc = {
            summonerName: InfoAboutRiotAcc.summonerName,
            id: response.data.id,
            accountId: response.data.accountId,
            puuid: response.data.puuid,
            name: response.data.name,
            profileIconId: response.data.profileIconId,
            revisionDate: response.data.revisionDate,
            summonerLevel: response.data.summonerLevel,
            matchesIds: [],
            matchesInfo: []
        }

        await user.setPassword(password)


        try {
            await user.save()
        } catch (err) {
           return console.log(err)
        }

        res.json({ success: true })
    }
}

module.exports = new AuthController()