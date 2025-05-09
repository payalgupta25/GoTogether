import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/db.js";
import authRoutes from "./routes/auth.routes.js"
import rideRoutes from "./routes/rides.routes.js"
import sosRoutes from "./routes/sos.routes.js"
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app=express()

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:5173", // Your frontend URL
        credentials: true, // Allow cookies
    })
);


app.use('/api/auth', authRoutes);
app.use('/api/rides',rideRoutes);
app.use("/api/sos", sosRoutes);


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server running on PORT http://localhost:${PORT}`);
    connectDB();
})