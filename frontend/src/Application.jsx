import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    
    try {
      let result;
      if (editingUser) {
        result = await axios.put(`http://localhost:5000/updateUser/${editingUser.Id}`, formData);
        console.log("Update response:", result.data);
        setEditingUser(null);
      } else {
        result = await axios.post("http://localhost:5000/addUser", formData);
        console.log("Add response:", result.data);
      }
      
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      
      await fetchData();
      setIsLoading(false);
    } catch (error) {
      console.error("Network error:", error);
      console.error("Error details:", error.response?.data);
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (Id) => {
    try {
      console.log("Deleting user with Id:", Id);
      console.log("Id type:", typeof Id);
      
      if (!Id) {
        console.error("No Id provIded for deletion");
        return;
      }
      
      const response = await axios.delete(`http://localhost:5000/deleteUser/${Id}`);
      console.log("Delete response:", response.data);
      await fetchData();
    } catch (err) {
      console.error("Delete error:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          User Management System
        </h1>
        
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          
          <div className="space-y-4">
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
            
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : editingUser ? "Update User" : "Add User"}
              </button>
              
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

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hIdden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
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
              <tbody className="bg-white divIde-y divIde-gray-200">
                {data.length > 0 ? (
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
                        {"*".repeat(item.password?.length || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            console.log("Edit clicked for user:", item);
                            handleEdit(item);
                          }}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                        >
                          Edit
                        </button>
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
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
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