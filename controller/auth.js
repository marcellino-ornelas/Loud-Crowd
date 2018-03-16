/**
 * Authorization
 *
 * path: controller/auth.js
*/


/*
 * Modules
*/
var passport = require("passport");
var _ = require("lodash");
var db = require("../models");


module.exports.new = function(req,res){
  /*
   * /login
   *
   * Method: Get
  */
  res.render('login');
}

// Destroy
module.exports.logout = function(req,res){
  /*
   * /logout
   *
   * Method: Get
  */
  if(req.user){
    console.log("user " + req.user._id + "is now logging out....." );
    req.logout();
    console.log("Log out successful")
  }

  res.redirect('/');
}

module.exports.create = function(req,res){
  /*
   * /login
   *
   * Method: Post
  */
  res.redirect("/user/"+ req.user._id)
}

