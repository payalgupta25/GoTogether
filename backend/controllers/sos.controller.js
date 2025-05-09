import twilio from "twilio";
import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SOS Alert
export const sendSOS = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const { userId } = req.params;

        // Validate request
        if ( !latitude || !longitude) {
            console.log(userId, latitude, longitude)
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Get emergency contacts from DB (Fallback contacts if DB is unavailable)
        const contacts = await Contact.find({ userId }) || ["+919990072250"];
        console.log(contacts)
        // Create SOS message
        const name = await User.findById(userId)
        const message = `🚨 SOS Alert! User ${name.name} needs help.\nLive Location: https://www.google.com/maps?q=${latitude},${longitude}`;

        // Send SMS to all emergency contacts
        for (const contact of contacts) {
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: contact.phoneNumber || contact // Fallback to hardcoded contacts
            });
        }

        // Log SOS alert (for future tracking)
        console.log(`SOS Alert Sent: ${message}`);

        return res.status(200).json({ success: true, message: "SOS alert sent successfully!" });
    } catch (error) {
        console.error("Error sending SOS:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const addEmergencyContact = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const { userId } = req.params;

        if (!userId || !phoneNumber) {
            return res.status(400).json({ success: false, message: "User ID and phone number are required!" });
        }

        const newContact = new Contact({ userId, phoneNumber });
        await newContact.save();

        return res.status(201).json({ success: true, message: "Emergency contact added successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const getContact = async (req, res) => {
    try {
        const { userId } = req.params;
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