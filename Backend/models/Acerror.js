// models/ErrorCode.js
const mongoose = require('mongoose');

const errorCodeSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  errorCode: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const ErrorCode = mongoose.model('ErrorCode', errorCodeSchema);

module.exports = ErrorCode;
