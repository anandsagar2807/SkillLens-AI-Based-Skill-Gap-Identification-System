import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaGithub,
    FaLinkedin,
    FaRocket,
    FaChartLine,
    FaLightbulb,
    FaUsers,
    FaGraduationCap,
    FaBriefcase,
    FaShieldAlt,
    FaHeart
} from 'react-icons/fa';

const About = () => {
    const features = [
        {
            icon: FaRocket,
            title: 'AI-Powered Analysis',
            description: 'Our advanced NLP algorithms analyze your resume against job descriptions to identify skill gaps and matches with high accuracy.'
        },
        {
            icon: FaChartLine,
            title: 'Progress Tracking',
            description: 'Track your skill development over time with detailed analytics and visual progress reports.'
        },
        {
            icon: FaLightbulb,
            title: 'Smart Recommendations',
            description: 'Get personalized course and resource recommendations based on your career goals and skill gaps.'
        },
        {
            icon: FaBriefcase,
            title: 'Job Explorer',
            description: 'Discover job opportunities that match your skill set and learn about in-demand skills in your field.'
        },
        {
            icon: FaGraduationCap,
            title: 'Career Roadmaps',
            description: 'Follow structured learning paths designed by industry experts to achieve your dream role.'
        },
        {
            icon: FaUsers,
            title: 'Market Insights',
            description: 'Stay ahead with real-time insights on trending skills, salary benchmarks, and industry demands.'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Users Worldwide' },
        { value: '50K+', label: 'Analyses Completed' },
        { value: '95%', label: 'Accuracy Rate' },
        { value: '500+', label: 'Skills Tracked' }
    ];

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-6 shadow-lg">
                        <span className="text-3xl font-bold text-white">S</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        About <span className="text-transparent bg-clip-text bg-gradient-primary">SkillLens</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Your AI-powered career companion for skill gap analysis, personalized learning paths, and career growth.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                            <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-primary mb-1">
                                {stat.value}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-card p-8 mb-16 text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-white/90 max-w-3xl mx-auto">
                            We believe everyone deserves access to quality career guidance. SkillLens democratizes career development by providing AI-powered tools that help professionals understand their strengths, identify gaps, and chart a clear path to their dream career.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        What We Offer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="text-xl text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                                1
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Your Resume</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Upload your resume in PDF or DOCX format. Our parser extracts your skills and experience.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                                2
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Paste Job Description</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Add the job description you're interested in. Our AI analyzes the required skills.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                                3
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Get Insights & Plan</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Receive a detailed analysis with skill matches, gaps, and personalized learning recommendations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-16 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FaShieldAlt className="text-3xl text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Your Privacy Matters
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We take your privacy seriously. Your resume data is processed securely and never stored permanently. 
                                We don't share your information with third parties. Your career journey is yours alone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Accelerate Your Career?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        Join thousands of professionals who are using SkillLens to reach their career goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/analysis"
                            className="btn-primary inline-flex items-center justify-center"
                        >
                            <FaRocket className="mr-2" />
                            Start Free Analysis
                        </Link>
                        <Link
                            to="/jobs"
                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-md transition-all inline-flex items-center justify-center"
                        >
                            <FaBriefcase className="mr-2" />
                            Explore Jobs
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                        Made with <FaHeart className="text-red-500" /> by SkillLens Team
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <FaGithub className="text-xl" />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <FaLinkedin className="text-xl" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;