/*global require module*/
var csvjson = require('csvjson');

var credentials = require('../models/credentials.js');
const VPNSERVER = credentials.server;
const VPNPORT = credentials.port;
const PASSWORD = credentials.password;
const CONNECTION = "/usr/local/vpnclient/./vpncmd /server " +  VPNSERVER + ":" + VPNPORT + " /password:" + PASSWORD + " /adminhub:";
const VNCPATH = "../novnc/utils/./launch.sh"
var exec = require("child_process").execSync; 
var exec2 =  require("child_process").exec;
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

  sessionList: function(hub, callback) {

    exec2(CONNECTION + hub + " /csv /cmd SessionList", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, csvjson.toObject(data, options));    
      }
    });
  },

  IpTable: function(hub,callback) {
    exec2(CONNECTION + hub + " /csv /cmd IpTable", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, csvjson.toObject(data, options));    
      }
    });
  },

  getConnections: function(hub,callback) {

    if(hub == "servers") {
      module.exports.sessionList(hub, function(err,data) {
        if(err) {
          callback(err);
        }
        else {
          callback(null, data);
        }
      });
    }
    else {
      module.exports.IpTable(hub, function(err, data) {
        if (err) {
          callback(err);
        }
        else {
          callback(null, data)
        }
      });
    }
  },


  getAllUsers(hub,callback) {
    exec2(CONNECTION + hub + " /csv /cmd UserList", function(err,data) {
      if (err) { 
        callback(err); 
      }
      else {
        callback(null,csvjson.toObject(data, options));
      }
    });
  },

  createUser: function(hub,accountName,password,completeName, group, callback) {
    if (group == "") {
      group = "none";
    }
    exec2(CONNECTION + hub + " /cmd UserCreate " + accountName + " /GROUP:" + group + " /REALNAME:" + completeName + " /NOTE:none", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        exec2(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + " /Password:" + password, function(err,data) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, data);
          }
        });
      }
    });
  },

  setPassword: function(hub,accountName,password) {
    exec2(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + "/Password:" + password, function() {
      if (err) {
        callback(err);
      }
      else {
        callback(null, data);
      }
    });
  },


  deleteUser: function(hub,userName) {
    exec2(CONNECTION + hub + " /cmd UserDelete " + userName, function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, data);
      }
    });
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

  generatePass: function(callback) { 
    var password = Math.random().toString(36).slice(-8);
    callback(password);
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
