// Import mongoose to interact with the MongoDB database
import mongoose from "mongoose";

// Define the schema for the 'Todo' collection
const todoSchema = new mongoose.Schema({
    // Define a 'text' field of type String that is required
    text: {
        type: String,
        required: true
    },
    // Define a 'completed' field of type Boolean that is required
    completed: {
        type: Boolean,
        required: true
    }
});

// Create a 'Todo' model using the schema, which represents the 'Todo' collection in MongoDB
const Todo = mongoose.model("Todo", todoSchema);

// Export the Todo model to be used in other parts of the application
export default Todo;
