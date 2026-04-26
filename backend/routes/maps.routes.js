import express from 'express';  
import { getAutoCompleteSuggestions, getCoordinates } from '../controllers/maps.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/get-suggestions', protectRoute, async (req, res) => {
  try {
    const { input, lat, lon } = req.query;  // lat/lon come from frontend geolocation
    const suggestions = await getAutoCompleteSuggestions(input, lat, lon);
    res.status(200).json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Internal server error' });
  }
});

router.get('/coordinates', protectRoute, async (req, res) => {
  try {
    const { place } = req.query;
    if (!place) return res.status(400).json({ message: 'place is required' });
    const coords = await getCoordinates(place);
    res.status(200).json(coords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;