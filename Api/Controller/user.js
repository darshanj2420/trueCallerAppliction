const express = require("express");
const User = require("../Collection/user");
const Contact = require("../Collection/contact");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const verifyToken = require("../Middleware/auth");
const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { contact_id, password } = req.body;
    let users = new User({ contact_id, password });
    await users.save();
    res.json({ msg: "User added successfully", users });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// router.post("/register", async (req, res) => {
//   try {
//     const { contact_id, password } = req.body;
//     console.log("contact_id", contact_id);
//     // Validate request body
//     if (!contact_id || !password) {
//       return res
//         .status(400)
//         .json({ msg: "Please provide contact_id and password" });
//     }

//     // Check if the contact exists
//     const existingContact = await Contact.findById(contact_id);
//     console.log("existingContact", existingContact);
//     if (!existingContact) {
//       return res.status(400).json({ msg: "Contact not found" });
//     }

//     // Check if the user already exists
//     const existingUser = await User.findOne({ contact_id });

//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create a new user
//     const newUser = new User({
//       contact_id,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res
//       .status(201)
//       .json({ msg: "User registered successfully", user: newUser });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server Error");
//   }
// });

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;

    // Validate request body
    if (!name || !phoneNumber || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide name, phoneNumber, and password" });
    }

    // Check if the contact already exists
    const existingContact = await Contact.findOne({ phoneNumber });

    if (!existingContact) {
      // Create a new contact
      const newContact = new Contact({
        name,
        phoneNumber,
      });

      await newContact.save();

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        contact_id: newContact._id,
        password: hashedPassword,
      });

      await newUser.save();

      res
        .status(201)
        .json({ msg: "User registered successfully", user: newUser });
    } else {
      return res.status(400).json({ msg: "Contact already exists" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validate request body
    if (!phoneNumber || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide phoneNumber and password" });
    }

    // Find the contact by phoneNumber
    const contact = await Contact.findOne({ phoneNumber });
    if (!contact) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Find the user by contact_id
    const user = await User.findOne({ contact_id: contact._id });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.jwtSecret, // Your JWT secret key
      { expiresIn: "2h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route for verifying token
router.post('/verifyToken', verifyToken, (req, res) => {
  // If middleware is passed, token is verified
  res.json({ valid: true });
});
module.exports = router;
