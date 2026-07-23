// require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config();


// console.log("name",process.env.CLOUDINARY_CLOUD_NAME);
// console.log("api",process.env.CLOUDINARY_CLOUD_API);
// console.log("secret",process.env.CLOUDINARY_SECRET_KEY);


// const express = require('express');
import express from 'express';
const app = express();
// const main = require('./database')
import main from './database.js';
// const AuthRoute = require('../project/routes/authRoutes');
import AuthRoute from '../project/routes/authRoutes.js';
// const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
// const UserRouter = require('../project/routes/userRoutes');
import UserRouter from '../project/routes/userRoutes.js';
// const multer  = require('multer');
import PasswordRouter from '../project/routes/PasswordResetToute.js';
import multer from 'multer';
//const upload = multer({ dest: 'uploads/' })
const upload = multer()

app.use(express.json());
app.use(cookieParser());


// const dns = require('dns');
import dns from 'dns';
dns.setServers(["1.1.1.1","8.8.8.8"]);










app.use('/auth',AuthRoute);
app.use('/user',UserRouter);
// app.use('/Reset',PasswordRouter);











main()
.then(()=>{
    console.log("Connected To Database")


    app.listen(process.env.PORT,()=>{
        console.log(`Listening at Port ${process.env.PORT}`);
    })

})
.catch((err)=>{
    console.log("error Occured " , err);
})

















