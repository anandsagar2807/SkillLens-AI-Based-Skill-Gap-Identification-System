"""
AI Chat Service
Advanced chatbot service with NLP capabilities, context awareness,
and comprehensive career guidance knowledge base
"""

import json
import re
from typing import Dict, List, Optional, Tuple
from pathlib import Path
from collections import defaultdict
import random


class ChatService:
    """Advanced AI Chat Service for career guidance"""
    
    def __init__(self):
        """Initialize chat service with knowledge base"""
        self.knowledge_base = self._load_knowledge_base()
        self.context_memory = defaultdict(list)
        self.conversation_states = {}
        
        # Intent patterns for understanding user queries
        self.intent_patterns = {
            'skill_analysis': [
                r'(skill|skills).*(analysis|analyze|check|assess|evaluat)',
                r'(how.*analysis.*work|what.*analysis)',
                r'(upload|resume|cv).*(analysis|check|review)',
                r'(identify|find|detect).*skill.*gap',
                r'gap.*(analysis|identification|find)',
            ],
            'career_roadmap': [
                r'(career|job).*(roadmap|path|plan|journey)',
                r'(roadmap|path).*(career|future|goal)',
                r'(how.*reach|achieve).*(career|job|position|role)',
                r'(career.*transition|switch.*career|change.*career)',
                r'(step|steps).*(become|career|developer|engineer)',
            ],
            'job_recommendation': [
                r'(job|jobs).*(recommend|match|suitable|fit)',
                r'(find|search|look).*(job|opportunity)',
                r'(what.*job|which.*job).*(fit|suit|match)',
                r'(job.*market|market.*trend|hiring)',
                r'(salary|compensation|pay).*range',
            ],
            'skill_improvement': [
                r'(improve|enhance|develop|boost).*(skill|skills)',
                r'(learn|study|master).*(skill|technology|programming)',
                r'(resource|course|tutorial|book).*learn',
                r'(tip|advice|suggestion).*(skill|learning|improve)',
                r'(how.*learn|best.*way.*learn)',
            ],
            'resume_help': [
                r'(resume|cv).*(help|review|improve|optimize)',
                r'(improve|optimize|enhance).*(resume|cv)',
                r'(ats|applicant.*track).*(resume|cv)',
                r'(resume|cv).*(format|template|structure)',
                r'(highlight|showcase).*(skill|experience).*resume',
            ],
            'interview_prep': [
                r'(interview).*(prepare|preparation|tip|help)',
                r'(prepare|ready).*(interview)',
                r'(common|frequent).*interview.*question',
                r'(how.*crack|pass|clear).*interview',
                r'(interview).*(tip|advice|guidance)',
            ],
            'salary_negotiation': [
                r'(salary|compensation|pay).*(negotiate|negotiation)',
                r'(negotiate|ask).*(salary|raise|hike)',
                r'(how.*much).*(earn|salary|pay)',
                r'(market|industry).*(rate|salary)',
            ],
            'career_switch': [
                r'(switch|change|transition).*(career|field|domain)',
                r'(move|shift).*different.*(career|field)',
                r'(career).*(change|switch)',
                r'(from|to).*(developer|engineer|designer|manager)',
            ],
            'course_recommendation': [
                r'(course|courses).*(recommend|best|good)',
                r'(learn|study).*(online|course|platform)',
                r'(platform|site).*(learn|course)',
                r'(certification|certificate).*course',
            ],
            'greeting': [
                r'^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))',
                r'^(howdy|what.*up|how\s*are\s*you)',
            ],
            'gratitude': [
                r'(thank|thanks|appreciate|grateful)',
                r'(helpful|useful|great).*(advice|help)',
            ],
            'farewell': [
                r'(bye|goodbye|see\s*you|take\s*care)',
                r'(quit|exit|end)',
            ],
            'about_skilllens': [
                r'(what.*is|about).*skilllens',
                r'(how.*skilllens.*work|skilllens.*feature)',
                r'(tell.*about).*(skilllens|platform)',
            ],
        }
        
        # Response templates
        self.response_templates = self._get_response_templates()
        
        # Skill-specific knowledge
        self.skill_knowledge = self._get_skill_knowledge()
        
        # Course database
        self.course_database = self._get_course_database()
        
        # Interview questions database
        self.interview_questions = self._get_interview_questions()
    
    def _load_knowledge_base(self) -> Dict:
        """Load knowledge base from JSON files"""
        knowledge = {}
        
        # Load skills data
        skills_path = Path(__file__).parent.parent / 'data' / 'skills.json'
        try:
            with open(skills_path, 'r', encoding='utf-8') as f:
                knowledge['skills'] = json.load(f)
        except FileNotFoundError:
            knowledge['skills'] = {}
        
        # Load courses data
        courses_path = Path(__file__).parent.parent / 'data' / 'courses.json'
        try:
            with open(courses_path, 'r', encoding='utf-8') as f:
                knowledge['courses'] = json.load(f)
        except FileNotFoundError:
            knowledge['courses'] = {}
        
        return knowledge
    
    def _get_response_templates(self) -> Dict:
        """Get comprehensive response templates"""
        return {
            'skill_analysis': {
                'detailed': """📊 **Skill Analysis Deep Dive**

SkillLens uses advanced AI to analyze your skills comprehensively:

**1. Resume Parsing**
• Extracts technical skills, soft skills, and domain expertise
• Identifies experience levels and proficiency indicators
• Recognizes certifications and educational background

**2. AI-Powered Analysis**
• Natural Language Processing (NLP) extracts key competencies
• Machine Learning models identify skill relationships
• Semantic analysis understands context and relevance

**3. Gap Identification**
• Compares your skills against job market requirements
• Identifies missing critical skills for target roles
• Highlights skill demand trends in your industry

**4. Personalized Recommendations**
• Curated learning paths based on your gaps
• Course recommendations from top platforms
• Project ideas to build practical skills

**Ready to analyze your skills?** Upload your resume on the Analysis page! 🚀""",
                'follow_up': "Would you like me to explain any specific part of the analysis process in detail?"
            },
            'career_roadmap': {
                'detailed': """🗺️ **Personalized Career Roadmap**

Your career journey, mapped with precision:

**Phase 1: Assessment**
• Current skill evaluation and market positioning
• Career interest and goal identification
• Strength and opportunity analysis

**Phase 2: Planning**
• Short-term milestones (3-6 months)
• Medium-term goals (6-18 months)
• Long-term vision (2-5 years)

**Phase 3: Skill Development**
• Priority skills for your target role
• Learning resources and timeline
• Hands-on project recommendations

**Phase 4: Progress Tracking**
• Milestone completion tracking
• Skill growth visualization
• Adaptive recommendations

**Want your personalized roadmap?** Visit the Roadmap page to get started! 🎯""",
                'follow_up': "What's your current role and where do you want to be in 2 years?"
            },
            'job_recommendation': {
                'detailed': """💼 **Smart Job Matching System**

Our AI matches you with perfect opportunities:

**Matching Algorithm**
• Skills match percentage calculation
• Experience level alignment
• Location and preference filtering
• Company culture fit analysis

**Market Insights**
• In-demand skills for each role
• Salary range estimates
• Growth potential indicators
• Industry trend analysis

**Job Features**
• Detailed skill gap analysis per job
• Application success probability
• Interview preparation tips
• Company insights and reviews

**Ready to find your dream job?** Explore opportunities on the Jobs page! 🔍""",
                'follow_up': "What type of role and location are you targeting?"
            },
            'skill_improvement': {
                'detailed': """💡 **Skill Enhancement Strategies**

Proven methods to accelerate your skill growth:

**1. Structured Learning Path**
• Start with fundamentals, progress to advanced
• Allocate 1-2 hours daily for consistent learning
• Mix theory with practical projects (70/30 ratio)

**2. Project-Based Learning**
• Build real-world projects for portfolio
• Contribute to open-source on GitHub
• Create a personal website/blog to showcase work

**3. Active Practice**
• Solve coding challenges on LeetCode/HackerRank
• Participate in hackathons and competitions
• Join coding communities and forums

**4. Mentorship & Networking**
• Find mentors on LinkedIn or ADPList
• Join tech Discord/Slack communities
• Attend meetups and conferences

**5. Continuous Assessment**
• Take skill assessments regularly
• Seek feedback from peers and seniors
• Track progress with measurable goals

**Need personalized course recommendations?** Tell me which skill you want to improve! 📚""",
                'follow_up': "Which specific skill would you like to improve? I can provide targeted resources."
            },
            'resume_help': {
                'detailed': """📄 **Resume Optimization Guide**

Create a resume that gets you interviews:

**ATS Optimization**
• Use standard section headings
• Include keywords from job description
• Avoid tables, graphics, or columns
• Save as .docx or .pdf format

**Content Structure**
• **Header**: Name, contact, LinkedIn, portfolio
• **Summary**: 2-3 lines highlighting your value
• **Experience**: Use STAR method for achievements
• **Skills**: Categorize (Technical, Soft, Tools)
• **Projects**: Include 2-3 relevant projects
• **Education**: Degree, relevant coursework, achievements

**Key Tips**
• Quantify achievements (e.g., "Improved performance by 40%")
• Use action verbs (Built, Led, Developed, Optimized)
• Keep it 1-2 pages for most roles
• Tailor for each application

**Want an AI analysis of your resume?** Upload it on the Analysis page! ✨""",
                'follow_up': "Would you like specific tips for your experience level (entry, mid, senior)?"
            },
            'interview_prep': {
                'detailed': """🎯 **Interview Preparation Strategy**

Ace your next interview with this comprehensive guide:

**Before the Interview**
• Research the company thoroughly
• Practice common behavioral questions (STAR method)
• Prepare 2-3 relevant project stories
• Review job description and required skills
• Prepare thoughtful questions to ask

**Technical Interview Tips**
• Practice coding problems daily
• Understand time/space complexity
• Explain your thought process clearly
• Write clean, readable code
• Test your solutions

**Behavioral Questions**
• "Tell me about yourself" - 2 min pitch
• "Why this company/role?" - Show research
• "Greatest challenge" - Show problem-solving
• "Leadership example" - Show initiative

**Soft Skills Showcase**
• Communication: Speak clearly, listen actively
• Collaboration: Use "we" for team achievements
• Problem-solving: Walk through your approach
• Growth mindset: Discuss learning from failures

**Need practice questions for a specific role?** Tell me the position! 🎤""",
                'follow_up': "What role are you interviewing for? I can provide specific questions."
            },
            'salary_negotiation': {
                'detailed': """💰 **Salary Negotiation Guide**

Negotiate confidently with these strategies:

**Research Phase**
• Use Glassdoor, PayScale, Levels.fyi for market rates
• Consider location, company size, experience level
• Factor in total compensation (stock, benefits, bonus)

**Negotiation Tactics**
• Never reveal your current salary first
• Give a range, not a specific number
• Focus on value you bring, not personal needs
• Be prepared to justify with achievements

**Timing Tips**
• Wait for the formal offer before negotiating
• Express excitement about the role first
• Take time to "review" the offer (24-48 hours)
• Negotiate after proving yourself in the role

**Phrases That Work**
• "Based on my research and experience, I was expecting..."
• "I'm excited about this opportunity. Can we discuss the compensation?"
• "The offer is great, but I was hoping for something closer to..."

**What role are you negotiating for?** I can provide specific salary insights! 💵""",
                'follow_up': "What's your target role and location? I can help with salary research."
            },
            'career_switch': {
                'detailed': """🔄 **Career Transition Strategy**

Successfully pivot to a new career with this roadmap:

**Assessment Phase**
• Identify transferable skills
• Research target role requirements
• Assess financial runway for transition
• Consider risk tolerance

**Preparation Phase**
• Learn required skills through courses/projects
• Build a portfolio showcasing relevant work
• Network with professionals in target field
• Find mentors who've made similar transitions

**Action Phase**
• Update resume for target role
• Leverage transferable skills in applications
• Be open to junior roles initially
• Consider contract/freelance work to build experience

**Common Transition Paths**
• Developer → Product Manager
• QA → Developer
• Support → Developer/PM
• Designer → Frontend Developer
• Developer → Data Scientist

**What's your current role and target career?** I'll create a personalized transition plan! 🚀""",
                'follow_up': "What career transition are you considering? I can provide specific guidance."
            },
            'course_recommendation': {
                'detailed': """📚 **Learning Platform Guide**

Top platforms for skill development:

**For Programming & Tech**
• **Coursera** - University courses, certificates
• **Udemy** - Affordable, practical courses
• **edX** - MIT, Harvard courses
• **Pluralsight** - Tech skill paths
• **freeCodeCamp** - Free, project-based

**For Data Science & AI**
• **Kaggle Learn** - Free micro-courses
• **DataCamp** - Interactive data science
• **Fast.ai** - Free ML courses
• **DeepLearning.AI** - Specialized ML content

**For Cloud & DevOps**
• **AWS Training** - Official AWS courses
• **Google Cloud Skills** - GCP learning paths
• **Microsoft Learn** - Azure certifications

**For Soft Skills**
• **LinkedIn Learning** - Professional skills
• **Coursera** - Leadership & management

**What skill do you want to learn?** I'll recommend specific courses! 🎓""",
                'follow_up': "Which skill are you looking to learn? I can suggest the best courses for it."
            },
            'about_skilllens': {
                'detailed': """🔮 **About SkillLens**

SkillLens is an AI-powered career development platform designed to help professionals navigate their career journey with confidence.

**Core Features**
• **Skill Gap Analysis** - AI identifies gaps between your skills and job requirements
• **Career Roadmaps** - Personalized learning paths for your career goals
• **Job Matching** - Smart job recommendations based on skill compatibility
• **Resume Analysis** - ATS optimization and skill extraction
• **AI Career Assistant** - 24/7 career guidance and advice

**Technology Stack**
• Advanced NLP for skill extraction
• Machine Learning for job matching
• Data-driven insights from job market trends

**Our Mission**
Empowering professionals worldwide with accessible, AI-driven career guidance.

**How can I help you today?** Ask about any career-related topic! ✨""",
                'follow_up': "What would you like to explore first?"
            },
            'greeting': {
                'detailed': """👋 **Welcome to SkillLens!**

I'm your AI Career Assistant, here to help you with:

🔹 **Skill Analysis** - Understand your strengths and gaps
🔹 **Career Planning** - Create a personalized roadmap
🔹 **Job Search** - Find roles that match your skills
🔹 **Resume Tips** - Optimize for ATS and recruiters
🔹 **Interview Prep** - Practice questions and strategies
🔹 **Salary Guidance** - Know your market value
🔹 **Course Recommendations** - Learn new skills effectively

**Quick Start Options:**
• "How does skill analysis work?"
• "Help me with my resume"
• "Interview preparation tips"
• "Course recommendations for Python"

What would you like help with today? 💬""",
                'follow_up': "How can I assist you with your career journey?"
            },
            'gratitude': {
                'detailed': """You're welcome! 😊 I'm glad I could help.

Remember, I'm here 24/7 to assist with any career-related questions. Feel free to ask about:
• Skill analysis and gap identification
• Career roadmaps and planning
• Job search strategies
• Resume and interview tips
• Learning resources and courses

Is there anything else you'd like to know? 🚀""",
                'follow_up': "Is there anything else I can help you with?"
            },
            'farewell': {
                'detailed': """Goodbye! 👋

Thank you for using SkillLens. Remember:
• Your career journey is a marathon, not a sprint
• Continuous learning is the key to success
• I'm always here when you need guidance

Good luck with your career goals! 🌟

*Tip: You can bookmark the Analysis page to quickly check your skill progress anytime.*""",
                'follow_up': None
            },
            'default': {
                'detailed': """I understand you're asking about something related to your career development.

Here are some topics I can help with:

📋 **Quick Help Options:**
• **Skills**: "How does skill analysis work?"
• **Career**: "Create my career roadmap"
• **Jobs**: "Find jobs matching my skills"
• **Resume**: "Help optimize my resume"
• **Interview**: "Interview preparation tips"
• **Learning**: "Best courses for web development"

💡 **Tip**: Be specific with your questions for more targeted advice!

What would you like to explore? 🤔""",
                'follow_up': "Could you tell me more about what you're looking for?"
            }
        }
    
    def _get_skill_knowledge(self) -> Dict:
        """Get skill-specific knowledge and learning paths"""
        return {
            'python': {
                'description': 'Python is a versatile programming language used for web development, data science, AI/ML, automation, and more.',
                'learning_path': ['Basics', 'Data Structures', 'OOP', 'Web Dev (Django/Flask)', 'Advanced Topics'],
                'time_to_learn': '3-6 months for proficiency',
                'job_roles': ['Python Developer', 'Data Scientist', 'Backend Developer', 'ML Engineer', 'Automation Engineer'],
                'salary_range': '$70,000 - $150,000',
                'resources': ['Python.org', 'Real Python', 'Automate the Boring Stuff', 'Python Crash Course book']
            },
            'javascript': {
                'description': 'JavaScript is the language of the web, essential for frontend development and increasingly popular for backend with Node.js.',
                'learning_path': ['Basics', 'DOM Manipulation', 'ES6+', 'React/Vue/Angular', 'Node.js', 'TypeScript'],
                'time_to_learn': '4-8 months for full proficiency',
                'job_roles': ['Frontend Developer', 'Full Stack Developer', 'JavaScript Developer', 'React Developer'],
                'salary_range': '$65,000 - $140,000',
                'resources': ['MDN Web Docs', 'JavaScript.info', 'Eloquent JavaScript', 'You Don\'t Know JS']
            },
            'react': {
                'description': 'React is a popular JavaScript library for building user interfaces, maintained by Meta.',
                'learning_path': ['JavaScript Fundamentals', 'React Basics', 'Hooks', 'State Management', 'Next.js'],
                'time_to_learn': '2-4 months with JS background',
                'job_roles': ['React Developer', 'Frontend Developer', 'UI Developer'],
                'salary_range': '$75,000 - $150,000',
                'resources': ['React Docs', 'Scrimba React Course', 'React - The Complete Guide (Udemy)']
            },
            'data_science': {
                'description': 'Data Science combines programming, statistics, and domain expertise to extract insights from data.',
                'learning_path': ['Python/R', 'Statistics', 'Data Visualization', 'ML Algorithms', 'Deep Learning'],
                'time_to_learn': '6-12 months for entry-level',
                'job_roles': ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Research Scientist'],
                'salary_range': '$80,000 - $170,000',
                'resources': ['Kaggle', 'DataCamp', 'Coursera IBM Data Science', 'Fast.ai']
            },
            'aws': {
                'description': 'Amazon Web Services is the leading cloud platform, essential for modern DevOps and cloud architecture.',
                'learning_path': ['Cloud Fundamentals', 'AWS Core Services', 'Architecture', 'Security', 'Advanced Services'],
                'time_to_learn': '3-6 months for certification',
                'job_roles': ['Cloud Engineer', 'DevOps Engineer', 'Solutions Architect', 'Cloud Developer'],
                'salary_range': '$90,000 - $180,000',
                'resources': ['AWS Free Tier', 'AWS Training', 'A Cloud Guru', 'Linux Academy']
            },
            'machine_learning': {
                'description': 'Machine Learning is a subset of AI that enables systems to learn and improve from experience.',
                'learning_path': ['Python', 'Math Foundations', 'ML Algorithms', 'Deep Learning', 'MLOps'],
                'time_to_learn': '6-12 months for proficiency',
                'job_roles': ['ML Engineer', 'AI Engineer', 'Data Scientist', 'Research Scientist'],
                'salary_range': '$100,000 - $200,000',
                'resources': ['Coursera ML Course', 'Fast.ai', 'Kaggle Learn', 'Google ML Crash Course']
            },
            'devops': {
                'description': 'DevOps combines development and operations to improve collaboration and productivity.',
                'learning_path': ['Linux', 'Networking', 'CI/CD', 'Containers (Docker)', 'Kubernetes', 'Cloud'],
                'time_to_learn': '4-8 months with dev background',
                'job_roles': ['DevOps Engineer', 'SRE', 'Platform Engineer', 'Cloud Engineer'],
                'salary_range': '$85,000 - $165,000',
                'resources': ['Docker Docs', 'Kubernetes.io', 'DevOps Roadmap', 'The DevOps Handbook']
            }
        }
    
    def _get_course_database(self) -> Dict:
        """Get comprehensive course recommendations"""
        return {
            'programming': [
                {'name': 'CS50\'s Introduction to Computer Science', 'platform': 'edX', 'price': 'Free', 'level': 'Beginner'},
                {'name': 'The Web Developer Bootcamp', 'platform': 'Udemy', 'price': '$15', 'level': 'Beginner'},
                {'name': 'Complete Python Bootcamp', 'platform': 'Udemy', 'price': '$15', 'level': 'Beginner'},
                {'name': 'JavaScript: The Good Parts', 'platform': 'O\'Reilly', 'price': 'Paid', 'level': 'Intermediate'}
            ],
            'data_science': [
                {'name': 'IBM Data Science Professional Certificate', 'platform': 'Coursera', 'price': '$49/mo', 'level': 'Beginner'},
                {'name': 'Data Science Specialization', 'platform': 'Coursera', 'price': '$49/mo', 'level': 'Intermediate'},
                {'name': 'Practical Deep Learning for Coders', 'platform': 'Fast.ai', 'price': 'Free', 'level': 'Intermediate'}
            ],
            'cloud': [
                {'name': 'AWS Cloud Practitioner', 'platform': 'AWS Training', 'price': 'Free', 'level': 'Beginner'},
                {'name': 'AWS Solutions Architect', 'platform': 'A Cloud Guru', 'price': '$49/mo', 'level': 'Intermediate'},
                {'name': 'Google Cloud Fundamentals', 'platform': 'Google Cloud', 'price': 'Free', 'level': 'Beginner'}
            ],
            'soft_skills': [
                {'name': 'Learning How to Learn', 'platform': 'Coursera', 'price': 'Free', 'level': 'All'},
                {'name': 'Leadership and Management Certificate', 'platform': 'LinkedIn Learning', 'price': '$30/mo', 'level': 'Intermediate'},
                {'name': 'Communication Skills', 'platform': 'Coursera', 'price': 'Free', 'level': 'All'}
            ]
        }
    
    def _get_interview_questions(self) -> Dict:
        """Get interview questions by category"""
        return {
            'behavioral': [
                "Tell me about yourself.",
                "Why do you want to work here?",
                "What's your greatest professional achievement?",
                "Describe a challenging situation and how you handled it.",
                "Where do you see yourself in 5 years?",
                "What's your greatest weakness?",
                "Why are you leaving your current role?",
                "Tell me about a time you showed leadership.",
                "How do you handle stress and pressure?",
                "What motivates you?"
            ],
            'technical_general': [
                "Walk me through your development process.",
                "How do you stay updated with new technologies?",
                "Describe your experience with version control.",
                "How do you approach debugging?",
                "What's your experience with testing?",
                "How do you handle code reviews?",
                "Describe a technically challenging project you worked on.",
                "How do you ensure code quality?",
                "What tools do you use for productivity?",
                "How do you approach learning a new technology?"
            ],
            'frontend': [
                "Explain the box model in CSS.",
                "What's the difference between let, const, and var?",
                "Explain React's virtual DOM.",
                "What are React hooks?",
                "How do you optimize a website's performance?",
                "Explain responsive design principles.",
                "What's the difference between sessionStorage and localStorage?",
                "How do you handle state management in React?",
                "Explain the concept of closures in JavaScript.",
                "What are the advantages of TypeScript over JavaScript?"
            ],
            'backend': [
                "Explain RESTful API design principles.",
                "What's the difference between SQL and NoSQL databases?",
                "How do you handle authentication and authorization?",
                "Explain the concept of microservices.",
                "How do you handle API rate limiting?",
                "What's your experience with caching strategies?",
                "Explain database indexing.",
                "How do you handle error handling in APIs?",
                "What's the difference between process and thread?",
                "How would you design a scalable system?"
            ],
            'data_science': [
                "Explain the difference between supervised and unsupervised learning.",
                "What's bias-variance tradeoff?",
                "How do you handle missing data?",
                "Explain cross-validation.",
                "What's the difference between classification and regression?",
                "How do you evaluate model performance?",
                "Explain overfitting and how to prevent it.",
                "What's feature engineering?",
                "Explain the concept of ensemble learning.",
                "How would you handle imbalanced datasets?"
            ]
        }
    
    def detect_intent(self, message: str) -> str:
        """Detect the intent of user message"""
        message_lower = message.lower()
        
        # Check each intent pattern
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, message_lower, re.IGNORECASE):
                    return intent
        
        return 'default'
    
    def extract_entities(self, message: str) -> Dict:
        """Extract entities like skills, roles, companies from message"""
        entities = {
            'skills': [],
            'roles': [],
            'experience_level': None,
            'location': None
        }
        
        message_lower = message.lower()
        
        # Extract skills from knowledge base
        for skill in self.skill_knowledge.keys():
            if skill in message_lower:
                entities['skills'].append(skill)
        
        # Detect experience level
        if any(word in message_lower for word in ['entry', 'junior', 'fresher', 'beginner', 'no experience']):
            entities['experience_level'] = 'entry'
        elif any(word in message_lower for word in ['senior', 'lead', 'architect', 'experienced']):
            entities['experience_level'] = 'senior'
        elif any(word in message_lower for word in ['mid', 'intermediate', '3-5 years', '4 years']):
            entities['experience_level'] = 'mid'
        
        # Common job roles
        role_patterns = [
            r'(frontend|backend|full[\s-]?stack|web|mobile)\s*(developer|engineer)',
            r'(data\s*scientist|ml\s*engineer|ai\s*engineer)',
            r'(devops|sre|platform)\s*(engineer)?',
            r'(product|project)\s*(manager)',
            r'(software|senior software)\s*(engineer|developer)',
        ]
        
        for pattern in role_patterns:
            match = re.search(pattern, message_lower)
            if match:
                entities['roles'].append(match.group(0))
        
        return entities
    
    def get_contextual_response(self, message: str, session_id: str = 'default') -> Dict:
        """Generate contextual response based on user message and conversation history"""
        
        # Get conversation context
        context = self.context_memory[session_id][-5:]  # Last 5 messages
        
        # Detect intent
        intent = self.detect_intent(message)
        
        # Extract entities
        entities = self.extract_entities(message)
        
        # Generate response based on intent and entities
        if intent in self.response_templates:
            response = self.response_templates[intent]['detailed']
            
            # Add skill-specific information if relevant
            if entities['skills']:
                skill_info = self._get_skill_specific_info(entities['skills'][0])
                if skill_info:
                    response += f"\n\n{skill_info}"
            
            follow_up = self.response_templates[intent].get('follow_up')
        else:
            response = self.response_templates['default']['detailed']
            follow_up = self.response_templates['default'].get('follow_up')
        
        # Update conversation memory
        self.context_memory[session_id].append({
            'message': message,
            'intent': intent,
            'entities': entities
        })
        
        return {
            'response': response,
            'intent': intent,
            'entities': entities,
            'follow_up': follow_up,
            'suggestions': self._get_suggestions(intent, entities)
        }
    
    def _get_skill_specific_info(self, skill: str) -> Optional[str]:
        """Get specific information about a skill"""
        if skill in self.skill_knowledge:
            info = self.skill_knowledge[skill]
            return f"""📌 **{skill.upper()} Quick Info**

**Description**: {info['description']}
**Learning Path**: {' → '.join(info['learning_path'])}
**Time to Learn**: {info['time_to_learn']}
**Job Roles**: {', '.join(info['job_roles'])}
**Salary Range**: {info['salary_range']}
**Top Resources**: {', '.join(info['resources'])}"""
        return None
    
    def _get_suggestions(self, intent: str, entities: Dict) -> List[str]:
        """Get follow-up suggestions based on intent and context"""
        suggestions = []
        
        if intent == 'skill_analysis':
            suggestions = [
                "Upload my resume for analysis",
                "What skills are in demand?",
                "How to identify skill gaps?"
            ]
        elif intent == 'career_roadmap':
            suggestions = [
                "Create my career roadmap",
                "Career path for software developer",
                "How to transition to management?"
            ]
        elif intent == 'job_recommendation':
            suggestions = [
                "Jobs for Python developers",
                "Remote opportunities near me",
                "How to prepare for job interviews?"
            ]
        elif intent == 'interview_prep':
            suggestions = [
                "Common interview questions",
                "How to answer 'tell me about yourself'?",
                "Technical interview preparation"
            ]
        elif intent == 'course_recommendation':
            suggestions = [
                "Best Python courses",
                "Free coding bootcamps",
                "AWS certification courses"
            ]
        else:
            suggestions = [
                "How does skill analysis work?",
                "Career roadmap guidance",
                "Job recommendations",
                "Skill improvement tips"
            ]
        
        return suggestions[:4]  # Return max 4 suggestions
    
    def get_interview_questions(self, category: str = 'behavioral', count: int = 5) -> List[str]:
        """Get interview questions by category"""
        if category in self.interview_questions:
            questions = self.interview_questions[category]
            return random.sample(questions, min(count, len(questions)))
        return self.interview_questions['behavioral'][:count]
    
    def get_course_recommendations(self, skill: str = None, category: str = None) -> List[Dict]:
        """Get course recommendations"""
        if category and category in self.course_database:
            return self.course_database[category]
        elif skill:
            # Return relevant courses for skill
            for cat, courses in self.course_database.items():
                for course in courses:
                    if skill.lower() in course['name'].lower():
                        return courses
        return self.course_database['programming']


# Create singleton instance
chat_service = ChatService()


def get_chat_response(message: str, session_id: str = 'default') -> Dict:
    """Get chat response from the chat service"""
    return chat_service.get_contextual_response(message, session_id)