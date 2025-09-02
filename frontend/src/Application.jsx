import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * User Management Application Component
 * Provides CRUD operations for user data with a clean UI
 * Features: Add, Edit, Delete, and View users
 */
const App = () => {
  // State for storing the list of users fetched from the backend
  const [data, setData] = useState([]);

  // Loading state to show spinner/disable buttons during API calls
  const [isLoading, setIsLoading] = useState(false);

  // Stores the user object currently being edited (null when adding new user)
  const [editingUser, setEditingUser] = useState(null);

  // Form data state for controlled input components
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /**
   * Handles input changes for all form fields
   * Updates the formData state with the new value
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles form submission for both creating new users and updating existing ones
   * Sets loading state, makes API call, resets form, and refreshes user list
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      let result;
      // Check if we're editing an existing user or creating a new one
      if (editingUser) {
        // Update existing user via PUT request
        result = await axios.put(
          `http://localhost:5000/updateUser/${editingUser.Id}`,
          formData
        );
        console.log("Update response:", result.data);
        setEditingUser(null);
      } else {
        // Create new user via POST request
        result = await axios.post("http://localhost:5000/addUser", formData);
        console.log("Add response:", result.data);
      }

      // Reset form fields after successful operation
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Refresh the user list to show updated data
      await fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("Network error:", error);
      console.error("Error details:", error.response?.data);
      setIsLoading(false);
    }
  };

  /**
   * Fetches all users from the backend API
   * Updates the data state with the retrieved user list
   */
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/showAllUser");
      console.log("Fetch response:", response.data);
      console.log("First user object:", response.data.result[0]); // Debug: check structure
      setData(response.data.result || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  // Load all users when the component first mounts
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Deletes a user by their ID
   * Shows confirmation and refreshes the user list after successful deletion
   * @param {string|number} Id - The unique identifier of the user to delete
   */
  const handleDelete = async (Id) => {
    try {
      console.log("Deleting user with Id:", Id);
      console.log("Id type:", typeof Id);

      if (!Id) {
        console.error("No Id provIded for deletion");
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/deleteUser/${Id}`
      );
      console.log("Delete response:", response.data);
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  /**
   * Prepares user data for editing by populating the form
   * @param {Object} user - The user object to edit
   */
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  };

  /**
   * Cancels the edit operation and resets the form to add mode
   */
  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          User Management System
        </h1>

        {/* User Form Section - Add/Edit Users */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingUser ? "Edit User" : "Add New User"}
          </h2>

          <div className="space-y-4">
            {/* Name Input Field */}
            <div>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email Input Field */}
            <div>
              <input
                onChange={handleChange}
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input Field */}
            <div>
              <input
                onChange={handleChange}
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Form Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Loading..."
                  : editingUser
                  ? "Update User"
                  : "Add User"}
              </button>

              {/* Cancel button - only shown when editing a user */}
              {editingUser && (
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Data Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hIdden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wIder">
                    Id
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wIder">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wIder">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wIder">
                    Password
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wIder">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table Body with User Data */}
              <tbody className="bg-white divIde-y divIde-gray-200">
                {data.length > 0 ? (
                  // Map through users and display each one as a table row
                  data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.Id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* Display password as asterisks for security */}
                        {"*".repeat(item.password?.length || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {/* Edit Action Button */}
                        <button
                          onClick={() => {
                            console.log("Edit clicked for user:", item);
                            handleEdit(item);
                          }}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        {/* Delete Action Button */}
                        <button
                          onClick={() => {
                            console.log("Delete clicked for user:", item);
                            console.log("User Id:", item.Id);
                            handleDelete(item.Id);
                          }}
                          className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Show empty state message when no users exist
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
