import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
        trim: true
    },
    to: {
        type: String,
        required: true,
        trim: true
    },
    
    isConfirmed: {
        type: Boolean,
        default: false,  // Initially, the ride is unconfirmed
    },   
    isCompleted: {
        type: Boolean,
        default: false,  // Initially, the ride is unconfirmed
    }, 
    numberOfMembers: {
        type: Number,
        required: true,
        min: 0,
        max: 4
    },
    
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function(v) {
          // Only validate on new documents, not on updates/completion
          if (!this.isNew) return true;
          return v >= new Date().setHours(0, 0, 0, 0);
        },
        message: props => `${props.value} is in the past!`
      }
    },
    
    time: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time format!`
        }
    },
    stopovers: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.every(stopover => typeof stopover === 'string');
            },
            message: props => `Stopovers should be an array of strings!`
        }
    },
    price: {
        type: Number,
        required: true
    },
    ratings: [{
        passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, min: 1, max: 5 }
    }],
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    passengers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    distance: {
        type: Number, // in kilometers
        required: false // will be filled after hitting API
    },
    duration: {
        type: String, // in minutes
        required: false // will be filled after hitting API
    },
    womenOnly: {
      type: Boolean,
      default: false
    },
    
},

{
    timestamps: true
});

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;