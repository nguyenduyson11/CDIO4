const siteController = require('../app/controllers/siteController');
const express = require('express');
const router = express.Router();

router.get('/login',siteController.login);
router.get('/register',siteController.register);
//post login
router.post('/login',siteController.postLogin);
// post register
router.post('/register',siteController.postRegister);

// router.get('/',siteController.index);

module.exports = router;