// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = requrie('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


/************
* DATABASE *
************/

var db = require('./models'),
  Event = db.Event,
  User = db.User;

/*************
* MIDDLEWARE *
**************/

app.use(cookieParser());
app.use(session({
  secret: 'whereismarcellino',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/**********
* ROUTES *
**********/

app.get('/', function(req, res) {
  res.send("hello world!");
})



/**********
 * SERVER *
 **********/

// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
