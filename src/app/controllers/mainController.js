const house = require('../models/houses');

class MainController{
    index(req,res){
        house.find({},function(err,docs){
            if(!err){
                // res.json(docs);
                res.render('home',{docs});
                console.log(docs);
                return;
            }
            res.send('loi roi');
        });
        res.render('home');
    }
    
}

module.exports = new MainController;
