import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserProtectedRoute from './components/UserProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import UserPage from './pages/UserPage';

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/user-login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/user-signup" element={<UserSignup />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/user" 
              element={
                <UserProtectedRoute>
                  <UserPage />
                </UserProtectedRoute>
              } 
            />
          </Routes>
        </Router>
        <ToastContainer 
          position="top-right" 
          autoClose={2000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="font-sans"
        />
      </UserProvider>
    </AuthProvider>
  );
};

export default App;