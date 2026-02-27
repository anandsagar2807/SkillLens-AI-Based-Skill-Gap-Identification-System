import React, { useState } from 'react';
import {
    FaLightbulb,
    FaChartLine,
    FaDollarSign,
    FaChartPie,
    FaBriefcase,
    FaArrowUp,
    FaFire
} from 'react-icons/fa';
import { insightsData } from '../data/mockData';

const Insights = () => {
    const [activeTab, setActiveTab] = useState('trending');

    const { trendingSkills, topPayingRoles, skillDemandByCategory } = insightsData;

    const tabs = [
        { id: 'trending', label: 'Trending Skills', icon: FaFire },
        { id: 'salaries', label: 'Top Paying Roles', icon: FaDollarSign },
        { id: 'demand', label: 'Demand Analytics', icon: FaChartPie }
    ];

    const getCategoryColor = (category) => {
        const colors = {
            'AI/ML': 'from-purple-500 to-indigo-600',
            'Cloud': 'from-blue-500 to-cyan-600',
            'DevOps': 'from-green-500 to-emerald-600',
            'Frontend': 'from-orange-500 to-amber-600',
            'Backend': 'from-red-500 to-rose-600',
            'Data': 'from-teal-500 to-cyan-600',
            'Programming': 'from-indigo-500 to-purple-600'
        };
        return colors[category] || 'from-gray-500 to-gray-600';
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Market Insights
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Stay ahead with the latest skill trends and salary insights
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-primary text-white shadow-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <Icon className="text-sm" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Trending Skills Tab */}
                {activeTab === 'trending' && (
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <FaFire className="text-2xl text-orange-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Trending Skills in 2024
                                </h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Skills with the highest growth in job postings
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {trendingSkills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                                                #{index + 1}
                                            </span>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {skill.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-sm font-semibold">
                                            <FaArrowUp className="mr-1 text-xs" />
                                            {skill.growth}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(skill.category)} text-white`}>
                                            {skill.category}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-900 dark:text-white">{skill.jobs.toLocaleString()}</span> open positions
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Paying Roles Tab */}
                {activeTab === 'salaries' && (
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <FaDollarSign className="text-2xl text-green-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Highest Paying Tech Roles
                                </h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Average and top compensation packages in the industry
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {topPayingRoles.map((role, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover relative overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                                >
                                    {/* Rank Badge */}
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-primary flex items-center justify-center rounded-bl-2xl">
                                        <span className="text-white font-bold">#{index + 1}</span>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 pr-10">
                                        {role.role}
                                    </h3>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Average Salary</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{role.avgSalary}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Top Performers</p>
                                            <p className="text-lg font-semibold text-green-600 dark:text-green-400">{role.topSalary}</p>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                role.demand === 'High' 
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                            }`}>
                                                {role.demand} Demand
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Demand Analytics Tab */}
                {activeTab === 'demand' && (
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center gap-3 mb-2">
                                <FaChartPie className="text-2xl text-purple-500" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Skill Demand by Category
                                </h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                Market demand analysis across different technology categories
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {skillDemandByCategory.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {category.category}
                                        </h3>
                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            {category.growth} YoY
                                        </span>
                                    </div>

                                    {/* Demand Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Demand Score</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{category.demand}%</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(category.category)}`}
                                                style={{ width: `${category.demand}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Demand Level Indicator */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Demand Level</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            category.demand >= 85 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : category.demand >= 75 
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                            {category.demand >= 85 ? 'Very High' : category.demand >= 75 ? 'High' : 'Medium'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Stats */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-card p-6 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaChartLine className="text-2xl" />
                                    <span className="font-medium text-white/80">Hottest Category</span>
                                </div>
                                <p className="text-3xl font-bold">AI/ML</p>
                                <p className="text-white/70 text-sm mt-1">+40% growth this year</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-card p-6 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaBriefcase className="text-2xl" />
                                    <span className="font-medium text-white/80">Most Jobs</span>
                                </div>
                                <p className="text-3xl font-bold">Python</p>
                                <p className="text-white/70 text-sm mt-1">150,000+ open positions</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-card p-6 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <FaLightbulb className="text-2xl" />
                                    <span className="font-medium text-white/80">Rising Star</span>
                                </div>
                                <p className="text-3xl font-bold">Gen AI</p>
                                <p className="text-white/70 text-sm mt-1">+156% growth in demand</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Insights;