'use client';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  IoColorPalette, IoServer, IoLayers, IoConstruct, IoHardwareChip, IoBrush,
  IoPeople, IoExtensionPuzzle, IoChatbubbles, IoSync, IoTime, IoBulb, IoHandLeft, IoLibrary, IoSearch,
} from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { InsetGroup, GroupRow, LevelBar, SymbolTile } from '../ui/mac';

const skillCategories: { title: string; Glyph: IconType; color: string; skills: { name: string; level: number; desc: string }[] }[] = [
  {
    title: 'Frontend', Glyph: IoColorPalette, color: '#af52de',
    skills: [
      { name: 'React', level: 95, desc: 'Hooks, Context, Redux, React Query' },
      { name: 'Next.js', level: 90, desc: 'App Router, SSR, SSG, API Routes' },
      { name: 'TypeScript', level: 85, desc: 'Types, Generics, Decorators' },
      { name: 'Tailwind CSS', level: 95, desc: 'Utility-first, Custom themes' },
      { name: 'HTML5/CSS3', level: 98, desc: 'Semantic HTML, Animations, Grid' },
    ],
  },
  {
    title: 'Backend', Glyph: IoServer, color: '#007aff',
    skills: [
      { name: 'Node.js', level: 90, desc: 'Express, REST APIs, WebSockets' },
      { name: 'Python', level: 88, desc: 'Django, Flask, FastAPI, Scripts' },
      { name: 'Java', level: 82, desc: 'Spring Boot, OOP, Data Structures' },
      { name: 'PHP', level: 80, desc: 'Laravel, MVC, Eloquent ORM' },
      { name: 'Express', level: 85, desc: 'Middleware, Auth, File uploads' },
    ],
  },
  {
    title: 'Databases', Glyph: IoLayers, color: '#34c759',
    skills: [
      { name: 'PostgreSQL', level: 85, desc: 'Complex queries, Indexing, Views' },
      { name: 'MongoDB', level: 88, desc: 'Aggregation, Atlas, Mongoose' },
      { name: 'MySQL', level: 82, desc: 'Stored procedures, Optimization' },
      { name: 'Firebase', level: 80, desc: 'Firestore, Auth, Realtime DB' },
    ],
  },
  {
    title: 'Tools & DevOps', Glyph: IoConstruct, color: '#8e8e93',
    skills: [
      { name: 'Git & GitHub', level: 92, desc: 'Branching, PRs, CI/CD Actions' },
      { name: 'Docker', level: 78, desc: 'Containers, Compose, Networking' },
      { name: 'Linux', level: 85, desc: 'Shell scripting, System admin' },
      { name: 'Django', level: 80, desc: 'ORM, Admin, REST Framework' },
      { name: 'Laravel', level: 75, desc: 'Eloquent, Blade, Queues' },
    ],
  },
  {
    title: 'AI & Data', Glyph: IoHardwareChip, color: '#ff2d55',
    skills: [
      { name: 'TensorFlow', level: 75, desc: 'Neural networks, Model training' },
      { name: 'OpenAI APIs', level: 85, desc: 'GPT-4, Embeddings, Fine-tuning' },
      { name: 'Data Analysis', level: 80, desc: 'Pandas, NumPy, Matplotlib' },
      { name: 'Prompt Engineering', level: 88, desc: 'Chain-of-thought, RAG, Agents' },
    ],
  },
  {
    title: 'Design & UX', Glyph: IoBrush, color: '#ff9500',
    skills: [
      { name: 'Figma', level: 85, desc: 'Wireframes, Prototypes, Components' },
      { name: 'UI/UX Design', level: 82, desc: 'User research, Accessibility' },
      { name: 'Responsive Design', level: 95, desc: 'Mobile-first, Cross-browser' },
    ],
  },
];

const softSkills: { name: string; Glyph: IconType; color: string }[] = [
  { name: 'Team Leadership', Glyph: IoPeople, color: '#007aff' },
  { name: 'Problem Solving', Glyph: IoExtensionPuzzle, color: '#5856d6' },
  { name: 'Communication', Glyph: IoChatbubbles, color: '#34c759' },
  { name: 'Adaptability', Glyph: IoSync, color: '#32ade6' },
  { name: 'Time Management', Glyph: IoTime, color: '#ff9500' },
  { name: 'Critical Thinking', Glyph: IoBulb, color: '#ffcc00' },
  { name: 'Collaboration', Glyph: IoHandLeft, color: '#ff2d55' },
  { name: 'Continuous Learning', Glyph: IoLibrary, color: '#a2845e' },
];

export default function Skills() {
  const [active, setActive] = useState<number | 'soft'>(0);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const avg = (i: number) => Math.round(skillCategories[i].skills.reduce((a, s) => a + s.level, 0) / skillCategories[i].skills.length);

  const sidebar = (
    <>
      <div className="flex items-center gap-1.5 h-[26px] px-2 mb-3 rounded-md bg-black/[0.06] dark:bg-white/[0.08]">
        <IoSearch className="text-[12px] opacity-45" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search"
          className="bg-transparent outline-none text-[13px] w-full placeholder:text-black/40 dark:placeholder:text-white/40" />
      </div>
      {/* Profile row, like the Apple Account row in System Settings */}
      <button type="button" onClick={() => setActive(0)} className="w-full flex items-center gap-2.5 px-2 py-2 mb-3 rounded-lg text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.05]">
        <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[14px] font-semibold bg-[linear-gradient(180deg,#a8a8b0,#6c6c74)]">MP</span>
        <span className="min-w-0">
          <span className="block text-[13px] font-semibold truncate">Mugisha Pacifique</span>
          <span className="block text-[11px] text-black/50 dark:text-white/50">25+ technologies</span>
        </span>
      </button>
      <div className="space-y-px">
        {skillCategories.map((c, i) => {
          if (q && !c.title.toLowerCase().includes(q) && !c.skills.some(s => s.name.toLowerCase().includes(q))) return null;
          const sel = active === i;
          return (
            <button key={c.title} type="button" onClick={() => setActive(i)}
              className={`w-full flex items-center gap-2 h-7 px-2 rounded-md text-[13px] text-left ${sel ? 'bg-macblue text-white' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'}`}>
              <SymbolTile Glyph={c.Glyph} color={c.color} size={20} />
              <span className="truncate">{c.title}</span>
            </button>
          );
        })}
        <div className="h-2" />
        <button type="button" onClick={() => setActive('soft')}
          className={`w-full flex items-center gap-2 h-7 px-2 rounded-md text-[13px] text-left ${active === 'soft' ? 'bg-macblue text-white' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'}`}>
          <SymbolTile Glyph={IoPeople} color="#5ac8fa" size={20} />
          <span>Soft Skills</span>
        </button>
      </div>
    </>
  );

  const cat = active === 'soft' ? null : skillCategories[active];

  return (
    <WindowLayout title={cat ? cat.title : 'Soft Skills'} sidebar={sidebar} sidebarWidth={220} surface="grouped">
      <div className="max-w-[560px] mx-auto px-6 py-6">
        {cat ? (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <SymbolTile Glyph={cat.Glyph} color={cat.color} size={56} />
              <h2 className="text-[20px] font-semibold mt-3">{cat.title}</h2>
              <p className="text-[12px] text-black/50 dark:text-white/50 mt-0.5">{cat.skills.length} skills · average proficiency {avg(active as number)}%</p>
            </div>
            <InsetGroup footer="Proficiency reflects hands-on production experience.">
              {cat.skills.map(s => (
                <GroupRow
                  key={s.name}
                  label={<span className={q && s.name.toLowerCase().includes(q) ? 'font-semibold' : ''}>{s.name}</span>}
                  detail={s.desc}
                  right={
                    <span className="flex items-center gap-2.5 w-[150px]">
                      <LevelBar value={s.level} color={cat.color} />
                      <span className="w-8 text-right tabular-nums">{s.level}%</span>
                    </span>
                  }
                />
              ))}
            </InsetGroup>
            <InsetGroup title="All Categories">
              {skillCategories.map((c, i) => (
                <GroupRow key={c.title} onClick={() => setActive(i)}
                  icon={<SymbolTile Glyph={c.Glyph} color={c.color} size={24} />}
                  label={c.title}
                  right={<span className="tabular-nums">{avg(i)}%</span>} />
              ))}
            </InsetGroup>
          </>
        ) : (
          <InsetGroup title="Soft Skills & Interests">
            {softSkills.map(s => (
              <GroupRow key={s.name} icon={<SymbolTile Glyph={s.Glyph} color={s.color} size={24} />} label={s.name} />
            ))}
          </InsetGroup>
        )}
      </div>
    </WindowLayout>
  );
}
