import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    
    if (userData && userToken) {
      setUser(JSON.parse(userData));
      setIsUserAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        setUser(user);
        setIsUserAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsUserAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isUserAuthenticated, 
      loading, 
      loginUser, 
      logoutUser 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
