import React from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { Routes, Route } from 'react-router-dom';  // Import 'Route' along with 'Routes'
import PageNotFound from './components/PageNotFound';
import { Toaster } from 'react-hot-toast';

function App() {
  const token = localStorage.getItem("jwt");
  return (
    <div>
      {/* The Routes component is responsible for rendering the correct component based on the URL */}
      <Routes>
        {/* This Route will render the Home component when the URL path is '/' */}
        <Route path="/" element={<Home />} />
        
        {/* This Route will render the Login component when the URL path is '/login' */}
        <Route path="/login" element={<Login />} />
        
        {/* This Route will render the Signup component when the URL path is '/signup' */}
        <Route path="/signup" element={<Signup />} />

        {/* This Route will render the Signup component when the URL path is '/signup' */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
      <Toaster/>
    </div>
  );
}

export default App;
