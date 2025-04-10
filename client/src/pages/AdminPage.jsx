import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBars } from 'react-icons/fa';

// Admin Components
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import AddPYQ from '../components/admin/AddPYQ';
import ViewPYQs from '../components/admin/ViewPYQs';
import FeedbackManagement from '../components/admin/FeedbackManagement';

const AdminPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    course: '',
    branch: '',
    semester: '',
    examType: ''
  });
  const [formData, setFormData] = useState({
    course: '',
    branch: '',
    semester: '',
    examType: '',
    subject: '',
    year: new Date().getFullYear().toString(),
    files: [],
    filesData: []
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({
    totalPyqs: 0,
    uniqueSubjects: 0,
    uniqueCourses: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadedFileUrls, setUploadedFileUrls] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get token from localStorage
  const token = localStorage.getItem('token');

  // Set headers for API requests
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (activeView === 'viewPYQs' || activeView === 'dashboard') {
      fetchPYQs();
    }
  }, [activeView, filters]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const formatCourseName = (courseName) => {
    if (!courseName) return '';
    return courseName.replace(/[^a-zA-Z]/g, '').toLowerCase();
  };

  const fetchPYQs = async () => {
    setLoading(true);
    try {
      let endpoint = '/api/pyq';
      if (filters.course || filters.branch || filters.semester || filters.examType) {
        endpoint = '/api/pyq/filter';
        const queryParams = new URLSearchParams();8
        if (filters.course) queryParams.append('course', filters.course);
        if (filters.branch) queryParams.append('branch', filters.branch);
        if (filters.semester) queryParams.append('semester', filters.semester);
        if (filters.examType) queryParams.append('examType', filters.examType);
        endpoint += `?${queryParams.toString()}`;
      }
      const response = await axios.get(`http://localhost:5000${endpoint}`, config);
      if (response.data.success) {
        setPyqs(response.data.data);
        if (activeView === 'dashboard') {
          const uniqueSubjects = new Set(response.data.data.map(pyq => pyq.subject)).size;
          const uniqueCourses = new Set(response.data.data.map(pyq => pyq.course)).size;
          setStats({
            totalPyqs: response.data.data.length,
            uniqueSubjects,
            uniqueCourses
          });
        }
      }
    } catch (error) {
      console.error('Error fetching PYQs:', error);
      toast.error('Failed to fetch PYQs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error('You can upload a maximum of 10 files at once');
      return;
    }
    if (files.length > 0) {
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      if (validFiles.length < files.length) {
        toast.error('Some files were too large and were not included. Maximum size per file is 5MB.');
      }
      setFormData({
        ...formData,
        files: validFiles
      });
      const filesDataArray = [];
      let loadedCount = 0;
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          filesDataArray.push({ name: file.name, data: reader.result });
          loadedCount++;
          if (loadedCount === validFiles.length) {
            setFormData(prev => ({
              ...prev,
              filesData: filesDataArray
            }));
          }
        };
        reader.onerror = (error) => {
          console.error("FileReader error:", error);
          toast.error('Error reading file. Please try again.');
        };
      });
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = Array.from(formData.files);
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      files: updatedFiles
    });
  };

  const resetForm = () => {
    setFormData({
      course: '',
      branch: '',
      semester: '',
      examType: '',
      subject: '',
      year: new Date().getFullYear().toString(),
      files: [],
      filesData: []
    });
    setEditMode(false);
    setEditId(null);
    setSuccessMessage('');
    setUploadedFileUrls([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.files.length && !editMode) {
      return toast.error('Please upload at least one file');
    }
    setLoading(true);
    try {
      let response;
      const submitData = new FormData();
      submitData.append('course', formData.course);
      submitData.append('branch', formData.branch);
      submitData.append('semester', formData.semester);
      submitData.append('examType', formData.examType);
      submitData.append('subject', formData.subject);
      submitData.append('year', formData.year);
      if (formData.files.length > 0) {
        for (let i = 0; i < formData.files.length; i++) {
          submitData.append('files', formData.files[i]);
        }
      }
      const uploadConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      };
      if (editMode) {
        response = await axios.put(
          `http://localhost:5000/api/pyq/${editId}`,
          submitData,
          uploadConfig
        );
        toast.success('PYQ updated successfully');
        setSuccessMessage('Question paper has been updated successfully!');
        if (response.data.success && response.data.data.fileURLs) {
          setUploadedFileUrls(response.data.data.fileURLs);
        } else if (response.data.success && response.data.data.fileURL) {
          setUploadedFileUrls([response.data.data.fileURL]);
        }
      } else {
        try {
          response = await axios.post(
            'http://localhost:5000/api/pyq',
            submitData,
            uploadConfig
          );
          toast.success('PYQ added successfully');
          if (response.data.success) {
            setSuccessMessage('Question papers have been added successfully!');
            if (response.data.data.fileURLs) {
              setUploadedFileUrls(response.data.data.fileURLs);
            } else if (response.data.data.fileURL) {
              setUploadedFileUrls([response.data.data.fileURL]);
            }
            fetchPYQs();
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Error saving PYQ:', error);
      let errorMessage = 'Failed to save PYQ';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
      setSuccessMessage('');
      setUploadedFileUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewChange = (view) => {
    setSuccessMessage('');
    setUploadedFileUrls('');
    setActiveView(view);
  };

  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/pyq/${id}`, config);
      if (response.data.success) {
        const pyq = response.data.data;
        setFormData({
          course: pyq.course,
          branch: pyq.branch,
          semester: pyq.semester.toString(),
          examType: pyq.examType,
          subject: pyq.subject,
          year: pyq.year.toString(),
          files: [],
          filesData: []
        });
        setEditMode(true);
        setEditId(id);
        setActiveView('addPYQ');
      }
    } catch (error) {
      console.error('Error fetching PYQ for edit:', error);
      toast.error('Failed to fetch PYQ for editing');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this PYQ?')) {
      setLoading(true);
      try {
        const response = await axios.delete(`http://localhost:5000/api/pyq/${id}`, config);
        if (response.data.success) {
          toast.success('PYQ deleted successfully');
          fetchPYQs();
        }
      } catch (error) {
        console.error('Error deleting PYQ:', error);
        toast.error('Failed to delete PYQ');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hamburger menu toggle button */}
      <button 
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-3 rounded-lg shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>
      
      <div className="flex">
        {/* Sidebar Component */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={handleViewChange} 
          resetForm={resetForm} 
          handleLogout={handleLogout}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        {/* Main Content - adjusted for all screen sizes */}
        <div className={`transition-all duration-300 w-full flex-1 p-3 md:p-8 ${sidebarOpen ? 'md:ml-64' : 'ml-0 md:ml-64'}`}>
          {/* Render different components based on active view */}
          {activeView === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              pyqs={pyqs} 
              loading={loading} 
              setActiveView={handleViewChange} 
            />
          )}

          {activeView === 'addPYQ' && (
            <AddPYQ 
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleRemoveFile={handleRemoveFile}
              handleSubmit={handleSubmit}
              resetForm={resetForm}
              loading={loading}
              editMode={editMode}
              successMessage={successMessage}
              uploadedFileUrls={uploadedFileUrls}
            />
          )}

          {activeView === 'viewPYQs' && (
            <ViewPYQs 
              pyqs={pyqs}
              loading={loading}
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              setActiveView={handleViewChange}
            />
          )}

          {activeView === 'feedback' && (
            <FeedbackManagement />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;