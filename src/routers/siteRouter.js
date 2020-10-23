const siteController = require('../app/controllers/siteController');
const homeController  = require('../app/controllers/HomeController');
const express = require('express');
const router = express.Router();
const Auth = require('./auth');
const Authlogin = require('./authlogin');

router.get('/login',Authlogin.auth,siteController.login);
router.get('/register',siteController.register);
//post login
router.post('/login',siteController.postLogin);
// post register
router.post('/register',siteController.postRegister);
//get add home
router.get('/add-home',Auth.auth,homeController.addHome);
//post add home
router.post('/add-home',Auth.auth,homeController.postaddHome);

//get update home
router.get('/edit-home/:id',Auth.auth,homeController.updateHome);
//put update home
router.put('/edit-home/:id',Auth.auth,homeController.postUpdateHome);
//delete home
router.delete('/delete-home/:id',homeController.deleteHome);
//get logout
router.get('/logout',siteController.logout);
router.get('/',Auth.auth,siteController.index);


module.exports = router;