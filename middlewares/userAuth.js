import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// const User = require('../models/userModel');
import User from '../models/userModel.js'

/*
my thinking i will authenticate the user after login if he tries to do http method to other apis other than register and login
i will do this by the access and refresh token he received from server.
so i have to verify these tokens of the user before user can hit other apis endpoint after login 
*/ 


export const UserAuth = async(req,res,next)=>{

    try{
        const AccessToken = req.cookies.token;
        if(!AccessToken)
        {
            return res.status(401).json({
                message:"Unauthorized,No Access Token"
            })
        }

        const RefreshToken = req.cookies.refreshToken;

        if(!RefreshToken)
        {
            return res.status(401).json({
                message:"Unauthorized,No Refresh Token"
            })
        }

        //  Access token verification

        const JwtVerificationPayload = await jwt.verify(AccessToken,process.env.PRIVATE_KEY);//this will return payload,here it is EmailId,or will throw error

        const {EmailId} = JwtVerificationPayload;
        const MainUser = await User.findOne({EmailId:EmailId});

        // req.user = JwtVerificationPayload;

        const RefreshTokenVerification = await bcrypt.compare(RefreshToken,MainUser.refreshToken);
        if(!RefreshTokenVerification)
        {
            return res.status(401).json({
                message:"Invalid Refresh Token"
            })
        }
        
        req.user = EmailId;

        next();

    }
    catch(err)
    {
        res.status(500).json({
            message:"Internal Server Error1"
        })
    }
}