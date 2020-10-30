const Sequelize = require("sequelize")
const sequelize = require("../utils/database.js")

const Product = sequelize.define('product',{
    id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true,
    },
    title : Sequelize.STRING,
    price : {
        type : Sequelize.INTEGER,
        allowNull : false
    },
    desc : {
        type : Sequelize.STRING,
        allowNull : false
    },
    imageUrl : {
        type : Sequelize.STRING,
        allowNull : false
    }
})

module.exports = Product