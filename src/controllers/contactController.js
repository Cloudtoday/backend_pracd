 const Contact = require("../models/contactModel");

// ==========================
// 1️⃣ Submit Contact Form (Patient / Doctor)
// ==========================
const submitContact = async (req, res) => {
  try {
    const { first_name, last_name, email, mobile_number, message } = req.body;

    if (!first_name || !email || !mobile_number) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newContact = new Contact({
      first_name,
      last_name,
      email,
      mobile_number,
      message,
    });

    await newContact.save();

    res.status(201).json({
      message: "Your enquiry has been submitted successfully",
      contact: newContact,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// ==========================
// 2️⃣ Admin: Get All Contact Enquiries
// ==========================
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    if (!contacts.length) {
      return res.status(404).json({ message: "No contact enquiries found" });
    }

    res.status(200).json({ total: contacts.length, contacts });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = { submitContact, getAllContacts };
