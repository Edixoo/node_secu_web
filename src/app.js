const express = require("express");
const { route } = require("./routes/route");
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.listen(3000)

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/views'));

app.use('/', route)