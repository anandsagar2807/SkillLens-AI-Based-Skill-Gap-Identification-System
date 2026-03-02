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
    FaFilter,
    FaTrophy,
    FaFire,
    FaStar,
    FaRocket,
    FaBolt,
    FaMedal,
    FaCrown,
    FaGem,
    FaAward
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
    Area,
    Treemap,
    ComposedChart,
    ScatterChart,
    Scatter,
    ZAxis
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

                {/* Unified DevSkillsMatch Dashboard */}
                {analyses.length > 0 && (
                    <div className="mb-8">
                        {/* DevSkillsMatch Hero Header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 mb-6 shadow-2xl">
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
                            </div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                    {/* Left: Title & Stats */}
                                    <div className="text-center lg:text-left">
                                        <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                                            <FaGem className="text-3xl text-cyan-300" />
                                            <h2 className="text-3xl lg:text-4xl font-bold text-white">
                                                DevSkillsMatch Dashboard
                                            </h2>
                                        </div>
                                        <p className="text-white/80 text-lg mb-6">
                                            Your comprehensive skill matching analytics at a glance
                                        </p>
                                        
                                        {/* Quick Stats */}
                                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/30">
                                                <div className="flex items-center gap-2">
                                                    <FaTrophy className="text-yellow-300" />
                                                    <span className="text-white font-semibold">{avgMatch}%</span>
                                                    <span className="text-white/70 text-sm">Avg Match</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/30">
                                                <div className="flex items-center gap-2">
                                                    <FaFire className="text-orange-300" />
                                                    <span className="text-white font-semibold">{totalReports}</span>
                                                    <span className="text-white/70 text-sm">Analyses</span>
                                                </div>
                                            </div>
                                            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/30">
                                                <div className="flex items-center gap-2">
                                                    <FaStar className="text-pink-300" />
                                                    <span className="text-white font-semibold">{topSkillsData.length}</span>
                                                    <span className="text-white/70 text-sm">Top Skills</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Right: Central Score Ring */}
                                    <div className="relative">
                                        <div className="w-48 h-48 relative">
                                            {/* Outer Glow Ring */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 blur-xl opacity-50 animate-pulse"></div>
                                            
                                            {/* Progress Ring */}
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.1)"
                                                    strokeWidth="8"
                                                />
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="45"
                                                    fill="none"
                                                    stroke="url(#scoreGradient)"
                                                    strokeWidth="8"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(avgMatch / 100) * 283} 283`}
                                                    className="transition-all duration-1000"
                                                />
                                                <defs>
                                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#22d3ee" />
                                                        <stop offset="50%" stopColor="#a855f7" />
                                                        <stop offset="100%" stopColor="#ec4899" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            
                                            {/* Center Content */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-5xl font-bold text-white">{avgMatch}</span>
                                                <span className="text-white/70 text-sm">Match Score</span>
                                            </div>
                                        </div>
                                        
                                        {/* Floating Badges */}
                                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full p-2 shadow-lg animate-bounce">
                                            <FaMedal className="text-white text-lg" />
                                        </div>
                                        <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg animate-bounce delay-500">
                                            <FaCrown className="text-white text-lg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Dashboard Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Match Categories & Distribution */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Match Categories (Pie) */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                                <FaChartPie className="text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Match Categories</h3>
                                        </div>
                                        
                                        {pieData.length > 0 ? (
                                            <div className="relative">
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={45}
                                                            outerRadius={75}
                                                            paddingAngle={4}
                                                            dataKey="value"
                                                            animationBegin={0}
                                                            animationDuration={1000}
                                                        >
                                                            {pieData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={2} stroke="white" />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<CustomTooltip />} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                
                                                {/* Legend */}
                                                <div className="flex flex-wrap gap-3 justify-center mt-2">
                                                    {pieData.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                            <span className="text-xs text-gray-600 dark:text-gray-300">{item.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-[200px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                No data to display
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Score Distribution */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                <FaChartBar className="text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Score Distribution</h3>
                                        </div>
                                        
                                        <ResponsiveContainer width="100%" height={180}>
                                            <BarChart data={matchDistributionData} barCategoryGap="15%">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                                <XAxis dataKey="range" stroke="#9ca3af" fontSize={10} tickLine={false} />
                                                <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Bar dataKey="count" name="Reports" radius={[6, 6, 0, 0]} animationDuration={1000}>
                                                    {matchDistributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Center Column: Trend Analysis */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 h-full overflow-hidden relative group">
                                    <div className="absolute top-1/2 right-0 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                                <FaChartLine className="text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Match Trends</h3>
                                        </div>
                                        
                                        {trendData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={350}>
                                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorTrendMatch" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0}/>
                                                        </linearGradient>
                                                        <linearGradient id="colorTrendSkills" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                                                    <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="match"
                                                        stroke="#06b6d4"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorTrendMatch)"
                                                        name="Match %"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="skills"
                                                        stroke="#8b5cf6"
                                                        strokeWidth={3}
                                                        fillOpacity={1}
                                                        fill="url(#colorTrendSkills)"
                                                        name="Skills Count"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-[350px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                No trend data available
                                            </div>
                                        )}
                                        
                                        {/* Trend Indicator */}
                                        <div className="flex items-center justify-center gap-4 mt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                                <span className="text-xs text-gray-600 dark:text-gray-300">Match %</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                <span className="text-xs text-gray-600 dark:text-gray-300">Skills Count</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Top Matched Skills */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 h-full overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                                <FaRocket className="text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Matched Skills</h3>
                                        </div>
                                        
                                        {topSkillsData.length > 0 ? (
                                            <div className="space-y-3">
                                                {topSkillsData.map((skill, index) => {
                                                    const maxCount = topSkillsData[0]?.count || 1;
                                                    const percentage = (skill.count / maxCount) * 100;
                                                    const colors = [
                                                        { from: '#f59e0b', to: '#fbbf24', icon: FaCrown },
                                                        { from: '#9ca3af', to: '#d1d5db', icon: FaMedal },
                                                        { from: '#b45309', to: '#d97706', icon: FaAward },
                                                        { from: '#6366f1', to: '#818cf8', icon: FaStar },
                                                        { from: '#8b5cf6', to: '#a78bfa', icon: FaBolt },
                                                        { from: '#ec4899', to: '#f472b6', icon: FaGem },
                                                        { from: '#10b981', to: '#34d399', icon: FaFire },
                                                        { from: '#06b6d4', to: '#22d3ee', icon: FaTrophy }
                                                    ];
                                                    const colorConfig = colors[index] || colors[3];
                                                    const IconComponent = colorConfig.icon;
                                                    
                                                    return (
                                                        <div key={index} className="group/skill">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <div 
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
                                                                    style={{ background: `linear-gradient(135deg, ${colorConfig.from}, ${colorConfig.to})` }}
                                                                >
                                                                    <IconComponent className="text-white text-sm" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" title={skill.fullSkill}>
                                                                            {skill.fullSkill}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{skill.count}x</span>
                                                                    </div>
                                                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                                                            style={{ 
                                                                                width: `${percentage}%`,
                                                                                background: `linear-gradient(90deg, ${colorConfig.from}, ${colorConfig.to})`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="h-[350px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                No skills data yet
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats Banner */}
                        <div className="mt-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 rounded-2xl p-6 relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-0 left-1/4 w-2 h-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"></div>
                                <div className="absolute top-0 right-1/3 w-2 h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"></div>
                            </div>
                            
                            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                                        <FaBolt className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm">Your Skill Journey</p>
                                        <p className="text-white font-bold text-lg">
                                            {analyses.filter(r => (r.match_percentage || 0) >= 70).length} High Matches • {' '}
                                            {topSkillsData.reduce((acc, s) => acc + s.count, 0)} Total Skill Matches
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                            {analyses.filter(r => (r.match_percentage || 0) >= 70).length}
                                        </p>
                                        <p className="text-white/60 text-xs">Excellent Matches</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/20"></div>
                                    <div className="text-center">
                                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                            {topSkillsData.length > 0 ? topSkillsData[0]?.fullSkill : 'N/A'}
                                        </p>
                                        <p className="text-white/60 text-xs">Top Skill</p>
                                    </div>
                                </div>
                            </div>
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