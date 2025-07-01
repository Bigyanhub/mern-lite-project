// Importing necessary React hooks (though unused in this component)
import { useState, useEffect } from 'react'

// Defining a functional React component named useForm
// Note: In React, component names should start with an uppercase letter (e.g., "UseForm")
const useForm = () => {
  return (
    // Wrapper div that centers the content and applies styling using Tailwind CSS
    <div className='max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      
      {/* Page title */}
      <h1 className='text-2xl font-bold'>User registration form</h1>
      
      {/* Form fields container */}
      <div>
        {/* Name field: label and text input */}
        <div className='mt-4'>
          <label htmlFor="" className='block font-medium'>Name:</label>
          <input type="text" className='border border-gray-300 p-2 rounded w-full' />
        </div>

        {/* Email field: label and email input */}
        <div className='mt-4'>
          <label htmlFor="" className='block font-medium'>Email:</label>
          <input type="email" className='border border-gray-300 p-2 rounded w-full' />
        </div>

        {/* Password field: label and password input */}
        <div className='mt-4'>
          <label htmlFor="" className='block font-medium'>Password:</label>
          <input type="password" className='border border-gray-300 p-2 rounded w-full' />
        </div>

        {/* Button to submit the form */}
        <div className='mt-6'>
          <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'>Add User</button>
        </div>
      </div>
    </div>
  )
}

// Exporting the component to allow its use in other parts of the app
export default useForm
