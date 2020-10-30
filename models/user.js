const sequelize = require("../utils/database.js")
const Sequelize = require("sequelize")

const user = sequelize.define('user',{
	id : {
		type : Sequelize.INTEGER,
		primaryKey : true,
		autoIncrement : true,
		allowNull : false
	},

	name : {
		allowNull : false,
		type : Sequelize.STRING
	},

	email : {
		allowNull : false,
		type : Sequelize.STRING
	},
})

module.exports = user