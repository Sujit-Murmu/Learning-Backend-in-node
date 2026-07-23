import express from 'express';
const UserRouter = express.Router();
// const multer  = require('multer');
import multer from 'multer';
//const upload = multer({ dest: 'uploads/' })
// const {upload} = require('../middlewares/multer.js');
import { upload } from '../middlewares/multer.js';




// const {UserAuth} = require('../middlewares/userAuth');
import { UserAuth } from '../middlewares/userAuth.js';
// const { GetAllUsers } = require('../controllers/userControllers');
import { GetAllUsers } from '../controllers/userControllers.js';
// const { GetUser } = require('../controllers/userControllers');
import {GetUser} from '../controllers/userControllers.js';
// const { UserUpdate } = require('../controllers/userControllers');
import { UserUpdate } from '../controllers/userControllers.js';
// const {PatchUpdateForFnameAndLname} = require('../controllers/userControllers');
import { PatchUpdateForFnameAndLname } from '../controllers/userControllers.js';
// const {ChangePassword} = require('../controllers/userControllers');
import { ChangePassword } from '../controllers/userControllers.js';
// const {UserLogout} = require('../controllers/userControllers');
import { UserLogout } from '../controllers/userControllers.js';
// const {GetMe} = require('../controllers/userControllers');
import { GetMe } from '../controllers/userControllers.js';
// const {UserDeleteOwnAccount} = require('../controllers/userControllers');
import { UserDeleteOwnAccount } from '../controllers/userControllers.js';
// const {DelAnyAccount} = require('../controllers/userControllers');
import { DelAnyAccount } from '../controllers/userControllers.js';
// const {UploadPhoto} = require('../controllers/userControllers');
import { UploadPhoto } from '../controllers/userControllers.js';

import{ForgotPassword} from '../controllers/userControllers.js';

//const {}//@@Tomorrows task[15/07/26]have to make other apis other than register and login to import here to test other UserAuth function or logic

UserRouter.get('/',UserAuth,GetAllUsers);
UserRouter.get('/particular',UserAuth,GetUser);
UserRouter.patch('/patchs',UserAuth,UserUpdate);
UserRouter.patch('/puts',UserAuth,PatchUpdateForFnameAndLname);
UserRouter.patch('/passChange',UserAuth,ChangePassword);
UserRouter.patch('/Logout',UserAuth,UserLogout);
UserRouter.get('/getme',UserAuth,GetMe);
UserRouter.delete('/DelOwnAcco',UserAuth,UserDeleteOwnAccount);
UserRouter.delete('/DelAccAdmin',UserAuth,DelAnyAccount);
UserRouter.post('/photoUpload',UserAuth,upload.single("UserPhoto"),(req, res, next) => {
        console.log("req.file =", req.file);
        next();
    },UploadPhoto);

UserRouter.post('/ForgotPassPIN',ForgotPassword);//this route will take email send it to middleware and verify the email, generate token or pin send it to user and save hash format pin to db,and pass on pin by next 
// UserRouter.post('/passForgot',ForgotPassword);


export default  UserRouter;