const Auth = require('./auth');
const mainController = require('../app/controllers/mainController');
const homeController = require('../app/controllers/homeController');
const express = require('express');
const router = express.Router();


router.get('/home',(req,res)=>{
    res.render('sites/addUser');
});
//get all homes sort
router.get('/product/sort',homeController.getHomeSort);
//get all homes
router.get('/product',homeController.getAllHome);
//get hoem detail
router.get('/product/:id/detail',homeController.getHomeDetail);
router.get('/',mainController.index);
module.exports = router;

