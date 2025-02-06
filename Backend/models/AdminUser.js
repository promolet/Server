const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AdminUserschema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default:"admin" },
});

const Admin = mongoose.model("AdminUser", AdminUserschema);
module.exports = Admin;