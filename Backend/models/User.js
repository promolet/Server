const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true , default:"user"},
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);
module.exports = User;
