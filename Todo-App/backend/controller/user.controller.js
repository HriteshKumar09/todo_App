// Importing the User model
import User from "../model/user.model.js";

// Importing Zod for validation
import { z } from "zod";

import bcrypt from 'bcryptjs';
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

// Defining the user schema for validation using Zod
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }), // Email must be valid
  username: z.string().min(3, { message: "Invalid username, must be at least 3 characters" }), // Username must be at least 3 characters
  password: z.string().min(6, { message: "Password must be at least 6 characters" }), // Password must be at least 6 characters
});

// Function to handle user registration
export const register = async (req, res) => {
  try {
    // Destructure email, username, and password from the request body
    const { email, username, password } = req.body;

    // Check if any field is missing
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Validate input using the Zod schema
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
    //return res.status(400).json({ errors: validation.error.errors }); // Return validation errors

    // Map validation errors to extract error messages
          const errorMessage = validation.error.errors.map((err) => err.message);
          return res.status(400).json({ errors: errorMessage }); // Send error messages as a response
        }

    
    // Check if a user with the same email already exists in the database
    const user = await User.findOne({ email });
    if (user) {
      // If user exists, send a 400 response with an error message
      return res.status(400).json({ message: "User already registered" });
    }

    const hashPassword=await bcrypt.hash(password,10)
    // Create a new user object
    const newUser = new User({ email, username, password:hashPassword });
    await newUser.save(); // Save the new user to the database

    if(newUser){
        const token=await generateTokenAndSaveInCookies(newUser._id,res);
        res
        .status(201)
        .json({ message: "User created successfully",newUser,token});
    }

    // If the user is successfully created, send a 201 response
    //return res.status(201).json({ message: "User created successfully", newUser });
    } catch (err) {
    // Log the error and send a 500 response
    console.log("Error registering user:", err);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ errors: "Invalid email or password" });
      }
      const token = await generateTokenAndSaveInCookies(user._id, res);
      res
        .status(200)
        .json({ message: "User logged in successfully", user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error logging user" });
    }
  };
  
  export const logout = (req, res) => {
    try {
      res.clearCookie("jwt", {
        path: "/",
      });
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error logging out user" });
    }
  };