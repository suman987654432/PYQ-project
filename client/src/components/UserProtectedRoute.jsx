import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useEffect, useState } from 'react';

const UserProtectedRoute = ({ children }) => {
  const { isUserAuthenticated, loading, user } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Additional validation to ensure token exists
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      // If no token or user data, redirect to login
      setIsChecking(false);
      return;
    }
    
    // Once the UserContext has finished loading, update our local state
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  // Show loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg font-medium">Verifying access...</span>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login page and save the location they were trying to access
  if (!isUserAuthenticated) {
    return <Navigate to="/user-login" state={{ from: location }} replace />;
  }

  return children;
};

export default UserProtectedRoute;
