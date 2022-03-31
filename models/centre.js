const mongoose = require("mongoose");

require("../config/db");

const centreSchema = new mongoose.Schema({
  centreName: String,
  address: String,
  status: String,
});

const CentreDetails = mongoose.model("CentreDetails", centreSchema);

module.exports = CentreDetails;
