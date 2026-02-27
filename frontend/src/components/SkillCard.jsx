import React from 'react';
import { FaCheck, FaTimes, FaStar } from 'react-icons/fa';

const SkillCard = ({ title, skills, type = 'matched', icon: Icon }) => {
  const isMatched = type === 'matched';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isMatched ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {isMatched ? (
              <FaCheck className="text-green-600 dark:text-green-400" />
            ) : (
              <FaTimes className="text-red-600 dark:text-red-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{skills.length} skills</p>
          </div>
        </div>
      </div>
      
      {/* Skills list */}
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className={`skill-tag ${isMatched ? 'skill-tag-matched' : 'skill-tag-missing'}`}
            >
              {isMatched ? (
                <FaCheck className="w-3 h-3 mr-1" />
              ) : (
                <FaTimes className="w-3 h-3 mr-1" />
              )}
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm italic">
            {isMatched ? 'No matched skills found' : 'No missing skills!'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillCard;