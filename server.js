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
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



/**********
* ROUTES *
**********/


// HOMEPAGE ROUTE

app.get("/", function (req, res) {
  Event.find(function (err, allevents) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.render("index", { events: allevents, user: req.user, });
    }
  });
});

app.get("/events/:id", function(req, res) {
  Event.findById(req.params.id, function (err, foundevent) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.render("events/show", { event: foundevent, });
    }
  });
});

app.post("/events", function(req, res) {
  var newevent = new Event(req.body);

  if (!req.user) {
     return res.redirect("/login")
  }

  // save new event in db
  newevent.save(function (err) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.redirect("/");
    }
  });
});

// update event
app.put("/events/:id", function (req, res) {
  // get event id from url params (`req.params`)
  var eventId = req.params.id;

  if (!req.user) {
     return res.redirect("/login")
  }

  // find event in db by id
  Event.findOne({ _id: eventId, }, function (err, foundevent) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      // update the events's attributes
      foundevent.eventName = req.body.eventName || foundevent.eventName;
      foundevent.lowScore = req.body.lowScore || foundevent.lowScore;
      foundevent.highScore = req.body.highScore || foundevent.highScore;


      // save updated event in db
      foundevent.save(function (err, savedevent) {
        if (err) {
          res.status(500).json({ error: err.message, });
        } else {
          res.redirect("/");
        }
      });
    }
  });
});


// delete event
app.delete("/events/:id", function (req, res) {
  // get event id from url params (`req.params`)
  if (!req.user) {
     return res.redirect("/login");
  }

  var eventId = req.params.id;

  // find event in db by id and remove
  Event.findOneAndRemove({ _id: eventId, }, function () {
    res.redirect("/");
  });
});


// AUTH ROUTES

// show signup view
app.get('/signup', function(req, res) {
  res.render('signup', { user: req.user, });
});

// sign up new user, then log them in
//hashes and salts password, saves new yser to db
app.post('/signup', function(req, res) {
  User.register(new User(req.body), req.body.password, function(err, newUser) {
    if (err) {
      console.log("Error!!!" + err)
      res.status(400)
    } else {
      passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  }
  });
});

// show login view
app.get('/login', function (req, res) {
 res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  console.log(req.user);
  res.redirect('/');
});

// log out user
app.get('/logout', function (req, res) {
  console.log("BEFORE logout", JSON.stringify(req.user));
  req.logout();
  console.log("AFTER logout", JSON.stringify(req.user));
  res.redirect('/signup');
});


// API ROUTES

// get all events
app.get("/api/events", function (req, res) {
  // find all events in db
  Event.find(function (err, allevents) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json({ events: allevents, });
    }
  });
});

app.get("/api/users", function (req, res) {
  // find all users in db
  User.find(function (err, allusers) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json({ users: allusers, });
    }
  });
});



// create new event
app.post("/api/events", function (req, res) {
  // create new event with form data (`req.body`)
  var newevent = new event(req.body);

  // save new event in db
  newevent.save(function (err, savedevent) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json(savedevent);
    }
  });
});

// get one event
app.get("/api/events/:id", function (req, res) {
  // get event id from url params (`req.params`)
  var eventId = req.params.id;

  // find event in db by id
  Event.findOne({ _id: eventId, }, function (err, foundevent) {
    if (err) {
      if (err.name === "CastError") {
        res.status(404).json({ error: "Nothing found by this ID.", });
      } else {
        res.status(500).json({ error: err.message, });
      }
    } else {
      res.json(foundevent);
    }
  });
});

// update event
app.put("/api/events/:id", function (req, res) {
  // get event id from url params (`req.params`)
  var eventId = req.params.id;

  // find event in db by id
  Event.findOne({ _id: eventId, }, function (err, foundevent) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      // update the events's attributes
      foundevent.title = req.body.title;
      foundevent.description = req.body.description;

      // save updated event in db
      foundevent.save(function (err, savedevent) {
        if (err) {
          res.status(500).json({ error: err.message, });
        } else {
          res.json(savedevent);
        }
      });
    }
  });
});

// delete event
app.delete("/api/events/:id", function (req, res) {
  // get event id from url params (`req.params`)
  var eventId = req.params.id;

  // find event in db by id and remove
  Event.findOneAndRemove({ _id: eventId, }, function (err, deletedevent) {
    if (err) {
      res.status(500).json({ error: err.message, });
    } else {
      res.json(deletedPost);
    }
  });
});




/**********
 * SERVER *
 **********/

// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
