const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const crypto = require('crypto');

const ForgotPassSchema = new Schema({

    User_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        immutable:true,
        required:true
    },
    OTP:
    {
        type:String,
        immutable:true
    },
    expiresAt:
    {
        type:Date,
        required:true
    }


},{timestamps:true})


const otpR = mongoose.model("otps",ForgotPassSchema);//this otpR means OTP reset
module.exports = otpR; 