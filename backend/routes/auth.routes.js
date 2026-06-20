import express from 'express';  
import {getMe, signup, login, logout , verifyEmail , vehicleInfo, getCarbonStats} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/signup', signup);
router.get('/me',protectRoute, getMe); //protectRoute is a middleware to check if user is logged in
router.post('/login', login);
router.post('/logout',protectRoute, logout);
router.post('/verifyEmail', verifyEmail);
router.post('/vehicleInfo',protectRoute, vehicleInfo);
router.get("/carbon-stats", protectRoute, getCarbonStats);

router.post('/pfp' , protectRoute , upload.single('pfp') , async(req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const result = await uploadToCloudinary(req.file.path);
        if (!result) return res.status(500).json({ message: "Cloudinary upload failed" });
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { pfp: result.url },
            { new: true }
        );
        res.status(200).json({ 
            message: "PFP updated", 
            pfp: updatedUser.pfp 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router;