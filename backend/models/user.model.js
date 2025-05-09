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
    ratings: [{
        passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        score: { type: Number, min: 1, max: 5 },
    }],
    
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

const User = mongoose.model("User", userSchema);

export default User;