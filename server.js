// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
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

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true, }));

// serve static files from public folder
app.use(express.static(__dirname + "/public"));

// set view engine to ejs
app.set("view engine", "ejs");

app.use(methodOverride("_method"));



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
  res.render('index');
})


/**************
* AUTH ROUTES *
**************/

//show langing page/signup page
app.get('/', function(req, res) {

})

/**********
 * SERVER *
 **********/

// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
