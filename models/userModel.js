const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new Schema({
    FirstName:
    {
        type:String,
        maxLength:15,
        required:true
    },
    LastName:
    {
        type:String,
        maxLength:15,
        required:true
    },
    gender:
    {
        type:String,
        validate(value)
        {
            if(!["Male","Female","Others"].includes(value))
            {
                throw new Error("Invalid gender!");
            }
        }
    },
    EmailId:
    {
        type:String,
        maxLength:20,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutable:true
    },
    password:
    {
        type:String,
        unique:true,
        required:true
        //select:false  //this will not send password as response to client or frontend(this is secure approach according to gpt)
    },
    UserPhoto:
    {
        type:String,
        default:"this is photo"
    },
    refreshToken:
    {
        type:String,
    }
},{timestamps:true})


// userSchema.methods.Hashpasswordandstore = function(password){

//     const salt  = bcrypt.genSalt(10);
//     const Hashed = bcrypt.hash(password,salt);
//     return Hashed;
// }

//Incoming client password verification of comparison
userSchema.methods.comparePassword = function(password){
    const compared =bcrypt.compare(password,this.password);//
    return compared;
}


//Access Token Generation
userSchema.methods.MakeJwt = function(){
    const JWTtoken = jwt.sign({EmailId:this.EmailId },process.env.PRIVATE_KEY,{expiresIn:"1h"});
    return JWTtoken;
}


//Refresh Token
userSchema.methods.MakeRefreshToken = async function(){
    const randomToken =crypto.randomBytes(64).toString("hex");
    const hashedRToken = await bcrypt.hash(randomToken,10);
    this.refreshToken = hashedRToken;//we just added to the request object
    return randomToken;
}



const User = mongoose.model("user",userSchema);
module.exports = User;