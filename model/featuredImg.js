const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title must be required"],
    unique: [true, "Title Must Be Unique!"],
    maxlength: [100, "Max Length must be 100"],
    minlength: [5, "Min Length must be 5"],
  },
  description: {
    type: String,
    required: [true, "decription must be required"],
    maxlength: [250, "Max Length must be 250"],
    minlength: [10, "Min Length must be 10"],
  },
  video_url: {
    type: String,
    required: [true, "Must Be a  Image link"],
  },
});

const FeaturedVideo = mongoose.model("FeatureVideo", imageSchema);

module.exports = FeaturedVideo;
