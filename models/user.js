//for authentication of user means login 
const mongoose=require("mongoose");
 const Schema = mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");//yeh username ar paasword  schema me add kr dega ar paasword bhi kr dega issliye hmne sirf schema me emial bnaya hai aki vo khud bna dega

 const userSchema= new Schema ({
     email: {
         type: String,
         required: true,
     },
 });
 userSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model("User", userSchema);