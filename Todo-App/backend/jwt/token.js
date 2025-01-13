// Importing required dependencies
import jwt from 'jsonwebtoken'; // For generating JSON Web Tokens
import User from '../model/user.model.js'; // User model for database operations

// Function to generate a token and save it in cookies
export const generateTokenAndSaveInCookies = async (userId, res) => {
  try {
    // Generate a JWT token for the user
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d", // Token will expire in 10 days
    });

    // Set the generated token as a cookie in the response
    res.cookie("jwt", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie, enhancing security
        secure:false,
        sameSite: "lax", // Prevents CSRF attacks but allows cross-site cookies for safe top-level navigation
        //path:"/"
    });

    
    // Update the user's record in the database with the generated token
    await User.findByIdAndUpdate(userId, { token });

    // Return the generated token
    return token;
  } catch (error) {
    // Log the error and throw it to be handled by the caller
    console.error("Error generating token or saving in cookies:", error);
    throw new Error("Failed to generate token or update user");
  }
};