var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventName: String,
  ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  lowScore: String,
  highScore: String,
  owner: String
});

EventSchema.methods.average = function () {
  if( this.ratings.length < 0) throw new Error("There is no ratings property. Try .populate('ratings') on Event model ")

  var finalScore = this.ratings.reduce(function(acc, nextValue){

    var score = (nextValue || {}).score || 0

    return acc + parseInt( score , 10);
  }, 0);

  return (finalScore / this.ratings.length) || 1
};

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;
