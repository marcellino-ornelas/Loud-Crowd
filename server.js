// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');


/************
* DATABASE *
************/

  // var db = require('./models');


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
