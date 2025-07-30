import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  // STATE: This is like memory for our component
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // STATE: Store all users from database
  const [users, setUsers] = useState([]);

  // STATE: Loading state
  const [isLoading, setIsLoading] = useState(false);

  // FUNCTION: Get all users from database
  const fetchUsers = async () => {
    try {
      console.log("Fetching users from database...");
      const response = await axios.get("http://localhost:5000/showAllUser");
      console.log("Response from database:", response.data);
      setUsers(response.data.result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // EFFECT: Run when component first loads
  
  useEffect(() => {
    fetchUsers(); // Get users when page loads
  }, []);

  // FUNCTION: Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`); // Debug log
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // FUNCTION: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setIsLoading(true);
    
    try {
      console.log("Adding user to database:", formData);
      const response = await axios.post("http://localhost:5000/addUser", formData);
      console.log("User added successfully:", response.data);
      
      // Clear the form after submission
      setFormData({
        name: "",
        email: "",
        password: ""
      });
      
      // Refresh the users list
      await fetchUsers();
      
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNCTION: Delete a user from database
  const handleDelete = async (userId) => {
    // Ask user for confirmation
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    
    if (!confirmed) {
      return; // Exit if user cancels
    }
    
    try {
      console.log("Deleting user with Id:", userId);
      const response = await axios.delete(`http://localhost:5000/deleteUser/${userId}`);
      console.log("Delete response:", response.data);
      
      // Refresh the users list after deletion
      await fetchUsers();
      
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        User Management System
      </h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}d
            placeholder="Enter password"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Adding User..." : "Add User"}
          </button>
        </form>
        
        {/* DEBUG: Show current form data */}
         <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
          <strong>Current Form Data (for learning):</strong>
          <pre className="mt-2 text-xs">{JSON.stringify(formData, null, 2)}</pre>
        </div>
        
        {/* DEBUG: Show users array */}
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <strong>Users from Database ({users.length} users):</strong>
          <pre className="mt-2 text-xs">{JSON.stringify(users, null, 2)}</pre>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hIdden max-w-4xl mx-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Users ({users.length} total)</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Id</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Password</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
          {/* Render users dynamically */}
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.Id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.password}</td>
                  <td className="p-3">
                    <button 
                      onClick={() => console.log("Edit clicked for user:", user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.Id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No users found in database
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;