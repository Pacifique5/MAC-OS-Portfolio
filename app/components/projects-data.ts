// Projects shown in the Projects app — taken from github.com/Pacifique5.
// Descriptions and stacks come from each repository's own description and topics.

export const GITHUB_PROFILE = 'https://github.com/Pacifique5';

export type ProjectCategory = 'Web' | 'Security' | 'AI & ML' | 'Mobile' | 'IoT & Robotics' | 'Blockchain';

export interface Project {
  name: string;
  repo: string;
  description: string;
  category: ProjectCategory;
  stack: string[];
  features: string[];
  year: string;
  live?: string;
  featured?: boolean;
}

const repo = (name: string) => `${GITHUB_PROFILE}/${name}`;

export const PROJECTS: Project[] = [
  /* ---------------------------------- Web ---------------------------------- */
  {
    name: 'macOS Portfolio',
    repo: repo('MAC-OS-Portfolio'),
    live: 'https://mfique5.vercel.app/',
    description: 'Modern macOS-style portfolio website with an interactive desktop interface, featuring draggable windows, a functional menu bar, Spotlight search and dock navigation.',
    category: 'Web',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    features: ['Draggable, focusable windows', 'Working menu bar and Control Center', 'Spotlight search and Launchpad', 'Dock navigation with magnification'],
    year: '2026',
    featured: true,
  },
  {
    name: 'Dataset Request Desk',
    repo: repo('Dataset-Request-Desk'),
    live: 'https://dataset-request-desk.vercel.app',
    description: 'Internal platform for a robotics data company: clients request teleoperation episode datasets, operators fulfil them, and clients accept or reject the results.',
    category: 'Web',
    stack: ['FastAPI', 'PostgreSQL', 'Next.js', 'Docker', 'GitHub Actions'],
    features: ['Client, operator and admin roles (RBAC)', 'Live updates with server-sent events', 'Docker Compose environment', 'CI pipeline with GitHub Actions'],
    year: '2026',
    featured: true,
  },
  {
    name: 'E-RECORD',
    repo: repo('E-RECORD'),
    description: 'School management system with financial tracking, inventory management and a multi-role portal.',
    category: 'Web',
    stack: ['NestJS', 'Next.js', 'PostgreSQL', 'TypeORM', 'Radix UI'],
    features: ['Financial tracking', 'Inventory management', 'Multi-role portal', 'JWT authentication'],
    year: '2026',
  },
  {
    name: 'EduSphere',
    repo: repo('EduSphere'),
    description: 'A full-stack Learning Management System with course management, authentication, dashboards and dark mode.',
    category: 'Web',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    features: ['Course management', 'JWT authentication', 'Learner and admin dashboards', 'Dark mode'],
    year: '2026',
  },
  {
    name: 'Fuel Route Optimizer API',
    repo: repo('Fuel-Route-Api-Django'),
    description: 'A Django REST API that calculates optimal fuel stops for long-distance routes in the USA, using data from 8,151+ truck stops.',
    category: 'Web',
    stack: ['Django', 'Django REST Framework', 'OpenRouteService'],
    features: ['Real-time route planning', 'Fuel cost optimisation', 'Data from 8,151+ truck stops', 'Route geometry for map visualisation'],
    year: '2026',
  },
  {
    name: 'Equipment Management System',
    repo: repo('Equipment-Management-System'),
    description: 'Spring Boot REST API with a React/TypeScript frontend for managing equipment requests, allocations and returns.',
    category: 'Web',
    stack: ['Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'MUI'],
    features: ['Equipment requests and allocations', 'Return tracking', 'Role-based access control', 'JWT-secured REST API'],
    year: '2026',
  },
  {
    name: 'Wallet Web Application',
    repo: repo('Wallet-Web-Application'),
    description: 'Full-stack personal finance app to manage accounts, transactions and budgets with data visualisation.',
    category: 'Web',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Chart.js'],
    features: ['Accounts, transactions and budgets', 'Chart.js dashboards', 'Real-time notifications', 'JWT authentication'],
    year: '2025',
  },
  {
    name: 'Rwamu Cleaning Company',
    repo: repo('Rwamu-Cleaning-Company'),
    live: 'https://rwamu-company.vercel.app/',
    description: 'Official website for Rwamu Cleaning Soap Products, a Rwandan company producing high-quality liquid cleaning soaps for homes and institutions.',
    category: 'Web',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    features: ['Business and product showcase', 'Responsive UI/UX', 'Deployed on Vercel'],
    year: '2026',
  },

  /* -------------------------------- Security ------------------------------- */
  {
    name: 'Secure Campus',
    repo: repo('Secure-Campus'),
    live: 'https://secure-campus.vercel.app',
    description: 'A security-first campus management system with role-based dashboards, smart attendance tracking and real-time cybersecurity monitoring.',
    category: 'Security',
    stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'JWT'],
    features: ['Role-based dashboards', 'Smart attendance tracking', 'Real-time security monitoring', 'JWT authentication'],
    year: '2026',
    featured: true,
  },
  {
    name: 'Cyber Forge',
    repo: repo('Cyber-Forge'),
    live: 'https://cyberforge1.vercel.app',
    description: 'A full-stack cybersecurity education platform where users take on security challenges, submit vulnerability reports and track their progress.',
    category: 'Security',
    stack: ['Next.js', 'Node.js', 'Prisma', 'PostgreSQL'],
    features: ['Security challenges', 'Vulnerability report submissions', 'Progress dashboard', 'Deployed on Vercel and Render'],
    year: '2026',
    featured: true,
  },
  {
    name: 'BioAccess',
    repo: repo('Bio-Access'),
    description: 'A biometric attendance platform that uses Windows Hello and WebAuthn to verify the real person behind every check-in.',
    category: 'Security',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebAuthn'],
    features: ['Fingerprint registration per employee', 'Real-time attendance tracking', 'Admin dashboard for teams', 'Payroll-ready reports'],
    year: '2026',
  },
  {
    name: 'Backdoor Game',
    repo: repo('Backdoor-Game'),
    description: 'Educational backdoor game for a cybersecurity course, demonstrating reverse shells, persistence and dependency injection inside an isolated VM.',
    category: 'Security',
    stack: ['Python'],
    features: ['Reverse shell demonstration', 'Persistence techniques', 'Dependency injection', 'Runs in an isolated VM for safe learning'],
    year: '2026',
  },

  /* --------------------------------- AI & ML -------------------------------- */
  {
    name: 'SymptomAI',
    repo: repo('Health-AI'),
    live: 'https://health-symptom-ai.vercel.app',
    description: 'An AI-powered health assistant that analyses symptoms, provides personalised health insights and points users to appropriate healthcare guidance.',
    category: 'AI & ML',
    stack: ['Next.js', 'TypeScript', 'Flask', 'Python'],
    features: ['AI symptom analysis', 'Personalised health insights', 'Healthcare guidance', 'Flask API on Render'],
    year: '2026',
    featured: true,
  },
  {
    name: 'Student Grade Prediction',
    repo: repo('Student-Grade-Prediction'),
    description: 'AI-powered web app that predicts student performance from study habits, sleep and scores, with dual AI models and smart validation.',
    category: 'AI & ML',
    stack: ['Django', 'Django REST Framework', 'scikit-learn'],
    features: ['Dual AI models', 'Random-forest predictions', 'Smart input validation', 'REST API'],
    year: '2026',
  },
  {
    name: 'Plate Detection (ANPR)',
    repo: repo('Plate-Detection'),
    description: 'Automatic Number Plate Recognition pipeline: real-time plate detection, alignment, OCR and regex validation.',
    category: 'AI & ML',
    stack: ['Python', 'OpenCV', 'Tesseract'],
    features: ['Real-time plate detection', 'Plate alignment', 'OCR text extraction', 'Regex validation'],
    year: '2026',
  },
  {
    name: 'Vehicle Analytics Dashboard',
    repo: repo('Vehicle-Analytics-Dashboard'),
    description: 'Interactive vehicle sales analytics dashboard with exploratory data analysis, profit analysis and geographic client distribution maps.',
    category: 'AI & ML',
    stack: ['Django', 'Plotly', 'Pandas', 'Python'],
    features: ['Exploratory data analysis', 'Profit analysis', 'Choropleth client maps', 'Interactive Plotly charts'],
    year: '2026',
  },
  {
    name: 'AI Chat Bot',
    repo: repo('AI-BOT'),
    description: 'Full-stack AI chat app with a FastAPI backend and React frontend, powered by OpenAI’s Chat Completions API.',
    category: 'AI & ML',
    stack: ['FastAPI', 'React', 'Vite', 'OpenAI'],
    features: ['Conversational AI chat', 'FastAPI backend', 'React + Vite frontend'],
    year: '2025',
  },
  {
    name: 'Water Meter Labeling Tool',
    repo: repo('Infrastructure-Development'),
    description: 'A desktop GUI for labelling water meter images with YOLO bounding boxes, saving labels in YOLO .txt format.',
    category: 'AI & ML',
    stack: ['Python', 'PySide6', 'OpenCV', 'YOLO'],
    features: ['Draw, move and resize boxes', 'Rotate annotations', 'Export YOLO .txt labels'],
    year: '2026',
  },

  /* --------------------------------- Mobile --------------------------------- */
  {
    name: 'Mobile Restaurant App',
    repo: repo('Mobile-Restaurant-App'),
    description: 'A Flutter food ordering app built with GetX (MVVM), supporting multiple payment gateways, local notifications and real-time chat.',
    category: 'Mobile',
    stack: ['Flutter', 'Dart', 'GetX'],
    features: ['Multiple payment gateways', 'Local notifications', 'Real-time chat', 'MVVM architecture'],
    year: '2026',
  },
  {
    name: 'Street Dunk Challenge',
    repo: repo('Street-Dunk-Game'),
    description: 'An immersive mobile basketball arcade game with realistic animations, dynamic gameplay and a combo scoring system.',
    category: 'Mobile',
    stack: ['React Native', 'Expo', 'react-native-svg'],
    features: ['Realistic animations', 'Combo scoring system', 'Runs on iOS and Android'],
    year: '2026',
  },
  {
    name: 'Push Notification Kit',
    repo: repo('Notification-Mobile'),
    description: 'Build and demo push notifications across devices with a lightweight React Native client and a Node.js backend.',
    category: 'Mobile',
    stack: ['React Native', 'Expo', 'Node.js', 'TypeScript'],
    features: ['Real-time push notifications', 'Customisable messages', 'Example server with email fallback'],
    year: '2026',
  },
  {
    name: 'RCA FoodBot',
    repo: repo('RCA-FoodBot-V1'),
    description: 'A Slack bot that manages food ordering, lets users request access tokens and posts to Slack channels, with an admin portal for user management.',
    category: 'Web',
    stack: ['Node.js', 'Express', 'MongoDB', 'Flutter', 'Slack API'],
    features: ['Food ordering in Slack', 'Access-token requests', 'Admin portal for users'],
    year: '2026',
  },

  /* ----------------------------- IoT & Robotics ----------------------------- */
  {
    name: 'Division Vision Control',
    repo: repo('Division-Vision-Control-System'),
    description: 'Distributed face-tracking system that recognises a target face via webcam, then sends servo angle commands to an ESP8266 over MQTT.',
    category: 'IoT & Robotics',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'ESP8266', 'MQTT'],
    features: ['Face recognition (ArcFace / ONNX)', 'Real-time face tracking', 'Servo control over MQTT', 'ESP8266 firmware'],
    year: '2026',
  },
  {
    name: 'Machine Learning & Robotics',
    repo: repo('Machine-Learning-and-Robotics'),
    description: 'Collection of Python, robotics and embedded systems work, including Arduino libraries for NeoPixel LEDs, WebSockets, ESP8266, cryptography and IR remote control.',
    category: 'IoT & Robotics',
    stack: ['Python', 'Arduino', 'ESP8266'],
    features: ['NeoPixel LED control', 'WebSockets on microcontrollers', 'IR remote control', 'Embedded cryptography'],
    year: '2025',
  },

  /* ------------------------------- Blockchain ------------------------------- */
  {
    name: 'Pet Shop dApp',
    repo: repo('Pet-Shop'),
    description: 'A decentralised pet adoption application built with Ethereum smart contracts and the Truffle framework.',
    category: 'Blockchain',
    stack: ['Solidity', 'Ethereum', 'Truffle', 'Web3'],
    features: ['Smart-contract adoptions', 'Web3 wallet integration', 'Truffle test suite'],
    year: '2026',
  },
];

export const CATEGORIES: ProjectCategory[] = ['Web', 'Security', 'AI & ML', 'Mobile', 'IoT & Robotics', 'Blockchain'];
