const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, default: uuidv4, unique: true }, // Unique User ID
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true }, // Added mobile number
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["student", "customer"], 
      default: "customer" 
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);
module.exports = User;
