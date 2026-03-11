export default function About() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
            👨‍💻
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Hi, I'm <span className="text-blue-500">Mugisha Pacifique</span>
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Full-Stack Developer', 'AI Enthusiast', 'Open-Source Contributor', 'Problem Solver'].map((role) => (
              <span key={role} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                {role}
              </span>
            ))}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Passionate Full-Stack Developer specializing in <strong>Next.js</strong>, <strong>React</strong>, and <strong>AI</strong>. 
            Building innovative solutions with a focus on user experience and performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-gray-900 dark:text-white font-medium">Pacifiquem58@gmail.com</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
          <p className="text-gray-900 dark:text-white font-medium">+250 795 653 123</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">GitHub</p>
          <a href="https://github.com/Pacifique5" className="text-blue-500 hover:underline">@Pacifique5</a>
        </div>
        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">LinkedIn</p>
          <a href="https://linkedin.com/in/mugisha-pacifique" className="text-blue-500 hover:underline">mugisha-pacifique</a>
        </div>
      </div>
    </div>
  );
}
