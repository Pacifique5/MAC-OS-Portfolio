'use client';
import { IoMail, IoCall, IoLogoGithub, IoLogoLinkedin, IoLocationSharp, IoDownloadOutline, IoCodeSlash, IoHardwareChip, IoRocket, IoBriefcase, IoRibbon, IoSchool, IoFlash } from 'react-icons/io5';
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython } from 'react-icons/si';
import { WindowLayout } from '../MacWindow';
import { InsetGroup, GroupRow, PushButton, SymbolTile } from '../ui/mac';

const roles = ['Full-Stack Developer', 'AI Enthusiast', 'Open-Source Contributor', 'Problem Solver'];

const stats = [
  { label: 'Projects', value: '10+', Glyph: IoBriefcase, color: '#af52de' },
  { label: 'Certificates', value: '25+', Glyph: IoRibbon, color: '#ff9500' },
  { label: 'Internships', value: '6', Glyph: IoSchool, color: '#007aff' },
  { label: 'Years Coding', value: '3+', Glyph: IoFlash, color: '#34c759' },
];

const techStack = [
  { Icon: SiNextdotjs, name: 'Next.js', color: 'currentColor' },
  { Icon: SiReact, name: 'React', color: '#61DAFB' },
  { Icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
  { Icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' },
  { Icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
  { Icon: SiPython, name: 'Python', color: '#3776AB' },
];

const values = [
  { Glyph: IoCodeSlash, color: '#5856d6', title: 'Clean Code', desc: 'Writing maintainable, scalable, and well-documented code is my standard.' },
  { Glyph: IoHardwareChip, color: '#ff2d55', title: 'AI-Driven', desc: 'Integrating AI and ML into real-world applications to solve complex problems.' },
  { Glyph: IoRocket, color: '#ff9500', title: 'Performance', desc: 'Obsessed with fast, optimized user experiences across all devices.' },
];

const fields = [
  { label: 'email', value: 'Pacifiquem58@gmail.com', href: 'mailto:Pacifiquem58@gmail.com' },
  { label: 'mobile', value: '+250 795 653 123', href: 'tel:+250795653123' },
  { label: 'GitHub', value: '@Pacifique5', href: 'https://github.com/Pacifique5' },
  { label: 'LinkedIn', value: 'pacifique-mugisha', href: 'https://www.linkedin.com/in/pacifique-mugisha-449a4a3b0/' },
  { label: 'address', value: 'Rwanda, Africa' },
];

const actions = [
  { Glyph: IoMail, label: 'mail', href: 'mailto:Pacifiquem58@gmail.com' },
  { Glyph: IoCall, label: 'call', href: 'tel:+250795653123' },
  { Glyph: IoLogoGithub, label: 'github', href: 'https://github.com/Pacifique5' },
  { Glyph: IoLogoLinkedin, label: 'linkedin', href: 'https://www.linkedin.com/in/pacifique-mugisha-449a4a3b0/' },
];

export default function About() {
  return (
    <WindowLayout
      title="About Me"
      subtitle="Contact Card"
      toolbar={<PushButton href="/MUGISHA PACIFIQUE.pdf" download><IoDownloadOutline /> Download CV</PushButton>}
    >
      <div className="max-w-[620px] mx-auto px-8 py-8">
        {/* Card header */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center text-white text-[34px] font-semibold bg-[linear-gradient(180deg,#a8a8b0,#6c6c74)] shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              MP
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#34c759] ring-[3px] ring-[var(--window-bg)]" title="Available" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[26px] font-semibold leading-tight">Mugisha Pacifique</h1>
            <p className="text-[13px] text-black/55 dark:text-white/55">{roles.join(' · ')}</p>
            <p className="flex items-center gap-1 text-[12px] text-black/45 dark:text-white/45 mt-1"><IoLocationSharp /> Rwanda, Africa</p>
          </div>
        </div>

        {/* Action buttons — Contacts style */}
        <div className="flex gap-2.5 mb-7">
          {actions.map(a => (
            <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg bg-black/[0.04] dark:bg-white/[0.07] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] text-macblue">
              <a.Glyph className="text-[18px]" />
              <span className="text-[11px]">{a.label}</span>
            </a>
          ))}
        </div>

        {/* Fields */}
        <div className="space-y-2.5 mb-7">
          {fields.map(f => (
            <div key={f.label} className="grid grid-cols-[90px_1fr] gap-3 text-[13px]">
              <span className="text-right text-black/45 dark:text-white/45">{f.label}</span>
              {f.href
                ? <a href={f.href} target="_blank" rel="noopener noreferrer" className="text-macblue hover:underline truncate">{f.value}</a>
                : <span>{f.value}</span>}
            </div>
          ))}
          <div className="grid grid-cols-[90px_1fr] gap-3 text-[13px] pt-2">
            <span className="text-right text-black/45 dark:text-white/45">note</span>
            <div className="space-y-2 leading-relaxed text-black/80 dark:text-white/80">
              <p>I’m a passionate Full-Stack Developer from Rwanda with over 3 years of experience building modern web applications. I specialize in creating seamless user experiences using Next.js, React, and TypeScript.</p>
              <p>My journey in tech started with a deep curiosity about how things work on the internet. That curiosity evolved into a career spanning farm management systems, AI-powered applications and educational platforms.</p>
              <p>When I’m not coding, I’m exploring the latest in AI/ML, contributing to open-source projects, or mentoring aspiring developers in my community.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2.5 mb-7">
          {stats.map(s => (
            <div key={s.label} className="rounded-[10px] bg-black/[0.03] dark:bg-white/[0.06] p-3 flex flex-col items-center gap-1">
              <SymbolTile Glyph={s.Glyph} color={s.color} size={24} />
              <div className="text-[20px] font-semibold leading-none mt-1">{s.value}</div>
              <div className="text-[11px] text-black/50 dark:text-white/50">{s.label}</div>
            </div>
          ))}
        </div>

        <InsetGroup title="Tech Stack">
          <div className="grid grid-cols-3 divide-x divide-y divide-black/[0.07] dark:divide-white/[0.07]">
            {techStack.map(t => (
              <div key={t.name} className="flex items-center gap-2 px-3 py-2.5 text-[13px]">
                <t.Icon style={{ color: t.color }} className="text-[16px]" /> {t.name}
              </div>
            ))}
          </div>
        </InsetGroup>

        <InsetGroup title="What I Value">
          {values.map(v => (
            <GroupRow key={v.title} icon={<SymbolTile Glyph={v.Glyph} color={v.color} size={26} />} label={<span className="font-medium">{v.title}</span>} detail={v.desc} />
          ))}
        </InsetGroup>

        <div className="flex gap-2 justify-end">
          <PushButton href="/MUGISHA PACIFIQUE.pdf" download><IoDownloadOutline /> Download CV</PushButton>
          <PushButton primary href="mailto:Pacifiquem58@gmail.com"><IoMail /> Let’s Connect</PushButton>
        </div>
      </div>
    </WindowLayout>
  );
}
