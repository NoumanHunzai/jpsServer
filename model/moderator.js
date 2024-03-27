const mongoose = require("mongoose");

const moderatorSchema = new mongoose.Schema({
  password: { type: String, required: true },
});

const Moderator = mongoose.model("Moderator", moderatorSchema);

module.exports = Moderator;
