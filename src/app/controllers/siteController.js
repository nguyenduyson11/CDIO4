const User = require('../models/user');
const Home = require('../models/houses');
const Validation = require('../validation/validations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {arraytoObject} = require('../../util/convertObject');
const multer = require('multer');
const Category = require('../models/category');

//config upload files
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/upload');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+ file.originalname  );
    }
  })
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/gif"){
            cb(null, true);  
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).array("fileupload",12)  
class SiteController{
    index(req,res){
        var home;
         Home.find({user:req.userid})
         .then(data=>home=data)
         .catch(err=>console.log(err))
        User.findOne({_id:req.userid})
        .then(user=>{
            console.log(user);
             res.render('sites/user',{
                user:user.toObject(),
                home:arraytoObject(home)
            })
        })
        .catch(err=>res.send(err+"lỗi eooi"))
    }
    login(req,res){
        res.render('sites/login');
    }
    //post login
    register(req,res){
        res.render('sites/register');
    };
    // validation 
    
    // post register
    async postRegister(req,res){
        //validation data register
        const {error} = Validation.registerValidation(req.body);
         if(error){
            res.render('sites/register',{
                err :error.details[0].message
            });
            return;
            
         }
         //check confirm password
         if(req.body.password != req.body.password2){
            return res.render('sites/register',{
                err :'password incorrect'
            });
         }
         //check email exits in database 
         const checkemail = await User.findOne({
             email:req.body.email
         })
         if(checkemail)
            return res.render('sites/register',{
                err :'Email already exists'
            });

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        //cretae user in database
        const user = await new User({
            username:req.body.username,
            email:req.body.email,
            phone:req.body.phone,
            password:hashPassword
       });
       user.save().then(user=>{
           res.render('./sites/login',{
                success:'Sign Up Success'
           })
       })
       .catch(err=>console.log(err))
    }
    async postLogin(req,res,next){
        //validation data login
        const {error} = Validation.loginValidation(req.body);
         if(error){
            res.render('sites/login',{
                err :error.details[0].message
            });
            return;
            
         }
        const findUser = await User.findOne({
            email:req.body.email
        });
        if(findUser){
           const validate = await bcrypt.compare(req.body.password,findUser.password);
           if(validate){
            const token = jwt.sign({ userid : findUser._id }, process.env.TOKEN_SCRET);
               res.cookie('userID',token);
                res.redirect('/user');
           }
           else{
               res.render('sites/login',{
                   err:'Incorrect password'
               });
               return;
           }
        }
        else{
            res.render('sites/login',{
                err:'Email is not registered'
            });
            return;
        }
        
        
    }
      
    //get logout
    logout(req,res){
        res.clearCookie('userID');
        res.redirect('/user/login');
    }
} 

module.exports = new SiteController;