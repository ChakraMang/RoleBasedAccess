const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {type : String, required : true, trim : true},
    email : {type : String,required:true,unique:true, trim : true},
    password : {type:String,required : true},
    role : {type : String, default : 'intern',enum : ["intern","SDE1","SDE2","SDE3", "Admin"]}    
},{timestamps : true})
const user = mongoose.model('User',userSchema);

module.exports = user;