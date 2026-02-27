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
    FaDatabase
} from 'react-icons/fa';

const About = () => {
    const teamMembers = [
        {
            name: 'G. Anand Sagar',
            initials: 'GAS',
            role: 'Full Stack Developer',
            bio: 'Passionate about building scalable web applications and AI-driven solutions.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            name: 'E. Akhilesh',
            initials: 'EA',
            role: 'Full Stack Developer',
            bio: 'Expert in frontend technologies and creating seamless user experiences.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-purple-500 to-pink-500'
        },
        {
            name: 'G. Bhoomesh',
            initials: 'GB',
            role: 'Full Stack Developer',
            bio: 'Specialized in backend systems and cloud infrastructure.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-orange-500 to-red-500'
        },
        {
            name: 'T. Shanker Singh',
            initials: 'TSS',
            role: 'Full Stack Developer',
            bio: 'Focused on database architecture and API development.',
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            color: 'from-green-500 to-teal-500'
        }
    ];

    const skills = [
        { icon: FaCode, label: 'Frontend', items: ['React', 'Vue', 'TypeScript'] },
        { icon: FaServer, label: 'Backend', items: ['Node.js', 'Python', 'FastAPI'] },
        { icon: FaDatabase, label: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
        { icon: FaLaptopCode, label: 'DevOps', items: ['Docker', 'AWS', 'CI/CD'] }
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
                <div className="text-center mb-20 pt-8">
                    {/* Logo */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-3xl mb-8 shadow-2xl shadow-primary-500/25 transform hover:scale-105 transition-transform duration-300">
                        <span className="text-4xl font-bold text-white">S</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500">
                            Meet Our Team
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Building AI-powered career solutions with innovation and passion.
                    </p>

                    {/* Decorative Line */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent to-primary-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full"></div>
                        <div className="w-12 h-1 bg-gradient-to-l from-transparent to-secondary-500 rounded-full"></div>
                    </div>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="group relative">
                            {/* Card */}
                            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
                                {/* Gradient Border Effect */}
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`}></div>

                                {/* Avatar */}
                                <div className="relative mb-6">
                                    <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        {member.initials}
                                    </div>
                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-1/2 transform translate-x-8 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"></div>
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-secondary-500 transition-all duration-300">
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
                                        className="w-11 h-11 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 dark:hover:bg-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                                    >
                                        <FaGithub className="text-lg" />
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                                    >
                                        <FaLinkedin className="text-lg" />
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