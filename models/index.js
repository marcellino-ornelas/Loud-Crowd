var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/engagement");

module.exports.Event = require("./event");
module.exports.User = require("./user");
module.exports.Rating = require("./rating")
