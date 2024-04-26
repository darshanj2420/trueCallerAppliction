const express = require("express");
const { connectDatabase } = require("./Connection/connection");
const cors = require("cors")
const bodyParser = require("body-parser")
const seedDatas = require("../trueCaller demo/seed")
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Call connection file
connectDatabase();

// call contact 
//Contact Routes
const contactRoutes = require("./Controller/contact");
app.use("/", contactRoutes);

//User Routes
const userRoutes = require("./Controller/user");
const contact = require("./Collection/contact");
app.use("/", userRoutes);

// Function to seed data
const seedDataFunction = async () => {
  try {
    await contact.insertMany(seedDatas);
    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Check if running the seed script
if (process.argv[2] === 'seed') {
  seedDataFunction();
}
//server run port 3001
app.listen(3001, () => {
    console.log("running port 3001");
  });