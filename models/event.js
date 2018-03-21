var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventName: { type: String, unique: true, required: true },
  ratings: [{ type: Schema.Types.ObjectId, ref: 'Rating' }],
  lowScore: { type: String, required: true },
  highScore: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

EventSchema.methods.average = function () {
  if( this.ratings.length < 0) throw new Error("There is no ratings property. Try .populate('ratings') on Event model ")

  var finalScore = this.ratings.reduce(function(acc, nextValue){

    var score = (nextValue || {}).score || 0

    return acc + parseInt( score , 10);
  }, 0);

  return Math.round((finalScore / this.ratings.length)) || 0
};

var Event = mongoose.model("Event", EventSchema);

module.exports = Event;
