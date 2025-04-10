import React from 'react';
import { FaUser, FaIdCard, FaGraduationCap } from 'react-icons/fa';

const UserInfoCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md mb-8 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaUser className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaIdCard className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Roll Number</p>
            <p className="font-medium">{user?.roll}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaGraduationCap className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Course</p>
            <p className="font-medium">{user?.course}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
