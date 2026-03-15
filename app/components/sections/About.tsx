'use client';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaDownload, FaMapMarkerAlt, FaCode, FaBrain, FaRocket } from 'react-icons/fa';
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython } from 'react-icons/si';

const roles = ['Full-Stack Developer', 'AI Enthusiast', 'Open-Source Contributor', 'Problem Solver'];

const stats = [
  { label: 'Projects', value: '10+', icon: '💼', color: 'from-violet-500 to-purple-600' },
  { label: 'Certificates', value: '25+', icon: '🏆', color: 'from-amber-500 to-orange-500' },
  { label: 'Internships', value: '6', icon: '🎓', color: 'from-blue-500 to-cyan-500' },
  { label: 'Years Coding', value: '3+', icon: '⚡', color: 'from-green-500 to-emerald-500' },
];

const techStack = [
  { icon: <SiNextdotjs />, name: 'Next.js', color: '#000' },
  { icon: <SiReact />, name: 'React', color: '#61DAFB' },
  { icon: <SiTypescript />, name: 'TypeScript', color: '#3178C6' },
  { icon: <SiTailwindcss />, name: 'Tailwind', color: '#06B6D4' },
  { icon: <SiNodedotjs />, name: 'Node.js', color: '#339933' },
  { icon: <SiPython />, name: 'Python', color: '#3776AB' },
];

const values = [
  { icon: <FaCode className="text-violet-500" />, title: 'Clean Code', desc: 'Writing maintainable, scalable, and well-documented code is my standard.' },
  { icon: <FaBrain className="text-pink-500" />, title: 'AI-Driven', desc: 'Integrating AI and ML into real-world applications to solve complex problems.' },
  { icon: <FaRocket className="text-orange-500" />, title: 'Performance', desc: 'Obsessed with fast, optimized user experiences across all devices.' },
];

export default function About() {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex-shrink-0">
            <div className="w-36 h-36 rounded-full bg-white/20 backdrop-blur border-4 border-white/40 flex items-center justify-center text-7xl shadow-2xl">👨‍💻</div>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-green-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-green-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="inline-block px-3 py-1 bg-white/20 text-white/90 text-xs font-medium rounded-full mb-3 border border-white/30">👋 Welcome to my portfolio</span>
            <h1 className="text-3xl font-extrabold text-white mb-3">Hi, I'm <span className="text-yellow-300">Mugisha Pacifique</span></h1>
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {roles.map(r => (
                <span key={r} className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full border border-white/30">{r}</span>
              ))}
            </div>
            <p className="text-white/80 text-sm max-w-lg leading-relaxed">
              Passionate Full-Stack Developer specializing in <span className="text-yellow-300 font-semibold">Next.js</span>, <span className="text-cyan-300 font-semibold">React</span>, and <span className="text-pink-300 font-semibold">AI</span>. Building innovative solutions with a focus on user experience and performance.
            </p>
            <div className="flex items-center gap-2 mt-3 justify-center md:justify-start text-white/70 text-xs">
              <FaMapMarkerAlt className="text-red-300" /> Rwanda, Africa
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><span>📖</span> About Me</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>I'm a passionate Full-Stack Developer from Rwanda with over 3 years of experience building modern web applications. I specialize in creating seamless user experiences using cutting-edge technologies like Next.js, React, and TypeScript.</p>
            <p>My journey in tech started with a deep curiosity about how things work on the internet. That curiosity evolved into a career where I've worked on everything from farm management systems to AI-powered applications and educational platforms.</p>
            <p>When I'm not coding, I'm exploring the latest in AI/ML, contributing to open-source projects, or mentoring aspiring developers in my community.</p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><span>🛠️</span> Tech Stack</h3>
          <div className="grid grid-cols-3 gap-3">
            {techStack.map(t => (
              <div key={t.name} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-600 transition-all group">
                <span className="text-xl" style={{ color: t.color }}>{t.icon}</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-3 gap-3">
          {values.map(v => (
            <div key={v.title} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl mb-2">{v.icon}</div>
              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{v.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <FaEnvelope className="text-violet-500" />, label: 'Email', value: 'Pacifiquem58@gmail.com', href: 'mailto:Pacifiquem58@gmail.com' },
            { icon: <FaPhone className="text-green-500" />, label: 'Phone', value: '+250 795 653 123', href: 'tel:+250795653123' },
            { icon: <FaGithub className="text-gray-700 dark:text-gray-300" />, label: 'GitHub', value: '@Pacifique5', href: 'https://github.com/Pacifique5' },
            { icon: <FaLinkedin className="text-blue-600" />, label: 'LinkedIn', value: 'mugisha-pacifique', href: 'https://linkedin.com/in/mugisha-pacifique' },
          ].map(item => (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md transition-all group">
              <div className="text-xl">{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-3 pb-4">
          <a href="mailto:Pacifiquem58@gmail.com" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] transition-all">
            Let's Connect
          </a>
          <a href="/MUGISHA PACIFIQUE.pdf" download className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-violet-500 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-[1.02] transition-all">
            <FaDownload className="text-xs" /> Download CV
          </a>
        </div>
      </div>
    </div>
  );
}
