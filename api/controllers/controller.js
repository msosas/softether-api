var tools = require('../models/functions.js');


// *********** Page Handling  ****************

exports.check_server = function(req,res) {
  //if (!req.body) return res.sendStatus (400);
  res.send("The server is UP");
  res.end();
};

exports.sessions =  function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  console.log("Checking Sessions...");
 // if (req.headers.token !== token) return res.sendStatus(401);
  hub = req.query.hubname;
  if(hubList.indexOf(hub) > -1) {
    var sessions = tools.getConnections(hub);
    res.send(sessions);
  }
  else {
    res.send("Hub not found");
  }    
  res.end(); 
};


exports.all_users = function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  //if (req.headers.token !== token) return res.sendStatus(401);
  console.log("Getting all users...");
  console.log(req.query.hubname);
  hub = req.query.hubname;
  if(hubList.indexOf(hub) > -1) {
    var users = tools.getAllUsers(hub);
    res.send(users);
  }
  else {
    res.send("Hub not found");
  } 
  res.end(); 
};


exports.new_user = function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  //if (req.headers.token !== token) return res.sendStatus(401);
  hub = req.query.hubname;
  if (hubList.indexOf(hub) > -1) {
    var userName = req.body.user_name;
    var passwd = req.body.password;
    var description = req.body.description;
    var group = req.body.group;
    tools.createUser(hub,userName,passwd,description,group);  
  }
  else {
    res.send("Hub not found");
  }
  onsole.log("New User Saved");
  res.end(); 
}; 


exports.delete_user = function (req,res) { //lista
  var userName;
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = req.body.hubName;
  userName = req.body.userName;
  tools.deleteUser(hub,userName);
  res.end();   
};  

exports.user_details = function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  //if (req.headers.token !== token) return res.sendStatus(401);
  hub = req.query.hubname;
  var userName = req.query.username;
  if(hubList.indexOf(hub) > -1) {
    var user = tools.userDetails(hub,userName);
    res.send(user);
  }
  else {
    res.send("Hub not found");
  } 
  res.end(); 
};

exports.session_list = function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
  if (req.body.token !== token) return res.sendStatus(401);
  hub = "agencias";
  var sessionName = req.body.sessionName;
  if(hubList.indexOf(hub) > -1) {
    var session = tools.sessionList("agencias",sessionName);
    res.send(session);
  }
  else {
    res.send("Hub not found");
  } 
  res.end(); 
};


exports.generate_pass = function (req,res) { //lista
  var password = tools.generatePass();
  res.send(password);
};

exports.vnc = function (req,res) { //lista
  if (!req.body) return res.sendStatus(400);
 // if (req.headers.token !== token) return res.sendStatus(401);
  ip = req.query.ip;
  var url = tools.vncConnect(ip);
  res.end(); 
};