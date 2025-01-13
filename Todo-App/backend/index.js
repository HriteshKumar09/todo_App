// Import the express module to use its functionalities
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoute from "../backend/routes/todo.route.js";
import userRoute from "../backend/routes/user.route.js";
import cookieParser from "cookie-parser";


// Create an object of an Express application
const app = express();

// Load environment variables from .env file
dotenv.config();

// Set up PORT and DB_URI from environment variables
const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

// Middleware for parsing JSON request bodies
app.use(express.json()); 
app.use(cookieParser());

// CORS configuration to allow requests from a specific frontend URL
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allows requests only from the frontend URL specified in environment variables
    credentials: true, // Allows cookies and other credentials to be included in cross-origin requests
    methods: "GET,POST,PUT,DELETE", // Specifies the allowed HTTP methods for cross-origin requests
    allowedHeaders: ["Content-Type", "Authorization"], // Specifies the headers that can be sent in the request
  })
);



// Connect to MongoDB asynchronously and handle connection errors
const connectDb = async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

// Call connectDb to establish the database connection
connectDb();

// Set up routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// Make the app listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
