var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:3000", {useMongoClient: true, });

module.exports.User = require("./user");
module.exports.Event = require("./event");
