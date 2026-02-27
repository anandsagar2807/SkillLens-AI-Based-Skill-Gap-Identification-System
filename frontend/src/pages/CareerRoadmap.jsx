import React, { useState } from 'react';
import {
    FaRoad,
    FaChevronDown,
    FaChevronUp,
    FaClock,
    FaBook,
    FaLightbulb,
    FaCheckCircle
} from 'react-icons/fa';
import { careerRoadmaps } from '../data/mockData';

const CareerRoadmap = () => {
    const [selectedRoadmap, setSelectedRoadmap] = useState(careerRoadmaps[0]);
    const [expandedStep, setExpandedStep] = useState(null);

    const toggleStep = (order) => {
        setExpandedStep(expandedStep === order ? null : order);
    };

    return (
        <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Career Roadmap
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Step-by-step learning paths to achieve your career goals
                    </p>
                </div>

                {/* Role Selector */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 mb-10 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                        Select Your Target Role
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {careerRoadmaps.map((roadmap) => (
                            <button
                                key={roadmap.id}
                                onClick={() => {
                                    setSelectedRoadmap(roadmap);
                                    setExpandedStep(null);
                                }}
                                className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                                    selectedRoadmap.id === roadmap.id
                                        ? 'bg-gradient-primary text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {roadmap.role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Roadmap Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full font-medium">
                        <FaRoad className="mr-2" />
                        {selectedRoadmap.role} Path
                    </div>
                </div>

                {/* Vertical Timeline */}
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-purple-500 to-secondary-500 hidden md:block" />

                    {/* Steps */}
                    <div className="space-y-6">
                        {selectedRoadmap.steps.map((step, index) => (
                            <div
                                key={step.order}
                                className={`relative pl-0 md:pl-20 transition-all duration-300 ${
                                    expandedStep === step.order ? 'z-10' : ''
                                }`}
                            >
                                {/* Timeline Node */}
                                <div className="absolute left-5 w-6 h-6 bg-white dark:bg-gray-800 border-4 border-primary-500 rounded-full hidden md:flex items-center justify-center z-10">
                                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                                        {step.order}
                                    </span>
                                </div>

                                {/* Step Card */}
                                <div
                                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 cursor-pointer transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
                                        expandedStep === step.order
                                            ? 'ring-2 ring-primary-500 shadow-xl'
                                            : 'hover:shadow-lg'
                                    }`}
                                    onClick={() => toggleStep(step.order)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            {/* Mobile Step Number */}
                                            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 md:hidden">
                                                {step.order}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="hidden sm:inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                                <FaClock className="mr-1.5 text-xs" />
                                                {step.duration}
                                            </span>
                                            {expandedStep === step.order ? (
                                                <FaChevronUp className="text-gray-400 dark:text-gray-500" />
                                            ) : (
                                                <FaChevronDown className="text-gray-400 dark:text-gray-500" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedStep === step.order && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                                            {/* Skills */}
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                    <FaLightbulb className="text-yellow-500" />
                                                    Skills to Learn
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {step.skills.map((skill, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium border border-primary-100 dark:border-primary-800"
                                                        >
                                                            <FaCheckCircle className="mr-1.5 text-xs text-green-500" />
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Resources */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                    <FaBook className="text-blue-500" />
                                                    Recommended Resources
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {step.resources.map((resource, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <div className="w-2 h-2 bg-primary-500 rounded-full" />
                                                            {resource}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mobile Duration */}
                                            <div className="mt-4 sm:hidden">
                                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                                                    <FaClock className="mr-1.5 text-xs" />
                                                    {step.duration}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="mt-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl shadow-card p-6 text-white">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-2">
                            Ready to Start Your Journey?
                        </h3>
                        <p className="text-white/80 mb-4">
                            Total estimated time: {selectedRoadmap.steps.reduce((acc, step) => {
                                const months = step.duration.match(/(\d+)-?(\d+)?/);
                                if (months) {
                                    return acc + (parseInt(months[2]) || parseInt(months[1]));
                                }
                                return acc;
                            }, 0)} months
                        </p>
                        <p className="text-sm text-white/70">
                            Click on each step to explore resources and skills to learn
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CareerRoadmap;