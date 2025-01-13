import mongoose from "mongoose"; // Importing Mongoose for database modeling

// Define the schema for the "User" collection
const userSchema = new mongoose.Schema({
  username: {
    type: String, // The username should be a string
    required: true, // This field is mandatory
  },
  email: {
    type: String, // The email should be a string
    required: true, // This field is mandatory
    unique: true, // Each email must be unique in the collection
  },
  password: {
    type: String, // Corrected "typeof" to "type"
    required: true, // This field is mandatory
  },
  token:{
    type:String,
  }
});

// Create a Mongoose model for the schema
const User = mongoose.model("User", userSchema); // "User" is the name of the collection in the database

// Export the model for use in other parts of the application
export default User;
