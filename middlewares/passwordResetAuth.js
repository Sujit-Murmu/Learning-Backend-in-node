// import bcrypt from "bcrypt";
// import User from '../models/userModel.js';
// import crypto from 'crypto';
// import otpR from '../models/paswordForgotModel.js';

// export const PasswordResetMiddleware = async(req,res,next)=>{

//     try{
//         // console.log(req.body);
//         const EmailIdOfUser = req.body;
//         // console.log(EmailIdOfUser);
//         if(!EmailIdOfUser)
//         {
//             return res.status(400).json({
//                 message:"No email "
//             })
//         }

//         const IdentifyUser = await User.findOne({EmailId:EmailIdOfUser.EmailId});
//         // console.log(IdentifyUser);
//         if(!IdentifyUser)
//         {
//             return res.status(404).json({
//                 message:"No User Found"
//             })
//         }

//         const PINNuMBER = crypto.randomInt(100000,1000000).toString();

//         const PINSalt = await bcrypt.genSalt(10);
//         const PINHASHANDSTORE = await bcrypt.hash(PINNuMBER,PINSalt);
        

//         const OTPRecord = await otpR.create({User_id:IdentifyUser._id,OTP:PINHASHANDSTORE,expiresAt:new Date(Date.now()+60 * 1000)});//once expires otp will not be accepted anymore,later on i will think to delete this from db
//         // const OTPid =OTPRecord.User_id;
//         const perfectUser = await otpR.findOne({User_id:OTPRecord.User_id});//working now finding data insise otps collection using User_id not monggose default id created in otps collection automatically
//         // console.log(perfectUser);
        


        
//         // await otpR.findOne()
        

//         req.UnhashedPIN = PINNuMBER;
//         req.User = perfectUser;
        

//         next();

//     }
//     catch(err)
//     {
//         console.log(err);
//         res.status(500).json(
//             {
//                 message:"Internal server error on PasswordResetAuth"
                
//             }
//         )
//     }
// }