import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PDFDocument } from 'pdf-lib'; // Add this import
import { FaPaperPlane } from 'react-icons/fa'; // Add this import

// Components
import Header from '../components/user/Header';
import UserInfoCard from '../components/user/UserInfoCard';
import FilterSection from '../components/user/FilterSection';
import QuestionPapersTable from '../components/user/QuestionPapersTable';
import DocumentViewer from '../components/user/DocumentViewer';
import Feedback from '../components/user/Feedback';

const UserPage = () => {
  const { user, logoutUser } = useUser();
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: '',
    branch: '',
    semester: '',
    examType: '',
    subject: '',
    year: ''
  });
  const [selectedPYQ, setSelectedPYQ] = useState(null);
  const navigate = useNavigate();
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(null);

  // Add state for the modal viewer
  const [selectedPyq, setSelectedPyq] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false); // Add state for feedback modal

  // PDF thumbnail image
  const pdfThumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAn1BMVEX///8AAACxsbFYWFiZmZk4ODhvb2/f399BQUGKiooTExO5ubkbGxvGxsYiIiLx8fH5+fn29vbp6enU1NShoaGRkZF5eXnOzs5NTU0oKCisrKxiYmLb29vAwMDl5eUvLy94eHhFRUVQUFCEhIRoaGhycnI8PDwVFRV+fn4dHR1bW1srKyuampqNjY3KyspJSUkzMzOlpaULCwumpqYeHh5f07gVAAAF4UlEQVR4nO2ba3+qPAzGC4hyEAHlJHgA5eTmNrf5/T/b/*...*/";

  useEffect(() => {
    if (user) {
      // Set initial filter based on user's course
      setFilters(prev => ({
        ...prev,
        course: user.course
      }));
    }
    
    fetchPYQs();
  }, [user]);

  // Update current file URL whenever selectedPyq or activeImageIndex changes
  useEffect(() => {
    if (selectedPyq) {
      const url = selectedPyq.fileURLs && selectedPyq.fileURLs.length > 0 
        ? selectedPyq.fileURLs[activeImageIndex]
        : selectedPyq.fileURL;
      setCurrentFileUrl(url);
      // Reset PDF load error when changing files
      setPdfLoadError(false);
    }
  }, [selectedPyq, activeImageIndex]);

  // Function to close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (downloadMenuOpen) {
        setDownloadMenuOpen(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [downloadMenuOpen]);

  const fetchPYQs = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/pyq';
      
      // Create a copy of filters to ensure user's course is always applied
      const appliedFilters = { ...filters };
      
      // Always enforce the user's course if they are logged in
      if (user) {
        appliedFilters.course = user.course;
      }
      
      // Add filters if any
      if (appliedFilters.course || appliedFilters.branch || appliedFilters.semester || 
          appliedFilters.examType || appliedFilters.subject || appliedFilters.year) {
        endpoint = '/api/pyq/filter';
        const queryParams = new URLSearchParams();
        
        if (appliedFilters.course) queryParams.append('course', appliedFilters.course);
        if (appliedFilters.branch) queryParams.append('branch', appliedFilters.branch);
        if (appliedFilters.semester) queryParams.append('semester', appliedFilters.semester);
        if (appliedFilters.examType) queryParams.append('examType', appliedFilters.examType);
        if (appliedFilters.subject) queryParams.append('subject', appliedFilters.subject);
        
        endpoint += `?${queryParams.toString()}`;
      }
      
      // Get authentication token for API request
      const userToken = localStorage.getItem('userToken');
      
      // Add token to request headers
      const config = {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      };
      
      // Send authenticated request
      const response = await axios.get(`http://localhost:5000${endpoint}`, config);
      
      if (response.data.success) {
        // Apply client-side filtering for fields not supported by the API
        let filteredPyqs = response.data.data;
        
        // Filter by subject (client-side)
        if (filters.subject) {
          filteredPyqs = filteredPyqs.filter(pyq => 
            pyq.subject.toLowerCase().includes(filters.subject.toLowerCase())
          );
        }
        
        // Filter by year (client-side)
        if (filters.year) {
          filteredPyqs = filteredPyqs.filter(pyq => 
            pyq.year == filters.year // Using == to handle type coercion (string to number)
          );
        }
        
        setPyqs(filteredPyqs);
      }
    } catch (error) {
      console.error('Error fetching PYQs:', error);
      
      // Provide more specific error messages
      if (error.response) {
        toast.error(`Error ${error.response.status}: ${error.response.data.message || 'Failed to fetch question papers'}`);
      } else if (error.request) {
        toast.error('No response from server. Please check your connection.');
      } else {
        toast.error('Failed to fetch question papers');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleApplyFilters = () => {
    fetchPYQs();
  };

  const handleClearFilters = () => {
    setFilters({
      course: user?.course || '', // Preserve user's course
      branch: '',
      semester: '',
      examType: '',
      subject: '',
      year: ''
    });
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/user-login');
  };

  const openPYQ = (pyq) => {
    setSelectedPYQ(pyq);
  };
  
  // Handle opening the image modal
  const openImageModal = (pyq, index = 0, e) => {
    e.preventDefault();
    setSelectedPyq(pyq);
    setActiveImageIndex(index);
    setPdfLoadError(false);
  };

  // Handle closing the modal
  const closeImageModal = () => {
    setSelectedPyq(null);
    setActiveImageIndex(0);
    setPdfLoadError(false);
    setCurrentFileUrl(null);
  };

  // Handle PDF load error
  const handlePdfLoadError = () => {
    console.log("PDF failed to load:", currentFileUrl);
    setPdfLoadError(true);
  };

  // Check if current file is a PDF
  const isCurrentFilePdf = () => {
    return currentFileUrl && currentFileUrl.toLowerCase().endsWith('.pdf');
  };
  
  // Helper function to extract filename from URL
  const getFilenameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };

  // Function to download a single file more reliably using pdf-lib for PDFs
  const downloadSingleFile = async (url, filename, e) => {
    if (e) e.stopPropagation();
    
    try {
      // Check if the file is a PDF
      if (url.toLowerCase().endsWith('.pdf')) {
        // Use pdf-lib for PDF downloads
        toast.info('Preparing PDF download...');
        
        // Fetch the PDF
        const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
        
        // Load the PDF document
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // Save the PDF
        const savedPdfBytes = await pdfDoc.save();
        
        // Create a blob from the PDF bytes
        const blob = new Blob([savedPdfBytes], { type: 'application/pdf' });
        
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a link to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || getFilenameFromUrl(url));
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 300);
        
        toast.success(`Downloading ${filename || getFilenameFromUrl(url)}`);
      } else {
        // For non-PDF files, use the direct approach
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || getFilenameFromUrl(url));
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 300);
        
        toast.success(`Downloading ${filename || getFilenameFromUrl(url)}`);
      }
    } catch (error) {
      console.error("Download error:", error);
      // Fallback method - open in new tab
      toast.info(`Opening file in new tab. Use browser's save option to download.`);
      window.open(url, '_blank');
    }
  };

  // Improved function to download all files with PDF support
  const downloadAllFiles = (pyq, e) => {
    if (e) e.stopPropagation();
    
    if (pyq.fileURLs && pyq.fileURLs.length > 0) {
      toast.success(`Preparing ${pyq.fileURLs.length} files for download...`);
      
      // Download each file with a slight delay
      pyq.fileURLs.forEach((url, index) => {
        setTimeout(() => {
          // Generate a filename based on document info
          const filename = `${pyq.subject}_${pyq.examType}_${pyq.year}_${index + 1}${url.endsWith('.pdf') ? '.pdf' : '.jpg'}`;
          
          // Use the single file download function
          downloadSingleFile(url, filename);
        }, index * 700);
      });
    }
    
    setDownloadMenuOpen(null);
  };

  // Toggle download menu - improved to handle click events better
  const toggleDownloadMenu = (pyqId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    e.preventDefault();
    
    if (downloadMenuOpen === pyqId) {
      setDownloadMenuOpen(null);
    } else {
      setDownloadMenuOpen(pyqId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} handleLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <UserInfoCard user={user} />
        
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md"
          >
            <FaPaperPlane className="mr-2" /> Give Feedback
          </button>
        </div>
        
        <FilterSection 
          filters={filters}
          handleFilterChange={handleFilterChange}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
        />
        
        <QuestionPapersTable 
          pyqs={pyqs}
          loading={loading}
          pdfThumbnail={pdfThumbnail}
          openImageModal={openImageModal}
          downloadMenuOpen={downloadMenuOpen}
          toggleDownloadMenu={toggleDownloadMenu}
          downloadSingleFile={downloadSingleFile}
          downloadAllFiles={downloadAllFiles}
          setDownloadMenuOpen={setDownloadMenuOpen}
        />
        
        <Feedback 
          isOpen={feedbackModalOpen}
          onClose={() => setFeedbackModalOpen(false)}
        />
      </main>

      <DocumentViewer 
        selectedPyq={selectedPyq}
        activeImageIndex={activeImageIndex}
        currentFileUrl={currentFileUrl}
        pdfLoadError={pdfLoadError}
        pdfThumbnail={pdfThumbnail}
        closeImageModal={closeImageModal}
        setActiveImageIndex={setActiveImageIndex}
        handlePdfLoadError={handlePdfLoadError}
        isCurrentFilePdf={isCurrentFilePdf}
        downloadAllFiles={downloadAllFiles}
      />
    </div>
  );
};

export default UserPage;