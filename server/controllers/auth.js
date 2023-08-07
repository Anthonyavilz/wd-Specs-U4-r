require('dotenv').config()
const {SECRET} = process.env
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const createToken = (username, id) => {
    return jwt.sign({username, id}, SECRET, {expiresIn: '2 days'})
}

module.exports = {
    register: async (req, res) => {
        try {
            const {username, password} = req.body
            const foundUser = await User.findOne({where: {username: username}})
            if (foundUser) {
                res.status(400).send('User already exist')
            } else {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)
                const newUser = await User.create({username: username, hashedPass: hash})
                console.log('user created', newUser)
                const token = createToken(newUser.dataValues.username, newUser.dataValues.id)
                const exp = Date.now() + 1000 * 60 * 60 * 48
                res.status(200).send({username: newUser.dataValues.username, userId: newUser.dataValues.id, token, exp})
            }
            
        } catch (error) {
            console.log('Register Error')
            res.sendStatus(400)
        }
    },

    login: async (req, res) => {
        try {
            const {username, password} = req.body
            const foundUser = await User.findOne({where: {username: username}})
            if (foundUser) {
                const isAuthenticated = bcrypt.compareSync(password, foundUser.hashedPass)
                
                if (isAuthenticated) {
                    const token = createToken(foundUser.dataValues.username, foundUser.dataValues.id)
                    const exp = Date.now() + 1000 * 60 * 60 * 48
                    res.status(200).send({username: foundUser.dataValues.username, userId: foundUser.dataValues.id, token, exp})
                } else {
                    res.status(400).send('1st cant login')
                }
            } else {
                res.status(400).send('2nd cant login')
            }
        } catch (error) {
            console.log('Login failed')
            res.sendStatus(400)
        }
    }
}