import express from 'express';  
import {sendSOS, addEmergencyContact, getContact, deleteContact} from '../controllers/sos.controller.js';
const router = express.Router();

router.post('/send-sos/:userId', sendSOS);    
router.post("/add-contact/:userId", addEmergencyContact);
router.get("/contacts/:userId", getContact);
router.delete("/delete-contact/:id", deleteContact);

export default router;