/**
 * Server.js
 *
*/


/*
 * Modules
*/
var express = require("express"),
    bodyParser = require("body-parser"),
    routes = require("./routes"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


/*
 * Data Base
*/

var db = require("./models");

/*
 * Initialize App
*/
var app = express();


app.set("port", process.env.PORT || 3000);

/*
 * Middle Ware
*/
app.use(cookieParser());

app.use(session({
  secret: '4239dn9u4b2u199lakir032',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


/*
 * Passport Set-up
*/

// old way
// passport.use( new LocalStrategy( User.authenticate() ) );

// passport-local-mongoose documentation said to use this method
// instead of new LocalStrategy
passport.use( db.User.createStrategy() );

passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );

/*
 * Routes
*/
app.use(routes);


app.listen( app.get("port"), function(error){
  console.log("server is now running on port:"+app.get("port"));
});
