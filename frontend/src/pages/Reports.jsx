import React, { useState, useMemo } from 'react';
import {
    FaFileAlt,
    FaDownload,
    FaTrash,
    FaSearch,
    FaChartPie,
    FaCalendar,
    FaBriefcase,
    FaEye,
    FaExclamationTriangle,
    FaChartBar,
    FaChartLine,
    FaFilter
} from 'react-icons/fa';
import { useAnalysis } from '../context/AnalysisContext';
import { savePDFReport } from '../services/api';
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
    RadialBarChart,
    RadialBar,
    AreaChart,
    Area
} from 'recharts';

const Reports = () => {
    const { analyses, deleteAnalysis, getAnalysis } = useAnalysis();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewReport, setViewReport] = useState(null);

    const reportTypes = ['All', 'Analysis'];

    const filteredReports = analyses.filter(report => {
        const matchesSearch = (report.job_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (report.company || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || report.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Calculate stats
    const totalReports = analyses.length;
    const avgMatch = analyses.length > 0 
        ? Math.round(analyses.reduce((acc, r) => acc + (r.match_percentage || 0), 0) / analyses.length)
        : 0;
    const uniqueCompanies = new Set(analyses.map(r => r.company).filter(Boolean)).size;
    const thisMonthCount = analyses.filter(r => {
        const date = new Date(r.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    // Chart data - Match Distribution
    const matchDistributionData = useMemo(() => {
        const ranges = {
            '90-100%': 0,
            '70-89%': 0,
            '50-69%': 0,
            '30-49%': 0,
            '0-29%': 0
        };
        
        analyses.forEach(report => {
            const match = report.match_percentage || 0;
            if (match >= 90) ranges['90-100%']++;
            else if (match >= 70) ranges['70-89%']++;
            else if (match >= 50) ranges['50-69%']++;
            else if (match >= 30) ranges['30-49%']++;
            else ranges['0-29%']++;
        });

        return Object.entries(ranges).map(([range, count]) => ({
            range,
            count,
            fill: range === '90-100%' ? '#10b981' :
                  range === '70-89%' ? '#22c55e' :
                  range === '50-69%' ? '#eab308' :
                  range === '30-49%' ? '#f97316' : '#ef4444'
        }));
    }, [analyses]);

    // Skill match trend data (last 7 analyses)
    const trendData = useMemo(() => {
        return analyses.slice(0, 7).reverse().map((report, index) => ({
            name: `#${index + 1}`,
            match: report.match_percentage || 0,
            skills: (report.matched_skills || []).length
        }));
    }, [analyses]);

    // Top skills across all reports
    const topSkillsData = useMemo(() => {
        const skillCounts = {};
        analyses.forEach(report => {
            (report.matched_skills || []).forEach(skill => {
                skillCounts[skill] = (skillCounts[skill] || 0) + 1;
            });
        });
        
        return Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([skill, count]) => ({
                skill: skill.length > 12 ? skill.substring(0, 12) + '...' : skill,
                fullSkill: skill,
                count
            }));
    }, [analyses]);

    // Company analysis data
    const companyData = useMemo(() => {
        const companyCounts = {};
        analyses.forEach(report => {
            const company = report.company || 'Unknown';
            companyCounts[company] = (companyCounts[company] || 0) + 1;
        });
        
        return Object.entries(companyCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([company, count], index) => ({
                company: company.length > 15 ? company.substring(0, 15) + '...' : company,
                fullCompany: company,
                count,
                fill: ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'][index]
            }));
    }, [analyses]);

    // Pie chart data for match categories
    const pieData = useMemo(() => {
        const high = analyses.filter(r => (r.match_percentage || 0) >= 70).length;
        const medium = analyses.filter(r => (r.match_percentage || 0) >= 40 && (r.match_percentage || 0) < 70).length;
        const low = analyses.filter(r => (r.match_percentage || 0) < 40).length;
        
        return [
            { name: 'High Match (70%+)', value: high, color: '#10b981' },
            { name: 'Medium Match (40-69%)', value: medium, color: '#eab308' },
            { name: 'Low Match (<40%)', value: low, color: '#ef4444' }
        ].filter(d => d.value > 0);
    }, [analyses]);

    // Radial bar data for overall stats
    const radialData = [
        { name: 'Match Rate', value: avgMatch, fill: '#6366f1' }
    ];

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

    const handleDelete = (id) => {
        deleteAnalysis(id);
        setDeleteConfirm(null);
    };

    const handleDownload = async (report) => {
        try {
            await savePDFReport({
                matched_skills: report.matched_skills || [],
                missing_skills: report.missing_skills || [],
                match_percentage: report.match_percentage || 0,
                similarity_score: report.similarity_score || 0,
                classification: report.classification || 'Unknown'
            }, report.recommendations || []);
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color || entry.fill }} className="text-sm">
                            {entry.name}: {entry.value}
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
                        Saved Reports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        View and manage your skill analysis reports
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FaFileAlt className="text-white text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Reports</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReports}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FaChartPie className="text-white text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Match</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgMatch}%</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FaBriefcase className="text-white text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Companies</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueCompanies}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                <FaCalendar className="text-white text-lg" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{thisMonthCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                {analyses.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Match Distribution Bar Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Match Score Distribution
                                </h2>
                                <FaChartBar className="text-primary-500" />
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={matchDistributionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="count" name="Reports" radius={[4, 4, 0, 0]}>
                                        {matchDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Match Categories Pie Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Match Categories
                                </h2>
                                <FaChartPie className="text-primary-500" />
                            </div>
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    No data to display
                                </div>
                            )}
                        </div>

                        {/* Match Trend Line Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Match Trend (Recent Analyses)
                                </h2>
                                <FaChartLine className="text-primary-500" />
                            </div>
                            {trendData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorMatch" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="match"
                                            stroke="#6366f1"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorMatch)"
                                            name="Match %"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    No data to display
                                </div>
                            )}
                        </div>

                        {/* Top Skills Bar Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Top Matched Skills
                                </h2>
                                <FaFilter className="text-primary-500" />
                            </div>
                            {topSkillsData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={topSkillsData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis type="number" stroke="#9ca3af" />
                                        <YAxis dataKey="skill" type="category" stroke="#9ca3af" width={80} fontSize={11} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Occurrences" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    No skills data yet
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                        {filteredReports.length > 0 ? (
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
                                                        <p className="font-medium text-gray-900 dark:text-white">{report.job_title || 'Skill Analysis'}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {report.matched_skills?.length || 0} matched skills
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-gray-600 dark:text-gray-300">{report.company || 'Not specified'}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type || 'Analysis')}`}>
                                                    {report.type || 'Analysis'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${(report.match_percentage || 0) >= 80 ? 'bg-green-500' :
                                                                    (report.match_percentage || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${report.match_percentage || 0}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-semibold ${getMatchColor(report.match_percentage || 0)}`}>
                                                        {report.match_percentage || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(report.date).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => setViewReport(report)}
                                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors" 
                                                        title="View"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDownload(report)}
                                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" 
                                                        title="Download"
                                                    >
                                                        <FaDownload />
                                                    </button>
                                                    <button 
                                                        onClick={() => setDeleteConfirm(report.id)}
                                                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" 
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-16">
                                <FaFileAlt className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {analyses.length === 0 ? 'No reports yet' : 'No reports found'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {analyses.length === 0 
                                        ? 'Run an analysis to generate your first report'
                                        : 'Try adjusting your search or filters'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Report</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to delete this report? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Report Modal */}
                {viewReport && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {viewReport.job_title || 'Skill Analysis'}
                                    </h3>
                                    <button
                                        onClick={() => setViewReport(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{viewReport.company || 'Not specified'}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Match Percentage</p>
                                        <p className={`font-semibold ${getMatchColor(viewReport.match_percentage || 0)}`}>
                                            {viewReport.match_percentage || 0}%
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Matched Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(viewReport.matched_skills || []).map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                        {(!viewReport.matched_skills || viewReport.matched_skills.length === 0) && (
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">No matched skills</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Missing Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(viewReport.missing_skills || []).map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                        {(!viewReport.missing_skills || viewReport.missing_skills.length === 0) && (
                                            <span className="text-gray-500 dark:text-gray-400 text-sm">No missing skills</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setViewReport(null)}
                                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDownload(viewReport);
                                            setViewReport(null);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
                                    >
                                        <FaDownload />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;