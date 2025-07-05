import { useState } from 'react'
import './App.css'

const App = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = () => {
    const { name, email, password } = formData
    if (!name || !email || !password) {
      setError('All fields are required.')
    } else {
      setError('')
      console.log('Form submitted:', formData)
      // Simulate form submission
    }
  }

  return (
    <div className='form-container max-w-4xl mx-auto mt-10 p-10 bg-white rounded-lg shadow-md'>
      <h1 className='form-title text-3xl font-bold mb-6'>Register New User</h1>
      <div>
        <div className='form-group'>
          <label className='form-label' htmlFor='name'>Name:</label>
          <input
            type="text"
            id='name'
            name="name"
            className='form-input'
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            data-testid="name-input" // Added for testing
          />
        </div>

        <div className='form-group'>
          <label className='form-label' htmlFor='email'>Email:</label>
          <input
            type="email"
            id='email'
            name="email"
            className='form-input'
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            data-testid="email-input" // Added for testing
          />
        </div>

        <div className='form-group'>
          <label className='form-label' htmlFor='password'>Password:</label>
          <input
            type="password"
            id='password'
            name="password"
            className='form-input'
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            data-testid="password-input" // Added for testing
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className='mt-6 text-right'>
          <button className='form-button' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  )
}

export default App