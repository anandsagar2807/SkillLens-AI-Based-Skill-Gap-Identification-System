import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaChartLine,
    FaCheckCircle,
    FaTimesCircle,
    FaHistory,
    FaArrowRight,
    FaRocket,
    FaBriefcase
} from 'react-icons/fa';
import { dashboardData } from '../data/mockData';

const Dashboard = () => {
    const {
        skillMatchPercentage,
        totalMatchedSkills,
        totalMissingSkills,
        recentAnalyses,
        skillDistribution
    } = dashboardData;

    // Stats cards data
    const stats = [
        {
            title: 'Skill Match',
            value: `${skillMatchPercentage}%`,
            icon: FaChartLine,
            color: 'from-purple-500 to-indigo-600',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Matched Skills',
            value: totalMatchedSkills,
            icon: FaCheckCircle,
            color: 'from-green-500 to-emerald-600',
            bgLight: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Missing Skills',
            value: totalMissingSkills,
            icon: FaTimesCircle,
            color: 'from-red-500 to-rose-600',
            bgLight: 'bg-red-50',
            textColor: 'text-red-600'
        },
        {
            title: 'Analyses Done',
            value: recentAnalyses.length,
            icon: FaHistory,
            color: 'from-blue-500 to-cyan-600',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600'
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Overview of your skill analysis and progress
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="text-white text-xl" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skill Distribution Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Skill Proficiency
                        </h2>
                        <div className="space-y-4">
                            {skillDistribution.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {skill.name}
                                        </span>
                                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                            {skill.level}%
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <Link
                                to="/analysis"
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white group hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <FaRocket className="text-lg" />
                                    <span className="font-medium">New Analysis</span>
                                </div>
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/jobs"
                                className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 group hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <FaBriefcase className="text-lg text-primary-600 dark:text-primary-400" />
                                    <span className="font-medium">Explore Jobs</span>
                                </div>
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-gray-400 dark:text-gray-500" />
                            </Link>
                        </div>

                        {/* Overall Progress */}
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Overall Progress
                                </span>
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                    {skillMatchPercentage}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                                    style={{ width: `${skillMatchPercentage}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                You're making great progress! Keep learning to improve your match rate.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Analyses */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Analyses
                        </h2>
                        <Link
                            to="/reports"
                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                        >
                            View All
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Job Title
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Company
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Match %
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAnalyses.map((analysis) => (
                                    <tr
                                        key={analysis.id}
                                        className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {analysis.jobTitle}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                                            {analysis.company}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${analysis.matchPercentage >= 70
                                                                ? 'bg-green-500'
                                                                : analysis.matchPercentage >= 50
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${analysis.matchPercentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {analysis.matchPercentage}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${analysis.status === 'High Match'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                    : analysis.status === 'Medium Match' || analysis.status === 'Moderate Match'
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                }`}>
                                                {analysis.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                                            {analysis.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;