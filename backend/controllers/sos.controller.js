import twilio from "twilio";
import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SOS Alert
// TODO: Verification of new nums
export const sendSOS = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const { userId } = req.user;

        if (!latitude || !longitude) {
            console.log(userId, latitude, longitude);
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const contacts = await Contact.find({ userId }) || ["+919990072250"];
        console.log("contacts", contacts);
        console.log("name", req.user.name);

        // 🧭 TomTom live location link
        const message = `🚨 SOS Alert! User ${req.user.name} needs help.\nLive Location: https://www.tomtom.com/mapshare/tools/?lat=${latitude}&lon=${longitude}&zoom=14`;

        for (const contact of contacts) {
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: contact.phoneNumber || contact
            });
        }

        console.log(`SOS Alert Sent: ${message}`);
        return res.status(200).json({ success: true, message: "SOS alert sent successfully!" });
    } catch (error) {
        console.error("Error sending SOS:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


export const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ Correctly extract userId
    const { phoneNumber } = req.body;

    if (!userId || !phoneNumber) {
      return res.status(400).json({ success: false, message: "User ID and phone number are required!" });
    }

    const newContact = new Contact({ userId, phoneNumber });
    await newContact.save();
    console.log(newContact);
    
    await User.findByIdAndUpdate(
        userId,
        { $push: { emergencyContact: newContact.phoneNumber } },
        { new: true }
    );

    return res.status(201).json({ success: true, message: "Emergency contact added successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const getContact = async (req, res) => {
    try {
        const userId = req.user._id;
        const contacts = await Contact.find({ userId });

        return res.status(200).json({ success: true, contacts });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error fetching contacts", error: error.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await Contact.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Contact deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error deleting contact", error: error.message });
    }
}