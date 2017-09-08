/*global require module*/
var csvjson = require('csvjson');
var lodash = require('lodash');
var credentials = require('../models/credentials.js');
var exec =  require("child_process").exec;

// Constants
const VPNSERVER = credentials.server;
const VPNPORT = credentials.port;
const PASSWORD = credentials.password;
const CONNECTION = "/usr/local/vpnclient/./vpncmd /server " +  VPNSERVER + ":" + VPNPORT + " /password:" + PASSWORD + " /adminhub:";
const VNCPATH = __dirname + "/../../../noVNC/utils/./launch.sh"


//Variables
var vncSessions = {};
var vnc;
//For CSV to JSON
var options = {
  delimiter : ',', 
  quote     : '"'  
};

//********************************************************************************

if(VPNSERVER == undefined || VPNPORT == undefined || PASSWORD == undefined) {
  console.log("ERROR: SERVER, PASSWORD or PORT not defined. Check /modules/credentials.js");
}
else {
  console.log("Your are working with this server ==> " + VPNSERVER + ":" + VPNPORT);
}

module.exports = {

  check: function(callback) {
    exec(CONNECTION + " /cmd Check", function(err,data){
      if(err) {
        callback(err);
      }
      else {
        callback(null,data);
      }
    })
  },  

  sessionList: function(hub, callback) {

    exec(CONNECTION + hub + " /csv /cmd SessionList", function(err,data) {
      if (err) {
        callback(err);
      }
      else {
        var result = csvjson.toObject(data, options);
        callback(null,
          lodash.forEach(result,function(data){
            data["Session Name"] = data["Session Name"].toLowerCase();
          })
          );
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
            data["Session Name"] = data["Session Name"].toLowerCase();
          })
        );
      }
    });
  },

  /*getConnections: function(hub,callback) {

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
  },*/


  getAllUsers: function(hub,callback) {
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
      if (err) {
        callback(err);
      }
      else {
        callback(null, data);
      }
    });
  },

  //WARNING
  //SoftEther doesn't generate CSV properly for this command. Keeping old parsing...
  userDetails: function(hub,userName,callback) {

    exec(CONNECTION + hub + " /cmd UserGet " + userName, function(err,data) {
      if (err) {
        console.log("Error code: " + err.code);
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
    callback(null,password);
  },

  vncConnect: function(ip) {
    ip = ip.toString();
    const CPORTS = ["6080","6081","6082","6083","6084","6085","6086","6087","6088","6089"];
    
    var i = 0;
    //if(vnc !== undefined) {
    //  vnc.kill();
    //}
    
    while(i < CPORTS.length) {
      var stdout = require('child_process').execSync("sudo netstat -nap | grep " + CPORTS[i] + " | wc -l").toString();

      if (stdout != 0) {
        console.log("Port " + CPORTS[i] + " used. Checking next one...");
        i++; 
      }
      else {
        console.log("Connecting to " + ip);
        vncSessions[CPORTS[i]] = require("child_process").spawn(VNCPATH, ["--listen", CPORTS[i], "--vnc", ip + ":5900"]);
        break;  
      }     
    } 
    return JSON.stringify(CPORTS[i]);
  },

  vncDisconnect: function(port) {
    vncSessions[port].kill('SIGINT');
    return 0;
  }
};
