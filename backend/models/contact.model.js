import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
