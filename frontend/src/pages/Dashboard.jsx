import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaChartLine,
    FaCheckCircle,
    FaTimesCircle,
    FaHistory,
    FaArrowRight,
    FaRocket,
    FaBriefcase,
    FaFileAlt,
    FaUsers,
    FaTrophy,
    FaDatabase
} from 'react-icons/fa';
import { useAnalysis } from '../context/AnalysisContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
    Area,
    AreaChart
} from 'recharts';

const Dashboard = () => {
    const { getDashboardStats, analyses } = useAnalysis();
    const [animatedStats, setAnimatedStats] = useState({
        users: 0,
        analyses: 0,
        accuracy: 0,
        skills: 0
    });

    // Target stats (these could come from an API)
    const targetStats = {
        users: 10847,
        analyses: 52439,
        accuracy: 95,
        skills: 523
    };

    const {
        skillMatchPercentage,
        totalMatchedSkills,
        totalMissingSkills,
        recentAnalyses,
        skillDistribution
    } = getDashboardStats();

    // Animate counter on mount
    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setAnimatedStats({
                users: Math.floor(targetStats.users * easeOut),
                analyses: Math.floor(targetStats.analyses * easeOut),
                accuracy: Math.floor(targetStats.accuracy * easeOut),
                skills: Math.floor(targetStats.skills * easeOut)
            });

            if (step >= steps) {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    // Stats cards data
    const stats = [
        {
            title: 'Skill Match',
            value: analyses.length > 0 ? `${skillMatchPercentage}%` : '0%',
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
            value: analyses.length,
            icon: FaHistory,
            color: 'from-blue-500 to-cyan-600',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600'
        }
    ];

    // Platform stats for charts
    const platformStats = [
        {
            title: 'Users Worldwide',
            value: animatedStats.users.toLocaleString() + '+',
            icon: FaUsers,
            color: 'from-blue-500 to-cyan-500',
            change: '+12%'
        },
        {
            title: 'Analyses Completed',
            value: animatedStats.analyses.toLocaleString() + '+',
            icon: FaTrophy,
            color: 'from-purple-500 to-pink-500',
            change: '+8%'
        },
        {
            title: 'Accuracy Rate',
            value: animatedStats.accuracy + '%',
            icon: FaChartLine,
            color: 'from-green-500 to-emerald-500',
            change: '+2%'
        },
        {
            title: 'Skills Tracked',
            value: animatedStats.skills + '+',
            icon: FaDatabase,
            color: 'from-orange-500 to-red-500',
            change: '+15%'
        }
    ];

    // Chart data
    const monthlyData = [
        { month: 'Jan', analyses: 4200, users: 1200 },
        { month: 'Feb', analyses: 5100, users: 1500 },
        { month: 'Mar', analyses: 6800, users: 1800 },
        { month: 'Apr', analyses: 7500, users: 2100 },
        { month: 'May', analyses: 8200, users: 2400 },
        { month: 'Jun', analyses: 9100, users: 2800 },
        { month: 'Jul', analyses: 10500, users: 3200 }
    ];

    const skillCategoryData = [
        { name: 'Frontend', value: 35, color: '#6366f1' },
        { name: 'Backend', value: 28, color: '#8b5cf6' },
        { name: 'Database', value: 18, color: '#a855f7' },
        { name: 'DevOps', value: 12, color: '#d946ef' },
        { name: 'Others', value: 7, color: '#ec4899' }
    ];

    const matchDistributionData = [
        { range: '90-100%', count: 1200, fill: '#10b981' },
        { range: '70-89%', count: 2800, fill: '#22c55e' },
        { range: '50-69%', count: 3500, fill: '#eab308' },
        { range: '30-49%', count: 2100, fill: '#f97316' },
        { range: '0-29%', count: 800, fill: '#ef4444' }
    ];

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Overview of your skill analysis and platform statistics
                    </p>
                </div>

                {/* Platform Statistics */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Platform Statistics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {platformStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}></div>
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                                <Icon className="text-white text-lg" />
                                            </div>
                                            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                                {stat.change}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {stat.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Personal Stats Cards */}
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

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Monthly Trends Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Platform Growth Trends
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="analyses"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorAnalyses)"
                                    name="Analyses"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                    name="New Users"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Skill Category Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Skill Category Distribution
                        </h2>
                        <div className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={skillCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {skillCategoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Match Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        Match Score Distribution (All Users)
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={matchDistributionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="range" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Users" radius={[4, 4, 0, 0]}>
                                {matchDistributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skill Distribution Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Your Skill Proficiency
                        </h2>
                        {skillDistribution.length > 0 ? (
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
                        ) : (
                            <div className="text-center py-12">
                                <FaFileAlt className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No skill data yet. Run an analysis to see your skill proficiency.
                                </p>
                                <Link
                                    to="/analysis"
                                    className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700"
                                >
                                    Start Analysis <FaArrowRight className="ml-2 text-sm" />
                                </Link>
                            </div>
                        )}
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
                                {analyses.length > 0 
                                    ? "You're making great progress! Keep learning to improve your match rate."
                                    : "Complete an analysis to track your progress."}
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

                    {recentAnalyses.length > 0 ? (
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
                    ) : (
                        <div className="text-center py-12">
                            <FaFileAlt className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No analyses yet. Start by analyzing your resume against a job description.
                            </p>
                            <Link
                                to="/analysis"
                                className="btn-primary inline-flex items-center"
                            >
                                <FaRocket className="mr-2" />
                                Start Analysis
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;