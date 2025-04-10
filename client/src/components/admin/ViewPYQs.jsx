import React, { useState, useEffect } from 'react';
import { FaFilter, FaPlus, FaFileAlt, FaDownload, FaEdit, FaTrash, FaFilePdf, FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaTimes, FaEye } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const ViewPYQs = ({ 
  pyqs, 
  loading, 
  filters, 
  handleFilterChange, 
  handleEdit, 
  handleDelete, 
  setActiveView 
}) => {
  const [selectedPyq, setSelectedPyq] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);

  const pdfThumbnail = "data:image/png;base64,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";

  useEffect(() => {
    if (selectedPyq) {
      const url = selectedPyq.fileURLs && selectedPyq.fileURLs.length > 0 
        ? selectedPyq.fileURLs[activeImageIndex]
        : selectedPyq.fileURL;
      setCurrentFileUrl(url);
      setPdfLoadError(false);
    }
  }, [selectedPyq, activeImageIndex]);

  const openImageModal = (pyq, index = 0, e) => {
    e.preventDefault();
    setSelectedPyq(pyq);
    setActiveImageIndex(index);
    setPdfLoadError(false);
  };

  const closeImageModal = () => {
    setSelectedPyq(null);
    setActiveImageIndex(0);
    setPdfLoadError(false);
    setCurrentFileUrl(null);
  };

  const handlePdfLoadError = () => {
    console.log("PDF failed to load:", currentFileUrl);
    setPdfLoadError(true);
  };

  const isCurrentFilePdf = () => {
    return currentFileUrl && currentFileUrl.toLowerCase().endsWith('.pdf');
  };

  const formatCourseName = (courseName) => {
    if (!courseName) return '';
    return courseName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  };

  const displayCourse = (pyq) => {
    if (!pyq.course) return <div className="text-gray-500">No course</div>;
    return (
      <div>
        <div className="text-gray-700">{pyq.course}</div>
        {pyq.course.toLowerCase() !== formatCourseName(pyq.course) && (
          <div className="text-gray-500 text-xs">{formatCourseName(pyq.course)}</div>
        )}
      </div>
    );
  };

  const handleFilterChangeWrapper = (e) => {
    handleFilterChange(e);
    if (e.target.name === 'course' && e.target.value) {
      console.log(`Searching for all variations of: ${e.target.value} (case-insensitive)`);
    }
  };

  const matchesCurrentFilter = (pyq) => {
    if (!filters.course) return true;
    const normalizedFilter = formatCourseName(filters.course);
    const normalizedCourse = formatCourseName(pyq.course);
    return normalizedCourse.includes(normalizedFilter);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 px-2">All Question Papers</h2>
      
      {/* Responsive Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-8 border">
        <div className="flex items-center mb-4">
          <FaFilter className="text-blue-600 mr-2 text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Question Papers</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Course', name: 'course', options: ['B.Tech', 'M.Tech', 'PhD', 'BBA', 'MBA'] },
            { label: 'Branch', name: 'branch', options: ['CSE', 'ECE', 'Mechanical', 'Civil'] },
            { label: 'Semester', name: 'semester', options: [1,2,3,4,5,6,7,8].map(n => `Semester ${n}`) },
            { label: 'Exam Type', name: 'examType', options: ['MST 1', 'MST 2', 'END SEM'] },
          ].map((field, index) => (
            <div key={index}>
              <label className="block mb-1 text-sm font-medium text-gray-600">{field.label}</label>
              <select
                name={field.name}
                value={filters[field.name]}
                onChange={handleFilterChangeWrapper}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All {field.label}s</option>
                {field.options.map((opt, i) => (
                  <option key={i} value={field.name === 'semester' ? i + 1 : opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="large" />
        </div>
      ) : pyqs.length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-6 md:p-12 text-center border">
          <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 mb-6">No question papers found with the selected filters.</p>
          <button
            onClick={() => setActiveView('addPYQ')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded flex items-center justify-center mx-auto"
          >
            <FaPlus className="mr-2" /> Add New PYQ
          </button>
        </div>
      ) : (
        /* Responsive Table Container */
        <div className="bg-white shadow-md rounded-xl overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-2 py-2 md:px-6 md:py-3 text-left whitespace-nowrap">Preview</th> 
                  <th className="px-2 py-2 md:px-6 md:py-3 text-left whitespace-nowrap">Document Details</th>
                  <th className="px-2 py-2 md:px-6 md:py-3 text-left whitespace-nowrap">Course & Branch</th>
                  <th className="px-2 py-2 md:px-6 md:py-3 text-left whitespace-nowrap">Exam Info</th>
                  <th className="px-2 py-2 md:px-6 md:py-3 text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {pyqs.map(pyq => (
                  <tr 
                    key={pyq._id} 
                    className={`hover:bg-gray-50 ${
                      filters.course && matchesCurrentFilter(pyq) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-2 py-2 md:px-6 md:py-4">
                      <div className="flex flex-col space-y-2">
                        {pyq.fileURLs && pyq.fileURLs.length > 0 ? (
                          <a 
                            href="#"
                            onClick={(e) => openImageModal(pyq, 0, e)}
                            className="block relative"
                            title="Click to view all files"
                          >
                            <div className="w-10 h-10 md:w-[50px] md:h-[50px] border border-gray-300 bg-gray-100 rounded overflow-hidden flex justify-center items-center hover:bg-blue-50 transition-colors">
                              {pyq.fileURLs[0].endsWith('.pdf') ? (
                                <img 
                                  src={pdfThumbnail} 
                                  alt="PDF" 
                                  className="w-8 h-8 md:w-[45px] md:h-[45px] object-contain"
                                />
                              ) : (
                                <img 
                                  src={pyq.fileURLs[0]} 
                                  alt={`Preview 1`} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'%3E%3C/path%3E%3Cpolyline points='13 2 13 9 20 9'%3E%3C/polyline%3E%3C/svg%3E";
                                  }}
                                />
                              )}
                            </div>
                            {pyq.fileURLs.length > 1 && (
                              <span className="text-[10px] md:text-xs text-blue-600 font-medium block mt-1 hover:underline">
                                {pyq.fileURLs.length} files
                              </span>
                            )}
                          </a>
                        ) : (
                          <a 
                            href="#"
                            onClick={(e) => openImageModal(pyq, 0, e)}
                            className="block"
                            title="Click to view file"
                          >
                            <div className="w-10 h-10 md:w-[50px] md:h-[50px] border border-gray-300 bg-gray-100 rounded overflow-hidden flex justify-center items-center hover:bg-blue-50 transition-colors">
                              {pyq.fileURL.endsWith('.pdf') ? (
                                <img 
                                  src={pdfThumbnail} 
                                  alt="PDF" 
                                  className="w-8 h-8 md:w-[45px] md:h-[45px] object-contain"
                                />
                              ) : (
                                <img 
                                  src={pyq.fileURL} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'%3E%3C/path%3E%3Cpolyline points='13 2 13 9 20 9'%3E%3C/polyline%3E%3C/svg%3E";
                                  }}
                                />
                              )}
                            </div>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2 md:px-6 md:py-4">
                      <div className="font-medium text-gray-800 text-xs md:text-sm truncate max-w-[100px] md:max-w-none">{pyq.subject}</div>
                      <div className="text-gray-500 text-[10px] md:text-sm">Added: {new Date(pyq.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-2 py-2 md:px-6 md:py-4">
                      <div className="text-gray-700 text-xs md:text-sm truncate max-w-[70px] md:max-w-none">{pyq.course}</div>
                      <div className="text-gray-500 text-[10px] md:text-sm">{pyq.branch}, Sem {pyq.semester}</div>
                    </td>
                    <td className="px-2 py-2 md:px-6 md:py-4">
                      <span className="bg-blue-100 text-blue-800 px-1 py-0.5 md:px-2 rounded-full text-[10px] md:text-xs font-medium">
                        {pyq.examType}
                      </span>
                      <div className="text-gray-500 text-[10px] md:text-sm mt-1">Year: {pyq.year}</div>
                    </td>
                    <td className="px-2 py-2 md:px-6 md:py-4">
                      <div className="flex flex-col md:flex-row md:space-x-2 space-y-1 md:space-y-0">
                        <button 
                          onClick={() => handleEdit(pyq._id)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded flex items-center text-[10px] md:text-xs justify-center"
                        >
                          <FaEdit className="mr-1" /> <span className="whitespace-nowrap">Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(pyq._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center text-[10px] md:text-xs justify-center"
                        >
                          <FaTrash className="mr-1" /> <span className="whitespace-nowrap">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Responsive Document Viewer Modal */}
      {selectedPyq && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-3 md:p-4 border-b">
              <h3 className="text-base md:text-xl font-semibold text-gray-800 truncate">
                {selectedPyq.subject} - {selectedPyq.examType} ({selectedPyq.year})
              </h3>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto p-3 md:p-4">
              <div className="flex flex-col items-center">
                {/* Main document display */}
                <div className="mb-4 md:mb-6 w-full flex justify-center">
                  {isCurrentFilePdf() ? (
                    <div className="w-full">
                      {!pdfLoadError ? (
                        <div className="w-full h-[50vh] md:h-[60vh] border relative">
                          <iframe
                            src={currentFileUrl}
                            className="w-full h-full"
                            title="PDF Viewer"
                            onError={handlePdfLoadError}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center border rounded-lg p-4 h-[50vh] md:h-[60vh] bg-gray-100">
                          <FaFilePdf className="text-red-500 text-4xl mb-4" />
                          <p className="text-red-600 font-medium text-center">
                            PDF viewer not available in the browser
                          </p>
                        </div>
                      )}
                      
                      {/* Always show these buttons for PDFs */}
                      <div className={`mt-4 flex justify-center ${pdfLoadError ? 'animate-pulse' : ''}`}>
                        <a
                          href={currentFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center shadow-md text-sm"
                        >
                          <FaEye className="mr-2" /> {pdfLoadError ? 'Open in New Tab' : 'Open PDF in New Tab'}
                        </a>
                        <a
                          href={currentFileUrl}
                          download
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg flex items-center ml-3 shadow-md text-sm"
                        >
                          <FaDownload className="mr-2" /> Download PDF
                        </a>
                      </div>
                      
                      {pdfLoadError && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-sm">
                          <p className="text-yellow-800">
                            We couldn't display this PDF in the browser.
                          </p>
                          <p className="text-yellow-700 mt-2">
                            Please use the "Open in New Tab" button above to view this document.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={currentFileUrl}
                      alt={`Document ${activeImageIndex + 1}`}
                      className="max-h-[50vh] md:max-h-[60vh] max-w-full object-contain"
                    />
                  )}
                </div>
                
                {/* Navigation counter */}
                {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 1 && (
                  <div className="text-center mb-3 md:mb-4">
                    <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      File {activeImageIndex + 1} of {selectedPyq.fileURLs.length}
                    </span>
                  </div>
                )}
                
                {/* Thumbnails - Horizontally scrollable on mobile */}
                <div className="flex overflow-x-auto pb-2 gap-2 md:gap-3 justify-start md:justify-center mt-2 md:mt-4 w-full md:flex-wrap">
                  {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 0 ? (
                    selectedPyq.fileURLs.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`cursor-pointer border-2 rounded overflow-hidden flex-shrink-0 ${
                          activeImageIndex === idx ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                        }`}
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gray-50 relative">
                          {url.endsWith('.pdf') ? (
                            <>
                              <img src={pdfThumbnail} alt="PDF" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                              <span className="absolute bottom-0 right-0 bg-red-500 text-white text-[8px] md:text-xs px-1 rounded-sm">PDF</span>
                            </>
                          ) : (
                            <img
                              src={url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-12 h-12 md:w-16 md:h-16 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'%3E%3C/path%3E%3Cpolyline points='13 2 13 9 20 9'%3E%3C/polyline%3E%3C/svg%3E";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
            
            {/* Footer with actions */}
            <div className="p-3 md:p-4 border-t flex flex-col md:flex-row justify-between items-center">
              <a
                href={currentFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center mb-3 md:mb-0"
              >
                <FaExternalLinkAlt className="mr-2" /> Open in new tab
              </a>
              
              {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 1 && (
                <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-center">
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? selectedPyq.fileURLs.length - 1 : prev - 1))}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center text-sm flex-1 md:flex-auto justify-center md:justify-start"
                  >
                    <FaArrowLeft className="mr-2" /> Previous
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev === selectedPyq.fileURLs.length - 1 ? 0 : prev + 1))}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center text-sm flex-1 md:flex-auto justify-center md:justify-start"
                  >
                    Next <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPYQs;