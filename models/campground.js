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
    ]
  }
);

module.exports = mongoose.model("Campground", campSchema);
