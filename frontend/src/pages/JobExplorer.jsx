import React, { useState } from 'react';
import {
    FaSearch,
    FaBriefcase,
    FaDollarSign,
    FaChartLine,
    FaFilter
} from 'react-icons/fa';
import { jobRoles } from '../data/mockData';

const JobExplorer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDemand, setSelectedDemand] = useState('All');

    // Get unique categories
    const categories = ['All', ...new Set(jobRoles.map(job => job.category))];

    // Filter jobs
    const filteredJobs = jobRoles.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
        const matchesDemand = selectedDemand === 'All' || job.demand === selectedDemand;
        return matchesSearch && matchesCategory && matchesDemand;
    });

    const getDemandColor = (demand) => {
        switch (demand) {
            case 'High':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'Medium':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            case 'Low':
                return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Job Explorer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Discover job roles and their skill requirements
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search job roles or skills..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="pl-12 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer text-gray-900 dark:text-white"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Demand Filter */}
                        <select
                            value={selectedDemand}
                            onChange={(e) => setSelectedDemand(e.target.value)}
                            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer text-gray-900 dark:text-white"
                        >
                            <option value="All">All Demand</option>
                            <option value="High">High Demand</option>
                            <option value="Medium">Medium Demand</option>
                            <option value="Low">Low Demand</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span> job roles
                    </p>
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {job.title}
                                    </h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                                        {job.category}
                                    </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDemandColor(job.demand)}`}>
                                    {job.demand} Demand
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-sm">
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <FaDollarSign className="mr-1 text-green-500" />
                                    <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <FaChartLine className="mr-1 text-blue-500" />
                                    <span>{job.growth} growth</span>
                                </div>
                            </div>

                            {/* Required Skills */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Required Skills
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {job.requiredSkills.slice(0, 4).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {job.requiredSkills.length > 4 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-xs">
                                            +{job.requiredSkills.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Preferred Skills */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Preferred Skills
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {job.preferredSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredJobs.length === 0 && (
                    <div className="text-center py-16">
                        <FaBriefcase className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No job roles found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobExplorer;