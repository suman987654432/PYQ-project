import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const formatCourseName = (courseName) => {
  if (!courseName) return '';
  return courseName.replace(/[^a-zA-Z]/g, '').toLowerCase();
};

const Dashboard = ({ stats, pyqs, loading, setActiveView }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
      
      {/* Recent uploads */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Uploads</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="large" />
          </div>
        ) : pyqs.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No question papers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-xs md:text-sm">
                  <th className="px-2 py-2 md:px-4 md:py-3 rounded-l-lg whitespace-nowrap">Subject</th>
                  <th className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">Course & Branch</th>
                  <th className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap">Exam Type</th>
                  <th className="px-2 py-2 md:px-4 md:py-3 rounded-r-lg whitespace-nowrap">Year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pyqs.slice(0, 5).map(pyq => (
                  <tr key={pyq._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-2 py-2 md:px-4 md:py-3 font-medium text-gray-800 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{pyq.subject}</td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-gray-600 text-xs md:text-sm truncate max-w-[70px] md:max-w-none">
                      {pyq.course} {' '}{pyq.branch}, Sem {pyq.semester}
                    </td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-gray-600 text-xs md:text-sm whitespace-nowrap">{pyq.examType}</td>
                    <td className="px-2 py-2 md:px-4 md:py-3 text-gray-600 text-xs md:text-sm whitespace-nowrap">{pyq.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Stats section could be added here if needed */}
    </div>
  );
};

export default Dashboard;
