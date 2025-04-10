import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaInbox, FaCheck, FaEye, FaSmile, FaMeh, FaFrown, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const FeedbackManagement = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      console.log('Fetching feedback with token:', token.substring(0, 10) + '...');

      const response = await axios.get('http://localhost:5000/api/feedback', config);
      
      if (response.data.success) {
        console.log("Feedback data received:", response.data.data);
        setFeedback(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error.response || error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Optionally redirect to login page here
      } else {
        toast.error('Failed to load feedback: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFeedbackStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`http://localhost:5000/api/feedback/${id}`, { status }, config);
      
      // Update local state
      setFeedback(prevFeedback => 
        prevFeedback.map(item => 
          item._id === id ? { ...item, status } : item
        )
      );
      
      if (selectedFeedback && selectedFeedback._id === id) {
        setSelectedFeedback({ ...selectedFeedback, status });
      }
      
      toast.success(`Feedback marked as ${status}`);
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Failed to update feedback status');
    }
  };

  const openDetailsModal = (item) => {
    setSelectedFeedback(item);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedFeedback(null);
  };

  const getFeedbackTypeLabel = (type) => {
    switch (type) {
      case 'suggestion': return 'Suggestion';
      case 'bug': return 'Bug Report';
      case 'content': return 'Content Request';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 1: return <FaFrown className="text-red-500" />;
      case 2: return <FaMeh className="text-yellow-500" />;
      case 3: return <FaSmile className="text-green-500" />;
      default: return null;
    }
  };

  const getActionButtonColor = (status) => {
    return status === 'resolved' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Feedback Management</h2>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-xl overflow-hidden border">
          {feedback.length === 0 ? (
            <div className="p-8 text-center">
              <FaInbox className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No feedback submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedback.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRatingIcon(item.rating)}
                          <span className="ml-2">{getFeedbackTypeLabel(item.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.message.length > 40 ? `${item.message.substring(0, 40)}...` : item.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.user ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                            <div className="text-sm text-gray-500">{item.user.email}</div>
                            {item.user.course && (
                              <div className="text-xs text-gray-500 mt-1">Course: {item.user.course}</div>
                            )}
                            {item.user.roll && (
                              <div className="text-xs text-gray-500">Roll: {item.user.roll}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Unknown user</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetailsModal(item)}
                            className={`${getActionButtonColor(item.status)} hover:opacity-75`}
                            title={item.status === 'resolved' ? 'View Resolved Feedback' : 'View Feedback'}
                          >
                            <FaEye className="text-lg" />
                          </button>
                          {item.status !== 'resolved' && (
                            <button
                              onClick={() => updateFeedbackStatus(item._id, 'resolved')}
                              className="text-gray-500 hover:text-green-600"
                              title="Mark as Resolved"
                            >
                              <FaCheck className="text-lg" />
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
      )}

      {/* Feedback Details Modal */}
      {detailsModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className={`bg-white rounded-xl max-w-2xl w-full shadow-xl ${selectedFeedback.status === 'resolved' ? 'border-2 border-green-200' : ''}`}>
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                Feedback Details
                {selectedFeedback.status === 'resolved' && (
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Resolved
                  </span>
                )}
              </h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-500 hover:text-gray-800 focus:outline-none"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  Submitted on {new Date(selectedFeedback.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Type</h4>
                  <p className="font-medium">{getFeedbackTypeLabel(selectedFeedback.type)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">User Rating</h4>
                  <p className="font-medium flex items-center">
                    {getRatingIcon(selectedFeedback.rating)}
                    <span className="ml-2">
                      {selectedFeedback.rating === 1 ? 'Dissatisfied' : 
                       selectedFeedback.rating === 2 ? 'Neutral' : 
                       selectedFeedback.rating === 3 ? 'Satisfied' : 'Not rated'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Subject</h4>
                <p className="font-medium">{selectedFeedback.subject}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Message</h4>
                <p className="bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{selectedFeedback.message}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500">Submitted By</h4>
                {selectedFeedback.user ? (
                  <div>
                    <p className="font-medium">{selectedFeedback.user.name}</p>
                    <p className="text-sm text-gray-500">{selectedFeedback.user.email}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Unknown user</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
                {selectedFeedback.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      updateFeedbackStatus(selectedFeedback._id, 'resolved');
                      closeDetailsModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <FaCheck className="mr-2" /> Mark as Resolved
                  </button>
                )}
              </div>

              {/* Add a prominent "Mark as Resolved" button at the bottom */}
              {selectedFeedback.status !== 'resolved' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      updateFeedbackStatus(selectedFeedback._id, 'resolved');
                      closeDetailsModal();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <FaCheck className="mr-2" /> Mark as Resolved
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

export default FeedbackManagement;
