import { useState, useEffect } from 'react';

export default function UserForm() {
  // State to store form data - this is like a container holding our form values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // State to track if we're currently submitting (for loading states)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages
  const [users, setUsers] = useState([]); // Store list of users
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Track which user is being edited

  // Function to fetch all users from backend
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:5000/showAllUser');
      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData); // Debug log
        
        // Check if the response has a 'result' property (your backend format)
        if (userData && userData.result && Array.isArray(userData.result)) {
          setUsers(userData.result); // Extract the actual array from the result property
        } else if (Array.isArray(userData)) {
          // Fallback: if it's directly an array
          setUsers(userData);
        } else {
          console.error('Expected array but got:', typeof userData, userData);
          setUsers([]); // Set empty array as fallback
          setMessage('Error: Invalid data format from server');
        }
      } else {
        console.error('Failed to fetch users, status:', response.status);
        setUsers([]); // Set empty array on error
        setMessage('Failed to fetch users from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set empty array on error
      setMessage('Error connecting to server. Make sure your backend is running on http://localhost:5000');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load users when component first renders
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return; // User cancelled
    }

    try {
      const response = await fetch(`http://localhost:5000/deleteUser/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json(); // Parse the response
      console.log('Delete response:', result); // Debug log

      if (response.ok) {
        setMessage('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } else {
        setMessage(`Error deleting user: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Failed to delete user - network error.');
    }
  };

  // Function to start editing a user
  const startEditing = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '' // Don't pre-fill password for security
    });
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
  };

  // Function to update a user
  const updateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/updateUser/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', email: '', password: '' });
        setEditingUser(null);
        setMessage('User updated successfully!');
        fetchUsers();
      } else {
        setMessage('Error updating user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage('Failed to update user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // This function runs every time someone types in an input field
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the input's name and value
    setFormData(prev => ({
      ...prev,        // Keep all existing data
      [name]: value   // Update only the field that changed
    }));
  };

  // This function runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh (default form behavior)
    setIsSubmitting(true); // Show loading state
    setMessage(''); // Clear any previous messages

    try {
      // Make a POST request to your backend
      const response = await fetch('http://localhost:5000/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell server we're sending JSON
        },
        body: JSON.stringify(formData) // Convert our data to JSON string
      });

      if (response.ok) {
        // Success! Clear the form and show success message
        setFormData({ name: '', email: '', password: '' });
        setMessage('User added successfully!');
        fetchUsers(); // Refresh the users list
      } else {
        // Something went wrong
        setMessage('Error adding user. Please try again.');
      }
    } catch (error) {
      // Network error or server is down
      console.error('Error:', error);
      setMessage('Failed to connect to server. Please check if your backend is running.');
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {editingUser ? 'Edit User' : 'User Registration Form'}
      </h1>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={editingUser ? updateUser : handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting 
              ? (editingUser ? 'Updating...' : 'Adding User...') 
              : (editingUser ? 'Update User' : 'Add User')
            }
          </button>

          {editingUser && (
            <button 
              type="button" 
              onClick={cancelEditing}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Display success/error messages */}
        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Users List Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
          <button
            onClick={fetchUsers}
            disabled={loadingUsers}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
          >
            {loadingUsers ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Users List */}
        {loadingUsers ? (
          <div className="text-center py-4">Loading users...</div>
        ) : !Array.isArray(users) ? (
          <div className="text-center py-4 text-red-500">Error: Invalid data format</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Password
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id || user.user_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.password ? '•'.repeat(user.password.length) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(user.id || user.user_id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}