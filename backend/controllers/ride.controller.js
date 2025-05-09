import Ride from '../models/ride.model.js';
import User from '../models/user.model.js';


// Get all rides
export const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find({})
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
    
    const ride = new Ride({
        from: req.body.from,
        to: req.body.to,
        driver:req.user._id,
        vehicle: req.body.vehicle,
        numberPlate: req.body.numberPlate,
        numberOfMembers: req.body.numberOfMembers,
        date: req.body.date,
        time: req.body.time,
        price: req.body.price,
        fuelType: req.body.fuelType,
    });
    

    if(!ride.from || !ride.to || !ride.driver || !ride.vehicle || !ride.numberPlate || !ride.numberOfMembers || !ride.date || !ride.time || !ride.price || !ride.fuelType) {
        return res.status(400).json({ message: 'All fields are mandatory' });
    }

    try {
        if (!req.user) {
            console.log("No user found");
            return res.status(401).json({ error: "Unauthorized: No user found" });
        }
        const newRide = await ride.save();
        res.status(201).json(newRide);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
            vehicle: req.body.vehicle || ride.vehicle,
            numberPlate: req.body.numberPlate || ride.numberPlate,
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

export const rateDriver = async (req, res) => {
    try {
        const { score } = req.body;
        const rideId = req.params.id;
        const passengerId = req.user._id;

        if (score < 1 || score > 5) {
            return res.status(400).json({ message: "Rating should be between 1 and 5." });
        }

        const ride = await Ride.findById(rideId).populate("driver");
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (!ride.passengers.includes(passengerId)) {
            return res.status(403).json({ message: "You are not authorized to rate this driver." });
        }

        if (!ride.isCompleted) {
            return res.status(400).json({ message: "You can only rate a completed ride." });
        }

        // Check if passenger already rated
        const alreadyRated = ride.ratings.find(r => r.passenger.toString() === passengerId.toString());
        if (alreadyRated) {
            return res.status(400).json({ message: "You have already rated this ride." });
        }

        // Add rating to ride
        ride.ratings.push({ passenger: passengerId, score });
        await ride.save();

        // Update driver's rating in User model
        const driver = await User.findById(ride.driver._id);
        driver.ratings.push({ passenger: passengerId, score });
        await driver.save();

        res.status(200).json({ 
            message: "Rating submitted successfully!", 
            averageRating: driver.averageRating,
            ratings: driver.ratings  // Return ratings with passenger info
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const confirmRide = async (req, res) => {
    try {
        const rideId = req.params.id;
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if(ride.passengers.length >= ride.numberOfMembers) {
            return res.status(400).json({ message: "No more seats available" });    
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

        if (!ride.isConfirmed) {
            return res.status(400).json({ message: "Ride is not confirmed yet" });
        }

        if (ride.isCompleted) {
            return res.status(400).json({ message: "Ride is already completed" });
        }

        // Mark ride as completed
        ride.isCompleted = true;
        await ride.save(); // Save before deletion

        // Send success response before deleting
        res.status(200).json({ message: "Ride completed successfully!" });

        // Delete the ride after response is sent
        await Ride.findByIdAndDelete(rideId);
        
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message });
        }
    }
};

