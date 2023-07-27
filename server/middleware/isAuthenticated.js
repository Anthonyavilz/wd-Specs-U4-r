require('dotenv').config()
const jwt = require('jsonwebtoken')
const {SECRET} = process.env

module.exports = {
    isAuthenticated: (req, res, next) => {
        const headerToken = req.get('authorization')
        // here we are declaring the header to be 'authorization' which is later defined in the Form.js under the axios request.
        // req.get is grabbing a header from the request which in this case is the string authorization

        if (!headerToken) {
            console.log('ERROR IN auth middleware')
            res.sendStatus(401)
        }

        // During this If statement, it checks to see if it doesn't have a headerToken from out request.get, it will send an error
        // stating there was an error in this middleware file and not allow the user to go further.

        let token

        // Here we are declaring a global variable for later usage

        try {
            token = jwt.verify(headerToken, SECRET)
        } catch (err) {
            err.statusCode = 500
            throw err
        }

        // In this try block, the token is being assigned to the verified jwt from the headerToken called on earlier along 
        // with the SECRET we've created in the .env file.
        // If it checks out, then it passes. If not it will created and send an error code of 500

        if (!token) {
            const error = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        // If the token does not exist/didn't get retrevied in the earlier code, it will provide an error code of 401, 
        // which we define/create as "not authenticated"

        next()

        // Once everything passes, the next() allows us to move forward to the specificed endpoint since this entire code block in the middleman between everything.
    }
}