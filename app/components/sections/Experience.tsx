const experiences = [
  {
    company: 'ALX Africa', role: 'Software Engineering & AI Internship', period: '2024', icon: '🎓',
    color: 'from-violet-500 to-purple-600', dot: 'bg-violet-500',
    description: 'Advanced software engineering practices and AI/ML implementation. Worked on real-world projects using modern tech stacks.',
    highlights: ['Built AI-powered web apps with OpenAI APIs', 'Completed 12-month intensive program', 'Collaborated with 50+ developers globally', 'Earned Software Engineering certification'],
  },
  {
    company: 'Harvard Remote Internship', role: 'Global Remote Work & Professional Skills', period: '2024', icon: '🌍',
    color: 'from-blue-500 to-cyan-600', dot: 'bg-blue-500',
    description: 'Remote collaboration, professional development, and global teamwork with peers from 50+ countries.',
    highlights: ['Worked with teams across 5 continents', 'Completed CS50 and professional development tracks', 'Earned Harvard certificate in remote work', 'Led cross-cultural project teams'],
  },
  {
    company: 'Code Alpha', role: 'Python & Web Development Internship', period: '2023–2024', icon: '💻',
    color: 'from-green-500 to-emerald-600', dot: 'bg-green-500',
    description: 'Full-stack web development with Python frameworks including Django and Flask. Built and deployed production apps.',
    highlights: ['Built 3 production-ready web applications', 'Mastered Django REST Framework', 'Implemented CI/CD pipelines', 'Mentored 2 junior developers'],
  },
  {
    company: 'ThinkCyber', role: 'Cybersecurity & Systems Security', period: '2023', icon: '🔒',
    color: 'from-red-500 to-rose-600', dot: 'bg-red-500',
    description: 'Security protocols, penetration testing, and system hardening. Earned certifications in ethical hacking.',
    highlights: ['Completed ethical hacking certification', 'Performed 10+ security audits', 'Implemented OWASP security standards', 'Studied network security protocols'],
  },
  {
    company: 'DTP Academy', role: 'DevOps & Software Engineering', period: '2023', icon: '⚙️',
    color: 'from-orange-500 to-amber-600', dot: 'bg-orange-500',
    description: 'CI/CD pipelines, containerization with Docker, and cloud infrastructure on AWS and GCP.',
    highlights: ['Set up Docker containerization workflows', 'Configured GitHub Actions CI/CD', 'Deployed apps on AWS EC2 and S3', 'Learned Kubernetes basics'],
  },
  {
    company: 'Cyberium', role: 'Linux, Python & Networking', period: '2022–2023', icon: '🐧',
    color: 'from-teal-500 to-cyan-600', dot: 'bg-teal-500',
    description: 'System administration, scripting, and network architecture. Deep dive into Linux internals and networking protocols.',
    highlights: ['Mastered Linux system administration', 'Wrote 20+ automation shell scripts', 'Studied TCP/IP and network protocols', 'Configured servers and firewalls'],
  },
];

const certAreas = ['Cybersecurity', 'Linux', 'AI', 'Python', 'Remote Work', 'Software Engineering', 'DevOps', 'Networking'];

import { useState } from 'react';

export default function Experience() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 px-8 py-8">
        <h2 className="text-2xl font-extrabold text-white mb-1">Experience & Training</h2>
        <p className="text-white/80 text-sm mb-4">My professional journey so far</p>
        <div className="flex gap-3">
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-white">6</div>
            <div className="text-white/70 text-xs">Internships</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-white">25+</div>
            <div className="text-white/70 text-xs">Certificates</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-white">3+</div>
            <div className="text-white/70 text-xs">Years</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 via-blue-400 via-green-400 to-teal-400 opacity-30" />
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i} className="relative flex gap-4 group">
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${exp.color} flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {exp.icon}
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">{exp.company}</h3>
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">{exp.period}</span>
                    </div>
                    <p className={`text-xs font-semibold bg-gradient-to-r ${exp.color} bg-clip-text text-transparent mb-2`}>{exp.role}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                    <button onClick={() => setExpanded(expanded === i ? null : i)}
                      className="text-xs text-violet-500 hover:text-violet-700 font-medium mt-2 transition-colors">
                      {expanded === i ? '▲ Hide details' : '▼ Show highlights'}
                    </button>
                  </div>
                  {expanded === i && (
                    <div className={`px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3`}>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Key Highlights:</p>
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <span className={`mt-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${exp.color} flex-shrink-0`} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates banner */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <div>
              <p className="text-xl font-extrabold">25+ Verified Certificates</p>
              <p className="text-white/70 text-xs">Across multiple disciplines and platforms</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {certAreas.map(area => (
              <span key={area} className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full border border-white/30">{area}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
