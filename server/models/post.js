const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/database')

module.exports = {
    Post: sequelize.define('post', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        privateStatus: DataTypes.BOOLEAN
    })
}

// Here we are creating models which work the same way as setting up a table in SQL terms.
// It's defining everything we normally would with a SQL query but created and Object Model. We can then use the word Post (in this case)
// to run and put information in with the keywords defined (id, title, content, privateStatus)