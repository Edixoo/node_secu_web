const express= require("express");
const { route } = require("./routes/route");
const app=express();
const path=require('path');

app.listen(3000)

app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'));

app.use('/test',route)