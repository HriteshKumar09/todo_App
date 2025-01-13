import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Home() {

    const [todos, setTodos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newTodo, setNewTodo] = useState("");

      // Fetch todos when the component mounts
useEffect(() => {

    const fetchtodos = async () => {
      try {
        setLoading(true); // Start loading
        // Send GET request to fetch todos
        const response = await axios.get("http://localhost:4006/todo/fetch", {
          withCredentials: true, // Ensure cookies are included in requests
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response.data.todos); // Log fetched todos
        setTodos(response.data.todos); // Update state with fetched todos
        setError(null); // Clear any previous errors
      } catch (error) {
        setError("Failed to fetch todos"); // Set error if request fails
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchtodos(); // Call the function to fetch todos
  }, []); // Empty dependency array to run only once on mount


 const todoCreate = async () => {
  // If the input field is empty, exit the function
  if (!newTodo) return;

  try {
    // Send a POST request to the server to create a new todo item
    const response = await axios.post(
      "http://localhost:4006/todo/create", // API endpoint for creating todos
      {
        text: newTodo, // The text content of the new todo
        completed: false, // New todos are marked as incomplete by default
      },
      {
        withCredentials: true, // Include credentials (cookies, etc.) with the request
      }
    );

    // Log the newly created todo for debugging purposes
    console.log(response.data.newTodo);

    // Add the new todo to the existing list of todos
    setTodos([...todos, response.data.newTodo]);

    // Clear the input field after successfully creating a todo
    setNewTodo("");
  } catch (error) {
    // Set an error message if the request fails
    setError("Failed to create todo");
  }
};


 // Function to toggle the completion status of a todo
const todoStatus = async (id) => {
    // Find the todo item by its ID
    const todo = todos.find((t) => t._id === id);
  
    try {
      // Send a PUT request to update the completion status of the todo
      const response = await axios.put(
        `http://localhost:4006/todo/update/${id}`, // API endpoint to update the todo
        {
          ...todo, // Include all existing properties of the todo
          completed: !todo.completed, // Toggle the completion status
        },
        {
          withCredentials: true, // Include credentials like cookies
        }
      );
  
      console.log(response.data.todo); // Log the updated todo item in the console
  
      // Update the state to reflect the changed todo in the list
      setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
    } catch (error) {
      // Set an error message if the request fails
      setError("Failed to update todo status"); // Updated error message
    }
  };
  

  // Function to delete a todo by its ID
const todoDelete = async (id) => {
    try {
      // Send a DELETE request to remove the todo
      await axios.delete(`http://localhost:4006/todo/delete/${id}`, {
        withCredentials: true, // Include credentials like cookies
      });
  
      // Remove the deleted todo from the state
      setTodos(todos.filter((t) => t._id !== id));
    } catch (error) {
      // Set an error message if the request fails
      setError("Failed to Delete Todo");
    }
  };

  const navigateTo = useNavigate();

//function to logout
  const logout = async () => {
    try {
      await axios.get("http://localhost:4006/user/logout", {
        withCredentials: true,
      });
      toast.success("User logged out successfully");
      navigateTo("/login");
      localStorage.removeItem("jwt");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className=" my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
        <h1 className="text-2xl font-semibold text-center">Todo App</h1>
        <div className="flex mb-4">
            <input 
            type="text" 
            placeholder='Add a new todo'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && todoCreate()}
            className="flex-grow p-2 border rounded-l-md focus:outline-none"
            />
            <button
            onClick={todoCreate}
            className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300">
                Add
            </button>
        </div>


        {loading ? (
  // Display loading spinner or message while data is loading
  <div className="text-center justify-center">
    <span className="text-gray-500">Loading...</span> {/* Fixed typo: text-gray-500 */}
  </div>
) : error ? (
  // Display error message if there's an error
  <div className="text-center text-red-600 font-semibold">{error}</div>
) : (
  // Main content when data is loaded and no errors
       <ul className="space-y-2">
            {todos.map((todo,index)=>(
                <li key={todo.id || index} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                
                <div className="flex items-center">
                <input 
                type='checkbox' 
                checked={todo.completed} 
                onChange={()=>todoStatus(todo._id)} 
                className='mr-2'/>

                <               span
                  className={`${
                    todo.completed ?
                     "line-through text-gray-800 font-semibold"
                     : ""
                  } `}
                >
                  {todo.text}
                </span>
                </div>
                <button onClick={() => todoDelete(todo._id)}
                className='text-red-500 hover:text-red-800 duration-300'>Delete</button>
            </li>
            ))}
        </ul>
)}
<p className="mt-4 text-center text-sm text-gray-700">
        {remainingTodos} remaining todos
      </p>
      <button
        onClick={() => logout()}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;