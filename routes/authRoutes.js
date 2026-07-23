const express = require('express');
const AuthRouter = express.Router();
// const express = require('express');
// const router = express.Router();


const {UserRegister,UserLogin} = require('../controllers/userControllers');


AuthRouter.post('/Register',UserRegister);//register path

AuthRouter.post('/Login',UserLogin);//login path




module.exports = AuthRouter;