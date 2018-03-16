/**
 * User
 *
 * path: controller/user.js
*/


/*
 * Modules
*/
var passport = require("passport");
var _ = require("lodash");
var db = require("../models");



module.exports.index = function(req,res){
  /*
   * /users
   *
   * Method: Get
  */
  res.render('users/index');
}

module.exports.create = function(){
  /*
   * /users
   *
   * Method: Post
  */
  db.User.register(new db.User(req.body), req.body.password, function(err,newUser){

    passport.authenticate('local')(req, res, function() {

      res.redirect('/');

    });
  });
}

module.exports.new = function(req,res){
  /*
   * /users/new
   *
   * Method: Get
  */
  res.render("user/signup");
}

// User Profile
module.exports.show = function(req,res){
  /*
   * /user/:id
   *
   * Method: Get
  */
  res.render("user/profile");
}


module.exports.update = function(req,res){
  /*
   * /user/:id
   *
   * Method: PUT
  */
  db.User.find
}

module.exports.destroy = function(req,res){
  /*
   * /user/:id
   *
   * Method: DELETE
  */
  db.User.remove
}
