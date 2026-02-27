// Mock data for SkillLens SaaS Platform

// Dashboard mock data
export const dashboardData = {
  skillMatchPercentage: 72,
  totalMatchedSkills: 15,
  totalMissingSkills: 6,
  recentAnalyses: [
    {
      id: 1,
      jobTitle: 'Senior Frontend Developer',
      company: 'Google',
      matchPercentage: 85,
      date: '2024-01-15',
      status: 'High Match'
    },
    {
      id: 2,
      jobTitle: 'Full Stack Engineer',
      company: 'Microsoft',
      matchPercentage: 68,
      date: '2024-01-12',
      status: 'Medium Match'
    },
    {
      id: 3,
      jobTitle: 'React Developer',
      company: 'Meta',
      matchPercentage: 92,
      date: '2024-01-10',
      status: 'High Match'
    },
    {
      id: 4,
      jobTitle: 'Software Engineer',
      company: 'Amazon',
      matchPercentage: 55,
      date: '2024-01-08',
      status: 'Moderate Match'
    }
  ],
  skillDistribution: [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Python', level: 70 },
    { name: 'Node.js', level: 75 },
    { name: 'TypeScript', level: 65 },
    { name: 'SQL', level: 60 }
  ]
};

// Job Explorer mock data
export const jobRoles = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    category: 'Engineering',
    demand: 'High',
    salary: '$120K - $180K',
    requiredSkills: ['React', 'TypeScript', 'CSS', 'Git', 'REST APIs', 'Testing'],
    preferredSkills: ['Next.js', 'GraphQL', 'AWS'],
    growth: '+25%'
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    category: 'Engineering',
    demand: 'High',
    salary: '$130K - $200K',
    requiredSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Docker'],
    preferredSkills: ['AWS', 'Kubernetes', 'GraphQL'],
    growth: '+30%'
  },
  {
    id: 3,
    title: 'Data Scientist',
    category: 'Data',
    demand: 'High',
    salary: '$140K - $220K',
    requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
    preferredSkills: ['Deep Learning', 'NLP', 'Spark'],
    growth: '+35%'
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    category: 'Operations',
    demand: 'Medium',
    salary: '$110K - $170K',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Python'],
    preferredSkills: ['Terraform', 'Ansible', 'GCP'],
    growth: '+20%'
  },
  {
    id: 5,
    title: 'Product Manager',
    category: 'Product',
    demand: 'Medium',
    salary: '$120K - $190K',
    requiredSkills: ['Agile', 'Data Analysis', 'User Research', 'Roadmapping', 'SQL'],
    preferredSkills: ['A/B Testing', 'Figma', 'JIRA'],
    growth: '+15%'
  },
  {
    id: 6,
    title: 'UX Designer',
    category: 'Design',
    demand: 'Medium',
    salary: '$90K - $150K',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Adobe XD'],
    preferredSkills: ['HTMLअनुसार', 'CSS', 'Motion Design'],
    growth: '+18%'
  },
  {
    id: 7,
    title: 'Backend Developer',
    category: 'Engineering',
    demand: 'High',
    salary: '$125K - $190K',
    requiredSkills: ['Python', 'Java', 'SQL', 'REST APIs', 'Microservices', 'Docker'],
    preferredSkills: ['Kubernetes', 'GraphQL', 'Redis'],
    growth: '+22%'
  },
  {
    id: 8,
    title: 'Machine Learning Engineer',
    category: 'AI/ML',
    demand: 'High',
    salary: '$150K - $250K',
    requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Deep Learning'],
    preferredSkills: ['Computer Vision', 'NLP', 'CUDA'],
    growth: '+40%'
  }
];

// Career Roadmap mock data
export const careerRoadmaps = [
  {
    id: 1,
    role: 'Frontend Developer',
    steps: [
      {
        order: 1,
        title: 'Master HTML, CSS & JavaScript',
        description: 'Build strong fundamentals in web technologies',
        duration: '2-3 months',
        resources: ['freeCodeCamp', 'MDN Web Docs', 'JavaScript.info'],
        skills: ['HTML5', 'CSS3', 'JavaScript ES6+']
      },
      {
        order: 2,
        title: 'Learn React Framework',
        description: 'Master component-based architecture',
        duration: '2-3 months',
        resources: ['React Docs', 'Scrimba', 'Egghead.io'],
        skills: ['React', 'JSX', 'State Management', 'Hooks']
      },
      {
        order: 3,
        title: 'TypeScript & Advanced Patterns',
        description: 'Add type safety and learn advanced patterns',
        duration: '1-2 months',
        resources: ['TypeScript Handbook', 'Total TypeScript'],
        skills: ['TypeScript', 'Design Patterns', 'Testing']
      },
      {
        order: 4,
        title: 'Build Portfolio Projects',
        description: 'Create real-world projects to showcase skills',
        duration: '2-3 months',
        resources: ['GitHub', 'Vercel', 'Netlify'],
        skills: ['Project Management', 'Deployment', 'Git']
      },
      {
        order: 5,
        title: 'Apply for Jobs & Interview Prep',
        description: 'Prepare for technical interviews',
        duration: '1-2 months',
        resources: ['LeetCode', 'Frontend Interview Handbook'],
        skills: ['Problem Solving', 'System Design']
      }
    ]
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    steps: [
      {
        order: 1,
        title: 'Frontend Fundamentals',
        description: 'Master HTML, CSS, JavaScript and React',
        duration: '3-4 months',
        resources: ['freeCodeCamp', 'React Docs'],
        skills: ['HTML', 'CSS', 'JavaScript', 'React']
      },
      {
        order: 2,
        title: 'Backend Development',
        description: 'Learn Node.js, Express and databases',
        duration: '3-4 months',
        resources: ['Node.js Docs', 'MongoDB University'],
        skills: ['Node.js', 'Express', 'MongoDB', 'SQL']
      },
      {
        order: 3,
        title: 'API Design & Architecture',
        description: 'Build RESTful and GraphQL APIs',
        duration: '2 months',
        resources: ['GraphQL Docs', 'REST API Tutorial'],
        skills: ['REST APIs', 'GraphQL', 'Authentication']
      },
      {
        order: 4,
        title: 'DevOps & Cloud',
        description: 'Learn deployment and cloud services',
        duration: '2-3 months',
        resources: ['AWS Training', 'Docker Docs'],
        skills: ['Docker', 'AWS', 'CI/CD', 'Kubernetes']
      },
      {
        order: 5,
        title: 'Full Stack Projects',
        description: 'Build complete applications end-to-end',
        duration: '3-4 months',
        resources: ['GitHub', 'Vercel', 'Railway'],
        skills: ['Full Stack Development', 'System Design']
      }
    ]
  },
  {
    id: 3,
    role: 'Data Scientist',
    steps: [
      {
        order: 1,
        title: 'Python & Statistics',
        description: 'Master Python programming and statistical concepts',
        duration: '3 months',
        resources: ['Python.org', 'Khan Academy Statistics'],
        skills: ['Python', 'Statistics', 'NumPy', 'Pandas']
      },
      {
        order: 2,
        title: 'Data Analysis & Visualization',
        description: 'Learn to analyze and visualize data effectively',
        duration: '2 months',
        resources: ['Kaggle', 'DataCamp'],
        skills: ['Matplotlib', 'Seaborn', 'EDA', 'Tableau']
      },
      {
        order: 3,
        title: 'Machine Learning',
        description: 'Understand and implement ML algorithms',
        duration: '3-4 months',
        resources: ['Coursera ML Course', 'Fast.ai'],
        skills: ['Scikit-learn', 'Regression', 'Classification', 'Clustering']
      },
      {
        order: 4,
        title: 'Deep Learning & NLP',
        description: 'Explore neural networks and NLP',
        duration: '3 months',
        resources: ['DeepLearning.AI', 'Hugging Face'],
        skills: ['TensorFlow', 'PyTorch', 'NLP', 'Transformers']
      },
      {
        order: 5,
        title: 'MLOps & Deployment',
        description: 'Learn to deploy and maintain ML models',
        duration: '2 months',
        resources: ['MLflow', 'AWS SageMaker'],
        skills: ['MLOps', 'Model Deployment', 'AWS']
      }
    ]
  }
];

// Insights mock data
export const insightsData = {
  trendingSkills: [
    { name: 'Generative AI', growth: '+156%', jobs: 15000, category: 'AI/ML' },
    { name: 'Langchain', growth: '+120%', jobs: 5000, category: 'AI/ML' },
    { name: 'Kubernetes', growth: '+45%', jobs: 25000, category: 'DevOps' },
    { name: 'React', growth: '+35%', jobs: 120000, category: 'Frontend' },
    { name: 'TypeScript', growth: '+40%', jobs: 80000, category: 'Programming' },
    { name: 'AWS', growth: '+30%', jobs: 95000, category: 'Cloud' },
    { name: 'Python', growth: '+28%', jobs: 150000, category: 'Programming' },
    { name: 'Docker', growth: '+25%', jobs: 70000, category: 'DevOps' }
  ],
  topPayingRoles: [
    { role: 'Machine Learning Engineer', avgSalary: '$185K', topSalary: '$300K+', demand: 'High' },
    { role: 'Data Scientist', avgSalary: '$165K', topSalary: '$250K+', demand: 'High' },
    { role: 'Solutions Architect', avgSalary: '$160K', topSalary: '$240K+', demand: 'High' },
    { role: 'DevOps Engineer', avgSalary: '$145K', topSalary: '$220K+', demand: 'Medium' },
    { role: 'Full Stack Developer', avgSalary: '$140K', topSalary: '$200K+', demand: 'High' },
    { role: 'Cloud Engineer', avgSalary: '$135K', topSalary: '$210K+', demand: 'Medium' },
    { role: 'Backend Developer', avgSalary: '$130K', topSalary: '$190K+', demand: 'High' },
    { role: 'Frontend Developer', avgSalary: '$120K', topSalary: '$180K+', demand: 'Medium' }
  ],
  skillDemandByCategory: [
    { category: 'AI/ML', demand: 95, growth: '+40%', color: 'purple' },
    { category: 'Cloud', demand: 88, growth: '+25%', color: 'blue' },
    { category: 'DevOps', demand: 82, growth: '+20%', color: 'green' },
    { category: 'Frontend', demand: 78, growth: '+15%', color: 'orange' },
    { category: 'Backend', demand: 85, growth: '+18%', color: 'red' },
    { category: 'Data', demand: 90, growth: '+30%', color: 'teal' }
  ]
};

// Saved Reports mock data
export const savedReports = [
  {
    id: 1,
    title: 'Frontend Developer Analysis',
    jobTitle: 'Senior Frontend Developer',
    company: 'Google',
    type: 'Analysis',
    matchPercentage: 85,
    matchedSkills: ['React', 'JavaScript', 'CSS', 'Git', 'REST APIs'],
    missingSkills: ['TypeScript', 'GraphQL'],
    date: '2024-01-15',
    recommendations: 3
  },
  {
    id: 2,
    title: 'Full Stack Analysis',
    jobTitle: 'Full Stack Engineer',
    company: 'Microsoft',
    type: 'Analysis',
    matchPercentage: 68,
    matchedSkills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    missingSkills: ['Python', 'Docker', 'AWS'],
    date: '2024-01-12',
    recommendations: 5
  },
  {
    id: 3,
    title: 'React Developer Analysis',
    jobTitle: 'React Developer',
    company: 'Meta',
    type: 'Analysis',
    matchPercentage: 92,
    matchedSkills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Jest'],
    missingSkills: ['GraphQL'],
    date: '2024-01-10',
    recommendations: 1
  },
  {
    id: 4,
    title: 'Software Engineer Analysis',
    jobTitle: 'Software Engineer',
    company: 'Amazon',
    type: 'Analysis',
    matchPercentage: 55,
    matchedSkills: ['Java', 'SQL', 'Git'],
    missingSkills: ['AWS', 'Docker', 'System Design', 'Python'],
    date: '2024-01-08',
    recommendations: 6
  }
];
