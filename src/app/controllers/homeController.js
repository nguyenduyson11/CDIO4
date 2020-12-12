const User = require('../models/user');
const Home = require('../models/houses');
const Validation = require('../validation/validations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {arraytoObject} = require('../../util/convertObject');
const multer = require('multer');
const Category = require('../models/category');
const request = require('request');
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
class HomeController{
    addHome(req,res,next){
        let user;
        User.findById(req.userid).then(data=>{user = data.toObject()})
        .catch(err=>next)
        Category.find({})
        .then(data=>{
            console.log(data);
            return res.render('home/addHome',{
                categories:arraytoObject(data),
                user:user,
            })})
        .catch(next)
    }
    postaddHome(req,res,next){
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              console.log("A Multer error occurred when uploading."); 
            } else if (err) {
              console.log("An unknown error occurred when uploading." + err);
            }else{
                var lat=1;
                var long =1;
                let myAdress = `${req.body.adress},${req.body.area}`;
                let encodeString = encodeURIComponent(myAdress);
                console.log(myAdress);
                const url  = `https://api.opencagedata.com/geocode/v1/json?q=${encodeString}&key=f83ea3d8638a4421ac6581cecf878d4d&pretty=1`;
                request({url:url,json:true},(err,response)=>{
                    var data = response.body;
                    
                    lat = data.results[0].geometry.lat;
                    long = data.results[0].geometry.lng;
                    //  res.json(req.files[0].filename);
                    const arrfile = req.files;
                    const images =  arrfile.map((image)=>{
                            return image.filename;
                    });
                    console.log(images);
                    if(images.length>0){
                        
                        const home = new Home({
                        name:req.body.nameHome,
                        category:req.body.category,
                        adress:{
                            street:req.body.adress,
                            district:req.body.district,
                            city:req.body.area,
                            geo:{
                                lat:lat,
                                lng:long
                            }
                        },
                        acreage:Number(req.body.acreage),
                        description:req.body.description,
                        price:req.body.price,
                        image:images,
                        user:req.userid,
                        room:{
                            bedroom:Number(req.body.bedroom),
                            livingroom:Number(req.body.livingroom),
                            bathroom:Number(req.body.bathroom)
                        }
                    })
                    home.save()
                    .then(home=> {return res.redirect('/user')})
                    .catch(err=>{return res.send("loi roi")});
                    }
                    else{
                        const home = new Home({
                            name:req.body.nameHome,
                            category:req.body.category,
                            adress:{
                                street:req.body.adress,
                                district:req.body.district,
                                city:req.body.area,
                                geo:{
                                    lat:lat,
                                    lng:long
                                }
                            },
                            acreage:Number(req.body.acreage),
                            description:req.body.description,
                            price:req.body.price,
                            image:[],
                            user:req.userid,
                            room:{
                                bedroom:Number(req.body.bedroom),
                                livingroom:Number(req.body.livingroom),
                                bathroom:Number(req.body.bathroom)
                            }
                        })
                        home.save()
                        .then(home=> {return res.redirect('/user')})
                        .catch(err=>{return res.send("loi roi")});

                    }
                })
               
            }
        })
    }
    updateHome(req,res,next){
        let user;
        let home;
        let categories;
        Home.findById(req.params.id,(err,docs)=>{
            if(err)
                console.log("loi");
            else{
                home = docs.toObject();
                User.findById(req.userid,(err,docs)=>{
                    if(err)
                        console.log(err);
                    else{
                        user = docs.toObject();
                        Category.find({},(err,docs)=>{
                             if(err)
                                console.log(err);
                             else{
                                 categories = arraytoObject(docs);
                                 return res.render('home/editHome',{
                                    home:home,
                                    user:user,
                                    categories:categories
                                })
                             }    
                        })

                    }    
                })
            }
        })
    }
    postUpdateHome(req,res,next){
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              console.log("A Multer error occurred when uploading."); 
            } else if (err) {
              console.log("An unknown error occurred when uploading." + err);
            }else{
                var lat=1;
                var long =1;
                let myAdress = `${req.body.adress},${req.body.area}`;
                let encodeString = encodeURIComponent(myAdress);
                const url  = `https://api.opencagedata.com/geocode/v1/json?q=${encodeString}&key=f83ea3d8638a4421ac6581cecf878d4d&pretty=1`;
               const arrfile = req.files;
               const images =  arrfile.map((image)=>{
                    return image.filename;
                });
                
                request({url:url,json:true},(err,response)=>{
                    var data = response.body;
                    
                    lat = data.results[0].geometry.lat;
                    long = data.results[0].geometry.lng;
                    const arrfile = req.files;
                    const images =  arrfile.map((image)=>{
                            return image.filename;
                    });
                    if(images.length>0)
                    {
                            Home.updateOne({_id:req.params.id},{
                            name:req.body.nameHome,
                            category:req.body.category,
                            adress:{
                                street:req.body.adress,
                                district:req.body.district,
                                city:req.body.area,
                                geo:{
                                    lat:lat,
                                    lng:long
                                }
                            },
                            room:{
                                bedroom:Number(req.body.bedroom),
                                livingroom:Number(req.body.livingroom),
                                bathroom:Number(req.body.bathroom)
                            },
                            acreage:Number(req.body.acreage),
                            description:req.body.description,
                            price:req.body.price,
                            image:images,
                        })
                        .then(home=> {return res.redirect('/user')})
                        .catch(err=>{return res.send("loi roi")});
                    }
                    else{
                        Home.updateOne({_id:req.params.id},{
                            name:req.body.nameHome,
                            category:req.body.category,
                            adress:{
                                street:req.body.adress,
                                district:req.body.district,
                                city:req.body.area,
                                geo:{
                                    lat:lat,
                                    lng:long
                                }
                            },
                            room:{
                                bedroom:Number(req.body.bedroom),
                                livingroom:Number(req.body.livingroom),
                                bathroom:Number(req.body.bathroom)
                            },
                            acreage:Number(req.body.acreage),
                            description:req.body.description,
                            price:req.body.price,
                        })
                        .then(home=> {return res.redirect('/user')})
                        .catch(err=>{return res.send("loi roi")});   
                        
                    }
                    
                })
            }
        })
    }
    deleteHome(req,res){
        Home.deleteOne({_id:req.params.id})
        .then(home=>{return res.redirect('/user')})
        .catch(err=>{console.log(err)})
    }
    //get all home
    async getAllHome(req,res){
        const page = (req.query.page)?parseInt(req.query.page):1; 
        const limit = 9;
        const startIndex = (page - 1) * limit;
        const listhome = await Home.find().limit(limit).skip(startIndex).exec();
        const user = await User.findById(req.userid);
        const categories = await Category.find({});
        if(listhome){
            if(categories){
                res.render('home/viewHome',{
                    listhome:arraytoObject(listhome),
                    user:user,
                    categories:arraytoObject(categories)
                })
            }
            
        }
        return;
        
    }
    //get all home sort
    async getHomeSort(req,res){
        const page = (req.query.page)?parseInt(req.query.page):1; 
        const limit = 9;
        const startIndex = (page - 1) * limit;
        const listhome = await Home.find().limit(limit).skip(startIndex).exec();
        const user = await User.findById(req.userid);
        const categories = await Category.find({});
        if(listhome){
            if(categories){
                res.json({
                    listhome:arraytoObject(listhome),
                    user:user,
                    categories:arraytoObject(categories)
                })
            }
            
        }
        return;
    }
}

module.exports = new HomeController;