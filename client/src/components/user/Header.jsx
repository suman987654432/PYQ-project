import React from 'react';
import { FaBook, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ user, handleLogout }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaBook className="text-2xl" />
          <h1 className="text-2xl font-bold">PYQ Portal</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center bg-blue-700 px-4 py-2 rounded-lg">
            <FaUser className="mr-2" />
            <span className="font-medium">{user?.name}</span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
