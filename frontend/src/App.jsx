import React , {useState} from "react";

const App = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen ">
      <h1 className="text-3xl font-bold text-center mb-8">
        User Management System
      </h1>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter name"
            className="w-full p-2 border border-gray-300 rounded "
          />
          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input 
          type="password" 
          placeholder="Enter password" 
          className="w-full p-2 border border-gray-300 rounded"/>
          <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer">Add User</button>
        </div>
      </div>

      {/* Table Section  */}
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-4xl mx-auto">
       <div className="p-4 border-b">
         <h2 className="text-xl font-semibold">All User</h2>
       </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Password</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">1</td>
              <td className="p-3">John Doe</td>
              <td className="p-3">john@example.com</td>
              <td className="p-3">*****</td>
              <td className="p-3">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
