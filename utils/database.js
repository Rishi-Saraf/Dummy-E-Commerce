// const mysql = require("mysql2");

// const pool = mysql.createPool({
//     host : "localhost",
//     user : "root",
//     database : 'products',
//     password : 'iamnoob',
// })

// module.exports = pool.promise();

const Sequelize = require("sequelize")

const sequelize = new Sequelize("products","root","iamnoob",{
	dialect:"mysql",
	host: "localhost"
})

module.exports = sequelize;