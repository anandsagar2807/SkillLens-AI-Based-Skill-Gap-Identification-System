import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaGithub,
    FaLinkedin,
    FaRocket,
    FaBriefcase,
    FaHeart,
    FaCode,
    FaLaptopCode,
    FaServer,
    FaRobot,
    FaComments,
    FaStar,
    FaUsers,
    FaCrown,
    FaLightbulb,
    FaGem
} from 'react-icons/fa';

const About = () => {
    const teamMembers = [
        {
            name: 'G.Anand Sagar',
            initials: 'ASG',
            emoji: '👨‍💻',
            role: 'Full Stack Developer',
            bio: 'Passionate about building scalable web applications and AI-driven solutions.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-blue-500 to-cyan-500',
            isLead: true
        },
        {
            name: 'E.Akhilesh',
            initials: 'EA',
            emoji: '🎨',
            role: 'Full Stack Developer',
            bio: 'Expert in frontend technologies and creating seamless user experiences.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-purple-500 to-pink-500',
            isLead: false
        },
        {
            name: 'G.Bhoomesh',
            initials: 'GB',
            emoji: '⚙️',
            role: 'Full Stack Developer',
            bio: 'Specialized in backend systems and cloud infrastructure.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-orange-500 to-red-500',
            isLead: false
        },
        {
            name: 'T.Shanker Singh',
            initials: 'TSS',
            emoji: '🗄️',
            role: 'Full Stack Developer',
            bio: 'Focused on database architecture and API development.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-green-500 to-teal-500',
            isLead: false
        }
    ];

    const skills = [
        { icon: FaCode, label: 'Frontend', items: ['React', 'Vue', 'TypeScript'] },
        { icon: FaServer, label: 'Backend', items: ['Node.js', 'Python', 'FastAPI'] },
        { icon: FaLaptopCode, label: 'DevOps', items: ['Docker', 'AWS', 'CI/CD'] },
        { icon: FaRobot, label: 'AI Chatbot', items: ['GPT Integration', 'NLP', 'Career Guidance'] }
    ];

    return (
        <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400/10 dark:bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-400/5 dark:bg-accent-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-16 pt-8">
                    {/* Simple Header */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Meet our Team
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        A dedicated team of developers committed to transforming how professionals navigate their career paths.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {teamMembers.map((member, index) => (
                        <div key={index} className={`group relative ${member.isLead ? 'lg:scale-105 z-10' : ''}`}>
                            {/* Card */}
                            <div className={`relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] ${member.isLead ? 'ring-2 ring-amber-400/50 dark:ring-amber-500/50' : ''}`}>
                                {/* Emoji Icon Above Avatar */}
                                <div className="text-center mb-3">
                                    <span className={`inline-block ${member.isLead ? 'text-5xl' : 'text-4xl'} transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                                        {member.emoji}
                                    </span>
                                </div>

                                {/* Avatar */}
                                <div className="relative mb-6">
                                    <div className={`${member.isLead ? 'w-36 h-36' : 'w-28 h-28'} mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white ${member.isLead ? 'text-4xl' : 'text-3xl'} font-bold shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        {member.initials}
                                    </div>
                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-1/2 transform translate-x-8 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                                    
                                    {/* Star decoration for lead */}
                                    {member.isLead && (
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <FaStar className="text-white text-sm" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <h3 className={`font-bold text-gray-900 dark:text-white mb-2 ${member.isLead ? 'text-2xl' : 'text-xl'}`}>
                                        {member.name}
                                    </h3>
                                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r ${member.color} text-white text-sm font-medium mb-4 shadow-md`}>
                                        <FaCode className="mr-2" />
                                        {member.role}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                        {member.bio}
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="flex items-center justify-center gap-4">
                                    <a
                                        href={member.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${member.isLead ? 'w-12 h-12' : 'w-11 h-11'} bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 dark:hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6`}
                                    >
                                        <FaGithub className={`${member.isLead ? 'text-xl' : 'text-lg'}`} />
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${member.isLead ? 'w-12 h-12' : 'w-11 h-11'} bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6`}
                                    >
                                        <FaLinkedin className={`${member.isLead ? 'text-xl' : 'text-lg'}`} />
                                    </a>
                                </div>

                                {/* Decorative Corner */}
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${member.color} opacity-10 rounded-tr-3xl rounded-bl-full`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">Tech Stack</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {skills.map((skill, index) => {
                            const Icon = skill.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="text-xl" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{skill.label}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skill.items.map((item, idx) => (
                                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AI Chatbot Features Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">AI-Assisted Job Chatbot</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Our intelligent chatbot is here to guide you through your career journey with personalized assistance.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white mb-4">
                                <FaRobot className="text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">Smart Career Guidance</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Get personalized career advice based on your skills, experience, and goals. Our AI understands your unique career path.
                            </p>
                        </div>
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white mb-4">
                                <FaComments className="text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">24/7 Chat Assistance</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Ask questions anytime about skill analysis, job recommendations, interview prep, and career roadmaps. Always available to help.
                            </p>
                        </div>
                        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center text-white mb-4">
                                <FaBriefcase className="text-2xl" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">Job Matching</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Describe your ideal job and let our AI find the best matches. Get insights on required skills and how to bridge the gap.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission Banner */}
                <div className="relative mb-20 overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500"></div>
                    <div className="relative px-8 py-12 md:py-16 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                            Empowering professionals worldwide with AI-driven career insights. We believe everyone deserves access to quality career guidance, and we are making that possible through innovative technology.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Transform Your Career?
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who are already using SkillLens to achieve their career goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/analysis"
                            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <FaRocket className="mr-3 group-hover:animate-bounce" />
                            Start Free Analysis
                        </Link>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-300"
                        >
                            <FaBriefcase className="mr-3" />
                            Explore Jobs
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
                    <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                        Made with <FaHeart className="text-red-500 animate-pulse" /> by SkillLens Team
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-900 dark:hover:bg-gray-600 hover:text-white transition-all duration-300"
                        >
                            <FaGithub />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                            <FaLinkedin />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;