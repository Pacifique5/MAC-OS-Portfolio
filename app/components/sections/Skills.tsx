'use client';
import { useState } from 'react';

const skillCategories = [
  {
    title: 'Frontend', emoji: '🎨', color: 'from-violet-500 to-purple-600', light: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800',
    skills: [
      { name: 'React', level: 95, desc: 'Hooks, Context, Redux, React Query' },
      { name: 'Next.js', level: 90, desc: 'App Router, SSR, SSG, API Routes' },
      { name: 'TypeScript', level: 85, desc: 'Types, Generics, Decorators' },
      { name: 'Tailwind CSS', level: 95, desc: 'Utility-first, Custom themes' },
      { name: 'HTML5/CSS3', level: 98, desc: 'Semantic HTML, Animations, Grid' },
    ],
  },
  {
    title: 'Backend', emoji: '⚙️', color: 'from-blue-500 to-cyan-600', light: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800',
    skills: [
      { name: 'Node.js', level: 90, desc: 'Express, REST APIs, WebSockets' },
      { name: 'Python', level: 88, desc: 'Django, Flask, FastAPI, Scripts' },
      { name: 'Java', level: 82, desc: 'Spring Boot, OOP, Data Structures' },
      { name: 'PHP', level: 80, desc: 'Laravel, MVC, Eloquent ORM' },
      { name: 'Express', level: 85, desc: 'Middleware, Auth, File uploads' },
    ],
  },
  {
    title: 'Databases', emoji: '🗄️', color: 'from-green-500 to-emerald-600', light: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800',
    skills: [
      { name: 'PostgreSQL', level: 85, desc: 'Complex queries, Indexing, Views' },
      { name: 'MongoDB', level: 88, desc: 'Aggregation, Atlas, Mongoose' },
      { name: 'MySQL', level: 82, desc: 'Stored procedures, Optimization' },
      { name: 'Firebase', level: 80, desc: 'Firestore, Auth, Realtime DB' },
    ],
  },
  {
    title: 'Tools & DevOps', emoji: '🛠️', color: 'from-orange-500 to-amber-600', light: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800',
    skills: [
      { name: 'Git & GitHub', level: 92, desc: 'Branching, PRs, CI/CD Actions' },
      { name: 'Docker', level: 78, desc: 'Containers, Compose, Networking' },
      { name: 'Linux', level: 85, desc: 'Shell scripting, System admin' },
      { name: 'Django', level: 80, desc: 'ORM, Admin, REST Framework' },
      { name: 'Laravel', level: 75, desc: 'Eloquent, Blade, Queues' },
    ],
  },
  {
    title: 'AI & Data', emoji: '🤖', color: 'from-pink-500 to-rose-600', light: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-800',
    skills: [
      { name: 'TensorFlow', level: 75, desc: 'Neural networks, Model training' },
      { name: 'OpenAI APIs', level: 85, desc: 'GPT-4, Embeddings, Fine-tuning' },
      { name: 'Data Analysis', level: 80, desc: 'Pandas, NumPy, Matplotlib' },
      { name: 'Prompt Engineering', level: 88, desc: 'Chain-of-thought, RAG, Agents' },
    ],
  },
  {
    title: 'Design & UX', emoji: '🎭', color: 'from-teal-500 to-cyan-600', light: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800',
    skills: [
      { name: 'Figma', level: 85, desc: 'Wireframes, Prototypes, Components' },
      { name: 'UI/UX Design', level: 82, desc: 'User research, Accessibility' },
      { name: 'Responsive Design', level: 95, desc: 'Mobile-first, Cross-browser' },
    ],
  },
];

const softSkills = [
  { name: 'Team Leadership', icon: '👥' }, { name: 'Problem Solving', icon: '🧩' },
  { name: 'Communication', icon: '💬' }, { name: 'Adaptability', icon: '🔄' },
  { name: 'Time Management', icon: '⏰' }, { name: 'Critical Thinking', icon: '🧠' },
  { name: 'Collaboration', icon: '🤝' }, { name: 'Continuous Learning', icon: '📚' },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const cat = skillCategories[activeTab];

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 px-8 py-8">
        <h2 className="text-2xl font-extrabold text-white mb-1">Technical Skills</h2>
        <p className="text-white/80 text-sm">Technologies I work with daily</p>
        <div className="flex gap-3 mt-4">
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-white">6</div>
            <div className="text-white/70 text-xs">Categories</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-white">25+</div>
            <div className="text-white/70 text-xs">Technologies</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <div className="text-xl font-bold text-white">3+</div>
            <div className="text-white/70 text-xs">Years Exp.</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {skillCategories.map((c, i) => (
            <button key={c.title} onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === i ? `bg-gradient-to-r ${c.color} text-white shadow-md scale-105` : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}>
              <span>{c.emoji}</span> {c.title}
            </button>
          ))}
        </div>

        {/* Active category */}
        <div className={`rounded-2xl p-5 border ${cat.light} ${cat.border}`}>
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-sm">
            <span>{cat.emoji}</span> {cat.title} Skills
          </h3>
          <div className="space-y-5">
            {cat.skills.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{skill.name}</span>
                    <span className="text-xs text-gray-400 ml-2">— {skill.desc}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full`} style={{ width: `${skill.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All categories overview */}
        <div>
          <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm">All Categories Overview</h3>
          <div className="grid grid-cols-3 gap-2">
            {skillCategories.map((c, i) => (
              <button key={c.title} onClick={() => setActiveTab(i)}
                className={`bg-white dark:bg-gray-800 rounded-xl p-3 border text-center hover:shadow-md transition-all ${activeTab === i ? 'border-violet-400 dark:border-violet-600 shadow-md' : 'border-gray-100 dark:border-gray-700'}`}>
                <div className="text-xl mb-1">{c.emoji}</div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{c.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{c.skills.length} skills</div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${c.color} rounded-full`}
                    style={{ width: `${Math.round(c.skills.reduce((a, s) => a + s.level, 0) / c.skills.length)}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Soft skills */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3 text-sm">Soft Skills & Interests</h3>
          <div className="grid grid-cols-2 gap-2">
            {softSkills.map(s => (
              <div key={s.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                <span className="text-base">{s.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
