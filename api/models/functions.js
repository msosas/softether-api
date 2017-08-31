/*global require module*/
var csvjson = require('csvjson');

var credentials = require('../models/credentials.js');
const VPNSERVER = credentials.server;
const VPNPORT = credentials.port;
const PASSWORD = credentials.password;
const CONNECTION = "/usr/local/vpnclient/./vpncmd /server " +  VPNSERVER + ":" + VPNPORT + " /password:" + PASSWORD + " /adminhub:";
const VNCPATH = "../novnc/utils/./launch.sh"
var exec =  require("child_process").execSync; 
var vnc;


//For CSV to JSON
var options = {
  delimiter : ',', 
  quote     : '"'  
};

//********************************************************************************

if(VPNSERVER == "") {
  console.log("ERROR: Server not defined...")
}

module.exports = {

  sessionList: function(hub) {

    var info = [];
    var sessions = [];
    var temp = [];
    info = exec(CONNECTION + hub + " /csv /cmd SessionList").toString();
    return csvjson.toObject(info, options);
  },

  IpTable: function(hub) {
    var info = [];
    var sessions = [];
    var temp = [];
    info = exec(CONNECTION + hub + " /csv /cmd IpTable").toString();   
    return csvjson.toObject(info, options);
  },

  getConnections: function(hub) {
    var sessions = [];
    var temp = [];
    var info = [];

    if(hub == "servers") {
      sessions = module.exports.sessionList(hub);
    }
    else {
      sessions = module.exports.IpTable(hub);
    }
    return sessions; 
  },


  getAllUsers(hub) {

    var oneUser = []; 
    var users = [];
    var temp = [];
    var info = exec(CONNECTION + hub + " /csv /cmd UserList").toString();

    return csvjson.toObject(info, options);
  },

  createUser: function(hub,accountName,password,completeName, group) {
    if (group == undefined) {
      group = "none";
    }
    exec(CONNECTION + hub + " /cmd UserCreate " + accountName + " /GROUP:" + group + "/REALNAME:" + completeName + " /NOTE:none");
    exec(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + " /Password:" + password);

  },

  setPassword: function(hub,accountName,password) {
    exec(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + "/Password:" + password);
    return;
  },


  deleteUser: function(hub,userName) {
    exec(CONNECTION + hub + " /cmd UserDelete " + userName);
  },

  //WARNING
  //Soft Ether doens generate CSV properly for this command. Keeping old parsing
  userDetails: function(hub,userName) {
    var info = exec(CONNECTION + hub + " /cmd UserGet " + userName).toString().split("\n");
    info = info.splice(14); //Remove header
    for (var i = 0 ; i < info.length; i++) {
      info[i] = info[i].substring(30);   //Remove field description
    }
    info.shift();
    info.pop();
    info.pop();
    info.pop();
    info.splice(5,1);  //Remove delimiter ---------------
    return JSON.stringify(info);
  },

  generatePass: function() { 
    var password = Math.random().toString(36).slice(-8);
    return password;
  },

  vncConnect: function(ip) {    
    const spawn = require('child_process').spawn;
    if(vnc != undefined) {
      vnc.kill();
    }
    vnc = require("child_process").spawn(VNCPATH,["--vnc", ip + ":5900"]);   
    console.log(ip + " Connected");
    
  }
};
