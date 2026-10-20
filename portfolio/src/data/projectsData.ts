import { Project } from '../types';

export const projectsData: Project[] = [
  {
    id: 'gallapasal',
    title: 'Gallapasal',
    tagline: 'Enterprise Point-of-Sale & Grain Ledger Accounting System',
    category: ['Live Products', 'Web Applications', 'E-Commerce'],
    status: 'Live Product',
    liveUrl: 'https://pos.damodarkafle.com.np/',
    githubUrl: 'https://github.com/DRKAFLE123/Gallapasal',
    featured: true,
    description: 'A comprehensive, high-throughput point-of-sale and financial ledger web application engineered for grain distributors and merchants. Integrates live stock registers, multi-party purchase and sales logging, automated dual Gregorian (AD) and Bikram Sambat (BS) date reconciliation, PDF voucher generation, and secure multi-tier roles.',
    techStack: ['Laravel 11', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'MySQL', 'Zustand', 'Vite'],
    highlights: [
      'Engineered dual-calendar transaction logging supporting synchronized Gregorian and Nepali Bikram Sambat dates.',
      'Designed automated server-side PDF invoice and voucher generation with receipt printing support.',
      'Constructed complete inventory audit trail with stock ledger tracking across multiple grain varietals.',
      'Integrated cPanel deployment pipelines with asset hashing and environment isolation.'
    ]
  },
  {
    id: 'digital-nomads-in-nepal',
    title: 'Digital Nomads in Nepal',
    tagline: 'Discover Workspaces, Stays & Mountain Experiences in Nepal',
    category: ['Live Products', 'Web Applications'],
    status: 'Live Product',
    liveUrl: 'https://www.digitalnomadsinnepal.com/',
    githubUrl: 'https://github.com/DRKAFLE123/digital-nomads-in-nepal',
    featured: true,
    description: 'A dedicated platform connecting international digital nomads and remote professionals with verified high-speed Wi-Fi workspaces, mountain retreats, community coliving spaces, local trekking guides, and authentic cultural expeditions throughout Nepal.',
    techStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vercel'],
    highlights: [
      'Comprehensive directory of verified coliving hubs, cafes, and mountain work retreats.',
      'Interactive filtering by speed, amenities, elevation, and community events.',
      'Direct WhatsApp and booking inquiry routing for authentic local operators.',
      'Mobile-first responsive architecture designed for travelers on variable cellular networks.'
    ]
  },
  {
    id: 'language-guru',
    title: 'Language Guru (JapanKoreaHub)',
    tagline: 'Language Learning, Jobs & Accommodation Portal for Japan and Korea',
    category: ['Live Products', 'Web Applications'],
    status: 'Live Product',
    liveUrl: 'https://language-guru-one.vercel.app/',
    githubUrl: 'https://github.com/DRKAFLE123/JapanKoreaHub',
    featured: true,
    description: 'A specialized international career and language education portal tailored for aspiring candidates seeking professional, vocational, and educational opportunities in Japan and Korea. Offers structured syllabus materials, JLPT/TOPIK test preparation, job openings, and verified living accommodation guides.',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Lucide React'],
    highlights: [
      'Structured curriculum modules for JLPT (N5–N1) and TOPIK language proficiencies.',
      'Verified job postings, visa guidelines, and work-permit verification resources.',
      'Community accommodation directory assisting students and workers with relocation in Tokyo, Osaka, and Seoul.'
    ]
  },
  {
    id: 'sajilo-pasal',
    title: 'Sajilo Pasal (Sajilo Dokan)',
    tagline: 'Modern B2C Multi-Vendor E-Commerce Platform',
    category: ['Ongoing', 'E-Commerce', 'Web Applications'],
    status: 'Ongoing Project',
    githubUrl: 'https://github.com/DRKAFLE123/Sajilo_Dokan',
    featured: false,
    description: 'An ongoing B2C SaaS e-commerce solution architected for seamless product catalog management, shopping cart state persistence, customer orders processing, and localized payment gateway integration.',
    techStack: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS', 'REST API'],
    highlights: [
      'Modular product listing with dynamic variant pricing and stock alert thresholds.',
      'Persistent local and synchronized shopping cart state management.',
      'Ready-to-integrate checkout architecture for domestic digital wallets.'
    ]
  },
  {
    id: 'image-captioning-cnn-rnn',
    title: 'Image Captioning Engine',
    tagline: 'Deep Learning Vision-to-Text Pipeline (ResNet-50 + LSTM)',
    category: ['AI / ML'],
    status: 'Open Source',
    githubUrl: 'https://github.com/DRKAFLE123/ImageCaptioning',
    featured: false,
    description: 'An automatic image description generator merging convolutional feature extraction with sequential text decoding. Utilizes a pre-trained ResNet-50 CNN encoder to capture spatial visual embeddings and an LSTM recurrent neural network decoder to generate syntactically coherent English captions.',
    techStack: ['Python', 'TensorFlow', 'Keras', 'ResNet-50', 'LSTM', 'Jupyter Notebook'],
    highlights: [
      'CNN-RNN encoder-decoder architecture benchmarked on benchmark image datasets.',
      'Preprocessing pipeline incorporating beam search and greedy decoding for sentence formation.'
    ]
  },
  {
    id: 'forest-fire-prediction',
    title: 'Forest Fire Risk Predictor',
    tagline: 'Meteorological Hazard Analysis & Machine Learning Modeling',
    category: ['AI / ML'],
    status: 'Open Source',
    githubUrl: 'https://github.com/DRKAFLE123/ForestFirePredict',
    featured: false,
    description: 'A data science and machine learning research project analyzing meteorological parameters (temperature, relative humidity, wind velocity, and precipitation) to predict wildland fire incidence and burned area severity.',
    techStack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    highlights: [
      'Exploratory data analysis identifying correlations between climate metrics and fire outbreaks.',
      'Comparative evaluation of regression and classification models with hyperparameter tuning.'
    ]
  },
  {
    id: 'face-recognition-cv',
    title: 'Real-Time Facial Recognition',
    tagline: 'Computer Vision Identity Verification Pipeline',
    category: ['AI / ML'],
    status: 'Open Source',
    githubUrl: 'https://github.com/DRKAFLE123/faceRecog',
    featured: false,
    description: 'Real-time face detection, alignment, and classification pipeline using OpenCV Haar cascades / DNN detectors and deep convolutional embeddings for real-time webcam identity verification.',
    techStack: ['Python', 'OpenCV', 'TensorFlow', 'Computer Vision'],
    highlights: [
      'Low-latency face boundary box tracking on real-time video frames.',
      'Robust feature matching under varied lighting conditions and facial angles.'
    ]
  },
  {
    id: 'ai-voice',
    title: 'AI Voice Synthesizer',
    tagline: 'AI Audio Synthesis & Voice Generation Pipeline',
    category: ['AI / ML', 'Web Applications'],
    status: 'Open Source',
    githubUrl: 'https://github.com/DRKAFLE123/AI-Voice',
    featured: false,
    description: 'An experimental voice synthesis and generative audio platform developed in TypeScript to explore neural text-to-speech audio pipelines, waveform visualization, and voice parameters.',
    techStack: ['TypeScript', 'Node.js', 'Web Audio API', 'AI Audio'],
    highlights: [
      'Interactive audio rendering interface with frequency visualization.',
      'Modular client architecture connecting to modern text-to-speech synthesis backends.'
    ]
  },
  {
    id: 'maze-and-puzzle',
    title: 'Maze & Puzzle Heuristics',
    tagline: 'Algorithmic Game Engine & Pathfinding Visualizer',
    category: ['Ongoing', 'Games'],
    status: 'Ongoing Project',
    githubUrl: 'https://github.com/DRKAFLE123/Pygame',
    featured: false,
    description: 'An exploratory algorithmic game development suite implementing procedural maze generation, collision matrices, and pathfinding heuristics (A* and BFS) wrapped in real-time Python/Pygame game loops.',
    techStack: ['Python', 'Pygame', 'Algorithms', 'Data Structures'],
    highlights: [
      'Procedural labyrinth generator utilizing depth-first recursive back-tracking.',
      'Real-time pathfinder showing algorithmic search fronts and optimal route calculations.'
    ]
  },
  {
    id: 'dating-app',
    title: 'Dating & Social Networking App',
    tagline: 'Modern Social Matchmaking & Messaging Architecture',
    category: ['Ongoing', 'Web Applications'],
    status: 'Ongoing Project',
    githubUrl: 'https://github.com/DRKAFLE123/collegeproject1',
    featured: false,
    description: 'A social application concept focusing on secure user profiles, interest-based matchmaking, real-time message exchange, and fluid responsive UI card interactions.',
    techStack: ['React', 'JavaScript', 'REST APIs', 'CSS3'],
    highlights: [
      'Gesture and button-based profile discovery cards.',
      'Protected direct messaging layout with optimistic UI updates.'
    ]
  },
  {
    id: 'tenant-management',
    title: 'Tenant & Property Management System',
    tagline: 'Relational Database Rental Workflow Automation',
    category: ['Ongoing', 'Web Applications'],
    status: 'Ongoing Project',
    githubUrl: 'https://github.com/DRKAFLE123/Hostel-Management-System',
    featured: false,
    description: 'A property allocation and ledger management platform created to handle tenant registrations, room occupancy tracking, monthly rent invoicing, and maintenance request queues.',
    techStack: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'Bootstrap'],
    highlights: [
      'Normalized relational schema preventing double-booking and tracking rental lease periods.',
      'Automated dues calculation and ledger receipt generation.'
    ]
  }
];
