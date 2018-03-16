var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:3000");

module.exports.User = require("./user");
module.exports.Event = require("./event");
