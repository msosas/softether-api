/*global require module*/
var csvjson = require('csvjson');
var lodash = require('lodash');
var credentials = require('../models/credentials.js');
const VPNSERVER = credentials.server;
const VPNPORT = credentials.port;
const PASSWORD = credentials.password;
const CONNECTION = "/usr/local/vpnclient/./vpncmd /server " +  VPNSERVER + ":" + VPNPORT + " /password:" + PASSWORD + " /adminhub:";
const VNCPATH = "../novnc/utils/./launch.sh"
var exec =  require("child_process").exec;
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

    exec(CONNECTION + hub + " /csv /cmd SessionList", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        callback(null, csvjson.toObject(data, options));    
      }
    });
  },

  IpTable: function(hub,callback) {
    exec(CONNECTION + hub + " /csv /cmd IpTable", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        var result = csvjson.toObject(data, options);

        callback(null,
          lodash.forEach(result, function(data){
            data["IP Address"] = data["IP Address"].replace(" (DHCP)", "");
          })
        );
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
    exec(CONNECTION + hub + " /csv /cmd UserList", function(err,data) {
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
    exec(CONNECTION + hub + " /cmd UserCreate " + accountName + " /GROUP:" + group + " /REALNAME:" + completeName + " /NOTE:none", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        exec(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + " /Password:" + password, function(err,data) {
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
    exec(CONNECTION + hub + " /cmd UserPasswordSet " + accountName + "/Password:" + password, function() {
      if (err) {
        callback(err);
      }
      else {
        callback(null, data);
      }
    });
  },


  deleteUser: function(hub,userName, callback) {
    exec(CONNECTION + hub + " /cmd UserDelete " + userName, function(err,data) {
      console.log(hub);
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
  userDetails: function(hub,userName,callback) {

    exec(CONNECTION + hub + " /cmd UserGet " + userName, function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        data = data.split("\n");
        data = data.splice(14);
        for (var i = 0 ; i < data.length; i++) {
          data[i] = data[i].substring(30);   //Remove field description
        }
        data.shift();
        data.pop();
        data.pop();
        data.pop();
        data.splice(5,1);  //Remove delimiter ---------------
        callback(null, data);
      }
    });
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
