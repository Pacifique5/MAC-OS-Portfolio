'use client';
import { IoMail, IoCall, IoLogoGithub, IoLogoLinkedin, IoLocationSharp, IoDownloadOutline, IoCodeSlash, IoHardwareChip, IoRocket, IoBriefcase, IoRibbon, IoSchool, IoFlash, IoShieldCheckmark, IoImages, IoChevronForward } from 'react-icons/io5';
import { FaXTwitter } from 'react-icons/fa6';
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython } from 'react-icons/si';
import { WindowLayout } from '../MacWindow';
import { CV_URL, SOCIAL_LINKS } from '../apps';
import { PHOTOS } from '../photos-data';
import { InsetGroup, GroupRow, PushButton, SymbolTile } from '../ui/mac';

const roles = ['Full-Stack Developer', 'Cybersecurity', 'AI Enthusiast', 'Open Source'];

const certificateCount = PHOTOS.filter(p => p.album === 'certificates').length;
const badgeCount = PHOTOS.filter(p => p.album === 'badges').length;

const stats = [
  { label: 'Projects', value: '10+', Glyph: IoBriefcase, open: 'projects' },
  { label: 'Certificates', value: `${certificateCount}`, Glyph: IoRibbon, open: 'photos' },
  { label: 'Internships', value: '6', Glyph: IoSchool, open: 'experience' },
  { label: 'Years Coding', value: '3+', Glyph: IoFlash, open: 'skills' },
];

const techStack = [
  { Icon: SiNextdotjs, name: 'Next.js' },
  { Icon: SiReact, name: 'React' },
  { Icon: SiTypescript, name: 'TypeScript' },
  { Icon: SiTailwindcss, name: 'Tailwind' },
  { Icon: SiNodedotjs, name: 'Node.js' },
  { Icon: SiPython, name: 'Python' },
];

const values = [
  { Glyph: IoCodeSlash, title: 'Clean Code', desc: 'Writing maintainable, scalable, and well-documented code is my standard.' },
  { Glyph: IoShieldCheckmark, title: 'Security First', desc: 'Applying what I learned in cybersecurity training to build safer software by default.' },
  { Glyph: IoHardwareChip, title: 'AI-Driven', desc: 'Integrating AI and ML into real-world applications to solve complex problems.' },
  { Glyph: IoRocket, title: 'Performance', desc: 'Obsessed with fast, optimized user experiences across all devices.' },
];

const fields = [
  { label: 'email', value: 'Pacifiquem58@gmail.com', href: 'mailto:Pacifiquem58@gmail.com' },
  { label: 'mobile', value: '+250 795 653 123', href: 'tel:+250795653123' },
  { label: 'GitHub', value: '@Pacifique5', href: SOCIAL_LINKS.github },
  { label: 'LinkedIn', value: 'pacifique-mugisha', href: SOCIAL_LINKS.linkedin },
  { label: 'X', value: '@_fiquem', href: SOCIAL_LINKS.x },
  { label: 'address', value: 'Rwanda, Africa' },
];

const actions = [
  { Glyph: IoMail, label: 'mail', href: 'mailto:Pacifiquem58@gmail.com' },
  { Glyph: IoCall, label: 'call', href: 'tel:+250795653123' },
  { Glyph: IoLogoGithub, label: 'github', href: SOCIAL_LINKS.github },
  { Glyph: IoLogoLinkedin, label: 'linkedin', href: SOCIAL_LINKS.linkedin },
  { Glyph: FaXTwitter, label: 'x', href: SOCIAL_LINKS.x },
];

export default function About({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <WindowLayout
      title="About Me"
      subtitle="Contact Card"
      toolbar={<PushButton href={CV_URL} download><IoDownloadOutline /> Download CV</PushButton>}
    >
      <div className="max-w-155 mx-auto px-8 py-8">
        {/* Card header */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative shrink-0">
            <div className="w-22 h-22 rounded-full flex items-center justify-center text-white text-[34px] font-semibold bg-[linear-gradient(180deg,#a8a8b0,#6c6c74)] shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
              MP
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#34c759] ring-[3px] ring-(--window-bg)" title="Available for work" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[26px] font-semibold leading-tight">Mugisha Pacifique</h1>
            <p className="text-[14px] text-black/70 dark:text-white/75">Full-Stack Developer &amp; Security Enthusiast</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {roles.map(r => (
                <span key={r} className="px-2 py-0.5 rounded-full text-[11px] bg-black/5 dark:bg-white/8 text-black/65 dark:text-white/70">{r}</span>
              ))}
              <span className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-black/45 dark:text-white/45"><IoLocationSharp /> Rwanda, Africa</span>
            </div>
          </div>
        </div>

        {/* Action buttons — Contacts style */}
        <div className="grid grid-cols-5 gap-2.5 mb-5">
          {actions.map(a => (
            <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 rounded-lg bg-black/4 dark:bg-white/[0.07] hover:bg-black/[0.07] dark:hover:bg-white/10 text-macblue transition-colors">
              <a.Glyph className="text-[18px]" />
              <span className="text-[11px]">{a.label}</span>
            </a>
          ))}
        </div>

        {/* Stats — each opens the related app */}
        <div className="grid grid-cols-4 gap-2.5 mb-7">
          {stats.map(s => (
            <button key={s.label} type="button" onClick={() => onOpen(s.open)} title={`Open ${s.label}`}
              className="rounded-[10px] bg-black/3 dark:bg-white/6 hover:bg-black/6 dark:hover:bg-white/10 p-3 flex flex-col items-center gap-1 transition-colors">
              <SymbolTile Glyph={s.Glyph} size={24} />
              <div className="text-[20px] font-semibold leading-none mt-1">{s.value}</div>
              <div className="text-[11px] text-black/50 dark:text-white/50">{s.label}</div>
            </button>
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
              <p>When I’m not coding, I’m exploring the latest in AI/ML and security, contributing to open-source projects, or mentoring aspiring developers in my community.</p>
            </div>
          </div>
        </div>

        <InsetGroup title="Tech Stack">
          <div className="grid grid-cols-3 gap-px bg-black/[0.07] dark:bg-white/[0.07]">
            {techStack.map(t => (
              <div key={t.name} className="flex items-center gap-2 px-3 py-2.5 text-[13px] bg-(--group-bg)">
                <t.Icon className="text-[16px] text-black/65 dark:text-white/75" /> {t.name}
              </div>
            ))}
          </div>
        </InsetGroup>

        <InsetGroup title="What I Value">
          {values.map(v => (
            <GroupRow key={v.title} icon={<SymbolTile Glyph={v.Glyph} size={26} />} label={<span className="font-medium">{v.title}</span>} detail={v.desc} />
          ))}
        </InsetGroup>

        <InsetGroup title="Credentials">
          <GroupRow
            onClick={() => onOpen('photos')}
            icon={<SymbolTile Glyph={IoImages} size={26} />}
            label={<span className="font-medium">Certificates &amp; Badges</span>}
            detail={`${certificateCount} certificates and ${badgeCount} skill badges in Photos`}
            right={<IoChevronForward className="text-[12px]" />}
          />
        </InsetGroup>

        <div className="flex gap-2 justify-end">
          <PushButton href={CV_URL} download><IoDownloadOutline /> Download CV</PushButton>
          <PushButton primary onClick={() => onOpen('contact')}><IoMail /> Let’s Connect</PushButton>
        </div>
      </div>
    </WindowLayout>
  );
}
