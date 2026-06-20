import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { sendVerificationEamil } from '../middlewares/auth.middleware.js';
import { senWelcomeEmail } from "../middlewares/auth.middleware.js";
export const signup = async (req, res) => { 
    try {
        const {name, gender, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Email is not in correct format"});
        }

        if(password.length < 8){
            return res.status(400).json({error:"Password must be atleast 8 characters long"});
        }

        if(!name || !email || !password || !gender){
            return res.status(400).json({error:"All fields are mandatory"});
        }

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({error:"User with this email or username already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        
        const verficationToken= Math.floor(100000 + Math.random() * 900000).toString()
        const newUser = new User({
            name,
            email, 
            password:passwordHash,
            gender,
            verficationToken,
            verficationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000
        });

        const isEmailSent = await sendVerificationEamil(newUser.email,verficationToken)

        if (!isEmailSent.success) {
            return res.status(500).json({ error: "Failed to send verification email. Please try again." });
        }
        
        

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            console.log("newUser",newUser);
            res.status(201).json({
                _id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                gender:newUser.gender,
                newUser
            });
        }else{
            return res.status(400).json({error:"Something went wrong"});
        }
    } catch (error) {
        console.log("Error in signup controller: ",error);
        res.status(500).json({error:"Internal server error"});
    }
} 

export const login = async (req, res) => {
    try {

        const {email,password} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
          }
          const isPasswordCorrect = await bcrypt.compare(password, user.password);
          console.log(password);
          
        // const isPasswordCorrect = user && await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({error:"Invalid credentials"});
        }else{
            //if we won't generate token and set cookie here, then we have to send token in response and then client has to store it in local storage or session storage
            const token = generateTokenAndSetCookie(user._id,res); //here we are generating token and setting it in cookie beacuse we are using cookie based authentication
            res.status(200).json({
                _id:user._id,
                email:user.email,
                token
            });
            console.log(`${user.name} logged in successfully`);
        }
 
    } catch (error) {
        console.log("Error in login controller: ",error);
        res.status(500).json({error:"Internal server error"});
        
    }
}

export const logout= async (req, res, next) => {
    try {
        const name = req.user?.name || "Unknown User";
        console.log(`${name} logged out successfully`);
        res.cookie("jwt","",{maxAge:0}); //setting the jwt cookie to empty string and maxAge to 1ms so that it expires immediately
        res.status(200).json({message:`${name} Logged out successfully`});
    } catch (error) {
        console.log("Error in logout controller: ",error);
        res.status(500).json({error:"Internal server error"});
    }
}

// export const getMe = async (req, res,next) => {
//     try {
//         // const user = await User.findById(req.user._id).select("-password"); //select("-password") is used to exclude password from the response
//         // const ratings = user.ratings || [];
//         // const totalScore = ratings.reduce((sum, rating) => sum + (rating.score || 0), 0);
//         // const averageRating = ratings.length > 0 ? (totalScore / ratings.length).toFixed(2) : 0;
//         // res.status(200).json({
//         //     _id:user._id,
//         //     name:user.name,
//         //     email:user.email,
//         //     isVerified:user.isVerified,
//         //     ratings: user.averageRating.toFixed(1),
//         //     averageRating
//         // });
//         res.status(200).json({user:req.user});  
        
//     } catch (error) {
//         console.log("Error in getMe controller: ");
//         res.status(500).json({error:"Internal server error"});
//     }
// }

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const ratings = user.ratings || [];
    const totalScore = ratings.reduce((sum, r) => sum + (r.score || 0), 0);
    const averageRating = ratings.length > 0 ? (totalScore / ratings.length).toFixed(1) : 0;

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        vehicle: user.vehicle,
        averageRating: parseFloat(averageRating),
        pfp : user.pfp
      }
    });

  } catch (error) {
    console.log("Error in getMe controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const verifyEmail = async (req, res) => {
    try {
        const {code}=req.body 
        const user= await User.findOne({
            verficationToken:code,
            verficationTokenExpiresAt:{$gt:Date.now()}
        })
        if (!user) {
            return res.status(400).json({success:false,message:"Inavlid or Expired Code"})
        }
          
        user.isVerified=true;
        user.verficationToken=undefined;
        user.verficationTokenExpiresAt=undefined;
        await user.save()
        await senWelcomeEmail(user.email,user.name)
        return res.status(200).json({success:true,message:"Email Verifed Successfully"})
           
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
    }
}

export const vehicleInfo = async (req, res) => {
  try {
    const { numberPlate, vehicleType, fuelType } = req.body;
    const user = await User.findById(req.user._id);  // req.user se, body se email nahi
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.vehicle = { numberPlate, type: vehicleType, fuel: fuelType };
    await user.save();
    return res.status(200).json({ success: true, message: "Vehicle info saved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/users/carbon-stats
export const getCarbonStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("carbonSaved name email");
    res.status(200).json({ 
      carbonSaved: user.carbonSaved.toFixed(2), 
      name: user.name 
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch carbon data" });
  }
};


