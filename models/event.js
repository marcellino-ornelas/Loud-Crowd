var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventName: String,
  Rating: Number,
  lowScore: String,
  highScore: String,
});

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;
