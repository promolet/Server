const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }], // for image URLs
  youtubeLink: { type: String, required: true }, // YouTube video link
});

module.exports = mongoose.model("Course", courseSchema);
