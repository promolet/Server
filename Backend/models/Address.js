// models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Assuming you have a User model
      required: true,
    },
    details: [
      {
        title: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        pincode: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
