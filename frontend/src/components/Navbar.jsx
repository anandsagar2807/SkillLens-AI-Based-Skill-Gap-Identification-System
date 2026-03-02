import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaStar,
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
  FaMoon,
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/70 bg-gradient-to-r from-white/95 via-indigo-50/60 to-white/95 shadow-[0_14px_48px_rgba(30,64,175,0.13)] backdrop-blur-xl transition-colors duration-300 dark:border-gray-800 dark:from-gray-900/95 dark:via-indigo-950/30 dark:to-gray-900/95">
      <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="group flex flex-shrink-0 items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#06b6d4] p-[2px] shadow-[0_16px_38px_rgba(37,99,235,0.36)] transition-all duration-300 group-hover:scale-[1.06] group-hover:shadow-[0_22px_46px_rgba(14,165,233,0.5)] dark:shadow-[0_16px_38px_rgba(37,99,235,0.5)] dark:ring-2 dark:ring-cyan-400/30">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-[#020617] via-[#0f274f] to-[#0c4a6e] dark:from-[#1e3a5f] dark:via-[#1d4ed8] dark:to-[#0891b2]">
                <div className="absolute h-11 w-11 rounded-full border border-sky-200/35 animate-[spin_11s_linear_infinite] dark:border-sky-300/50" />
                <div className="absolute h-7 w-7 rounded-full border border-dashed border-cyan-200/70 animate-[spin_5.2s_linear_infinite_reverse] dark:border-cyan-300/80" />
                <div className="absolute -top-0.5 h-6 w-10 rounded-b-full border-b-2 border-cyan-200/60 dark:border-cyan-300/70" />
                <div className="absolute bottom-[13px] h-[11px] w-[20px] rounded-md bg-white/90 dark:bg-white" />
                <div className="absolute bottom-[23px] h-[6px] w-[10px] rounded-t-sm bg-cyan-200/95 dark:bg-cyan-300" />
                <FaBriefcase className="relative z-10 mt-2 text-[11px] text-sky-900 dark:text-sky-100" />
                <FaStar className="absolute top-1.5 right-1.5 text-[8px] text-cyan-100/95 animate-pulse dark:text-yellow-300" />
              </div>
            </div>
            <span className="text-[2.05rem] font-extrabold tracking-tight leading-none">
              <span className="text-slate-900 dark:text-slate-100">Skill</span>
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-300 dark:via-violet-300 dark:to-fuchsia-300">Lens</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
            <div className="flex items-center gap-1 rounded-[1.35rem] border border-gray-200/90 bg-gray-100/85 p-1.5 shadow-inner shadow-white/60 dark:border-gray-700 dark:bg-gray-800/80 dark:shadow-none">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-violet-400/35'
                        : 'text-gray-600 hover:bg-white hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700/80 dark:hover:text-indigo-300'
                    }`}
                  >
                    <Icon className="text-xs" />
                    <span className="leading-none">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden flex-shrink-0 items-center gap-4 xl:flex">
            <button
              onClick={toggleDarkMode}
              className="rounded-2xl border border-gray-200 bg-gray-100/90 p-3.5 text-gray-600 shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <FaSun className="text-xl text-amber-400" />
              ) : (
                <FaMoon className="text-xl text-indigo-500" />
              )}
            </button>

            <Link
              to="/analysis"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <FaRocket className="text-base" />
              Start Analysis
            </Link>
          </div>

          <div className="flex items-center gap-3 xl:hidden">
            <button
              onClick={toggleDarkMode}
              className="rounded-xl bg-gray-100 p-2.5 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="text-xl text-amber-400" /> : <FaMoon className="text-xl text-indigo-500" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900 xl:hidden">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="text-base" />
                  {item.label}
                </Link>
              );
            })}

            <Link
              to="/analysis"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 font-semibold text-white"
            >
              <FaRocket />
              Start Analysis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;