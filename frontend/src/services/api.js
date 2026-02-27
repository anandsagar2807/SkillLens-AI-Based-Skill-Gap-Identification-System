/**
 * API Service
 * Handles all API calls to the backend
 */

import axios from 'axios';

// Base API URL - uses proxy in development
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:8000' 
  : '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for file uploads
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Analyze resume against job description
 * @param {File} resumeFile - Resume file (PDF/DOCX)
 * @param {string} jobDescription - Job description text
 * @returns {Promise} Analysis results
 */
export const analyzeResume = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('job_description', jobDescription);

  const response = await api.post('/analyze/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Analyze text against job description
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description text
 * @returns {Promise} Analysis results
 */
export const analyzeText = async (resumeText, jobDescription) => {
  const formData = new FormData();
  formData.append('resume_text', resumeText);
  formData.append('job_description', jobDescription);

  const response = await api.post('/analyze/text', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Classify skill match level
 * @param {number} matchPercentage - Match percentage (0-100)
 * @returns {Promise} Classification result
 */
export const classifyMatch = async (matchPercentage) => {
  const response = await api.post('/classify/', {
    match_percentage: matchPercentage,
  });

  return response.data;
};

/**
 * Get course recommendations for missing skills
 * @param {string[]} missingSkills - Array of missing skills
 * @param {number} topN - Number of recommendations (default: 5)
 * @returns {Promise} Course recommendations
 */
export const getRecommendations = async (missingSkills, topN = 5) => {
  const response = await api.post('/recommend/', {
    missing_skills: missingSkills,
    top_n: topN,
  });

  return response.data;
};

/**
 * Get all available skills
 * @returns {Promise} List of skills
 */
export const getAvailableSkills = async () => {
  const response = await api.get('/analyze/skills');
  return response.data;
};

/**
 * Get course statistics
 * @returns {Promise} Course stats
 */
export const getCourseStats = async () => {
  const response = await api.get('/recommend/stats');
  return response.data;
};

/**
 * Health check
 * @returns {Promise} Health status
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * Download PDF report
 * @param {Object} analysisResults - Analysis results
 * @param {Array} recommendations - Course recommendations
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadPDFReport = async (analysisResults, recommendations = []) => {
  const formData = new FormData();
  formData.append('matched_skills', JSON.stringify(analysisResults.matched_skills || []));
  formData.append('missing_skills', JSON.stringify(analysisResults.missing_skills || []));
  formData.append('match_percentage', analysisResults.match_percentage || 0);
  formData.append('similarity_score', analysisResults.similarity_score || 0);
  formData.append('classification', analysisResults.classification || 'Unknown');
  formData.append('recommendations', JSON.stringify(recommendations));

  const response = await api.post('/analyze/report', formData, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * Download and save PDF report
 * @param {Object} analysisResults - Analysis results
 * @param {Array} recommendations - Course recommendations
 */
export const savePDFReport = async (analysisResults, recommendations = []) => {
  const blob = await downloadPDFReport(analysisResults, recommendations);
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `skilllens_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Export default api instance for custom requests
export default api;
