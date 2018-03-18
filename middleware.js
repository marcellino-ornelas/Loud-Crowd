/*
 * Middle Ware
 *
 * path: /middleware.js
*/

var getIp = require("ipware")().get_ip;

module.exports.getIp = function(req,res,next){

  // get users ip address
  req.userIp = getIp(req);
  next();
}

module.exports.isLoggedIn = function(req,res,next){
  if(req.user){ next(); }
  else {
    console.log("Access Denied");
    res.redirect("/");
  }
}
