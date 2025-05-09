import express from 'express';  
import {createRide, getRideById, updateRide , deleteRide,completeRide, getAllRides,getFilteredRides, rateDriver, confirmRide} from '../controllers/ride.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create',protectRoute, createRide);     
router.get('/all', getAllRides);
router.get('/ride/:id', getRideById);
router.delete('/delete/:id',protectRoute, deleteRide);
router.put('/update/:id',protectRoute, updateRide);
router.post('/filter',protectRoute, getFilteredRides);
router.post('/rating/:id',protectRoute, rateDriver);
router.post('/confirm/:id',protectRoute, confirmRide);
router.post('/complete/:id',protectRoute, completeRide);


export default router;