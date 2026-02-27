import React, { useState, useRef } from 'react';
import {
  FaUpload,
  FaFileAlt,
  FaBriefcase,
  FaChartBar,
  FaBookOpen,
  FaArrowRight,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaRedo,
  FaDownload,
  FaSave,
  FaCommentDots
} from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import SkillCard from '../components/SkillCard';
import RecommendationCard from '../components/RecommendationCard';
import FeedbackModal from '../components/FeedbackModal';
import { analyzeResume, analyzeText, getRecommendations, savePDFReport } from '../services/api';
import { useAnalysis } from '../context/AnalysisContext';

const Analysis = () => {
  const { addAnalysis } = useAnalysis();
  const [step, setStep] = useState(1); // 1: Input, 2: Loading, 3: Results
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      setError('Invalid file type. Please upload a PDF, DOCX, or TXT file.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setResumeFile(file);
      setError('');
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setResumeFile(file);
        setError('');
      }
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (inputMode === 'file' && !resumeFile) {
      setError('Please upload a resume file.');
      return;
    }
    if (inputMode === 'text' && !resumeText.trim()) {
      setError('Please enter your resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please enter the job description.');
      return;
    }

    setError('');
    setStep(2);
    setLoadingMessage('Analyzing your resume...');

    try {
      // Step 1: Analyze resume
      let analysisResult;
      if (inputMode === 'file') {
        analysisResult = await analyzeResume(resumeFile, jobDescription);
      } else {
        analysisResult = await analyzeText(resumeText, jobDescription);
      }

      setResults(analysisResult);
      setLoadingMessage('Getting course recommendations...');

      // Step 2: Get recommendations for missing skills
      if (analysisResult.missing_skills && analysisResult.missing_skills.length > 0) {
        const recResult = await getRecommendations(analysisResult.missing_skills);
        setRecommendations(recResult.recommendations || []);
      } else {
        setRecommendations([]);
      }

      setStep(3);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'An error occurred during analysis. Please try again.');
      setStep(1);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      await savePDFReport(results, recommendations);
    } catch (err) {
      console.error('PDF download error:', err);
      setError('Failed to generate PDF report. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleSaveAnalysis = () => {
    if (results && !saved) {
      // Extract job title from job description
      const extractJobTitle = (jd) => {
        const lines = jd.split('\n');
        if (lines.length > 0) {
          const firstLine = lines[0].trim();
          if (firstLine.length < 100 && firstLine.length > 3) {
            return firstLine;
          }
        }
        return 'Job Position';
      };

      addAnalysis({
        job_title: extractJobTitle(jobDescription),
        company: 'Analysis',
        match_percentage: results.match_percentage,
        matched_skills: results.matched_skills || [],
        missing_skills: results.missing_skills || [],
        classification: results.classification,
        recommendations_count: recommendations.length
      });
      setSaved(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResumeFile(null);
    setResumeText('');
    setJobDescription('');
    setError('');
    setResults(null);
    setRecommendations([]);
    setSaved(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render loading state
  if (step === 2) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 text-center py-16 border border-gray-100 dark:border-gray-700">
            <LoadingSpinner size="xl" text={loadingMessage} />
            <div className="mt-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                This may take a few seconds. Our AI is analyzing your skills...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render results
  if (step === 3 && results) {
    const {
      match_percentage,
      matched_skills = [],
      missing_skills = [],
      classification = 'Unknown',
      confidence = 0
    } = results;

    // Classification badge color
    const classificationColors = {
      'High Match': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      'Medium Match': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      'Moderate Match': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      'Low Match': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      'Unknown': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    };

    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analysis Results
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Here's how your skills match the job requirements
            </p>
          </div>

          {/* Match Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Circular Progress */}
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="stroke-gray-200 dark:stroke-gray-700"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={match_percentage >= 70 ? '#10b981' : match_percentage >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${match_percentage * 4.4} 440`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {Math.round(match_percentage)}%
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Match</span>
                </div>
              </div>

              {/* Classification */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <span className={`px-4 py-2 rounded-full font-semibold ${classificationColors[classification] || classificationColors['Unknown']}`}>
                    {classification}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {classification === 'High Match' && 'Great! You\'re a strong candidate for this role.'}
                  {(classification === 'Medium Match' || classification === 'Moderate Match') && 'You have potential! Focus on filling the skill gaps.'}
                  {classification === 'Low Match' && 'Consider developing more skills for this role.'}
                  {classification === 'Unknown' && 'Analysis complete.'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {matched_skills.length} skills matched • {missing_skills.length} skills missing
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSaveAnalysis}
                  disabled={saved}
                  className={`inline-flex items-center justify-center ${saved ? 'bg-green-600 cursor-not-allowed' : 'btn-primary'}`}
                >
                  {saved ? (
                    <>
                      <FaCheck className="mr-2" />
                      Saved to Reports
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save to Reports
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloadingPDF}
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  {downloadingPDF ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2" />
                      Download PDF Report
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="btn-secondary inline-flex items-center justify-center bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <FaCommentDots className="mr-2" />
                  Give Feedback
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  <FaRedo className="mr-2" />
                  New Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SkillCard
              title="Matched Skills"
              skills={matched_skills}
              type="matched"
            />
            <SkillCard
              title="Missing Skills"
              skills={missing_skills}
              type="missing"
            />
          </div>

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Recommended Courses
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Top courses to fill your skill gaps
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <RecommendationCard
                    key={index}
                    recommendation={rec}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No recommendations message */}
          {missing_skills.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 text-center py-12 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FaCheck className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Perfect Match!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You have all the skills required for this job. No course recommendations needed.
              </p>
            </div>
          )}

          {/* Feedback Modal */}
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            matchPercentage={match_percentage}
          />
        </div>
      </div>
    );
  }

  // Render input form (step 1)
  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Analyze Your Skills
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload your resume and job description to get started
          </p>
        </div>

        {/* Main Form */}
        <div className="space-y-6">
          {/* Resume Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <FaFileAlt className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Resume</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload a file or paste text</p>
              </div>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setInputMode('file')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${inputMode === 'file'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${inputMode === 'text'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                Paste Text
              </button>
            </div>

            {/* File Upload */}
            {inputMode === 'file' && (
              <div>
                {!resumeFile ? (
                  <div
                    ref={dropZoneRef}
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-primary-500 bg-primary-100/50 dark:bg-primary-900/30 scale-[1.02]' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                    />
                    <FaUpload className={`mx-auto text-4xl mb-4 transition-colors ${isDragging ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                      {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      PDF, DOCX, or TXT (max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <FaCheck className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{resumeFile.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {(resumeFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                    >
                      <FaTimes className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Text Input */}
            {inputMode === 'text' && (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-48 p-4 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            )}
          </div>

          {/* Job Description Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                <FaBriefcase className="text-secondary-600 dark:text-secondary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Job Description</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Paste the job posting content</p>
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here, including required skills and qualifications..."
              className="w-full h-48 p-4 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <FaExclamationTriangle className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
          >
            Analyze Skills
            <FaArrowRight />
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your data is processed securely and not stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;