const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const house = new Schema({
    name : {type:String},
    loai : {type:Schema.Types.ObjectId},
    diachi:{type:String},
    dientich:{type:String},
    mota:{type:String},
    giaban:{type:String},
    giadang:{type:String},
    user:{type:Schema.Types.ObjectId}
})

module.exports = mongoose.model('home',house);