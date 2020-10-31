const sequelize = require('../utils/database.js')

const Sequelize : require('sequelize')

const cart = sequelize.define(cart,{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    }
})

module.exports = cart