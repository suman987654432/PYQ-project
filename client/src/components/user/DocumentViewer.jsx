import React from 'react';
import { FaTimes, FaExternalLinkAlt, FaArrowLeft, FaArrowRight, FaDownload, FaEye } from 'react-icons/fa';

const DocumentViewer = ({ 
  selectedPyq, 
  activeImageIndex, 
  currentFileUrl,
  pdfLoadError,
  pdfThumbnail,
  closeImageModal, 
  setActiveImageIndex, 
  handlePdfLoadError,
  isCurrentFilePdf,
  downloadAllFiles 
}) => {
  if (!selectedPyq) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
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
        <div className="flex-1 overflow-auto p-4">
          <div className="flex flex-col items-center">
            {/* Main document display */}
            <div className="mb-6 w-full flex justify-center">
              {isCurrentFilePdf() ? (
                <div className="w-full">
                  {!pdfLoadError ? (
                    <div className="w-full h-[60vh] border relative">
                      <iframe
                        src={currentFileUrl}
                        className="w-full h-full"
                        title="PDF Viewer"
                        onError={handlePdfLoadError}
                        onLoad={() => console.log("PDF iframe loaded")}
                      />
                      {/* Loading indicator */}
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 pointer-events-none">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p className="text-gray-600">Loading PDF...</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  
                  {/* Always show these buttons for PDFs, prominently if there's an error */}
                  <div className={`mt-4 flex justify-center ${pdfLoadError ? 'animate-pulse' : ''}`}>
                    <a
                      href={currentFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md"
                    >
                      <FaEye className="mr-2" /> {pdfLoadError ? 'PDF Viewer Not Working - Open in New Tab' : 'Open PDF in New Tab'}
                    </a>
                    <a
                      href={currentFileUrl}
                      download
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center ml-3 shadow-md"
                    >
                      <FaDownload className="mr-2" /> Download PDF
                    </a>
                  </div>
                  
                  {pdfLoadError && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <p className="text-yellow-800">
                        We couldn't display this PDF in the browser. This might be due to browser settings or the PDF format.
                      </p>
                      <p className="text-yellow-700 mt-2">
                        Please use the "Open PDF in New Tab" button above to view this document.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={currentFileUrl}
                  alt={`Document ${activeImageIndex + 1}`}
                  className="max-h-[60vh] max-w-full object-contain"
                />
              )}
            </div>
            
            {/* Navigation counter */}
            {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 1 && (
              <div className="text-center mb-4">
                <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  File {activeImageIndex + 1} of {selectedPyq.fileURLs.length}
                </span>
              </div>
            )}
            
            {/* Thumbnails - Show ALL files for this PYQ */}
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 0 ? (
                // Display all files in thumbnails
                selectedPyq.fileURLs.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`cursor-pointer border-2 rounded overflow-hidden ${
                      activeImageIndex === idx ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-50 relative">
                      {url.endsWith('.pdf') ? (
                        <>
                          <img src={pdfThumbnail} alt="PDF" className="w-12 h-12 object-contain" />
                          <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-1 rounded-sm">PDF</span>
                        </>
                      ) : (
                        <img
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-16 h-16 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'%3E%3C/path%3E%3Cpolyline points='13 2 13 9 20 9'%3E%3C/polyline%3E%3C/svg%3E";
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback for single file
                <div className="cursor-pointer border-2 border-blue-500 ring-2 ring-blue-300 rounded overflow-hidden">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-50 relative">
                    {selectedPyq.fileURL && selectedPyq.fileURL.endsWith('.pdf') ? (
                      <>
                        <img src={pdfThumbnail} alt="PDF" className="w-12 h-12 object-contain" />
                        <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-1 rounded-sm">PDF</span>
                      </>
                    ) : (
                      <img
                        src={selectedPyq.fileURL}
                        alt="Thumbnail"
                        className="w-16 h-16 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'%3E%3C/path%3E%3Cpolyline points='13 2 13 9 20 9'%3E%3C/polyline%3E%3C/svg%3E";
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer with actions */}
        <div className="p-4 border-t flex justify-between items-center">
          <a
            href={currentFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaExternalLinkAlt className="mr-2" /> Open in new tab
          </a>
          
          <div className="flex gap-3">
            {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? selectedPyq.fileURLs.length - 1 : prev - 1))}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                >
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === selectedPyq.fileURLs.length - 1 ? 0 : prev + 1))}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  Next <FaArrowRight className="ml-2" />
                </button>
              </>
            )}
            
            {/* Add download all button in modal */}
            {selectedPyq.fileURLs && selectedPyq.fileURLs.length > 1 ? (
              <button
                onClick={(e) => downloadAllFiles(selectedPyq, e)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center ml-3"
              >
                <FaDownload className="mr-2" /> Download All Files
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
