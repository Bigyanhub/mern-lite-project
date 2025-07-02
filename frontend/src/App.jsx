// App.jsx
import { useState, useEffect } from 'react'
import './App.css'

const App = () => {
  return (
    <div className='form-container max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md'>
      <h1 className='form-title text-3xl font-bold mb-6'>User Registration Form</h1>
      
      <div>
        <div className='form-group'>
          <label className='form-label'>Name:</label>
          <input type="text" className='form-input' />
        </div>

        <div className='form-group'>
          <label className='form-label'>Email:</label>
          <input type="email" className='form-input' />
        </div>

        <div className='form-group'>
          <label className='form-label'>Password:</label>
          <input type="password" className='form-input' />
        </div>

        <div className='form-action mt-6'>
          <button className='form-button'>Add User</button>
        </div>
      </div>
    </div>
  )
}

export default App
