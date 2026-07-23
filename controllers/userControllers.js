// const User = require('../models/userModel')
// const { default: mongoose } = require('mongoose');
// const {UserZodSchema} = require('../userValidations/MainValidation');


import User from '../models/userModel.js';
import otpR from '../models/userModel.js';
import crypto from 'crypto';
import mongoose from "mongoose";
import { UserZodSchema } from '../userValidations/MainValidation.js';
import { PasswordSchema } from '../userValidations/passwordValidation.js';
import bcrypt from "bcrypt";
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
// const multer  = require('multer')
import multer from "multer";
const upload = multer();
// import {v2 as cloudinary} from 'cloudinary';
// import fs from 'fs';
import UploadToCloudinary from '../utils/cloudinary.js';







import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
//USER REGISTRATION API(✓✓ double check means this api or section is working fine giving satisfactory output for which it was made)
export const UserRegister = async(req,res)=>{        /*                    ✓✓                  */
    try{
        const userData = UserZodSchema.parse(req.body);
        const {password} =userData;

        // const HashedPassword = userData.Hashpasswordandstore(password);
        // userData.password = HashedPassword;

        const salt = await bcrypt.genSalt(10);
        const Hashss = await bcrypt.hash(password,salt);
        userData.password = Hashss;

        await User.create(userData);

        // const {Userpassword,...userWithoutPassword} = userData;

        res.status(200).json({
            message:"User Successfully Added",
            data:userData
        })
    }
    catch(err)
    {
        if(err.name === "ZodError"){
            return res.status(400).json({
                message:"Validation Failed",
                errors:err.errors
            });
        }

    res.status(500).json({
        message:"Internal Server Error",
        error:err.message
    })

    }
}

//User Login Controller(Applied Access and Refresh Token)[@@Task->make it better find where are places to error can occur so can add if statements  ✓✓(done) ]
//(✓✓ double check means this api or section is working fine giving satisfactory output for which it was made)
export const UserLogin = async(req,res)=>{       /*                    ✓✓                  */
    try{
    const {EmailId,password} = req.body;
    if(!EmailId)
    {
        return res.status(400).json(
        {
            message:"Please enter your EmailId"
        })
    }

    if(!password)
    {
        return res.status(400).json(
        {
            message:"Please enter your password"
        })
    }

    //if email and password are correctly entered correctly
    //next task is to verify user using provide emailId durning sign up or during login

    const ParticularUser = await User.findOne({EmailId:EmailId});//if user is found with provided emailId next step is to verify the password
    if(!ParticularUser){
        return res.status(404).json({
            message:"Invalid User"
        })
    }


    const finalCompared = await ParticularUser.comparePassword(password);//@@ tomorrows TASK THIS password comparison is not working properly ,it is allowing wrong password to login//I THINK MY SOME CODE LOGIC IS WRONG SOME REGARDING THIS
    //@@i found the mistake await was missing thats why it was accepting every wrong password and i was getting Login Successful everytime 
    //bcrypt.compare returns a promise if await not used it gives truthy everytime(task done  ✓✓ )

    if(!finalCompared)
    {
        return res.status(401).json({
            message:"Invalid password,Access denied!"
        })
    }

    //if password is valid or correct then next step is to generate JWT token and send to client for further crud operations after login

    const token = ParticularUser.MakeJwt();

    res.cookie("token",token, //sending token inside cookie to user or frontend after generating JWT token in previous step
    {
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge: 60 * 60 * 1000
    })

    const RToken = await ParticularUser.MakeRefreshToken();//hashed refresh token comes here
    // ParticularUser.refreshToken = RToken;
    

    await ParticularUser.save();//now it is saved to db

    res.cookie("refreshToken",RToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7 * 24 * 60 * 60 * 1000 //this is 7 days in milliseconds, so the refresh token will expire after 7 days
    });

     
    
    res.status(200).json({
        message:"Login Successful"
    })

    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error",
            error:err.message
        })
    }
}

//Get API,GET ALL USERS OR DOCUMENTS(✓✓ double check means this api or section is working fine giving satisfactory output for which it was made)
export const GetAllUsers = async(req,res)=>{             /*                    ✓✓                  */

    try{
        //we have already set userAuth middleware before this api is called form userRoutes, if authenticatoin succeds
        //means if access and refresh token are validated or verified this this api will run

        // const {EmailId}= req.user;>>>>> well i don't need this for this api as i dont want any particular document i want all users or documents from db
        
        
        const MainUsers = await User.find().select({
            password:0,
            refreshToken:0
        });

        //const users = await User.find().select("-password -refreshToken");//not working

        // const {password,...MainUserss} = MainUsers.toObject(); //this will not work, we know MainUsers contain all documents or users , not one user or document
        //const MainUsers = await User.find().select("-password");//step 2 removes password 
        // const MainUsers = await User.find().select("-password");
        res.status(200).json({
            message:"Success",
            data:MainUsers
        })


    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error 2"
        })
    }
}


//Get All Users(✓✓ double check means this api or section is working fine giving satisfactory output for which it was made)
export const GetUser = async(req,res)=>{           /*                    ✓✓                  */
    try
    {
        // console.log(typeof req.user);
        const EmailId = req.user; //this is giving me payload like this->sharma@gmail.com, this is type of string

        const ParticularUser =await User.findOne({EmailId}).select("-password");
        // console.log(ParticularUser);
        if(!ParticularUser)
        {
            return res.status(404).json({
                message:"No User Found"
            })
        }

        // const {password,...otherInfos} = ParticularUser;

        res.status(200).json({
            message:"User Found",
            data:ParticularUser
        })

    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error3"
        })
    }
}



//User Update API(✓✓ double check means this api or section is working fine giving satisfactory output for which it was made)
export const UserUpdate = async(req,res)=>{        /*                    ✓✓                  */
    try
    {
        //console.log(req.user);//for checking what is coming from authenticaton middleware
        const EmailId = req.user;
        // console.log(EmailId); ✓

        const FirstN = req.body.FirstName; 
        const LastN = req.body.LastName;
        // console.log(FirstN);  ✓
        console.log(LastN);   //✓
        

        // const UserFound = await User.findOne({EmailId}).select("-password");
        const UserFoundAndUpdated = await User.findOneAndUpdate({EmailId:EmailId},{FirstName:FirstN,LastName:LastN},{new:true,runValidators:true}).select("-password");
        // console.log(UserFoundAndUpdated);
        
        if(!UserFoundAndUpdated)
        {
            return res.status(404).json({
                message:"User not found"
            })
        }

        res.status(200).json({
            message:"Successfully Updated",
            data:UserFoundAndUpdated
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


//PATCH API FOR FirstName and LastName
/*                    ✓✓                  done */ 
export const PatchUpdateForFnameAndLname = async(req,res)=>{ /*@@Tomorrows task make patch apis for different parts like for FirstName,LastName,gender another for Password,but we will not let someone change password directly first we will ask for previous password to verify user same goes for EmailId */
    try                                                      
    {
        const MainUserEmailId = req.user;
        const PatchData = req.body;
        console.log(PatchData);
        // if(!PatchData.FirstName){  //this commented part was creating program unable to make me change myrequired field as i like , ihade to send voth firstname and lastname to update,so i cannot change only firstname or lastname due to this checks
        //     res.status(400).json({
        //         message:"Please send your FirstName"
        //     })

        // }
        // if(!PatchData.LastName){
        //     res.status(400).json({
        //         message:"Please send your LastName"
        //     })

        // }

        // if(!PatchData){
        //     res.status(400).json({
        //         message:"Please send your FirstName and LastName"
        //     })
        // }
        const UpdateData = {}; //creating empty object which will hold incoming field from frontend to update and later on we provide this to this function await User.findOneAndUpdate() which will change according ti my requirements
        if(PatchData.FirstName){
            UpdateData.FirstName = PatchData.FirstName;
        }
        // console.log(UpdateData);

        if(PatchData.LastName){
            UpdateData.LastName = PatchData.LastName;
        }
        // console.log(UpdateData);
        if(PatchData.gender)
        {
            UpdateData.gender = PatchData.gender;
        }
        console.log(UpdateData);

        if(PatchData.FirstName && PatchData.LastName && PatchData.gender){
            UpdateData.FirstName = PatchData.FirstName,
            UpdateData.LastName = PatchData.LastName,
            UpdateData.gender = PatchData.gender
        }

        

        const FindUserInDbAndUpdate = await User.findOneAndUpdate({EmailId:MainUserEmailId},UpdateData,{new:true,runValidators:true}).select("-password -refreshToken");
                                                                  //{EmailId:MainUserEmailId},{FirstName:PatchData.FirstName,LastName:PatchData.LastName}
        res.status(200).json({
            message:"Successfully Updated Firstname and Lastname and gender",
            data:FindUserInDbAndUpdate
        })
    }


    catch(err)
    {
        res.status(500).json(
        {
            message:"Internal Server Error"
        });
    }
}



//PATCH API FOR password
/*                    ✓✓                  done */ 
export const ChangePassword = async(req,res)=>{          //  ✓✓ (working)
    try{
        const UserEmailId = req.user;
        // console.log(typeof UserEmailId);
        const {previousPassword} = req.body;//it comes as previousPassword and password;
        // console.log(previousPassword);
        const NewPassword = req.body.password;
        // console.log(typeof NewPassword);
        // console.log(req.cookies.token);

        if(!previousPassword || !NewPassword)
        {
            return res.status(400).json({
                message:"Previous and New password are required"
            })
        }

        if(NewPassword === previousPassword)
        {
            return res.status(400).json({
                message:"Cannot use Same password"
            })
        }

        //our task is to find the user using emailid in our database if found then
        //next step is to compare the incoming password
        //if incoming password matches the hashed password which is stored in db then we allow user to change the password,let see if this works or not 




        const ParticularUserFind = await User.findOne({EmailId:UserEmailId});
        // console.log(ParticularUserFind);
        if(!ParticularUserFind)
        {
            return res.status(404).json({
                message:"User Doesn't Exists"
            })
        }
        const currentDBhashedpassword =ParticularUserFind.password; 
        console.log(currentDBhashedpassword);

        const passwordCompare = await bcrypt.compare(previousPassword,currentDBhashedpassword);
        console.log(passwordCompare);
        if(!passwordCompare)
        {
            return res.status(400).json({
                meassage:"Incorrect Password"
            })
        }
        const salting = await bcrypt.genSalt(10);
        const passwordHashing = await bcrypt.hash(NewPassword,salting);

        const ChangedPasswordUser = await User.findOneAndUpdate({EmailId:UserEmailId},{password:passwordHashing},{new:true,runValidators:true});
        
        res.status(200).json({
            message:"Password changed successfully",
            // data:ChangedPasswordUser ->no need to send data to client
        })

    }
    catch(err){
        res.status(500).json({
            message:"Internal Server Error"
        })

    }
}

export const UserLogout = async(req,res)=>{   //  ✓✓ (working)
    try{

        const EmailId = req.user;
        //const AToken = req.cookies.token;                returns access token 
        //const RToken = req.cookies.refreshToken;         returns refresh token
        const nothing= "";

        const user = await User.findOneAndUpdate({EmailId:EmailId},{refreshToken:nothing},{new:true,runValidators:true}).select("-password -refreshToken");
        
        if(!user)
        {
            return res.status(404).json({
                message:"User Not Found !"
            })
        }
        
        //clearCookie removes or clears cookie sent to client or frontend in my case here to postman
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        
        
        
        res.status(200).json({
            message:"Logout Successful"
        })

    }
    catch(err)
    {
        res.status(500).json({
            message:"Invalid Server Error"
        });
    }
} 


export const GetMe = async(req,res)=>{
    try
    {
        const MyEmail = req.user;

        const MyProfile = await User.findOne({EmailId:MyEmail}).select("-password -refreshToken");
        if(!MyProfile)
        {
            return res.status(404).json({
                message:"Data not Available"
            })
        }

        res.status(200).json({
            message:"Successful",
            data:MyProfile

        })
    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error"
        });
    }
}


export const UserDeleteOwnAccount = async(req,res)=>{
    try{
        const MailId = req.user;

        const deleteAccount = await User.findOneAndDelete({EmailId:MailId});
        // console.log(deleteAccount);
        if(!deleteAccount)
        {
            return res.status(404).json({
                message:"No user found to delete"
            })
        }

        res.status(200).json({
            message:"User Deleted Successfully"
        })



    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}



//DELETE ANY DOCUMENT FROM DB API
export const DelAnyAccount = async(req,res)=>{

    try{
        const IncomingEmailToDelByAdmin = req.body.EmailId;

        if(!IncomingEmailToDelByAdmin)
        {
            return res.status(404).json({
                message:"Please send EmailId to delete the user data"
            })
        }

        const UserFound = await User.findOneAndDelete({EmailId:IncomingEmailToDelByAdmin});

        res.status(200).json({
            message:"User Successfully deleted"
        })
    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


/*export const UploadPhoto = async(req,res)=>{
    try
    {

        const EmailId = req.user;
        // console.log(EmailId);
        const UserPhoto = req.file.path; //this will return parsed photo format from multer,this contain the path of destination where photo is stored by doing multer({dest:'photoStore'}) in userRoutes.js file,so we can store this path in our db and later on we can use this path to get the photo from server or backend 
        // console.log(UserPhoto);


        const replacex = await User.findOneAndUpdate({EmailId:EmailId},{UserPhoto:UserPhoto}).select("-password -refreshToken");
        
        res.status(200).json({
            message:"SUCCESS"
        })

    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error1"
        })
    }

}
*/


export const UploadPhoto = async(req,res)=>{
    try{
        console.log(req.file.path);
        const response = await UploadToCloudinary(req.file.path);

        res.json(response);

    }
    catch(err)
    {
        res.status(500).json({
            error:err.message
        })
    }
}


// export const ForgotPassword = async(req,res)=>{
//     try
//     {
//         const UnhashPIN =req.UnhashedPIN;
//         const otpsUsers =req.User;
//         // console.log(otpsUsers);
//         console.log(UnhashPIN);

//         const {EnterNewPassword} = req.body;
//         const {EnterNewPasswordAgain} = req.body;

//         // console.log(EnterNewPassword);
//         // console.log(EnterNewPasswordAgain);
//         // console.log(UnhashPIN);
//         // console.log(otpsUsers);
       

//         //now will compare the unhashed token with hashed token which is saved in db
    
//         const HashPINcompare = await bcrypt.compare(UnhashPIN,otpsUsers.OTP);
//         console.log(HashPINcompare);

//         if(!HashPINcompare)
//         {
//             return res.status(400).json({
//                 message:"Wrong PIN"
//             })
//         }

//         //if entered pin is correct then we will allow user to create new password
//         //so user will send two password he will send password then we will make him type again the same password for confirmation

        



//         res.send("testing")
        


//     }
//     catch(error)
//     {
//         res.status(500).json({
//             message:"Internal Server Error",
//             error:error.message
//         })
//     }
// }