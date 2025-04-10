import React from 'react';
import { FaFileAlt, FaEye, FaDownload, FaChevronDown } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const QuestionPapersTable = ({ 
  pyqs, 
  loading, 
  pdfThumbnail, 
  openImageModal, 
  downloadMenuOpen, 
  toggleDownloadMenu, 
  downloadSingleFile, 
  downloadAllFiles, 
  setDownloadMenuOpen 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Available Question Papers</h2>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="large" />
        </div>
      ) : pyqs.length === 0 ? (
        <div className="text-center py-10">
          <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500">No question papers found with the selected filters.</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-blue-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Preview</th>
                <th className="px-6 py-3 text-left">Document Details</th>
                <th className="px-6 py-3 text-left">Course & Branch</th>
                <th className="px-6 py-3 text-left">Exam Info</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pyqs.map(pyq => (
                <tr key={pyq._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      {pyq.fileURLs && pyq.fileURLs.length > 0 ? (
                        <a 
                          href="#"
                          onClick={(e) => openImageModal(pyq, 0, e)}
                          className="block relative"
                          title="Click to view all files"
                        >
                          <div className="w-[50px] h-[50px] border border-gray-300 bg-gray-100 rounded overflow-hidden flex justify-center items-center hover:bg-blue-50 transition-colors">
                            {pyq.fileURLs[0].endsWith('.pdf') ? (
                              <img 
                                src={pdfThumbnail} 
                                alt="PDF" 
                                className="w-[45px] h-[45px] object-contain"
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
                            <span className="text-xs text-blue-600 font-medium block mt-1 hover:underline">
                              View all {pyq.fileURLs.length} files
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
                          <div className="w-[50px] h-[50px] border border-gray-300 bg-gray-100 rounded overflow-hidden flex justify-center items-center hover:bg-blue-50 transition-colors">
                            {pyq.fileURL && pyq.fileURL.endsWith('.pdf') ? (
                              <img 
                                src={pdfThumbnail} 
                                alt="PDF" 
                                className="w-[45px] h-[45px] object-contain"
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
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{pyq.subject}</div>
                    <div className="text-gray-500 text-sm">Added: {new Date(pyq.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{pyq.course}</div>
                    <div className="text-gray-500 text-sm">{pyq.branch}, Sem {pyq.semester}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {pyq.examType}
                    </span>
                    <div className="text-gray-500 text-sm mt-1">Year: {pyq.year}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => openImageModal(pyq, 0, e)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center text-xs"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                      
                      {pyq.fileURLs && pyq.fileURLs.length > 1 ? (
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDownloadMenu(pyq._id, e)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded flex items-center text-xs"
                          >
                            <FaDownload className="mr-1" /> Download <FaChevronDown className="ml-1" size={10} />
                          </button>
                          
                          {downloadMenuOpen === pyq._id && (
                            <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                              <ul className="py-1">
                                <li>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const filename = `${pyq.subject}_${pyq.examType}_${pyq.year}_current${pyq.fileURLs[0].endsWith('.pdf') ? '.pdf' : '.jpg'}`;
                                      downloadSingleFile(pyq.fileURLs[0], filename);
                                      setDownloadMenuOpen(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <FaDownload className="mr-2 text-blue-500" /> 
                                      <span>Download Current File</span>
                                    </div>
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={(e) => {
                                      downloadAllFiles(pyq, e);
                                      setDownloadMenuOpen(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center">
                                      <FaDownload className="mr-2 text-green-500" /> 
                                      <span>Download All Files ({pyq.fileURLs.length})</span>
                                    </div>
                                  </button>
                                </li>
                                <li className="border-t border-gray-100 mt-1 pt-1">
                                  <div className="px-4 py-1 text-xs font-medium text-gray-500">Individual Files:</div>
                                </li>
                                {pyq.fileURLs.map((url, idx) => (
                                  <li key={idx}>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const filename = `${pyq.subject}_${pyq.examType}_${pyq.year}_${idx + 1}${url.endsWith('.pdf') ? '.pdf' : '.jpg'}`;
                                        downloadSingleFile(url, filename);
                                        setDownloadMenuOpen(null);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      <div className="flex items-center">
                                        {url.endsWith('.pdf') ? 
                                          <img src={pdfThumbnail} alt="PDF" className="w-4 h-4 mr-2 object-contain" /> : 
                                          <FaFileAlt className="mr-2 text-blue-500" />
                                        }
                                        <span>File {idx + 1} {url.endsWith('.pdf') ? '(PDF)' : '(Image)'}</span>
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const fileUrl = (pyq.fileURLs && pyq.fileURLs.length > 0) ? pyq.fileURLs[0] : pyq.fileURL;
                            const filename = `${pyq.subject}_${pyq.examType}_${pyq.year}${fileUrl.endsWith('.pdf') ? '.pdf' : '.jpg'}`;
                            downloadSingleFile(fileUrl, filename);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded flex items-center text-xs"
                        >
                          <FaDownload className="mr-1" /> Download
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuestionPapersTable;
