// const mongodb = require('mongodb')
// const mongoClient = mongodb.MongoClient
// const URL = require('../url.js')
// var _db;

// const mongoCli = new mongoClient(URL, {  useUnifiedTopology: true,useNewUrlParser: true  })

// const mongoConnect = (cb) =>{
// mongoCli.connect()
// .then(client=>{
// 	console.log("CONNECTED")
// 	_db = client.db('shop')
// 	cb()
// })
// .catch(err=>console.log(err))
// }

// const getDb = () => {
// 	if(_db){
// 		return _db
// 	}
// 	console.log('No database found')
// }

// exports.mongoConnect = mongoConnect
// exports.getDb = getDb
