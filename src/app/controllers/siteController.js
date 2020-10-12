const User = require('../models/user');
const Validation = require('../validation/validations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('express');
const passport  = require('passport');
class SiteController{
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
} 

module.exports = new SiteController;