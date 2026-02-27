import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, 
  FaChartLine, 
  FaGraduationCap, 
  FaFileAlt, 
  FaSearch, 
  FaLightbulb,
  FaArrowRight,
  FaCheck,
  FaStar
} from 'react-icons/fa';

const Landing = () => {
  const features = [
    {
      icon: FaFileAlt,
      title: 'Resume Analysis',
      description: 'Upload your resume in PDF or DOCX format and let our AI extract your skills automatically.',
    },
    {
      icon: FaSearch,
      title: 'Skill Gap Detection',
      description: 'Compare your skills against job descriptions to identify what\'s missing from your profile.',
    },
    {
      icon: FaChartLine,
      title: 'Match Classification',
      description: 'Get a clear classification of how well you match the job requirements.',
    },
    {
      icon: FaGraduationCap,
      title: 'Course Recommendations',
      description: 'Receive personalized course suggestions to fill your skill gaps effectively.',
    },
  ];

  const stats = [
    { value: '150+', label: 'Skills Recognized' },
    { value: '40+', label: 'Courses Database' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Available' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      content: 'SkillLens helped me identify exactly what skills I needed to land my dream job. The course recommendations were spot-on!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Data Analyst',
      content: 'The AI-powered analysis is incredibly accurate. I was able to focus my learning on the right skills.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      content: 'Finally, a tool that tells me exactly what I need to learn. No more guessing about skill gaps.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 font-medium text-sm mb-8 border border-primary-100 dark:border-primary-800">
              <FaRocket className="mr-2" />
              AI-Powered Skill Analysis
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              Bridge Your
              <span className="block text-gradient mt-2">Skill Gaps</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
              Analyze your resume against job descriptions using advanced NLP. 
              Identify missing skills and get personalized course recommendations 
              to advance your career.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/analysis"
                className="btn-primary inline-flex items-center text-lg"
              >
                Start Analysis
                <FaArrowRight className="ml-2" />
              </Link>
              <a
                href="#features"
                className="btn-secondary inline-flex items-center text-lg"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-4xl">
              <div className="bg-gradient-primary rounded-2xl p-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-8 transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sample Result Card */}
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center border border-green-100 dark:border-green-800">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">78%</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Skill Match</div>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-900/30 rounded-xl p-4 text-center border border-primary-100 dark:border-primary-800">
                      <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">12</div>
                      <div className="text-sm text-primary-700 dark:text-primary-300">Matched Skills</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 text-center border border-red-100 dark:border-red-800">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">4</div>
                      <div className="text-sm text-red-700 dark:text-red-300">Missing Skills</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-primary-100 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform analyzes your resume and job descriptions 
              to give you actionable insights for career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-slate-50 dark:bg-gray-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple 3-Step Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload Resume', desc: 'Upload your resume in PDF or DOCX format' },
              { step: '2', title: 'Add Job Description', desc: 'Paste the job description you want to match' },
              { step: '3', title: 'Get Insights', desc: 'Receive detailed analysis and recommendations' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 text-center border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.desc}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <FaArrowRight className="text-gray-300 dark:text-gray-600 text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6 card-hover border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Bridge Your Skill Gaps?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Start your analysis today and take the first step towards your dream career.
          </p>
          <Link
            to="/analysis"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
          >
            Start Free Analysis
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 dark:bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <FaRocket className="text-white text-sm" />
              </div>
              <span className="text-lg font-bold text-white">SkillLens</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 SkillLens. AI-Powered Skill Gap Analysis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;