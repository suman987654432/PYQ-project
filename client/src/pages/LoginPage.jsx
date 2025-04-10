import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaBook } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('sumanqaj9876@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/admin');
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
          <h2 className="text-3xl font-bold text-gray-800">PYQ Admin Portal</h2>
          <p className="text-gray-500 mt-1">Sign in to manage question papers</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
              <FaUser />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Password"
              required
            />
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">Admin credentials:</p>
            <p className="text-sm text-blue-700">Email: sumanqaj9876@gmail.com</p>
            <p className="text-sm text-blue-700">Password: suman</p>
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
                Logging in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
