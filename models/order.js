const sequelize = require('../utils/database')
const Sequelize = require('sequelize')

const Order = sequelize.define('order',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true,
        allowNull : false
    }
})

module.exports = Order