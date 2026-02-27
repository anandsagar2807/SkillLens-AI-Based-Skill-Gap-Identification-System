import React, { useState } from 'react';
import {
    FaFileAlt,
    FaDownload,
    FaTrash,
    FaSearch,
    FaFilter,
    FaCalendar,
    FaBriefcase,
    FaChartPie,
    FaEye
} from 'react-icons/fa';
import { savedReports } from '../data/mockData';

const Reports = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');

    const reportTypes = ['All', 'Analysis', 'Comparison', 'Progress'];

    const filteredReports = savedReports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || report.type === selectedType;
        return matchesSearch && matchesType;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'Analysis':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'Comparison':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            case 'Progress':
                return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const getMatchColor = (match) => {
        if (match >= 80) return 'text-green-600 dark:text-green-400';
        if (match >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Saved Reports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        View and manage your skill analysis reports
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <FaFileAlt className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{savedReports.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                <FaChartPie className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Match</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {Math.round(savedReports.reduce((acc, r) => acc + r.matchPercentage, 0) / savedReports.length)}%
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                <FaBriefcase className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Companies</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {new Set(savedReports.map(r => r.company)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                                <FaCalendar className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {savedReports.filter(r => {
                                        const date = new Date(r.date);
                                        const now = new Date();
                                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            {reportTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedType === type
                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Reports Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Report
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Company
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Type
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Match
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Date
                                    </th>
                                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FaFileAlt className="text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{report.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{report.jobTitle}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-600 dark:text-gray-300">{report.company}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${report.matchPercentage >= 80 ? 'bg-green-500' :
                                                                report.matchPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${report.matchPercentage}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-semibold ${getMatchColor(report.matchPercentage)}`}>
                                                    {report.matchPercentage}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{report.date}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors" title="View">
                                                    <FaEye />
                                                </button>
                                                <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="Download">
                                                    <FaDownload />
                                                </button>
                                                <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* No Results */}
                    {filteredReports.length === 0 && (
                        <div className="text-center py-16">
                            <FaFileAlt className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                No reports found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;