import React from 'react';
import { FaBook, FaClipboardList, FaPlus, FaFileAlt, FaSignOutAlt, FaTimes, FaComments } from 'react-icons/fa';

const Sidebar = ({ activeView, setActiveView, resetForm, handleLogout, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Overlay for mobile - darkens the background when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      
      {/* Sidebar with responsive behavior */}
      <div 
        className={`w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white fixed z-30 h-screen shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-blue-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <FaBook className="text-blue-800 text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PYQ Admin</h1>
              <p className="text-blue-200 text-xs">Question Paper Manager</p>
            </div>
          </div>
          
          {/* Close button - only visible on mobile */}
          <button 
            className="text-white md:hidden"
            onClick={toggleSidebar}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <button 
            onClick={() => {
              setActiveView('dashboard');
              resetForm();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 mb-3 rounded-lg transition-colors ${
              activeView === 'dashboard' 
                ? 'bg-white text-blue-800 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <FaClipboardList className="mr-3" />
            Dashboard
          </button>
          
          <button 
            onClick={() => {
              setActiveView('addPYQ');
              resetForm();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 mb-3 rounded-lg transition-colors ${
              activeView === 'addPYQ' 
                ? 'bg-white text-blue-800 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <FaPlus className="mr-3" /> 
            Add New PYQ
          </button>
          
          <button 
            onClick={() => {
              setActiveView('viewPYQs');
              resetForm();
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 mb-3 rounded-lg transition-colors ${
              activeView === 'viewPYQs' 
                ? 'bg-white text-blue-800 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <FaFileAlt className="mr-3" />
            View All PYQs
          </button>

          <button 
            onClick={() => {
              setActiveView('feedback');
              if (window.innerWidth < 768) toggleSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 mb-3 rounded-lg transition-colors ${
              activeView === 'feedback' 
                ? 'bg-white text-blue-800 shadow-md' 
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            <FaComments className="mr-3" />
            User Feedback
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 mt-8 text-red-200 hover:bg-red-700 hover:text-white rounded-lg transition-colors"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
