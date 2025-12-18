import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import api from '../utils/axiosConfig';
import { UserContext } from '../../context/UserContext.jsx';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/initiate-login', {
        email: formData.email,
        password: formData.password,
      }, {
        headers: { 'Authorization': undefined }
      });
      console.log('Email/Password submit response:', response);
      setError('');
      setStep(2);
    } catch (err) {
      console.error('Email/Password submit error:', err);
      console.error('Email/Password submit response:', err.response);
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting OTP for email:', formData.email, 'OTP:', otp);
      const response = await api.post('/api/users/verify-otp', { email: formData.email, otp }, {
        headers: { 'Authorization': undefined }
      });
      console.log('Full OTP response:', response);
      const { token, roles, user } = response.data;
      const role = roles?.[0]?.authority === 'ROLE_PHARMACIST' ? 'pharmacist' : 'staff';
      console.log('Computed role:', role);
      if (!token) {
        throw new Error('No token received from server');
      }
      localStorage.setItem('token', token);
      setUser({ role, name: user.fullName, token });
      navigate(role === 'pharmacist' ? '/' : '/staff', { replace: true });
    } catch (err) {
      console.error('OTP error:', err);
      console.error('OTP response:', err.response);
      setError(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 box-border m-0 p-0">
      <div className="flex rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left Side with Image and Tint */}
        <div className="relative w-1/2 hidden md:block">
          <img
            src="/pharma2.jpg"
            alt="Pharmacy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-500 opacity-30"></div>
          <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 rounded font-normal">
            MEDIX PHARMA
          </div>
          <div className="absolute bottom-20 left-8 text-white text-4xl font-bold text-left opacity-90">
            Everyday Pharmacy <br /> Operations, <br /> Simplified.
          </div>
        </div>
        {/* Right Side with Form */}
        <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-left">LOGIN</h2>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {step === 1 && (
            <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-gray-200 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-400 transition"
              >
                Next
              </button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className="w-full p-3 border-2 border-gray-200 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-400 transition"
              >
                Verify OTP & Login
              </button>
            </form>
          )}
          <p className="text-center text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
          <p className="mt-2 text-center">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 