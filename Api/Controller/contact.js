const express = require("express");
const Contact = require("../Collection/contact");
const verifyToken = require("../Middleware/auth");
const router = express.Router();

//Create Contact details api
router.post("/contact", async (req, res) => {
  try {
    const { name, phoneNumber, email, isSpam } = req.body;
    // Create new contact
    let contact = new Contact({ name, phoneNumber, email, isSpam });

    // Save user to database
    await contact.save();

    res.json({ msg: "Contact added successfully", contact });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/users", verifyToken, async (req, res) => {
  const userdata = await Contact.find();
  console.log("userdata", userdata);
  res.json(userdata);
});
router.get("/contact/search", verifyToken, async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      return res
        .status(400)
        .json({ msg: "Please provide searchQuery for search" });
    }

    let query = {};

    // Check if searchQuery is a valid phoneNumber
    if (!isNaN(searchQuery)) {
      query.phoneNumber = { $regex: new RegExp(searchQuery, "i") };
    } else if (!isNaN(searchQuery) && searchQuery.length === 10) {
      // Search for exact phone number
      query.phoneNumber = searchQuery;
    } else {
      // Perform case-insensitive search for name
      query.name = { $regex: new RegExp(searchQuery, "i") };
    }

    const contacts = await Contact.find(query);

    if (!contacts.length) {
      return res.status(404).json({ msg: "No contacts found" });
    }

    // Sort the contacts based on the searchQuery
    const sortedContacts = contacts.sort((a, b) => {
      const regexPattern = new RegExp(`^${searchQuery.charAt(0)}.*`, "i");
      return regexPattern.test(a.name) ? -1 : 1;
    });

    res.json(sortedContacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Mark phoneNumber as spam
router.put("/contact/markSpam/:phoneNumber", verifyToken, async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    // Update the contact's isSpam field to true
    const contact = await Contact.findOneAndUpdate(
      { phoneNumber },
      { isSpam: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    res.json({ msg: "Contact marked as spam", contact });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// Mark phoneNumber as not spam
router.put("/contact/markNotSpam/:phoneNumber", verifyToken, async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;

    // Update the contact's isSpam field to false
    const contact = await Contact.findOneAndUpdate(
      { phoneNumber },
      { isSpam: false },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ msg: "Contact not found" });
    }

    res.json({ msg: "Contact marked as not spam", contact });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
