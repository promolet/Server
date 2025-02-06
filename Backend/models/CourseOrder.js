const mongoose = require("mongoose");

const CourseOrderSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paymentId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CourseOrder", CourseOrderSchema);
