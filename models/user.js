var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String
});

UserSchema.plugin( passportLocalMongoose, {
  usernameField:"email"
});

var User = mongoose.model("User", UserSchema );

module.exports = User
