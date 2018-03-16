var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var PostSchema = new Schema({
  eventName: String,
  Rating: Number,
  lowScore: String,
  highScore: String,
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
