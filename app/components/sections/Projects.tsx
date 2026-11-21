'use client';
import { useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoGridOutline, IoStar, IoLogoGithub, IoOpenOutline, IoChevronForward, IoCheckmarkCircle, IoGlobeOutline,
  IoCodeSlash, IoShieldCheckmark, IoSparkles, IoPhonePortraitOutline, IoHardwareChip, IoCube, IoSearch, IoRadio,
} from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { SidebarItem, SidebarSection, PushButton } from '../ui/mac';
import { SQUIRCLE } from '../icons/AppIcons';
import { PROJECTS, CATEGORIES, GITHUB_PROFILE, Project, ProjectCategory } from '../projects-data';

type Filter = 'All' | 'Featured' | 'Live' | ProjectCategory;

const CATEGORY_ICONS: Record<ProjectCategory, IconType> = {
  Web: IoCodeSlash,
  Security: IoShieldCheckmark,
  'AI & ML': IoSparkles,
  Mobile: IoPhonePortraitOutline,
  'IoT & Robotics': IoHardwareChip,
  Blockchain: IoCube,
};

const matches = (p: Project, f: Filter) =>
  f === 'All' ? true : f === 'Featured' ? Boolean(p.featured) : f === 'Live' ? Boolean(p.live) : p.category === f;

/** App-icon style tile with the project's initials — one accent for every project. */
function ProjectTile({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name.replace(/[()]/g, '').split(/[\s-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="absolute inset-0" aria-hidden>
        <defs>
          <linearGradient id="project-tile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4d9bff" /><stop offset="1" stopColor="#0a5fd9" />
          </linearGradient>
        </defs>
        <path d={SQUIRCLE} fill="url(#project-tile)" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white font-semibold" style={{ fontSize: size * 0.36 }}>{initials}</span>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(PROJECTS[0].name);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROJECTS.filter(p => matches(p, filter) && (!q || `${p.name} ${p.description} ${p.stack.join(' ')} ${p.category}`.toLowerCase().includes(q)));
  }, [filter, query]);

  const project = list.find(p => p.name === selected) ?? list[0];
  const count = (f: Filter) => PROJECTS.filter(p => matches(p, f)).length;

  const sidebar = (
    <>
      <SidebarSection title="Library">
        <SidebarItem icon={<IoGridOutline />} label="All Projects" badge={count('All')} active={filter === 'All'} onClick={() => setFilter('All')} />
        <SidebarItem icon={<IoStar />} label="Featured" badge={count('Featured')} active={filter === 'Featured'} onClick={() => setFilter('Featured')} />
        <SidebarItem icon={<IoRadio />} label="Live Sites" badge={count('Live')} active={filter === 'Live'} onClick={() => setFilter('Live')} />
      </SidebarSection>
      <SidebarSection title="Categories">
        {CATEGORIES.map(c => {
          const Icon = CATEGORY_ICONS[c];
          return <SidebarItem key={c} icon={<Icon />} label={c} badge={count(c)} active={filter === c} onClick={() => setFilter(c)} />;
        })}
      </SidebarSection>
      <SidebarSection title="GitHub">
        <a href={GITHUB_PROFILE} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center gap-2 h-7 px-2.5 rounded-md text-[13px] hover:bg-black/4 dark:hover:bg-white/5">
          <span className="flex items-center justify-center w-4.5 text-macblue"><IoLogoGithub /></span>
          <span className="flex-1 truncate">All repositories</span>
          <IoOpenOutline className="text-[11px] opacity-40" />
        </a>
      </SidebarSection>
    </>
  );

  return (
    <WindowLayout title="Projects" subtitle={`${list.length} of ${PROJECTS.length} projects`} sidebar={sidebar} sidebarWidth={200}>
      <div className="flex h-full">
        {/* List column */}
        <div className="w-64 shrink-0 border-r border-(--hairline) flex flex-col">
          <div className="p-2 border-b border-(--hairline)">
            <div className="flex items-center gap-1.5 h-6.5 px-2 rounded-md bg-black/6 dark:bg-white/8">
              <IoSearch className="text-[12px] opacity-45" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects or tech"
                className="bg-transparent outline-none text-[13px] w-full placeholder:text-black/40 dark:placeholder:text-white/40" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto mac-scroll p-1.5">
            {list.length === 0 && <div className="p-6 text-center text-[12px] text-black/45 dark:text-white/45">No projects match “{query}”.</div>}
            {list.map(p => {
              const active = project?.name === p.name;
              return (
                <button key={p.name} type="button" onClick={() => setSelected(p.name)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-md text-left ${active ? 'bg-macblue text-white' : 'hover:bg-black/4 dark:hover:bg-white/5'}`}>
                  <ProjectTile name={p.name} size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium leading-snug line-clamp-2">
                      {p.name}
                      {p.featured && <IoStar className={`inline text-[10px] ml-1 -mt-0.5 ${active ? 'text-white' : 'text-macblue'}`} />}
                    </div>
                    <div className={`text-[11px] truncate ${active ? 'text-white/75' : 'text-black/50 dark:text-white/50'}`}>
                      {p.category} · {p.year}{p.live ? ' · Live' : ''}
                    </div>
                  </div>
                  <IoChevronForward className={`text-[11px] ${active ? 'text-white/70' : 'opacity-30'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        {project ? (
          <div className="flex-1 min-w-0 overflow-y-auto mac-scroll px-7 py-6">
            <div className="max-w-180">
              <div className="flex items-start gap-4 mb-5">
                <ProjectTile name={project.name} size={72} />
                <div className="flex-1 min-w-0">
                  <h2 className="text-[22px] font-semibold leading-tight">{project.name}</h2>
                  <div className="text-[12px] text-black/50 dark:text-white/50 mt-1">{project.category} · {project.year}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.live && <PushButton primary href={project.live}><IoGlobeOutline /> Visit Site</PushButton>}
                    <PushButton primary={!project.live} href={project.repo}><IoLogoGithub /> View on GitHub</PushButton>
                  </div>
                </div>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[
                  ['Status', project.live ? 'Live' : 'Source'],
                  ['Category', project.category],
                  ['Year', project.year],
                  ['Stack', `${project.stack.length} tools`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-black/3 dark:bg-white/6 px-3 py-2">
                    <div className="text-[11px] text-black/45 dark:text-white/45">{k}</div>
                    <div className="text-[13px] font-medium mt-0.5 truncate">{v}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-[13px] font-semibold mb-1.5">Overview</h3>
              <p className="text-[13px] leading-relaxed text-black/75 dark:text-white/75 mb-6">{project.description}</p>

              <h3 className="text-[13px] font-semibold mb-2">Key Features</h3>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                {project.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] text-black/75 dark:text-white/75">
                    <IoCheckmarkCircle className="mt-0.5 shrink-0 text-[15px] text-macblue" />
                    {feature}
                  </li>
                ))}
              </ul>

              <h3 className="text-[13px] font-semibold mb-2">Built With</h3>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.stack.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-[5px] text-[12px] bg-black/5 dark:bg-white/8 text-black/70 dark:text-white/75">{tag}</span>
                ))}
              </div>

              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] text-macblue hover:underline">
                {project.repo.replace('https://', '')} <IoOpenOutline className="text-[11px]" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[13px] text-black/45 dark:text-white/45">No project selected</div>
        )}
      </div>
    </WindowLayout>
  );
}
