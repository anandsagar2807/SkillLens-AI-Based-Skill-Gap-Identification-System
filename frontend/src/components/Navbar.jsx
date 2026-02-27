import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaCode, 
  FaHome, 
  FaChartBar, 
  FaBriefcase, 
  FaRoad, 
  FaLightbulb, 
  FaFileAlt, 
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaRocket,
  FaSun,
  FaMoon
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/dashboard', label: 'Dashboard', icon: FaChartBar },
    { path: '/analysis', label: 'Analysis', icon: FaChartBar },
    { path: '/jobs', label: 'Jobs', icon: FaBriefcase },
    { path: '/roadmap', label: 'Roadmap', icon: FaRoad },
    { path: '/insights', label: 'Insights', icon: FaLightbulb },
    { path: '/reports', label: 'Reports', icon: FaFileAlt },
    { path: '/about', label: 'About', icon: FaInfoCircle },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left Corner */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
              <FaCode className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-gradient">SkillLens</span>
          </Link>
          
          {/* Desktop Navigation Links - Center */}
          <div className="hidden xl:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive(item.path) 
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Right side - Desktop */}
          <div className="hidden xl:flex items-center space-x-4 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-xl text-yellow-500" />
              ) : (
                <FaMoon className="text-xl text-primary-500" />
              )}
            </button>
            
            {/* CTA Button - Right Corner */}
            <Link
              to="/analysis"
              className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-base"
            >
              <FaRocket className="mr-2" />
              Start Analysis
            </Link>
          </div>
          
          {/* Mobile menu buttons */}
          <div className="flex xl:hidden items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-xl text-yellow-500" />
              ) : (
                <FaMoon className="text-xl text-primary-500" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-lg animate-fadeIn">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive(item.path) 
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Mobile CTA */}
            <Link
              to="/analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 mt-4 w-full px-4 py-4 bg-gradient-primary text-white font-semibold rounded-xl shadow-lg text-base"
            >
              <FaRocket />
              <span>Start Analysis</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;