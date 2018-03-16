/*
 * Main Routes
 *
 * Path: routes/index.js
*/


/*
 * Modules
*/
var express = require("express");
var ctrl = require("./controller");
var passport = require("passport");
var middleware = require("./middleware");

var Router = express.Router();


/*
 * Middle Ware
*/
Router.use( middleware.initLocals );


// Main
// Router.get("/");


// Users
Router.route("/users")
  .get( ctrl.users.index )
  .post( ctrl.users.create );

Router.get("/users/new", ctrl.users.new );

Router.route("/users/:id")
  .get( ctrl.users.show )
  .put( ctrl.users.update )
  .delete( ctrl.users.destroy );


// Auth
Router.get("/logout", ctrl.auth.logout );

Router.route("/login")
  .get("/login",  ctrl.auth.new )
  .post("/login", passport.authenticate('local') ,ctrl.auth.create);

