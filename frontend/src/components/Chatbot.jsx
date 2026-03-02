import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaLightbulb, FaBriefcase, FaGraduationCap, FaChartLine, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { sendChatMessage } from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I\'m SkillLens AI Assistant. I can help you with skill analysis, career roadmaps, job recommendations, interview prep, and more. How can I help you today?',
      timestamp: new Date(),
      suggestions: [
        'How does skill analysis work?',
        'Career roadmap guidance',
        'Job recommendations',
        'Interview preparation tips'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick reply suggestions
  const quickReplies = [
    { text: 'How does skill analysis work?', icon: FaChartLine },
    { text: 'Career roadmap guidance', icon: FaGraduationCap },
    { text: 'Job recommendations', icon: FaBriefcase },
    { text: 'Skill improvement tips', icon: FaLightbulb },
  ];

  // Fallback response when API is unavailable
  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('skill') && (message.includes('analysis') || message.includes('work'))) {
      return {
        text: `📊 **Skill Analysis Process:**\n\n1. **Upload Your Resume** - Our AI extracts your skills and experience\n2. **AI Analysis** - We identify your strengths and areas for improvement\n3. **Gap Identification** - Compare your skills against job market demands\n4. **Personalized Recommendations** - Get tailored courses and resources\n\nWould you like to start your skill analysis now?`,
        suggestions: ['Upload my resume', 'What skills are in demand?', 'How accurate is the analysis?']
      };
    }
    
    if (message.includes('career') || message.includes('roadmap')) {
      return {
        text: `🗺️ **Career Roadmap Features:**\n\n• **Personalized Path** - Custom roadmap based on your current skills\n• **Milestone Tracking** - Set and achieve career goals\n• **Skill Milestones** - Know exactly what skills to learn next\n• **Timeline Estimates** - Realistic timeframes for each step\n\nVisit the **Roadmap** page to create your personalized career path!`,
        suggestions: ['Create my roadmap', 'Career path for developers', 'How long to become a senior dev?']
      };
    }
    
    if (message.includes('job') || message.includes('recommend')) {
      return {
        text: `💼 **Job Recommendations:**\n\nOur AI matches your skills with the best job opportunities:\n\n• **Smart Matching** - Skills aligned with job requirements\n• **Market Insights** - Know which skills are in demand\n• **Salary Estimates** - Get realistic salary expectations\n• **Growth Opportunities** - Find roles with career growth\n\nCheck out the **Jobs** page to explore opportunities!`,
        suggestions: ['Find Python developer jobs', 'Remote job opportunities', 'What skills for FAANG?']
      };
    }
    
    if (message.includes('improve') || message.includes('tip') || message.includes('learn')) {
      return {
        text: `💡 **Skill Improvement Tips:**\n\n1. **Practice Daily** - Consistency is key to mastery\n2. **Build Projects** - Apply skills in real-world scenarios\n3. **Get Feedback** - Learn from code reviews and mentors\n4. **Stay Updated** - Follow industry trends and new technologies\n5. **Use Our Resources** - Access curated courses and tutorials\n\nWould you like personalized course recommendations?`,
        suggestions: ['Best Python courses', 'How to learn React?', 'Free coding resources']
      };
    }
    
    if (message.includes('interview')) {
      return {
        text: `🎯 **Interview Preparation:**\n\nI can help you prepare for interviews:\n\n• **Behavioral Questions** - Practice STAR method responses\n• **Technical Questions** - Coding and system design prep\n• **Mock Interviews** - Practice with common questions\n• **Tips & Strategies** - How to stand out from other candidates\n\nWould you like to practice some interview questions?`,
        suggestions: ['Common behavioral questions', 'Technical interview prep', 'Tips for virtual interviews']
      };
    }
    
    if (message.includes('resume') || message.includes('cv')) {
      return {
        text: `📄 **Resume Analysis:**\n\nOur AI can help optimize your resume:\n\n• **ATS Optimization** - Make your resume ATS-friendly\n• **Skill Highlighting** - Emphasize relevant skills\n• **Format Suggestions** - Professional formatting tips\n• **Keyword Analysis** - Include the right keywords\n\nUpload your resume on the **Analysis** page to get started!`,
        suggestions: ['ATS-friendly format tips', 'How to highlight skills?', 'Resume for career change']
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        text: `Hello! 👋 Welcome to SkillLens! I'm here to help you with:\n\n• **Skill Gap Analysis** - Identify your strengths and gaps\n• **Career Roadmaps** - Plan your career path\n• **Job Recommendations** - Find matching jobs\n• **Interview Prep** - Practice questions and tips\n• **Resume Tips** - Optimize your resume\n\nWhat would you like to explore?`,
        suggestions: ['Analyze my skills', 'Create career roadmap', 'Interview preparation']
      };
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return {
        text: `You're welcome! 😊 I'm glad I could help. Feel free to ask if you have any more questions. Good luck with your career journey! 🚀`,
        suggestions: ['Analyze my skills', 'Career roadmap', 'Job recommendations']
      };
    }
    
    return {
      text: `I understand you're asking about "${userMessage}". Here are some topics I can help with:\n\n• **Skill Analysis** - Understand your skill gaps\n• **Career Roadmap** - Plan your career path\n• **Job Recommendations** - Find matching jobs\n• **Interview Prep** - Practice interview questions\n• **Resume Tips** - Optimize your resume\n\nTry asking a specific question!`,
      suggestions: ['How does skill analysis work?', 'Career roadmap guidance', 'Job recommendations', 'Interview preparation tips']
    };
  };

  // Send message to backend API
  const sendMessageToAPI = async (text) => {
    try {
      setConnectionError(false);
      const response = await sendChatMessage(text, sessionId);
      return {
        text: response.response,
        suggestions: response.suggestions || [],
        intent: response.intent,
        entities: response.entities,
        followUp: response.follow_up
      };
    } catch (error) {
      console.error('Chat API error:', error);
      setConnectionError(true);
      return null;
    }
  };

  const handleSendMessage = useCallback(async (text = inputValue) => {
    if (!text.trim()) return;
    
    const userMessage = {
      type: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Try to get response from API
    let botResponse = await sendMessageToAPI(text.trim());
    
    // Fallback to local responses if API fails
    if (!botResponse) {
      await new Promise(resolve => setTimeout(resolve, 800));
      botResponse = getFallbackResponse(text.trim());
    }
    
    setMessages(prev => [...prev, {
      type: 'bot',
      text: botResponse.text,
      timestamp: new Date(),
      suggestions: botResponse.suggestions || [],
      intent: botResponse.intent,
      followUp: botResponse.followUp
    }]);
    setIsTyping(false);
  }, [inputValue, sessionId]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format message text - clean text without markdown styling
  const formatMessage = (text) => {
    if (!text) return text;
    
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold markers, keep text
      .replace(/\*(.*?)\*/g, '$1')       // Remove italic markers, keep text
      .replace(/`(.*?)`/g, '$1')         // Remove code markers, keep text
      .split('\n')
      .join('<br />');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 hover:scale-110'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaComments className="text-white text-xl" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slideUp">
          {/* Header - Compact Design */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaRobot className="text-white text-base" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">SkillLens AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${connectionError ? 'bg-yellow-400' : 'bg-green-400'}`}></span>
                    <p className="text-white/80 text-xs truncate">
                      {connectionError ? 'Offline' : 'Online'}
                    </p>
                  </div>
                </div>
              </div>
              {connectionError && (
                <button 
                  onClick={() => handleSendMessage('retry')}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  title="Retry connection"
                >
                  <FaSync className="text-white/80 text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-100 dark:bg-primary-900/30' 
                    : 'bg-secondary-100 dark:bg-secondary-900/30'
                }`}>
                  {message.type === 'user' ? (
                    <FaUser className="text-primary-600 dark:text-primary-400 text-sm" />
                  ) : (
                    <FaRobot className="text-secondary-600 dark:text-secondary-400 text-sm" />
                  )}
                </div>
                <div className={`max-w-[75%] ${message.type === 'user' ? '' : 'w-full'}`}>
                  <div className={`rounded-2xl px-4 py-2.5 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                  }`}>
                    <p 
                      className="text-sm whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
                    />
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.suggestions.map((suggestion, sIndex) => (
                        <button
                          key={sIndex}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
                  <FaRobot className="text-secondary-600 dark:text-secondary-400 text-sm" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies - Show only at start */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(reply.text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <reply.icon className="text-xs" />
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Connection Error Warning */}
          {connectionError && (
            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-100 dark:border-yellow-800">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-xs">
                <FaExclamationTriangle />
                <span>Using offline mode. Some features may be limited.</span>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;