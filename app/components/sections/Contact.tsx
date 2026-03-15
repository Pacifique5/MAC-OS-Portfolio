'use client';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaPaperPlane, FaCheckCircle, FaMapMarkerAlt, FaDownload } from 'react-icons/fa';

const contactLinks = [
  { icon: <FaEnvelope />, label: 'Email', value: 'Pacifiquem58@gmail.com', href: 'mailto:Pacifiquem58@gmail.com', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'hover:border-violet-300 dark:hover:border-violet-600' },
  { icon: <FaPhone />, label: 'Phone', value: '+250 795 653 123', href: 'tel:+250795653123', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'hover:border-green-300 dark:hover:border-green-600' },
  { icon: <FaGithub />, label: 'GitHub', value: 'github.com/Pacifique5', href: 'https://github.com/Pacifique5', color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-50 dark:bg-gray-700/50', border: 'hover:border-gray-400 dark:hover:border-gray-500' },
  { icon: <FaLinkedin />, label: 'LinkedIn', value: 'mugisha-pacifique', href: 'https://linkedin.com/in/mugisha-pacifique', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'hover:border-blue-300 dark:hover:border-blue-600' },
];

const faqs = [
  { q: 'Are you available for freelance work?', a: 'Yes! I am open to freelance projects, especially in web development and AI integration.' },
  { q: 'What is your typical response time?', a: 'I usually respond within 24 hours on business days.' },
  { q: 'Do you work with international clients?', a: 'Absolutely. I have experience working remotely with teams across multiple continents.' },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 px-8 py-8">
        <h2 className="text-2xl font-extrabold text-white mb-1">Get In Touch</h2>
        <p className="text-white/80 text-sm mb-3">I'm always open to new opportunities and collaborations</p>
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <FaMapMarkerAlt className="text-red-300" /> Rwanda, Africa · Available for remote work worldwide
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* Contact links */}
        <div className="grid grid-cols-2 gap-3">
          {contactLinks.map(item => (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-3 ${item.bg} rounded-xl p-3.5 border border-gray-100 dark:border-gray-700 ${item.border} hover:shadow-md hover:scale-[1.02] transition-all group`}>
              <div className={`text-lg flex-shrink-0 ${item.color}`}>{item.icon}</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Availability badge */}
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">Available for new projects</p>
            <p className="text-xs text-green-600/70 dark:text-green-500/70">Open to full-time, part-time, and freelance opportunities</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Send a Message</h3>
          {sent ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <FaCheckCircle className="text-5xl text-green-500" />
              <p className="font-bold text-gray-800 dark:text-white text-lg">Message sent!</p>
              <p className="text-sm text-gray-500 text-center">Thanks for reaching out. I'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name *</label>
                  <input type="text" required placeholder="Your name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email *</label>
                  <input type="email" required placeholder="your@email.com"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject *</label>
                <input type="text" required placeholder="What's this about?"
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message *</label>
                <textarea required rows={4} placeholder="Tell me about your project or opportunity..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                  value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:shadow-violet-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:scale-100 transition-all">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaPaperPlane className="text-xs" />}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{faq.q}</span>
                  <span className="text-gray-400 text-xs ml-2">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Download CV */}
        <a href="/MUGISHA PACIFIQUE.pdf" download
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-violet-500 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:scale-[1.02] transition-all mb-4">
          <FaDownload className="text-xs" /> Download My CV / Resume
        </a>

      </div>
    </div>
  );
}
