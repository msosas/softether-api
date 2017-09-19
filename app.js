/*global require __dirname*/

global.	hubList = ["operaciones","servers","agencias", "ruviag"];


var PORT = 3001;

//********  Dependencies  **************
var bodyParser = require("body-parser");

//*******  Include Functions  *****


//********  Create Server ***********

var express = require("express")
 , app = express();
//var router = express.Router();

var hub;


//*****   Start Server:  **********
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'token, hubname')
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT); 
console.log("Listening on "+ PORT  + "...");

//*********************************

var routes = require('./api/routes/routes');
routes(app);

