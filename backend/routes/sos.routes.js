import express from 'express';  
import { protectRoute } from '../middlewares/auth.middleware.js';
import {sendSOS, addEmergencyContact, getContact, deleteContact} from '../controllers/sos.controller.js';
const router = express.Router();

router.post('/send-sos',protectRoute, sendSOS);    
router.post("/add-contact",protectRoute, addEmergencyContact);
router.get("/contacts",protectRoute, getContact);
router.delete("/delete-contact/:id",protectRoute, deleteContact);

export default router;