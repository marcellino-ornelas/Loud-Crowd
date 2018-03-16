var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost", {useMongoClient: true, });

module.exports.Event = require("./event");
module.exports.User = require("./user");
