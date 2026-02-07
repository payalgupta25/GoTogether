import express from 'express';  
import {getAutoCompleteSuggestions} from '../controllers/maps.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();


router.get('/get-suggestions', protectRoute, async (req, res) => {
        try {
            const { input } = req.query;
            // console.log(input);
            
            const suggestions = await getAutoCompleteSuggestions(input, req.userLocation.lat, req.userLocation.lon);
            res.status(200).json(suggestions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message || 'Internal server error' });
        }
    });



export default router;