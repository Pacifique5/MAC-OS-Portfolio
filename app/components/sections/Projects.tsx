const projects = [
  {
    title: 'Next Portfolio Website',
    description: 'A modern portfolio website built with Next.js and Tailwind CSS featuring smooth animations and responsive design.',
    tags: ['Next.js', 'React', 'Tailwind CSS'],
    featured: true,
  },
  {
    title: 'FARM PRO',
    description: 'A full-stack farm management system with inventory tracking, crop monitoring, and analytics dashboard.',
    tags: ['Laravel', 'PHP', 'MySQL'],
  },
  {
    title: 'CacheNet',
    description: 'A network caching solution enabling offline content access for education during internet outages.',
    tags: ['Next.js', 'React Native', 'Node.js'],
    featured: true,
  },
  {
    title: 'Umurava-Website',
    description: 'Youth mentorship platform with authentication and CRUD operations supporting empowerment and leadership.',
    tags: ['Next.js', 'Tailwind CSS', 'TypeScript'],
  },
];

export default function Projects() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.title} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            {project.featured && (
              <span className="inline-block px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded mb-2">
                ⭐ FEATURED
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
