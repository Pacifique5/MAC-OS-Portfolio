'use client';
import { useState } from 'react';
import { IoSearch, IoStar, IoCreateOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { Monogram } from '../icons/AppIcons';
import { ToolbarButton } from '../ui/mac';

const testimonials = [
  {
    name: 'John Doe', role: 'Senior Developer', company: 'Tech Company', relationship: 'Colleague', date: 'January 2024', rating: 5, avatar: 'JD', tint: ['#b18cf5', '#7c4ddb'] as [string, string],
    text: 'Working with Pacifique was an incredible experience. His dedication to clean code and innovative solutions is unmatched. He consistently delivered high-quality work and was always willing to help team members.',
    tags: ['Clean Code', 'Teamwork', 'Innovation'],
  },
  {
    name: 'Jane Smith', role: 'Project Manager', company: 'StartupXYZ', relationship: 'Supervisor', date: 'December 2023', rating: 5, avatar: 'JS', tint: ['#f78cb4', '#d9437a'] as [string, string],
    text: 'Pacifique demonstrated exceptional problem-solving skills and leadership throughout our project. His ability to learn new technologies quickly and apply them effectively made him an invaluable team member.',
    tags: ['Leadership', 'Fast Learner', 'Problem Solving'],
  },
  {
    name: 'Alex Johnson', role: 'Full-Stack Developer', company: 'DevAgency', relationship: 'Colleague', date: 'November 2023', rating: 5, avatar: 'AJ', tint: ['#6cc4ff', '#2f84e0'] as [string, string],
    text: 'I had the pleasure of collaborating with Pacifique on multiple projects. His technical expertise in React and Next.js, combined with his excellent communication skills, made every project a success.',
    tags: ['React', 'Next.js', 'Communication'],
  },
  {
    name: 'Sarah Williams', role: 'UI/UX Designer', company: 'DesignStudio', relationship: 'Team Member', date: 'October 2023', rating: 5, avatar: 'SW', tint: ['#5fd8b0', '#21a67a'] as [string, string],
    text: "Pacifique's attention to detail and commitment to creating user-friendly interfaces is remarkable. He bridges the gap between design and development seamlessly, always respecting the design vision.",
    tags: ['UI/UX', 'Attention to Detail', 'Design-Dev Bridge'],
  },
  {
    name: 'Michael Brown', role: 'Tech Lead', company: 'InnovateTech', relationship: 'Mentor', date: 'September 2023', rating: 5, avatar: 'MB', tint: ['#ffc06a', '#f08a1c'] as [string, string],
    text: "As Pacifique's mentor, I've watched him grow into an exceptional developer. His passion for learning and his ability to tackle complex challenges head-on is truly inspiring. He's one of the best I've mentored.",
    tags: ['Growth Mindset', 'Complex Problems', 'Passion'],
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const t = testimonials[active];
  const list = testimonials
    .map((x, i) => ({ ...x, i }))
    .filter(x => `${x.name} ${x.company} ${x.text}`.toLowerCase().includes(query.toLowerCase()));

  const sidebar = (
    <>
      <div className="flex items-center gap-1.5 h-[26px] px-2 mb-2 rounded-md bg-black/[0.06] dark:bg-white/[0.08]">
        <IoSearch className="text-[12px] opacity-45" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search"
          className="bg-transparent outline-none text-[13px] w-full placeholder:text-black/40 dark:placeholder:text-white/40" />
      </div>
      <div className="space-y-px">
        {list.map(x => {
          const sel = x.i === active;
          return (
            <button key={x.name} type="button" onClick={() => setActive(x.i)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left ${sel ? 'bg-macblue text-white' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'}`}>
              <Monogram initials={x.avatar} size={36} tint={x.tint} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-semibold truncate">{x.name}</span>
                  <span className={`text-[11px] flex-shrink-0 ${sel ? 'text-white/75' : 'text-black/40 dark:text-white/40'}`}>{x.date.split(' ')[0].slice(0, 3)}</span>
                </div>
                <div className={`text-[12px] leading-snug line-clamp-2 ${sel ? 'text-white/80' : 'text-black/50 dark:text-white/50'}`}>{x.text}</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <WindowLayout
      title={t.name}
      subtitle={`${t.role} · ${t.company}`}
      sidebar={sidebar}
      sidebarWidth={260}
      toolbar={<><ToolbarButton title="Info"><IoInformationCircleOutline className="text-[17px]" /></ToolbarButton><ToolbarButton title="New Message"><IoCreateOutline className="text-[17px]" /></ToolbarButton></>}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto mac-scroll px-5 py-5">
          <div className="flex flex-col items-center mb-5">
            <Monogram initials={t.avatar} size={56} tint={t.tint} />
            <div className="text-[13px] font-semibold mt-1.5">{t.name}</div>
            <div className="text-[11px] text-black/45 dark:text-white/45">{t.relationship} · {t.company}</div>
          </div>
          <div className="text-center text-[11px] text-black/40 dark:text-white/40 mb-3">{t.date}</div>

          {/* Incoming bubble */}
          <div className="flex items-end gap-2 mb-1.5">
            <Monogram initials={t.avatar} size={26} tint={t.tint} />
            <div className="relative max-w-[78%] px-3 py-2 rounded-[18px] rounded-bl-[6px] bg-[#e9e9eb] dark:bg-[#3a3a3c] text-[13px] leading-relaxed">
              {t.text}
            </div>
          </div>
          <div className="flex items-end gap-2 mb-4 pl-[34px]">
            <div className="px-3 py-1.5 rounded-[18px] rounded-bl-[6px] bg-[#e9e9eb] dark:bg-[#3a3a3c] flex items-center gap-0.5 text-[#ff9f0a]">
              {Array.from({ length: t.rating }).map((_, j) => <IoStar key={j} className="text-[13px]" />)}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pl-[34px] mb-5">
            {t.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[11px] border border-[var(--hairline)] text-black/60 dark:text-white/60">{tag}</span>
            ))}
          </div>

          {/* Outgoing reply */}
          <div className="flex justify-end">
            <div className="max-w-[70%] px-3 py-2 rounded-[18px] rounded-br-[6px] bg-[linear-gradient(180deg,#3d9bff,#0a7aff)] text-white text-[13px]">
              Thank you, {t.name.split(' ')[0]}! It was a pleasure working together.
            </div>
          </div>
          <div className="text-right text-[11px] text-black/40 dark:text-white/40 mt-1 pr-1">Delivered</div>
        </div>

        {/* Message field */}
        <div className="px-4 py-2.5 border-t border-[var(--hairline)] flex items-center gap-2">
          <a href="mailto:Pacifiquem58@gmail.com"
            className="flex-1 h-[28px] px-3 rounded-full border border-[var(--hairline)] flex items-center text-[13px] text-black/40 dark:text-white/40 hover:border-macblue">
            Want to work together? Send me a message…
          </a>
        </div>
      </div>
    </WindowLayout>
  );
}
