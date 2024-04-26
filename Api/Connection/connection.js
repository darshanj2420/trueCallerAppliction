const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose.connect("mongodb://0.0.0.0:27017/trueCaller");
  let db = mongoose.connection;

  db.on("connected", () => {
    console.log("Connected to the database!");
  });
};
