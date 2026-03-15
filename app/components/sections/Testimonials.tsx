const testimonials = [
  {
    name: 'John Doe', role: 'Senior Developer', company: 'Tech Company', relationship: 'Colleague', date: 'January 2024', rating: 5, avatar: 'JD', color: 'from-violet-500 to-purple-600',
    text: 'Working with Pacifique was an incredible experience. His dedication to clean code and innovative solutions is unmatched. He consistently delivered high-quality work and was always willing to help team members.',
    tags: ['Clean Code', 'Teamwork', 'Innovation'],
  },
  {
    name: 'Jane Smith', role: 'Project Manager', company: 'StartupXYZ', relationship: 'Supervisor', date: 'December 2023', rating: 5, avatar: 'JS', color: 'from-pink-500 to-rose-600',
    text: 'Pacifique demonstrated exceptional problem-solving skills and leadership throughout our project. His ability to learn new technologies quickly and apply them effectively made him an invaluable team member.',
    tags: ['Leadership', 'Fast Learner', 'Problem Solving'],
  },
  {
    name: 'Alex Johnson', role: 'Full-Stack Developer', company: 'DevAgency', relationship: 'Colleague', date: 'November 2023', rating: 5, avatar: 'AJ', color: 'from-blue-500 to-cyan-600',
    text: 'I had the pleasure of collaborating with Pacifique on multiple projects. His technical expertise in React and Next.js, combined with his excellent communication skills, made every project a success.',
    tags: ['React', 'Next.js', 'Communication'],
  },
  {
    name: 'Sarah Williams', role: 'UI/UX Designer', company: 'DesignStudio', relationship: 'Team Member', date: 'October 2023', rating: 5, avatar: 'SW', color: 'from-teal-500 to-emerald-600',
    text: "Pacifique's attention to detail and commitment to creating user-friendly interfaces is remarkable. He bridges the gap between design and development seamlessly, always respecting the design vision.",
    tags: ['UI/UX', 'Attention to Detail', 'Design-Dev Bridge'],
  },
  {
    name: 'Michael Brown', role: 'Tech Lead', company: 'InnovateTech', relationship: 'Mentor', date: 'September 2023', rating: 5, avatar: 'MB', color: 'from-orange-500 to-amber-600',
    text: "As Pacifique's mentor, I've watched him grow into an exceptional developer. His passion for learning and his ability to tackle complex challenges head-on is truly inspiring. He's one of the best I've mentored.",
    tags: ['Growth Mindset', 'Complex Problems', 'Passion'],
  },
];

const stats = [
  { value: '5+', label: 'Recommendations', icon: '💬' },
  { value: '5.0', label: 'Avg Rating', icon: '⭐' },
  { value: '100%', label: 'Would Recommend', icon: '✅' },
];

export default function Testimonials() {
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 px-8 py-8">
        <h2 className="text-2xl font-extrabold text-white mb-1">Testimonials</h2>
        <p className="text-white/80 text-sm mb-4">What people say about working with me</p>
        <div className="flex gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <div className="text-lg">{s.icon}</div>
              <div className="text-lg font-bold text-white">{s.value}</div>
              <div className="text-white/70 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">

        {/* Featured first testimonial */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100 dark:bg-violet-900/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="text-5xl font-serif text-violet-200 dark:text-violet-800 leading-none mb-3">"</div>
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-4 font-medium italic">"{testimonials[0].text}"</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[0].color} flex items-center justify-center text-white text-sm font-bold shadow-md`}>{testimonials[0].avatar}</div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{testimonials[0].name}</p>
                <p className="text-xs text-gray-400">{testimonials[0].role} · {testimonials[0].company}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex gap-0.5 justify-end mb-1">
                {Array.from({ length: testimonials[0].rating }).map((_, j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <p className="text-xs text-gray-400">{testimonials[0].date}</p>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            {testimonials[0].tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        {/* Rest of testimonials */}
        {testimonials.slice(1).map((t, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className={`text-3xl font-serif bg-gradient-to-r ${t.color} bg-clip-text text-transparent leading-none mb-2 opacity-40`}>"</div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>{t.avatar}</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}{t.company ? ` · ${t.company}` : ''}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-0.5 justify-end mb-1">
                  {Array.from({ length: t.rating }).map((_, j) => <span key={j} className="text-yellow-400 text-xs">★</span>)}
                </div>
                <p className="text-xs text-gray-400">{t.date}</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {t.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-5 text-white text-center">
          <p className="font-bold text-lg mb-1">Want to work together?</p>
          <p className="text-white/80 text-sm mb-4">I'm always open to new opportunities and collaborations.</p>
          <a href="mailto:Pacifiquem58@gmail.com" className="inline-block px-6 py-2.5 bg-white text-pink-600 font-semibold text-sm rounded-xl hover:shadow-lg hover:scale-105 transition-all">
            Get In Touch
          </a>
        </div>

      </div>
    </div>
  );
}
