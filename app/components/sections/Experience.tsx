'use client';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import { IoSchool, IoEarth, IoCodeSlash, IoShieldCheckmark, IoGitNetwork, IoTerminal, IoRibbon, IoCheckmarkCircle } from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { InsetGroup, SymbolTile } from '../ui/mac';
import { ChevronGlyph } from '../icons/SystemIcons';

const experiences: { company: string; role: string; period: string; Glyph: IconType; color: string; description: string; highlights: string[] }[] = [
  {
    company: 'ALX Africa', role: 'Software Engineering & AI Internship', period: '2024', Glyph: IoSchool, color: '#af52de',
    description: 'Advanced software engineering practices and AI/ML implementation. Worked on real-world projects using modern tech stacks.',
    highlights: ['Built AI-powered web apps with OpenAI APIs', 'Completed 12-month intensive program', 'Collaborated with 50+ developers globally', 'Earned Software Engineering certification'],
  },
  {
    company: 'Harvard Remote Internship', role: 'Global Remote Work & Professional Skills', period: '2024', Glyph: IoEarth, color: '#007aff',
    description: 'Remote collaboration, professional development, and global teamwork with peers from 50+ countries.',
    highlights: ['Worked with teams across 5 continents', 'Completed CS50 and professional development tracks', 'Earned Harvard certificate in remote work', 'Led cross-cultural project teams'],
  },
  {
    company: 'Code Alpha', role: 'Python & Web Development Internship', period: '2023–2024', Glyph: IoCodeSlash, color: '#34c759',
    description: 'Full-stack web development with Python frameworks including Django and Flask. Built and deployed production apps.',
    highlights: ['Built 3 production-ready web applications', 'Mastered Django REST Framework', 'Implemented CI/CD pipelines', 'Mentored 2 junior developers'],
  },
  {
    company: 'ThinkCyber', role: 'Cybersecurity & Systems Security', period: '2023', Glyph: IoShieldCheckmark, color: '#ff3b30',
    description: 'Security protocols, penetration testing, and system hardening. Earned certifications in ethical hacking.',
    highlights: ['Completed ethical hacking certification', 'Performed 10+ security audits', 'Implemented OWASP security standards', 'Studied network security protocols'],
  },
  {
    company: 'DTP Academy', role: 'DevOps & Software Engineering', period: '2023', Glyph: IoGitNetwork, color: '#ff9500',
    description: 'CI/CD pipelines, containerization with Docker, and cloud infrastructure on AWS and GCP.',
    highlights: ['Set up Docker containerization workflows', 'Configured GitHub Actions CI/CD', 'Deployed apps on AWS EC2 and S3', 'Learned Kubernetes basics'],
  },
  {
    company: 'Cyberium', role: 'Linux, Python & Networking', period: '2022–2023', Glyph: IoTerminal, color: '#30b0c7',
    description: 'System administration, scripting, and network architecture. Deep dive into Linux internals and networking protocols.',
    highlights: ['Mastered Linux system administration', 'Wrote 20+ automation shell scripts', 'Studied TCP/IP and network protocols', 'Configured servers and firewalls'],
  },
];

const certAreas = ['Cybersecurity', 'Linux', 'AI', 'Python', 'Remote Work', 'Software Engineering', 'DevOps', 'Networking'];

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <WindowLayout title="Experience" subtitle="6 internships · 25+ certificates · 3+ years" surface="grouped">
      <div className="max-w-[640px] mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {[['6', 'Internships'], ['25+', 'Certificates'], ['3+', 'Years']].map(([v, l]) => (
            <div key={l} className="rounded-[10px] bg-[var(--group-bg)] shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.08)] py-3 text-center">
              <div className="text-[22px] font-semibold leading-none">{v}</div>
              <div className="text-[11px] text-black/50 dark:text-white/50 mt-1">{l}</div>
            </div>
          ))}
        </div>

        <InsetGroup title="Experience & Training">
          {experiences.map((exp, i) => {
            const open = expanded === i;
            return (
              <div key={exp.company}>
                <button type="button" onClick={() => setExpanded(open ? null : i)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                  <ChevronGlyph dir={open ? 'down' : 'right'} size={9} className="opacity-45 transition-transform flex-shrink-0" />
                  <SymbolTile Glyph={exp.Glyph} color={exp.color} size={30} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">{exp.company}</div>
                    <div className="text-[12px] text-black/55 dark:text-white/55 truncate">{exp.role}</div>
                  </div>
                  <span className="text-[12px] text-black/45 dark:text-white/45 tabular-nums flex-shrink-0">{exp.period}</span>
                </button>
                {open && (
                  <div className="pl-[68px] pr-4 pb-3.5 animate-fade-in">
                    <p className="text-[13px] leading-relaxed text-black/70 dark:text-white/70 mb-2.5">{exp.description}</p>
                    <ul className="space-y-1.5">
                      {exp.highlights.map(h => (
                        <li key={h} className="flex items-start gap-2 text-[12px] text-black/70 dark:text-white/70">
                          <IoCheckmarkCircle className="mt-px flex-shrink-0 text-[14px]" style={{ color: exp.color }} />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </InsetGroup>

        <InsetGroup title="Certificates" footer="Verified across multiple disciplines and platforms.">
          <div className="flex items-center gap-3 px-3 py-3">
            <SymbolTile Glyph={IoRibbon} color="#ff9500" size={36} />
            <div>
              <div className="text-[15px] font-semibold">25+ Verified Certificates</div>
              <div className="text-[12px] text-black/50 dark:text-white/50">{certAreas.length} areas of study</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 px-3 py-3">
            {certAreas.map(a => (
              <span key={a} className="px-2 py-0.5 rounded-[5px] text-[12px] bg-black/[0.05] dark:bg-white/[0.08] text-black/70 dark:text-white/75">{a}</span>
            ))}
          </div>
        </InsetGroup>
      </div>
    </WindowLayout>
  );
}
