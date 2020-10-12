const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
var path = require('path');
const port = 3000;
const Router = require('./routers/index');
const conectdb = require('./config/db/index');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//connect db
conectdb();
//router
Router(app);
//




//template engine
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources','views'));
//static file
app.use(express.static(path.join(__dirname,'public')));
//app listen

app.listen(process.env.PORT||port,()=>{
    console.log(`listening at http://localhost:${port}`)
});
