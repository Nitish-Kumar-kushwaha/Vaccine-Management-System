const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  applicantName: {
    type: "string",
    required: true,
  },
  date: {
    type: "string",
    required: true,
  },
  vaccine: {
    type: "string",
    required: true,
  },
  dose: {
    type: "string",
    required: true,
  },
  time: {
    type: "string",
    required: true,
  },
});

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;
