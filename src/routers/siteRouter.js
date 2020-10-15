const siteController = require('../app/controllers/siteController');
const express = require('express');
const router = express.Router();
const Auth = require('./auth');

router.get('/login',siteController.login);
router.get('/register',siteController.register);
//post login
router.post('/login',siteController.postLogin);
// post register
router.post('/register',siteController.postRegister);
//get logout
router.get('/logout',siteController.logout);
router.get('/',Auth.auth,siteController.index);


module.exports = router;