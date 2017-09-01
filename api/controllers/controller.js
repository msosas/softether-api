var tools = require('../models/functions.js');


// *********** Page Handling  ****************

exports.check_server = function(req,res) {
  tools.check(function(err,data){
    if (err) {
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
 // if (req.headers.token !== token) return res.sendStatus(401);
 var hub = req.query.hubName;
 
  tools.getConnections(hub, function(err,data) {
    if (err) {
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
  //if (req.headers.token !== token) return res.sendStatus(401);
  console.log("Getting all users...");
  
  var hub = req.query.hubName;
  
  tools.getAllUsers(hub, function(err,data) {
    if (err) { 
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
  //if (req.headers.token !== token) return res.sendStatus(401);
  var hub = req.query.hubName;
  
  var userName = req.body.userName;
  var passwd = req.body.password;
  var description = req.body.description;
  var group = req.body.group;
  
  tools.createUser(hub,userName,passwd,description,group, function(err,data) {
    if (err) {
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
  //if (req.body.token !== token) return res.sendStatus(401);
  var hub = req.query.hubName;
  var userName = req.body.userName;
  tools.deleteUser(hub,userName, function(err,data) {
    if (err) {
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
  //if (req.headers.token !== token) return res.sendStatus(401);
  var hub = req.query.hubName;
  var userName = req.query.userName;
  
  tools.userDetails(hub,userName,function(err,data){
    if (err) {
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
 // if (req.headers.token !== token) return res.sendStatus(401);
 ip = req.query.ip;
 var url = tools.vncConnect(ip);
 res.end(); 
};