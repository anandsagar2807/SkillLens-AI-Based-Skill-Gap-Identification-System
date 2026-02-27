import React from 'react';
import { FaExternalLinkAlt, FaStar, FaClock, FaGraduationCap } from 'react-icons/fa';

const RecommendationCard = ({ recommendation, index }) => {
  const { 
    title, 
    platform, 
    link, 
    matched_skills = [], 
    duration, 
    rating,
    relevance_score 
  } = recommendation;

  // Platform colors
  const platformColors = {
    'Udemy': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    'Coursera': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    'Pluralsight': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    'LinkedIn Learning': 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
    'Educative': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    'Microsoft Learn': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  };

  const platformColor = platformColors[platform] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300 group relative">
      {/* Rank Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg">
        #{index + 1}
      </div>

      {/* Content */}
      <div className="pt-2">
        {/* Platform Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${platformColor}`}>
            {platform}
          </span>
          {rating && (
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">{rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h4>

        {/* Meta info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          {duration && (
            <div className="flex items-center space-x-1">
              <FaClock className="text-gray-400 dark:text-gray-500" />
              <span>{duration}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <FaGraduationCap className="text-gray-400 dark:text-gray-500" />
            <span>{matched_skills.length} skills covered</span>
          </div>
        </div>

        {/* Matched Skills */}
        {matched_skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Skills you'll learn:</p>
            <div className="flex flex-wrap gap-1">
              {matched_skills.slice(0, 4).map((skill, i) => (
                <span 
                  key={i}
                  className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {matched_skills.length > 4 && (
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                  +{matched_skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Relevance Score */}
        {relevance_score && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500 dark:text-gray-400">Relevance</span>
              <span className="font-medium text-primary-600 dark:text-primary-400">{relevance_score}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${relevance_score}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white font-medium rounded-xl hover:bg-primary-600 dark:hover:bg-primary-600 transition-all duration-300 group-hover:shadow-lg"
        >
          View Course
          <FaExternalLinkAlt className="ml-2 text-sm opacity-70" />
        </a>
      </div>
    </div>
  );
};

export default RecommendationCard;