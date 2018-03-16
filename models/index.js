/*
 * Node Modules
*/
var mongoose = require("mongoose");


/*
 * Modules
*/
// var User = require("./user");


/*
 * Variables
*/
var DataBaseConnection = process.env.MONGODB_URI || "mongodb://localhost/<add_db_name>"


/*
 * DataBase Connection
*/
mongoose.connect( DataBaseConnection );

mongoose.Promise = global.Promise;

module.exports = {
  User: require("./user")
}
