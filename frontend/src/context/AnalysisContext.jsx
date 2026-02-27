import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisContext = createContext();

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [analyses, setAnalyses] = useState(() => {
    const saved = localStorage.getItem('skilllens_analyses');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Persist to localStorage whenever analyses change
  useEffect(() => {
    localStorage.setItem('skilllens_analyses', JSON.stringify(analyses));
  }, [analyses]);

  // Add a new analysis
  const addAnalysis = (analysis) => {
    const newAnalysis = {
      id: Date.now(),
      ...analysis,
      date: new Date().toISOString(),
      type: 'Analysis'
    };
    setAnalyses(prev => [newAnalysis, ...prev]);
    setCurrentAnalysis(newAnalysis);
    return newAnalysis;
  };

  // Delete an analysis
  const deleteAnalysis = (id) => {
    setAnalyses(prev => prev.filter(a => a.id !== id));
  };

  // Get a single analysis by ID
  const getAnalysis = (id) => {
    return analyses.find(a => a.id === id);
  };

  // Clear all analyses
  const clearAnalyses = () => {
    setAnalyses([]);
    localStorage.removeItem('skilllens_analyses');
  };

  // Calculate dashboard stats
  const getDashboardStats = () => {
    if (analyses.length === 0) {
      return {
        skillMatchPercentage: 0,
        totalMatchedSkills: 0,
        totalMissingSkills: 0,
        recentAnalyses: [],
        skillDistribution: []
      };
    }

    // Calculate average match percentage
    const avgMatch = Math.round(
      analyses.reduce((acc, a) => acc + (a.match_percentage || 0), 0) / analyses.length
    );

    // Calculate total matched and missing skills (unique)
    const allMatchedSkills = new Set();
    const allMissingSkills = new Set();
    analyses.forEach(a => {
      (a.matched_skills || []).forEach(s => allMatchedSkills.add(s));
      (a.missing_skills || []).forEach(s => allMissingSkills.add(s));
    });

    // Get skill distribution from latest analyses
    const skillLevels = {};
    analyses.slice(0, 10).forEach(a => {
      (a.matched_skills || []).forEach(s => {
        skillLevels[s] = Math.min(100, (skillLevels[s] || 70) + 5);
      });
    });

    const skillDistribution = Object.entries(skillLevels)
      .map(([name, level]) => ({ name, level }))
      .sort((a, b) => b.level - a.level)
      .slice(0, 8);

    return {
      skillMatchPercentage: avgMatch,
      totalMatchedSkills: allMatchedSkills.size,
      totalMissingSkills: allMissingSkills.size,
      recentAnalyses: analyses.slice(0, 5).map(a => ({
        id: a.id,
        jobTitle: a.job_title || 'Unknown Position',
        company: a.company || 'Not specified',
        matchPercentage: a.match_percentage || 0,
        date: new Date(a.date).toLocaleDateString(),
        status: getClassification(a.match_percentage)
      })),
      skillDistribution
    };
  };

  // Helper function to classify match
  const getClassification = (percentage) => {
    if (percentage >= 80) return 'High Match';
    if (percentage >= 60) return 'Medium Match';
    if (percentage >= 40) return 'Moderate Match';
    return 'Low Match';
  };

  const value = {
    analyses,
    currentAnalysis,
    addAnalysis,
    deleteAnalysis,
    getAnalysis,
    clearAnalyses,
    getDashboardStats,
    setCurrentAnalysis
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export default AnalysisContext;