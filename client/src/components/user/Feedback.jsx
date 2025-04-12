import React, { useState } from 'react';
import { FaTimes, FaPaperPlane, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Feedback = ({ isOpen, onClose }) => {
  const [feedbackData, setFeedbackData] = useState({
    type: 'suggestion',
    subject: '',
    message: '',
    rating: 0
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFeedbackData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user token for authentication
      const userToken = localStorage.getItem('userToken');
      
      if (!userToken) {
        toast.error('You must be logged in to submit feedback');
        return;
      }

      // Log the token to confirm it's being retrieved correctly
      console.log('Using token for feedback:', userToken ? 'Token found' : 'No token');

      const config = {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      };

      // Add a check to verify user is logged in before submitting
      const userResponse = await axios.get('http://localhost:5000/api/user/profile', config);
      if (!userResponse.data.success) {
        toast.error('Unable to verify your account. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/feedback',
        feedbackData,
        config
      );

      if (response.data.success) {
        toast.success('Thank you for your feedback!');
        // Reset form
        setFeedbackData({
          type: 'suggestion',
          subject: '',
          message: '',
          rating: 0
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Share Your Feedback</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Feedback Type</label>
            <select
              name="type"
              value={feedbackData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug Report</option>
              <option value="content">Content Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={feedbackData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your feedback"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Your Message</label>
            <textarea
              name="message"
              value={feedbackData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Please share your thoughts, suggestions or report issues..."
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">How would you rate your experience?</label>
            <div className="flex space-x-5 justify-center mt-2">
              <button 
                type="button"
                onClick={() => handleRatingClick(1)}
                className={`p-2 rounded-full ${feedbackData.rating === 1 ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                <FaFrown className="text-2xl" />
              </button>
              <button 
                type="button"
                onClick={() => handleRatingClick(2)}
                className={`p-2 rounded-full ${feedbackData.rating === 2 ? 'bg-yellow-100 text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <FaMeh className="text-2xl" />
              </button>
              <button 
                type="button"
                onClick={() => handleRatingClick(3)}
                className={`p-2 rounded-full ${feedbackData.rating === 3 ? 'bg-green-100 text-green-500' : 'text-gray-400 hover:text-green-500'}`}
              >
                <FaSmile className="text-2xl" />
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center">
                  <FaPaperPlane className="mr-2" /> Submit Feedback
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
