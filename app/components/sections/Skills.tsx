const skillCategories = [
  {
    title: 'Frontend 🎨',
    skills: [
      { name: 'React', level: 95 },
      { name: 'Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
    ],
  },
  {
    title: 'Backend ⚙️',
    skills: [
      { name: 'Node.js', level: 90 },
      { name: 'Python', level: 88 },
      { name: 'Java', level: 82 },
      { name: 'PHP', level: 80 },
    ],
  },
  {
    title: 'Databases 🗄️',
    skills: [
      { name: 'PostgreSQL', level: 85 },
      { name: 'MongoDB', level: 88 },
      { name: 'MySQL', level: 82 },
    ],
  },
  {
    title: 'AI & Data 🤖',
    skills: [
      { name: 'TensorFlow', level: 75 },
      { name: 'OpenAI APIs', level: 85 },
      { name: 'Prompt Engineering', level: 88 },
    ],
  },
];

export default function Skills() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Technical Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((category) => (
          <div key={category.title} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{category.title}</h3>
            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
