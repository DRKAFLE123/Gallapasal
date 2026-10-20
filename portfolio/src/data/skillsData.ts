import { SkillCategory, EducationItem } from '../types';

export const skillsCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    categoryKey: 'frontend',
    skills: [
      'React 19 / 18',
      'Next.js (App Router)',
      'TypeScript',
      'JavaScript (ES6+)',
      'Tailwind CSS v4/v3',
      'HTML5 & Semantic Markup',
      'CSS3 & Micro-animations',
      'Vite & Asset Bundling',
      'Responsive & Mobile-First Design'
    ]
  },
  {
    title: 'Backend Engineering',
    categoryKey: 'backend',
    skills: [
      'Laravel 11 (PHP 8.2+)',
      'Node.js & Express',
      'Python (Django & Flask)',
      'RESTful API Architecture',
      'Authentication (Sanctum / Session)',
      'Middleware & Security Headers',
      'MVC Architectural Design',
      'PDF & Invoice Generation Pipelines'
    ]
  },
  {
    title: 'Programming Languages',
    categoryKey: 'languages',
    skills: [
      'TypeScript',
      'JavaScript',
      'Python',
      'PHP',
      'SQL',
      'C / C++'
    ]
  },
  {
    title: 'Databases & Storage',
    categoryKey: 'databases',
    skills: [
      'MySQL',
      'MariaDB',
      'SQLite',
      'Relational Database Normalization',
      'Index Optimization & Query Tuning',
      'Transactions & ACID Ledgers'
    ]
  },
  {
    title: 'AI & Machine Learning',
    categoryKey: 'aiml',
    skills: [
      'TensorFlow & Keras',
      'OpenCV (Computer Vision)',
      'Scikit-Learn',
      'Convolutional Neural Networks (CNNs)',
      'Recurrent Neural Networks (RNN/LSTM)',
      'Natural Language Processing (NLP)',
      'Pandas & NumPy Data Analysis',
      'Jupyter Notebook Experimentation'
    ]
  },
  {
    title: 'Testing & Quality Assurance',
    categoryKey: 'qa',
    skills: [
      'Quality Assurance Test Planning',
      'Manual & Automated Test Execution',
      'API Contract Validation (Postman / cURL)',
      'PHPUnit & Unit Testing',
      'Edge-Case & Regression Testing',
      'Bug Lifecycle & Defect Triage'
    ]
  },
  {
    title: 'DevOps & Infrastructure',
    categoryKey: 'devops',
    skills: [
      'Git Version Control & Branching',
      'GitHub Workflows & Releases',
      'cPanel Shared Hosting Administration',
      'LiteSpeed & Apache Web Server Config',
      'PowerShell Automation Scripting',
      'Composer & npm Package Management'
    ]
  },
  {
    title: 'Project Management & Methodologies',
    categoryKey: 'pm',
    skills: [
      'Agile / Scrum Delivery Cycles',
      'Technical Architecture Specifications',
      'Cross-Functional Team Collaboration',
      'User Acceptance Testing (UAT)',
      'Release Management & Rollback Strategy'
    ]
  }
];

export const educationData: EducationItem = {
  degree: 'Bachelor of Science in Computer Science and Information Technology (BSc CSIT)',
  institution: 'Tribhuvan University',
  location: 'Kathmandu, Nepal',
  graduationYear: 2023,
  field: 'Computer Science, Software Engineering, Algorithms & Machine Learning',
  details: 'Comprehensive four-year academic curriculum covering advanced data structures, database management systems, artificial intelligence, operating systems, compiler design, computer networking, software engineering, and applied mathematical modeling.'
};
