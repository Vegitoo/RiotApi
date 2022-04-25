const Utils = require("../Utils");
const UserModel = require('../db/models/users')
const {riotApiKey, baseUrl} = require("../config");

class MainController {
    async changePass(req, res) {
        let user = res.locals.user

        let { oldPass, newPass, confirmNewPass } = req.body

        if (!oldPass || !newPass || !confirmNewPass) {
            return res.json({ success: false, code: 13, message: 'All data is required.'})
        }
        if (oldPass.length < 5 || newPass.length < 5 || confirmNewPass.length < 5) {
            return res.json({ success: false, code: 2, message: 'Minimum password lenght: 5'})
        }

        if (newPass !== confirmNewPass) {
            return res.json({ success: false, code: 14, message: 'Confirm password is different from new password.'})
        }

        let oldPassVerify = await user.checkPassword(oldPass)

        if (!oldPassVerify) {
            return res.json({ success: false, code: 15, message: 'Old password is not correct.' })
        }

        let newPassVerify = await user.checkPassword(newPass)

        if(newPassVerify) {
            return res.json({ success: false, code: 16, message: 'New password can not be same as old password.' })
        }

        await user.setPassword(newPass)

        try {
            await user.save()
        } catch (err) {
            console.log(err)
            return res.json({ success: false, code: 0, message: 'Error saving data' })
        }

        res.json({ success: true })
    }

    async getMatchesIds(req, res) {
        let user = res.locals.user

        let response
        try {
            response = await Utils.getAxios('https://europe.api.riotgames.com/lol/match/v5')
                .get(`/matches/by-puuid/${user.InfoAboutRiotAcc.puuid}/ids?start=0&count=5&${riotApiKey}`)
        } catch(err) {
            console.log(err)
            return res.json({ success: false, code: 5, message: 'Summoner not found' })
        }

        let matchesIds = []

        if(response.data) {
            for( let matchId of response.data){
                matchesIds.push(matchId)
            }
        }
        user.InfoAboutRiotAcc = {
            ...user.InfoAboutRiotAcc,
            matchesIds: matchesIds
        }

        try {
            await user.save()
        } catch (err) {
            console.log(err)
            return res.json({ success: false, code: 0, message: 'Error saving data' })
        }

        res.json({ success: true })
    }

    async getMatchesInfoByIds(req, res) {
        let user = res.locals.user
        let response
        let matchesHistory = []
        if(user.InfoAboutRiotAcc.matchesIds.length !== []) {
            for( let matchId of user.InfoAboutRiotAcc.matchesIds ) {
                try {
                    response = await Utils.getAxios(`https://europe.api.riotgames.com/lol/match/v5/matches/`).get(`${matchId}?${riotApiKey}`)
                    matchesHistory.push(response.data)
                } catch (err) {
                    console.log(err)
                    return res.json({ success: false, code: 17, message: 'Wrong data' })
                }
            }
            user.InfoAboutRiotAcc = {
                ...user.InfoAboutRiotAcc,
                matchesInfo: matchesHistory
            }
        }
        try {
            await user.save()
        } catch (err) {
            console.log(err)
            return res.json({ success: false, code: 0, message: 'Error saving data' })
        }

        res.json({ success: true })
    }


    async logout(req, res) {
        await req.session.destroy()
        res.json({ success: true })
    }
}

module.exports = new MainController()