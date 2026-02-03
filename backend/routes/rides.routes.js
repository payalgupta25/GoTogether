import express from 'express';  
import {createRide, getRideById, updateRide , deleteRide,completeRide, getAllRides,getFilteredRides, rateDriver, confirmRide, getCompletedRidesForUser,getOngoingRidesForUser,getPendingRatings} from '../controllers/ride.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create',protectRoute, createRide);     
router.get('/all', getAllRides);
router.get('/ride/:id', getRideById);
router.delete('/delete/:id',protectRoute, deleteRide);
router.put('/update/:id',protectRoute, updateRide);
router.post('/filter',protectRoute, getFilteredRides);
router.post('/rate/:id',protectRoute, rateDriver);
router.post('/confirm/:id',protectRoute, confirmRide);
router.post('/complete/:id',protectRoute, completeRide);
router.get('/ongoing', protectRoute, getOngoingRidesForUser);
router.get('/completed', protectRoute, getCompletedRidesForUser);
router.get("/pending-ratings", protectRoute, getPendingRatings);


export default router;