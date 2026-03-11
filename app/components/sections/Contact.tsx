'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent! (This is a demo)');
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span>📧</span> Pacifiquem58@gmail.com
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span>📱</span> +250 795 653 123
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span>🔗</span> <a href="https://github.com/Pacifique5" className="text-blue-500 hover:underline">GitHub</a>
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <span>💼</span> <a href="https://linkedin.com/in/mugisha-pacifique" className="text-blue-500 hover:underline">LinkedIn</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
