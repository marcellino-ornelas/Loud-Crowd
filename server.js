// require express and other modules
var express = require('express'),
    app = express(),
    http = require("http"),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    flash = require('connect-flash'),
    _ = require("lodash"),
    async = require('async'),
    socket = require("socket.io"),
    middleware = require("./middleware"),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;


var server = http.createServer(app);
var io = socket(server);

io.on('connection', function (socket) {
  console.log("connection established");
})

/************
* DATABASE *
************/

var db = require('./models'),
  Event = db.Event,
  Rating = db.Rating,
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

// flash messages
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// assign signed in user to locals for template use
app.use(function(req,res,next){
  // add user to locals
  res.locals.user = req.user || null;

  /*
   * Get all flash messages before rendering
  */
  res.render = middleware.renderWithMessages(res.render);

  next();
});

app.use("/login", middleware.denySignedIn);

/**********
* ROUTES *
**********/

// HOMEPAGE ROUTE
app.get("/profile", middleware.isLoggedIn, function (req, res) {

  Event.find({ owner: req.user._id }).populate("ratings").exec(function (err, allevents) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.render("profile", { events: allevents});
    }
  });

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/events/:slug", function(req, res) {

  var slug = req.params.slug;
  var eventName = slug.split("-").join(" ");

  Event.findOne({eventName: eventName}).populate("ratings").exec(function(err, event){
    if(err || !event){
      req.flash("error", "Sorry there was a problem trying to get this event. Please try again later");
      res.redirect("/profile");
    }

    var userRating = req.cookies.voteId && _.find(event.ratings, function(item){
      return item._id.toString() === req.cookies.voteId;
    });

    var formUrl = "/events/" + event._id + "/rating";

    if(userRating){
      formUrl += "/" + userRating._id;
    }

    res.render("events/show", {
      event: event,
      userRating: userRating,
      formUrl: formUrl
    });

  });
});


/*
 * Rating
*/
app.post("/events/:id/rating",function(req,res){

  var id = req.params.id;

  var data = {
    score: req.body.score,
    event: id
  }

  Rating.create( data, function(err,rating){
    if(err || !rating){
      console.log(err)
      res.json({ error: err });
    } else {

      Event.findById(id).exec(function(err, oldEvent){

        oldEvent.ratings.push(rating._id);

        oldEvent.save(function(err, saved_event){
          if(err || !saved_event){
            res.json({ error: err });
          }

          Event.populate( saved_event, { path: "ratings"}, function(err, newEvent){
            if(err){
              res.status(500).json(err);
            }
            var average = newEvent.average();

            res.cookie("voteId", rating._id );
            io.emit("average", average );
            res.json({average: average, rating: rating});
          })
        });

      });
    }

  });
});

app.put("/events/:id/rating/:rating_id",function(req,res){

  var data = { score: req.body.score };

  Rating.findByIdAndUpdate(req.params.rating_id, data ).exec(function(err,rating){

    if(err || !rating){
      res.json({error: err, rating: rating })
    }

    Event.findById(rating.event).populate("ratings").exec(function(err, event){
      var average = event.average();

      res.cookie("voteId", rating._id);
      io.emit("average", average );
      res.json({ average: average});
    })

  });
});

app.post("/events", middleware.isLoggedIn, function(req, res) {

  var newEvent = new Event(req.body);

  req.user.events.push(newEvent._id)

  async.series([
      function(cb){ newEvent.save(cb); },
      function(cb){ req.user.save(cb); },
    ], function(err,results){
      if(err){
        req.flash("error","Sorry there was a problem saving your event, the name of your event must be unique.");
      } else {
        req.flash("success", "Your event has been successfully added");
      }
      res.redirect("/profile");
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
          res.redirect("/profile");
        }
      });
    }
  });
});


// delete event
app.delete("/events/:id", middleware.isLoggedIn, function (req, res) {

  var eventId = req.params.id;

  async.series([
      function(cb){ Event.findOneAndRemove({ _id: eventId, }, cb); },
      function(cb){ Rating.remove({ event: eventId }).exec(cb); },
    ], function(err,results){
      if(err){
        req.flash("error","Sorry there was a problem removing your event. Please try again.");
      } else {
        req.flash("success", "You event has been successfully deleted");
      }
      res.redirect("/profile");
  });

});


// AUTH ROUTES

// show landingpage view
app.get('/', middleware.denySignedIn, function(req, res) {
  res.render('landingpage');
});

// sign up new user, then log them in
//hashes and salts password, saves new user to db
app.post('/',function(req, res) {
  User.register(new User(req.body), req.body.password, function(err, newUser) {
    if (err) {
      req.flash("error", "There was a problem signing you up. Please try again later")
      res.redirect("/");
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/profile');
      });
    }
  });
});

// show login view

app.get('/login', function (req, res) {
 res.render('login');
});

app.post('/login', passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login'}), function(req, res) {
    res.redirect('/profile');
});

// log out user
app.get('/logout', function (req, res) {

  req.logout();
  req.flash("success", "You have successfully been logged out");
  res.redirect('/');
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
server.listen(process.env.PORT || 3000, function () {
  console.log('Express server is up and running on http://localhost:3000/');
});
