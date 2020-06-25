
let mongoose = require('mongoose');

let campSchema = new mongoose.Schema(
  {
    name: String,
    url:  String,
    description: String
  }
);

module.exports = mongoose.model("Campground", campSchema);
