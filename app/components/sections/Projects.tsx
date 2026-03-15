'use client';
import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaStar, FaCode, FaMobile, FaGlobe } from 'react-icons/fa';

const projects = [
  {
    title: 'Next Portfolio Website',
    description: 'A modern macOS-style portfolio website built with Next.js and Tailwind CSS. Features a fully interactive desktop interface with draggable windows, functional dock, Spotlight search, and real macOS menu bar.',
    longDesc: 'Built from scratch with a focus on pixel-perfect macOS UI replication. Includes working traffic light buttons, context menus, notification center, and smooth animations throughout.',
    image: '/images/projects/11.png',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'React Icons'],
    category: 'Web',
    featured: true,
    github: 'https://github.com/Pacifique5/MAC-OS-Portfolio',
    live: 'https://github.com/Pacifique5',
    color: 'from-violet-500 to-indigo-500',
    year: '2024',
    status: 'Live',
  },
  {
    title: 'CacheNet',
    description: 'A network caching solution enabling offline content access for education during internet outages — bridging the digital divide in underserved communities.',
    longDesc: 'Uses service workers and local caching strategies to serve educational content even without internet. Supports video, documents, and interactive quizzes offline.',
    image: '/images/projects/4.png',
    tags: ['Next.js', 'React Native', 'Node.js', 'Service Workers', 'PWA'],
    category: 'Mobile',
    featured: true,
    github: 'https://github.com/Pacifique5',
    live: 'https://github.com/Pacifique5',
    color: 'from-cyan-500 to-blue-500',
    year: '2024',
    status: 'Live',
  },
  {
    title: 'FARM PRO',
    description: 'A full-stack farm management system with inventory tracking, crop monitoring, weather integration, and a real-time analytics dashboard for modern agriculture.',
    longDesc: 'Helps farmers track crop cycles, manage inventory, monitor weather conditions, and generate reports. Built with Laravel backend and a responsive frontend.',
    image: '/images/projects/2.png',
    tags: ['Laravel', 'PHP', 'MySQL', 'Chart.js', 'Bootstrap'],
    category: 'Web',
    featured: false,
    github: 'https://github.com/Pacifique5',
    live: 'https://github.com/Pacifique5',
    color: 'from-green-500 to-emerald-500',
    year: '2023',
    status: 'Completed',
  },
  {
    title: 'Library Management System',
    description: 'A comprehensive library management solution with book tracking, member management, borrowing history, fine calculation, and a full-featured admin panel.',
    longDesc: 'Supports multiple user roles (admin, librarian, member), automated fine calculation, email notifications for due dates, and detailed reporting.',
    image: '/images/projects/3.png',
    tags: ['Laravel', 'PHP', 'MySQL', 'Blade', 'Bootstrap'],
    category: 'Web',
    featured: false,
    github: 'https://github.com/Pacifique5',
    live: 'https://github.com/Pacifique5',
    color: 'from-amber-500 to-orange-500',
    year: '2023',
    status: 'Completed',
  },
  {
    title: 'Umurava-Website',
    description: 'Youth mentorship platform with full authentication, CRUD operations, mentor matching, and progress tracking — supporting empowerment and leadership development.',
    longDesc: 'Connects young people with mentors in their field. Features profile matching, session scheduling, progress tracking, and a community forum.',
    image: '/images/projects/12.png',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Prisma', 'PostgreSQL'],
    category: 'Web',
    featured: false,
    github: 'https://github.com/Pacifique5',
    live: 'https://github.com/Pacifique5',
    color: 'from-pink-500 to-rose-500',
    year: '2023',
    status: 'Live',
  },
  {
    title: 'Vehicle Management System',
    description: 'A complete vehicle management solution for tracking parking spaces, fees, vehicle information, and generating detailed reports with real-time updates.',
    longDesc: 'Manages parking lot operations including space allocation, fee calculation, vehicle entry/exit logging, and monthly revenue reports.',
    image: '/images/projects/6.png',
    tags: ['HTML', 'CSS', 'PHP', 'MySQL', 'JavaScript'],
    category: 'Web',
    featured: false,
    github: 'https://github.com/Pacifique5',
    live: 'https://github.com/Pacifique5',
    color: 'from-slate-500 to-gray-600',
    year: '2022',
    status: 'Completed',
  },
];

const categories = ['All', 'Web', 'Mobile'];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeCategory === 'All' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-8 py-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white blur-3xl" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-1">Projects</h2>
        <p className="text-white/80 text-sm mb-4">Things I've built that I'm proud of</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === cat ? 'bg-white text-orange-600 shadow-md' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                {cat}
              </button>
            ))}
          </div>
          <span className="text-white/70 text-xs">{filtered.length} projects</span>
        </div>
      </div>

      {/* Featured projects */}
      <div className="px-6 pt-6 space-y-4">
        {filtered.filter(p => p.featured).map(project => (
          <div key={project.title} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className={`h-2 bg-gradient-to-r ${project.color}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">
                    <FaStar className="text-[10px]" /> Featured
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">{project.status}</span>
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">{project.year}</span>
                </div>
                <div className="flex gap-2">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                    <FaGithub className="text-xs" />
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all">
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">{project.description}</p>
              {expanded === project.title && (
                <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed mb-3 border-l-2 border-violet-400 pl-3 italic">{project.longDesc}</p>
              )}
              <button onClick={() => setExpanded(expanded === project.title ? null : project.title)}
                className="text-xs text-violet-500 hover:text-violet-700 font-medium mb-3 transition-colors">
                {expanded === project.title ? '▲ Show less' : '▼ Read more'}
              </button>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Regular projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
          {filtered.filter(p => !p.featured).map(project => (
            <div key={project.title} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">{project.category}</span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">{project.year}</span>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
                      <FaGithub style={{ fontSize: 10 }} />
                    </a>
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white transition-all">
                      <FaExternalLinkAlt style={{ fontSize: 10 }} />
                    </a>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{project.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">{tag}</span>
                  ))}
                  {project.tags.length > 3 && <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 text-xs rounded-full">+{project.tags.length - 3}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
