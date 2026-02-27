import React, { useState } from 'react';
import {
  FaTimes,
  FaStar,
  FaPaperPlane,
  FaCheckCircle,
  FaSmile,
  FaMeh,
  FaFrown
} from 'react-icons/fa';

const FeedbackModal = ({ isOpen, onClose, matchPercentage }) => {
  const [rating, setRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const satisfactionOptions = [
    { id: 'happy', label: 'Very Satisfied', icon: FaSmile, color: 'text-green-500' },
    { id: 'neutral', label: 'Neutral', icon: FaMeh, color: 'text-yellow-500' },
    { id: 'sad', label: 'Needs Improvement', icon: FaFrown, color: 'text-red-500' }
  ];

  const handleSubmit = async () => {
    if (rating === 0 || !satisfaction) return;

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, you would send this to your backend
    const feedbackData = {
      rating,
      satisfaction,
      feedback,
      matchPercentage,
      timestamp: new Date().toISOString()
    };
    
    console.log('Feedback submitted:', feedbackData);
    
    setLoading(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setSatisfaction(null);
    setFeedback('');
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all border border-gray-100 dark:border-gray-700">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Share Your Feedback
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Help us improve your experience with SkillLens
                </p>
              </div>

              {/* Match Score Summary */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Your Match Score</span>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {Math.round(matchPercentage)}%
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  How would you rate the analysis?
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-2 transition-transform hover:scale-110"
                    >
                      <FaStar
                        className={`text-2xl transition-colors ${
                          star <= rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>

              {/* Satisfaction */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  How satisfied are you with the recommendations?
                </label>
                <div className="flex justify-center gap-4">
                  {satisfactionOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSatisfaction(option.id)}
                        className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                          satisfaction === option.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className={`text-2xl ${option.color}`} />
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Feedback */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Comments (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={rating === 0 || !satisfaction || loading}
                className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  rating === 0 || !satisfaction
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-primary text-white hover:opacity-90 shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Submit Feedback
                  </>
                )}
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your feedback helps us improve SkillLens for everyone.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gradient-primary text-white rounded-xl font-medium hover:opacity-90 transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;