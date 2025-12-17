// src/components/Register.jsx
import { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users', {
        username: formData.fullName, // Use fullName as username (adjust if needed)
        password: formData.password,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Side with Image and Tint */}
        <div className="relative w-1/2 hidden md:block">
          <img
            src="/src/assets/pharma3.jpg"
            alt="Pharmacy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-600 opacity-30"></div>
          <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 rounded font-normal">
            MEDIX PHARMA
          </div>
          <div className="absolute bottom-20 left-8 text-white text-4xl font-bold text-left opacity-90">
            Everything You Need, <br /> In One Place.
          </div>
        </div>
        {/* Right Side with Form */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-left">REGISTER</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 focus:ring-blue-600"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 focus:ring-blue-600"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 focus:ring-blue-600"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 focus:ring-blue-600"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 bg-gray-100 focus:ring-blue-600"
            >
              <option value="" disabled>Select Role</option>
              <option value="ROLE_PHARMACIST">Pharmacist</option>
              <option value="ROLE_STAFF">Staff</option>
            </select>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-400 transition"
            >
              Register
            </button>
            <p className="text-center text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-blue-700 hover:underline">
                Login here.
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;