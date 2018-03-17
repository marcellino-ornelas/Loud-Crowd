var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var RatingSchema = new Schema({
  score: { type: Number, required: true, min: 1, max: 20, default: 10 },
  userAddress: { type: String, required: true, unique: true, index: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event' }
});

var Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
