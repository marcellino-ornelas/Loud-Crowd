var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventName: String,
  rating: Number,
  lowScore: String,
  highScore: String,
  owner: String
});

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;
