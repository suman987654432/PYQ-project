import React from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';

const FilterSection = ({ filters, handleFilterChange, handleApplyFilters, handleClearFilters }) => {
  const { user } = useUser();

  const handleFilterChangeInternal = (e) => {
    // Don't allow changing the course if user is logged in
    if (user && e.target.name === 'course') {
      return;
    }
    handleFilterChange(e);
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-8 p-6">
      <div className="flex items-center mb-4">
        <FaFilter className="text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Find Question Papers</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Course</label>
          <select
            name="course"
            value={filters.course}
            onChange={handleFilterChangeInternal}
            disabled={!!user}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${user ? 'bg-gray-100' : ''}`}
          >
            <option value="">All Courses</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="PhD">PhD</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
          </select>
          {user && (
            <p className="text-xs text-blue-600 mt-1">You can only view papers from your course: {user.course}</p>
          )}
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Branch</label>
          <select
            name="branch"
            value={filters.branch}
            onChange={handleFilterChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Semester</label>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleFilterChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Exam Type</label>
          <select
            name="examType"
            value={filters.examType}
            onChange={handleFilterChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Exam Types</option>
            <option value="MST 1">MST 1</option>
            <option value="MST 2">MST 2</option>
            <option value="END SEM">END SEM</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Subject</label>
          <input
            type="text"
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            placeholder="Search by subject..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">Year</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaSearch className="mr-2" /> Search
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
