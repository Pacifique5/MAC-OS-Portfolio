const testimonials = [
  {
    name: 'John Doe',
    role: 'Senior Developer at Tech Company',
    date: 'January 2024',
    rating: 5,
    text: 'Working with Pacifique was an incredible experience. His dedication to clean code and innovative solutions is unmatched.',
  },
  {
    name: 'Jane Smith',
    role: 'Project Manager',
    date: 'December 2023',
    rating: 5,
    text: 'Pacifique demonstrated exceptional problem-solving skills and leadership throughout our project.',
  },
  {
    name: 'Alex Johnson',
    role: 'Full-Stack Developer',
    date: 'November 2023',
    rating: 5,
    text: 'His technical expertise in React and Next.js, combined with his excellent communication skills, made every project a success.',
  },
];

export default function Testimonials() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Testimonials</h2>
      <div className="grid grid-cols-1 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {testimonial.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                  <span className="text-yellow-500">{'⭐'.repeat(testimonial.rating)}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
                <p className="text-xs text-gray-400 mt-2">{testimonial.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
