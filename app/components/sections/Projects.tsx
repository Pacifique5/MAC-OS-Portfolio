'use client';
import { useState } from 'react';
import { IoGridOutline, IoGlobeOutline, IoPhonePortraitOutline, IoStar, IoLogoGithub, IoOpenOutline, IoChevronForward } from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { SidebarItem, SidebarSection, PushButton } from '../ui/mac';
import { SQUIRCLE } from '../icons/AppIcons';

const projects = [
  {
    title: 'Next Portfolio Website',
    description: 'A modern macOS-style portfolio website built with Next.js and Tailwind CSS. Features a fully interactive desktop interface with draggable windows, functional dock, Spotlight search, and real macOS menu bar.',
    longDesc: 'Built from scratch with a focus on pixel-perfect macOS UI replication. Includes working traffic light buttons, context menus, notification center, and smooth animations throughout.',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'React Icons'],
    category: 'Web', featured: true,
    github: 'https://github.com/Pacifique5/MAC-OS-Portfolio', live: 'https://github.com/Pacifique5',
    color: ['#8b5cf6', '#4f46e5'], year: '2024', status: 'Live',
  },
  {
    title: 'CacheNet',
    description: 'A network caching solution enabling offline content access for education during internet outages — bridging the digital divide in underserved communities.',
    longDesc: 'Uses service workers and local caching strategies to serve educational content even without internet. Supports video, documents, and interactive quizzes offline.',
    tags: ['Next.js', 'React Native', 'Node.js', 'Service Workers', 'PWA'],
    category: 'Mobile', featured: true,
    github: 'https://github.com/Pacifique5', live: 'https://github.com/Pacifique5',
    color: ['#06b6d4', '#2563eb'], year: '2024', status: 'Live',
  },
  {
    title: 'FARM PRO',
    description: 'A full-stack farm management system with inventory tracking, crop monitoring, weather integration, and a real-time analytics dashboard for modern agriculture.',
    longDesc: 'Helps farmers track crop cycles, manage inventory, monitor weather conditions, and generate reports. Built with Laravel backend and a responsive frontend.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Chart.js', 'Bootstrap'],
    category: 'Web', featured: false,
    github: 'https://github.com/Pacifique5', live: 'https://github.com/Pacifique5',
    color: ['#22c55e', '#059669'], year: '2023', status: 'Completed',
  },
  {
    title: 'Library Management System',
    description: 'A comprehensive library management solution with book tracking, member management, borrowing history, fine calculation, and a full-featured admin panel.',
    longDesc: 'Supports multiple user roles (admin, librarian, member), automated fine calculation, email notifications for due dates, and detailed reporting.',
    tags: ['Laravel', 'PHP', 'MySQL', 'Blade', 'Bootstrap'],
    category: 'Web', featured: false,
    github: 'https://github.com/Pacifique5', live: 'https://github.com/Pacifique5',
    color: ['#f59e0b', '#ea580c'], year: '2023', status: 'Completed',
  },
  {
    title: 'Umurava-Website',
    description: 'Youth mentorship platform with full authentication, CRUD operations, mentor matching, and progress tracking — supporting empowerment and leadership development.',
    longDesc: 'Connects young people with mentors in their field. Features profile matching, session scheduling, progress tracking, and a community forum.',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Prisma', 'PostgreSQL'],
    category: 'Web', featured: false,
    github: 'https://github.com/Pacifique5', live: 'https://github.com/Pacifique5',
    color: ['#ec4899', '#e11d48'], year: '2023', status: 'Live',
  },
  {
    title: 'Vehicle Management System',
    description: 'A complete vehicle management solution for tracking parking spaces, fees, vehicle information, and generating detailed reports with real-time updates.',
    longDesc: 'Manages parking lot operations including space allocation, fee calculation, vehicle entry/exit logging, and monthly revenue reports.',
    tags: ['HTML', 'CSS', 'PHP', 'MySQL', 'JavaScript'],
    category: 'Web', featured: false,
    github: 'https://github.com/Pacifique5', live: 'https://github.com/Pacifique5',
    color: ['#64748b', '#334155'], year: '2022', status: 'Completed',
  },
];

type Filter = 'All' | 'Featured' | 'Web' | 'Mobile';

/** App-icon style tile with the project's initials. */
function ProjectTile({ title, color, size = 44 }: { title: string; color: string[]; size?: number }) {
  const initials = title.split(/[\s-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0">
        <defs>
          <linearGradient id={`pt-${title.replace(/\W/g, '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color[0]} /><stop offset="1" stopColor={color[1]} />
          </linearGradient>
        </defs>
        <path d={SQUIRCLE} fill={`url(#pt-${title.replace(/\W/g, '')})`} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white font-semibold" style={{ fontSize: size * 0.36 }}>{initials}</span>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const [selected, setSelected] = useState(projects[0].title);

  const list = projects.filter(p =>
    filter === 'All' ? true : filter === 'Featured' ? p.featured : p.category === filter,
  );
  const project = projects.find(p => p.title === selected) ?? list[0];

  const count = (f: Filter) => projects.filter(p => f === 'All' ? true : f === 'Featured' ? p.featured : p.category === f).length;

  const sidebar = (
    <>
      <SidebarSection title="Library">
        <SidebarItem icon={<IoGridOutline />} label="All Projects" badge={count('All')} active={filter === 'All'} onClick={() => setFilter('All')} />
        <SidebarItem icon={<IoStar />} label="Featured" badge={count('Featured')} active={filter === 'Featured'} onClick={() => setFilter('Featured')} />
      </SidebarSection>
      <SidebarSection title="Platforms">
        <SidebarItem icon={<IoGlobeOutline />} label="Web" badge={count('Web')} active={filter === 'Web'} onClick={() => setFilter('Web')} />
        <SidebarItem icon={<IoPhonePortraitOutline />} label="Mobile" badge={count('Mobile')} active={filter === 'Mobile'} onClick={() => setFilter('Mobile')} />
      </SidebarSection>
    </>
  );

  return (
    <WindowLayout title="Projects" subtitle={`${list.length} projects`} sidebar={sidebar} sidebarWidth={190}>
      <div className="flex h-full">
        {/* List column */}
        <div className="w-62.5 shrink-0 border-r border-(--hairline) overflow-y-auto mac-scroll p-1.5">
          {list.map(p => {
            const active = project?.title === p.title;
            return (
              <button key={p.title} type="button" onClick={() => setSelected(p.title)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-md text-left ${active ? 'bg-macblue text-white' : 'hover:bg-black/4 dark:hover:bg-white/5'}`}>
                <ProjectTile title={p.title} color={p.color} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate flex items-center gap-1">
                    {p.title}
                    {p.featured && <IoStar className={`text-[10px] shrink-0 ${active ? 'text-white' : 'text-[#ff9f0a]'}`} />}
                  </div>
                  <div className={`text-[11px] truncate ${active ? 'text-white/75' : 'text-black/50 dark:text-white/50'}`}>{p.category} · {p.year}</div>
                </div>
                <IoChevronForward className={`text-[11px] ${active ? 'text-white/70' : 'opacity-30'}`} />
              </button>
            );
          })}
        </div>

        {/* Detail */}
        {project && (
          <div className="flex-1 min-w-0 overflow-y-auto mac-scroll px-7 py-6">
            <div className="flex items-start gap-4 mb-5">
              <ProjectTile title={project.title} color={project.color} size={72} />
              <div className="flex-1 min-w-0">
                <h2 className="text-[22px] font-semibold leading-tight">{project.title}</h2>
                <div className="flex items-center gap-1.5 mt-1.5 text-[11px]">
                  <span className={`px-1.5 py-px rounded ${project.status === 'Live' ? 'bg-[#34c759]/15 text-[#248a3d] dark:text-[#30d158]' : 'bg-black/6 dark:bg-white/10 text-black/60 dark:text-white/60'}`}>{project.status}</span>
                  <span className="text-black/45 dark:text-white/45">{project.category} · {project.year}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <PushButton primary href={project.live}><IoOpenOutline /> Open</PushButton>
                  <PushButton href={project.github}><IoLogoGithub /> Source</PushButton>
                </div>
              </div>
            </div>

            <div className="h-px bg-(--hairline) mb-4" />
            <h3 className="text-[13px] font-semibold mb-1.5">Description</h3>
            <p className="text-[13px] leading-relaxed text-black/75 dark:text-white/75 mb-3">{project.description}</p>
            <p className="text-[13px] leading-relaxed text-black/60 dark:text-white/60 mb-5">{project.longDesc}</p>

            <h3 className="text-[13px] font-semibold mb-2">Built With</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-[5px] text-[12px] bg-black/5 dark:bg-white/8 text-black/70 dark:text-white/75">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </WindowLayout>
  );
}
