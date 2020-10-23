const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const house = new Schema({
    name : {
        type:String,
        required:true
    },
    category : {
        type:Schema.Types.ObjectId,
        required:true,
    },
    adress:{
        type:String,
        require:true
    },
    acreage:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:String,
        require:true
    },
    image:{
        type:Array,
        require:true
    }
    ,
    user:{
        type:Schema.Types.ObjectId,
        require:true
    }
},{
    timestamps:true,
})

module.exports = mongoose.model('home',house);