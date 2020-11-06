const sequelize = require('../utils/database.js')

const Sequelize = require('sequelize')

const cartItem = sequelize.define('cartItem',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    qty : Sequelize.INTEGER
})

module.exports = cartItem