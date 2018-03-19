var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/engagement");

module.exports.Event = require("./event");
module.exports.User = require("./user");
module.exports.Rating = require("./rating")
