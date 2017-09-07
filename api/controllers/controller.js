var tools = require('../models/functions.js');
var token = '29131f3d713e8e360777ac3d2c1d42c8';

// *********** Page Handling  ****************

exports.check_server = function(req,res) {
  tools.check(function(err,data){
    if (err) {
      console.log("Error code: " + err.code);
      res.sendStatus(500);
      res.end();
    }
    else {
      res.send(data);
      res.end();
    }
  })
};

exports.sessions =  function (req,res) { 
  if (!req.body) { 
    return res.sendStatus(400);
  }
  console.log("Checking Sessions...");
  if (req.headers.token !== token) return res.sendStatus(401);
  var hub = req.headers.hubname;
 
  tools.getConnections(hub, function(err,data) {
    if (err) {
      console.log("Error code: " + err.code);
      res.sendStatus(400);
      res.end(); 
    }
    else {
      res.send(data);    
      res.end(); 
    }
  });
};


exports.all_users = function (req,res) { 
  if (!req.body) return res.sendStatus(400);
  if (req.headers.token !== token) return res.sendStatus(401);
  console.log("Getting all users...");
  
  var hub = req.headers.hubname;
  console.log(hub);
  
  tools.getAllUsers(hub, function(err,data) {
    if (err) { 
      console.log("Error code: " + err.code);
      res.sendStatus(400); 
      res.end();  
    }
    else {
      res.send(data);  
      res.end(); 
    }    
  });  
};


exports.new_user = function (req,res) { 
  if (!req.body) return res.sendStatus(400);
  if (req.headers.token !== token) return res.sendStatus(401);
  var hub = req.body.hubname;
  
  var userName = req.body.username;
  var passwd = req.body.password;
  var description = req.body.description;
  var group = req.body.group;
  
  tools.createUser(hub,userName,passwd,description,group, function(err,data) {
    if (err) {
      console.log("Error code: " + err.code);
      res.sendStatus(400);
      res.end(); 
    }
    else {
      res.sendStatus(200);
      console.log("New User Saved");
      res.end(); 
    }
  });  
}; 


exports.delete_user = function (req,res) { 
  if (!req.body) return res.sendStatus(400);
  if (req.headers.token !== token) return res.sendStatus(401);
  var hub = req.body.hubname;
  var userName = req.body.username;
  tools.deleteUser(hub,userName, function(err,data) {
    if (err) {
      console.log("Error code: " + err.code);
      res.sendStatus(400);
      res.end();
    }
    else {
      res.sendStatus(200);
      res.end();
    }
  });
};  

exports.user_details = function (req,res) { 
  if (!req.body) return res.sendStatus(400);
  if (req.headers.token !== token) return res.sendStatus(401);
  var hub = req.headers.hubname;
  var userName = req.headers.username;
  
  tools.userDetails(hub,userName,function(err,data){
    if (err) {
      console.log("Error code: " + err.code);
      res.sendStatus(400);
      res.end(); 
    }
    else {
      res.send(data);    
      res.end(); 
    }
  });
};

exports.generate_pass = function (req,res) { 
  tools.generatePass(function(err,data) {
    res.send(data);  
  });
};

exports.vnc = function (req,res) { 
 if (!req.body) return res.sendStatus(400);
 if (req.headers.token !== token) return res.sendStatus(401);
 ip = req.query.ip;
 tools.vncConnect(ip);
 res.sendStatus(200);
 res.end();  
 
};