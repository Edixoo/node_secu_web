const express= require("express");
const { route } = require("./routes/route");
const app=express()


app.listen(3000)

app.set('view engine', 'pug');
app.set('views', '../views/');

app.use(route)