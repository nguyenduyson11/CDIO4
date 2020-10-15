const Auth = require('./auth');
const mainController = require('../app/controllers/mainController');
const express = require('express');
const router = express.Router();


router.get('/home',(req,res)=>{
    res.send('thành công');
})

router.get('/',mainController.index);
module.exports = router;

