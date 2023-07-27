const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email :{
        type:String,
        required:[true , 'A user must have an email'],
        trim:true
    },
    favorites:{
        type:Array,
        default:[]
    },
    downloads:{
        type:Array,
        default:[]
    }
});

const User = mongoose.model('User',userSchema);

module.exports = User;