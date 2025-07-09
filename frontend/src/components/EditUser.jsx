import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

/* ---------------------------- Component: EditUser --------------------------- */
/* 
   Description: 
   This component allows editing an existing user's data (name, email, password).
   It fetches user data on mount, displays a form with current values, and handles updates.
*/

const EditUser = () => {
  const { id } = useParams(); // Extract user ID from URL parameters
  const navigate = useNavigate(); // Hook for navigation after update or cancel

  // ------------------------- State: Form Input Values ------------------------
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // ------------------------- State: Loading & Submitting ---------------------
  const [isLoading, setIsLoading] = useState(true); // Initial data loading state
  const [isUpdating, setIsUpdating] = useState(false); // Form submission/loading state

  // ------------------------- State: Error Handling ---------------------------
  const [error, setError] = useState(''); // Holds any fetch/update error message

  // ------------------- Fetch User Data from Server by ID ---------------------
  const fetchUserData = async () => {
    try {
      console.log('Fetching user data for ID:', id);
      const response = await axios.get(`http://localhost:5000/getOneUser/${id}`);
      console.log('User data response:', response.data);

      if (response.data.user) {
        setFormData({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          password: response.data.user.password || ''
        });
      } else {
        setError('User not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setIsLoading(false); // Stop showing loading UI
    }
  };

  // ---------------------- Load user data on component mount -------------------
  useEffect(() => {
    fetchUserData();
  }, [id]);

  // ---------------------------- Handle Form Input ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // ----------------------------- Handle Form Submit ---------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError('');

    try {
      console.log('Updating user with ID:', id, 'Data:', formData);
      const response = await axios.put(`http://localhost:5000/updateUser/${id}`, formData);
      console.log('Update response:', response.data);

      alert('User updated successfully!');
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // --------------------------- Handle Cancel Button ---------------------------
  const handleCancel = () => {
    navigate('/'); // Go back to home without saving changes
  };

  // ----------------------------- Render Loading UI ----------------------------
  if (isLoading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading user data...</div>
          <div className="text-gray-600">Please wait while we fetch the user information.</div>
        </div>
      </div>
    );
  }

  // ------------------------------ Render Error UI -----------------------------
  if (error) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2 text-red-600">Error</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button 
            onClick={handleCancel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back to Main Page
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------- Render Form UI --------------------------------
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Edit User
        </h1>

        {/* Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Update User Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Show any form-level error */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Form Buttons */}
            <div className="flex space-x-4">
              <button 
                type="submit" 
                disabled={isUpdating}
                className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update User'}
              </button>
              
              <button 
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Debug Section (for development only)
          <div className="mt-6 p-3 bg-gray-100 rounded text-sm">
            <strong>Current Form Data (for debugging):</strong>
            <pre className="mt-2 text-xs">{JSON.stringify(formData, null, 2)}</pre>
          </div> 
          */}
        </div>
      </div>
    </div>
  );
};

export default EditUser;
