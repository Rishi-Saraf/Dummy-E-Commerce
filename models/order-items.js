const sequelize = require('../utils/database')
const Sequelize = require('sequelize')

const OrderItems = sequelize.define('orderItem',{
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    qty : Sequelize.INTEGER
})

module.exports = OrderItems