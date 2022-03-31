const express = require("express");
const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect("mongodb://localhost:27017/vcm", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("db is connected");
    })
    .catch((err) => {
      console.log("err");
    });
};

module.exports = connectDB;
