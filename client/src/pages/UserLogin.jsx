import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaBook } from 'react-icons/fa';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form data
      if (!formData.email || !formData.password) {
        toast.error('Please fill all the fields');
        setIsLoading(false);
        return;
      }

      // Call the loginUser function from UserContext
      const result = await loginUser(
        formData.email,
        formData.password
      );
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/user'); // Navigate to user dashboard
      } else {
        toast.error(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <FaBook className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">PYQ Student Portal</h2>
          <p className="text-gray-500 mt-1">Sign in to access question papers</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Email Address"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-300 font-medium text-lg disabled:opacity-70 shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/user-signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;