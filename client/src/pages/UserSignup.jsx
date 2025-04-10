import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaIdCard, FaGraduationCap, FaBook, FaLock } from 'react-icons/fa';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    email: '',
    course: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
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
      if (!formData.name || !formData.roll || !formData.email || !formData.course || !formData.password) {
        toast.error('Please fill all the fields');
        setIsLoading(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Password validation
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        setIsLoading(false);
        return;
      }

      // Password confirmation
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }

      // Register the user
      const response = await axios.post('http://localhost:5000/api/user/register', {
        name: formData.name,
        roll: formData.roll,
        email: formData.email,
        course: formData.course,
        password: formData.password
      });
      
      if (response.data.success) {
        toast.success('Registration successful! Please log in');
        navigate('/user-login');
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-gray-500 mt-1">Sign up to access question papers</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
              <FaUser />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Full Name"
              required
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
              <FaIdCard />
            </div>
            <input
              type="text"
              name="roll"
              value={formData.roll}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Roll Number"
              required
            />
          </div>
          
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
              <FaGraduationCap />
            </div>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              required
            >
              <option value="">Select Your Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="PhD">PhD</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
            </select>
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
              minLength="6"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
              <FaLock />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Confirm Password"
              required
              minLength="6"
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
                Registering...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/user-login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
