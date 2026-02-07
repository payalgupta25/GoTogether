import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import authRoutes from "./routes/auth.routes.js";
import rideRoutes from "./routes/rides.routes.js";
import sosRoutes from "./routes/sos.routes.js";
import mapRoutes from "./routes/maps.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {Server} from "socket.io";
import http from "http";

dotenv.config();
const app = express();
const server = http.createServer(app); // 👈 wrap express app into http server

// Express middleware (MUST be before routes and Socket.IO)
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - MUST allow specific origin with credentials for preflight requests
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Setup Socket.IO on the HTTP server with matching CORS
// const io = new Server(server, {
//   cors: corsOptions,
//   allowEIO3: true
// });

// Basic WebSocket connection
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // socket.on("sendLocation", ({ rideId, lat, lon }) => {
//   //   console.log(`Live location for ride ${rideId}:`, lat, lon);

//   //   // Broadcast it to others if needed:
//   //   // io.emit("locationUpdate", { rideId, lat, lon });

//   //   // OR: Save to DB
//   //   // await Ride.findByIdAndUpdate(rideId, { currentLocation: { lat, lon } });
//   // });

//   // socket.on("disconnect", () => {
//   //   console.log("User disconnected:", socket.id);
//   // });
// });

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/maps", mapRoutes);

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  connectDB();
});
