let mongoose = require('mongoose');

let campSchema = new mongoose.Schema(
  {
    name: String,
    url:  String,
    description: String,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
    }
  }
);

module.exports = mongoose.model("Campground", campSchema);
