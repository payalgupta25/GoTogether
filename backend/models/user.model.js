import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        // select: false,  //this will hide the password from the response
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    socketId: {
        type: String,
    },
    emergencyContact: [{
        type: String
    }],
    vehicle: {
        numberPlate: {
          type: String,
          trim: true,
          uppercase: true,
        },
        type: {
          type: String,
          enum: ["Car", "Bike", "Two-wheeler", "EV-Car", "EV-Bike"],
        },
        fuel: {
          type: String,
          enum: ["Petrol", "Diesel", "Electric"],
        }
    },

    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },


    carbonSaved: {
         type: Number,
        default: 0  // in kg
    },
    ratings: [{
        passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, min: 1, max: 5 },
    }],
    pfp : {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    
    verficationToken:String,
    verficationTokenExpiresAt:Date,
},
{
    timestamps:true
}
); 

userSchema.virtual("averageRating").get(function() {
    if (!this.ratings || this.ratings.length === 0) return 0;

    const totalScore = this.ratings.reduce((sum, rating) => sum + (rating.score || 0), 0);
    return totalScore / this.ratings.length;
});
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;