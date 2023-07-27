require('dotenv').config()
const {CONNECTION_STRING } = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }

})

module.exports = {
    sequelize
}

// Here we are creating the connection to the database (in this case i'm using elephantSQL).
// After we are simply exporting sequelize to be used across the board with that established connection behind the word sequelize