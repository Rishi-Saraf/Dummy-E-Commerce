// const getDb = require('../utils/database').getDb
// const MongoDb = require('mongodb')

// class Products{
//     constructor(title,price,desc,imageUrl,id,userId){
//         this.title = title
//         this.price = price
//         this.desc = desc
//         this.imageUrl = imageUrl
//         this._id = id ? new MongoDb.ObjectID(id) : null
//         this.userId = userId
//     }
//     save(cb){
//         const db = getDb()
//         let dbOps
//         if(!this._id){
//             dbOps =  db.collection('product').insertOne(this)                   
//         }
//         else{
//             dbOps =  db.collection('product').updateOne({_id: new MongoDb.ObjectId(this._id)},{$set:this})
//         }
//         return dbOps
//         .then(result=>{
//             console.log(result)
//             cb()
//         })
//         .catch(err=>console.log(err))
//         }
        
//     static fetchAll() {
//         const db = getDb()
//         return db.collection('product')
//         .find().toArray()
//         .then(product=>{
//             console.log(product)
//             return product
//         })
//         .catch(err=>console.log(err))
//     }

//     static findById(prodId){
//         const db = getDb()
//         return db.collection('product')
//         .find({_id: new MongoDb.ObjectId(prodId)})
//         .next()
//         .then(product=>{return product})
//         .catch(err=>console.log(err))
//     }

//     static deleteById(prodId){
//         const db = getDb()
//         return db.collection('product').deleteOne({_id: new MongoDb.ObjectID(prodId)})
//     }
//     }
    
// module.exports = Products

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = mongoose.model('Product',productSchema)