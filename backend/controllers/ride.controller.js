import Ride from '../models/ride.model.js';
import User from '../models/user.model.js';
import { getCoordinates } from './maps.controller.js';
import axios from 'axios';

// Get all rides
export const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find({isCompleted:false})
        .populate("driver", "name email averageRating") // Fetch only name and email from User
        .populate("passengers", "name");
        res.status(200).json(rides);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const getFilteredRides = async (req, res) => {
    try {
        const { from, to, date } = req.body;
        const rides = await Ride.find({ 
            $or: [
                {from:from},
                {to:to},
                {date:date}
            ]
         });
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get ride by ID
export const getRideById = async (req, res) => {
    try {
      const ride = await Ride.findById(req.params.id).populate("passengers driver", "name email");
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      
      res.status(200).json(ride);
    } catch (error) {
      if (error.kind === "ObjectId") {
        return res.status(400).json({ message: "Invalid ride ID" });
      }
      res.status(500).json({ message: error.message });
    }
  };

// Create a new ride
export const createRide = async (req, res) => {
  try {
    if (!req.user) {
      console.log("No user found");
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    // 1. Validate fields early
    const { from, to, numberOfMembers, date, time, price } = req.body;
    if (!from || !to || !numberOfMembers || !date || !time || !price) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    // 2. Get coordinates
    const start = await getCoordinates(from);
    const destination = await getCoordinates(to);
    console.log("coordinates", start, destination);
    
    // 3. Calculate distance
    const distance = await calculateDistance(
      start.lng, start.lat,
      destination.lng, destination.lat
    );

    // 4. Create ride with distance
    const ride = new Ride({
      from,
      to,
      driver: req.user._id,
      numberOfMembers,
      date,
      time,
      price,
      distance, // in km
    });

    const newRide = await ride.save();
    res.status(201).json(newRide);
  } catch (error) {
    console.error("Error in createRide:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Update a ride
export const updateRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        // console.log(ride.driver.toString(), req.user._id.toString())
        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this ride' });
        }

        const updates = {
            from: req.body.from || ride.from,
            to: req.body.to || ride.to,
            numberOfMembers: req.body.numberOfMembers || ride.numberOfMembers,
            date: req.body.date || ride.date,
            time: req.body.time || ride.time,
            price: req.body.price || ride.price
        };

        Object.assign(ride, updates);

        const updatedRide = await ride.save();
        res.status(200).json(updatedRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a ride
export const deleteRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.driver.toString() != req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this ride' });
        }

        await Ride.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Ride deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/rides/rate/:rideId
export const rateDriver = async (req, res) => {
  const { id: rideId } = req.params;
  const { score } = req.body;
  const userId = req.user._id;

  const ride = await Ride.findById(rideId);
  if (!ride) return res.status(404).json({ error: "Ride not found" });

  // Check if user is a passenger
  const isPassenger = ride.passengers.some(p => p.toString() === userId.toString());
  if (!isPassenger) {
    return res.status(400).json({ error: "You are not a passenger on this ride." });
  }

  // Check if already rated
  const alreadyRated = ride.ratings.some(r => r.passenger.toString() === userId.toString());
  if (alreadyRated) {
    return res.status(400).json({ error: "You have already rated this ride." });
  }

  // Add to ride's ratings
  ride.ratings.push({ passenger: userId, score });
  await ride.save();

  // Also add to driver's ratings
  const driver = await User.findById(ride.driver);
  driver.ratings.push({ passenger: userId, score });
  await driver.save();

  res.json({ success: true, message: "Thanks for your feedback!" });
};


export const confirmRide = async (req, res) => {
    try {
        const rideId = req.params.id;
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if(ride.numberOfMembers<=0) {
            return res.status(400).json({ message: "No more seats available" });    
        }
        // Prevent driver from booking their own ride
        if (ride.driver.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Driver cannot book their own ride" });
        }

        // Check if the user has already confirmed this ride
        if (ride.passengers.includes(req.user._id)) {
            return res.status(400).json({ message: "You have already confirmed this ride" });
        }

        // Confirm the ride and add the passenger
        ride.isConfirmed = true; // Keeps ride confirmed but allows more passengers
        ride.passengers.push(req.user._id);
        ride.numberOfMembers-=1;
        await ride.save();

        res.status(200).json({ message: "Ride confirmed successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const completeRide = async (req, res) => {
    try {
        const rideId = req.params.id;
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.driver.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to complete this ride" });
        }

        // if (!ride.isConfirmed) {
        //     return res.status(400).json({ message: "Ride is not confirmed yet" });
        // }

        if (ride.isCompleted) {
            return res.status(400).json({ message: "Ride is already completed" });
        }
        const emissionFactor = 0.21; // kg CO₂ per km
        const totalPeople = 1 + ride.passengers.length;
        const totalCarbonSaved = ride.distance * (1 - 1 / totalPeople) * emissionFactor;
        const carbonPerUser = totalCarbonSaved / totalPeople;
        // Mark ride as completed
        ride.isCompleted = true;
        
        const userIds = [ride.driver, ...ride.passengers];

        for (const userId of userIds) {
          await User.findByIdAndUpdate(
            userId,
            { $inc: { carbonSaved: carbonPerUser } },
            { new: true }
          );
        }

        await ride.save(); // Save before deletion

        // Send success response before deleting
        res.status(200).json({ message: "Ride completed successfully!" });
        
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message });
        }
    }
};

// Get ongoing rides for a user (driver or passenger)
export const getOngoingRidesForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const rides = await Ride.find({
            isCompleted: false,
            $or: [
                { driver: userId },
                { passengers: userId }
            ]
        })
        .populate("driver", "name email")
        .populate("passengers", "name");
        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get completed rides for a user (driver or passenger)
export const getCompletedRidesForUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const rides = await Ride.find({
            isCompleted: true,
            $or: [
                { driver: userId },
                { passengers: userId }
            ]
        })
        .populate("driver", "name email")
        .populate("passengers", "name");
        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// route: GET /api/rides/pending-ratings
export const getPendingRatings = async (req, res) => {
  try {
    const userId = req.user._id;

    const completedRides = await Ride.find({
      isCompleted: true,
      passengers: userId
    }).populate("driver");

    const pendingRatings = completedRides.filter(ride =>
      !ride.ratings.some(r => r.passenger.toString() === userId.toString())
    );

    res.json({ rides: pendingRatings });
  } catch (err) {
    console.error("Error getting pending ratings:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const calculateDistance = async (fromLng, fromLat, toLng, toLat) => {
  const apiKey = "mDO5KfGVfRkA5MEeyU2iRVcCFu3gN6uF";
  const url = `https://api.tomtom.com/routing/1/calculateRoute/${fromLat},${fromLng}:${toLat},${toLng}/json?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const route = response.data.routes[0];

    if (!route || !route.summary || typeof route.summary.lengthInMeters !== "number") {
      console.error("Invalid route summary:", route);
      throw new Error("Distance information missing in route");
    }

    const distance = route.summary.lengthInMeters / 1000;
    console.log("Calculated distance:", distance);
    return distance;
  } catch (err) {
    console.error("Error in calculateDistance:", err);
    throw new Error('Unable to calculate distance');
  }
};
