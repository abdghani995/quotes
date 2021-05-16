const express = require("express")
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
var createError = require('http-errors');
var errorhandler = require('errorhandler')
const mongoPool = require('./util/mongo');
const app = express()
require('dotenv').config();

//configure bodyparser to hande the post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get("/", (req, res) => res.send({"hello": "world"}));
app.use('/api/quote', require("./routes/quotes"));
app.use('/api/user', require("./routes/users"));
app.use('/api/projects', require("./routes/projects"));
app.use('/api/notes', require("./routes/notes"));

// catch 404 and forward to error handler
app.get('*', function(req, res){
  res.status(404).send('Page Not Found');
});

// app.use(errorhandler())

let port = process.env.MY_PORT || 3000;
mongoPool.initMongoose();
mongoPool.initPool(() => {
  console.log("Mongo db  connected");
  app.listen(port, ()=>{
  	console.log(`server started at port ${port}`)
  })
})
