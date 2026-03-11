const experiences = [
  {
    role: 'Software Engineering & AI Internship',
    company: 'ALX Africa 🎓',
    period: '2024',
    description: 'Advanced software engineering practices and AI/ML implementation',
  },
  {
    role: 'Global Remote Work & Professional Skills',
    company: 'Harvard Remote Internship 🌍',
    period: '2024',
    description: 'Remote collaboration, professional development, and global teamwork',
  },
  {
    role: 'Python & Web Development Internship',
    company: 'Code Alpha 💻',
    period: '2023-2024',
    description: 'Full-stack web development with Python frameworks',
  },
  {
    role: 'Cybersecurity & Systems Security',
    company: 'ThinkCyber 🔒',
    period: '2023',
    description: 'Security protocols, penetration testing, and system hardening',
  },
  {
    role: 'DevOps & Software Engineering',
    company: 'DTP Academy ⚙️',
    period: '2023',
    description: 'CI/CD pipelines, containerization, and cloud infrastructure',
  },
];

export default function Experience() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Experience & Training</h2>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.company}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">{exp.period}</span>
            </div>
            <p className="text-blue-500 font-medium mb-2">{exp.role}</p>
            <p className="text-gray-600 dark:text-gray-300">{exp.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
        <p className="text-2xl font-bold">🏆 25+ Verified Certificates</p>
        <p className="mt-2">in Cybersecurity, Linux, AI, Python, Remote Work & Software Engineering</p>
      </div>
    </div>
  );
}
