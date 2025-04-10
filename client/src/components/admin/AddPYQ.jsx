import React from 'react';
import { FaUniversity, FaGraduationCap, FaCalendarAlt, FaBook, FaClipboardList, FaFileAlt, FaEdit, FaPlus, FaEye, FaTimesCircle } from 'react-icons/fa';

const AddPYQ = ({ formData, handleInputChange, handleFileChange, handleSubmit, resetForm, loading, editMode, successMessage, uploadedFileUrls }) => {
  // PDF thumbnail image
  const pdfThumbnail = "data:image/png;base64,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";
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        {editMode ? 'Edit Question Paper' : 'Add New Question Paper'}
      </h2>
      
      {/* Success Message and PDF Preview */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="bg-green-100 p-2 rounded-full">
              <FaFileAlt className="text-green-600 text-2xl" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-green-800 font-medium text-lg">{successMessage}</h3>
            {uploadedFileUrls && uploadedFileUrls.length > 0 && (
              <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-medium mb-2 text-gray-700">Uploaded Files:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {uploadedFileUrls.map((url, index) => (
                    <a 
                      key={index}
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center border rounded-lg p-2 hover:bg-blue-50"
                    >
                      {url.endsWith('.pdf') ? (
                        <img src={pdfThumbnail} alt="PDF" className="w-8 h-8 mr-2 object-contain" />
                      ) : (
                        <img src={url} alt="Preview" className="w-8 h-8 mr-2 object-cover border rounded" />
                      )}
                      File {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="course">
                <FaUniversity className="inline-block mr-2 text-blue-600" /> Course
              </label>
              <input
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
                placeholder="e.g., B.Tech, M.Tech"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="branch">
                <FaGraduationCap className="inline-block mr-2 text-blue-600" /> Branch
              </label>
              <input
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
                placeholder="e.g., CSE, ECE, Mechanical"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="semester">
                <FaCalendarAlt className="inline-block mr-2 text-blue-600" /> Semester
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white"
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            {/* Exam Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="examType">
                <FaClipboardList className="inline-block mr-2 text-blue-600" /> Exam Type
              </label>
              <select
                id="examType"
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white"
                required
              >
                <option value="">Select Exam Type</option>
                <option value="MST 1">MST 1</option>
                <option value="MST 2">MST 2</option>
                <option value="END SEM">END SEM</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="subject">
                <FaBook className="inline-block mr-2 text-blue-600" /> Subject
              </label>
              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
                placeholder="e.g., Data Structures, Computer Networks"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="year">
                <FaCalendarAlt className="inline-block mr-2 text-blue-600" /> Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                min="2000"
                max="2099"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="files">
              <FaFileAlt className="inline-block mr-2 text-blue-600" />
              Upload Images/PDF {editMode && '(Leave empty to keep current files)'}
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition-colors cursor-pointer">
              <input
                id="files"
                name="files"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                multiple // Allow multiple file selection
                className="hidden"
                required={!editMode}
              />
              <label htmlFor="files" className="flex flex-col items-center justify-center cursor-pointer">
                <FaFileAlt className="text-blue-500 text-3xl mb-3" />
                <span className="font-medium text-blue-600">Click to browse files</span>
                <span className="text-sm text-gray-500 mt-1">or drag and drop files here</span>
                <span className="text-sm font-medium text-blue-700 mt-2">You can select up to 10 files</span>
              </label>
              {formData.files && formData.files.length > 0 && (
                <div className="mt-4 bg-blue-50 text-blue-700 rounded-lg p-3">
                  <h4 className="font-medium mb-2">Selected Files ({formData.files.length}/10):</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Array.from(formData.files).map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div className="flex items-center">
                          {file.type.includes('pdf') ? (
                            <img src={pdfThumbnail} alt="PDF" className="w-8 h-8 mr-2 object-contain" />
                          ) : (
                            <FaFileAlt className="text-blue-500 mr-2" />
                          )}
                          <span className="text-sm truncate" title={file.name}>
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove file"
                        >
                          <FaTimesCircle />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Maximum file size: 15MB per file. Supported formats: PDF, JPG, PNG. Upload up to 10 files.
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium text-lg disabled:opacity-70 shadow-md flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {editMode ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
                  {editMode ? 'Update PYQ' : 'Add PYQ'}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-8 rounded-lg hover:bg-gray-200 transition duration-300 font-medium text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPYQ;
