const mongoose = require('mongoose');

// Define the schema for the Result model
const resultSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  }
});

// Create the Result model using the schema
const Result = mongoose.model('Result', resultSchema);

// Export the Result model
module.exports = Result;
