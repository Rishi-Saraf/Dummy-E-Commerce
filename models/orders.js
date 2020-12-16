const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderModel = new Schema(
    {
        userId : {type : Schema.Types.ObjectId , ref : "User"},
        products : [
            {
                product : {type : Object, ref : "Product"},
                qty : {type : Number,required : true}
            }
        ]
    }
)

module.exports =  mongoose.model('Order',orderModel)