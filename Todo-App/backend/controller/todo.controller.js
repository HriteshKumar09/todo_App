import Todo from "../model/todo.model.js";

// Define a controller function to create a new Todo
export const createTodo = async (req, res) => {
    // Create a new Todo instance with data from the request body
    const todo = new Todo({
      text: req.body.text,        // Text for the Todo item
      completed: req.body.completed  // Status of the Todo item (completed or not)
    });

    try {
        // Wait for the new Todo to be saved in the database
        const newTodo = await todo.save();

        // If the Todo is saved successfully, send a success response with the new Todo
        res.status(201).json({ message: "Todo created successfully", newTodo });
    } catch (error) {
        // If there's an error during save, log it and send an error response
        console.log(error);
        res.status(400).json({ message: "Error occurred in todo creation" });
    }
};


export const getTodos=async(req,res)=>{
    try {
        const todos = await Todo.find()
        res.status(201).json({ message: "Todo Fetched successfully", todos });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Error occurred in todo retrieval" });
            }
};


export const updateTodo=async(req,res)=>{
    try{
        const todo=await Todo.findByIdAndUpdate(req.params.id,req.body,{ 
            new:true,
        })
        res.status(201).json({ message: "Todo updated successfully", todo });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error occurred in todo updating" });
        }
};


export const deleteTodo=async(req,res)=>{
    try{
        const todo=await Todo.findByIdAndDelete(req.params.id)
        if(!todo){
           return res.status(404).json({message:"Todo not found"});  
        }
        res.status(201).json({ message: "Todo deleted successfully", todo });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Error occurred in todo updating" });
        }
};