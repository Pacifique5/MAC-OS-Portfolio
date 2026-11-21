'use client';
import { useState } from 'react';
import { IoPaperPlane, IoMail, IoCall, IoLogoGithub, IoLogoLinkedin, IoDownloadOutline, IoCheckmarkCircle, IoAttach, IoText } from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { InsetGroup, GroupRow, SymbolTile, ToolbarButton, PushButton } from '../ui/mac';
import { ChevronGlyph, Spinner } from '../icons/SystemIcons';

const contactLinks = [
  { Glyph: IoMail, color: '#007aff', label: 'Email', value: 'Pacifiquem58@gmail.com', href: 'mailto:Pacifiquem58@gmail.com' },
  { Glyph: IoCall, color: '#34c759', label: 'Phone', value: '+250 795 653 123', href: 'tel:+250795653123' },
  { Glyph: IoLogoGithub, color: '#1d1d1f', label: 'GitHub', value: 'github.com/Pacifique5', href: 'https://github.com/Pacifique5' },
  { Glyph: IoLogoLinkedin, color: '#0a66c2', label: 'LinkedIn', value: 'pacifique-mugisha', href: 'https://www.linkedin.com/in/pacifique-mugisha-449a4a3b0/' },
];

const faqs = [
  { q: 'Are you available for freelance work?', a: 'Yes! I am open to freelance projects, especially in web development and AI integration.' },
  { q: 'What is your typical response time?', a: 'I usually respond within 24 hours on business days.' },
  { q: 'Do you work with international clients?', a: 'Absolutely. I have experience working remotely with teams across multiple continents.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const canSend = form.name && form.email && form.subject && form.message;

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  };

  const field = 'flex-1 bg-transparent outline-none text-[13px] placeholder:text-black/30 dark:placeholder:text-white/30';

  return (
    <WindowLayout
      title="New Message"
      subtitle="To: Mugisha Pacifique"
      toolbar={
        <>
          <ToolbarButton title="Attach"><IoAttach className="text-[17px]" /></ToolbarButton>
          <ToolbarButton title="Format"><IoText className="text-[15px]" /></ToolbarButton>
          <ToolbarButton title="Send" onClick={() => send()}>
            {loading ? <Spinner size={15} /> : <IoPaperPlane className={`text-[16px] ${canSend ? 'text-macblue' : ''}`} />}
          </ToolbarButton>
        </>
      }
    >
      {/* Compose */}
      <form onSubmit={send} className="border-b border-[var(--hairline)]">
        {sent ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2">
            <IoCheckmarkCircle className="text-[44px] text-[#34c759]" />
            <p className="text-[15px] font-semibold">Message Sent</p>
            <p className="text-[13px] text-black/50 dark:text-white/50">Thanks for reaching out — I’ll reply within 24 hours.</p>
          </div>
        ) : (
          <>
            {[
              { label: 'To:', node: <span className="inline-flex items-center px-2 h-[20px] rounded-full bg-macblue/15 text-macblue text-[12px]">Mugisha Pacifique</span> },
              { label: 'From:', node: <input required placeholder="Your name" className={field} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /> },
              { label: 'Reply-To:', node: <input required type="email" placeholder="your@email.com" className={field} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /> },
              { label: 'Subject:', node: <input required placeholder="What’s this about?" className={`${field} font-medium`} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /> },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2 mx-5 h-[34px] border-b border-[var(--hairline)]">
                <span className="w-[68px] text-right text-[13px] text-black/45 dark:text-white/45 flex-shrink-0">{r.label}</span>
                {r.node}
              </div>
            ))}
            <textarea
              required
              rows={7}
              placeholder="Tell me about your project or opportunity…"
              className="w-full px-5 py-3 bg-transparent outline-none resize-none text-[13px] leading-relaxed placeholder:text-black/30 dark:placeholder:text-white/30"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
            />
            <div className="flex justify-end px-5 pb-3">
              <PushButton primary type="submit" disabled={!canSend || loading}>
                {loading ? <Spinner size={12} /> : <IoPaperPlane />} {loading ? 'Sending…' : 'Send'}
              </PushButton>
            </div>
          </>
        )}
      </form>

      <div className="bg-[var(--content-bg)] px-6 py-6">
        <div className="max-w-[560px] mx-auto">
          <div className="flex items-center gap-2.5 mb-5 px-3 py-2.5 rounded-[10px] bg-[#34c759]/10 shadow-[0_0_0_0.5px_rgba(52,199,89,0.35)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34c759] animate-pulse" />
            <div>
              <div className="text-[13px] font-semibold text-[#248a3d] dark:text-[#30d158]">Available for new projects</div>
              <div className="text-[11px] text-black/50 dark:text-white/50">Rwanda, Africa · Open to remote work worldwide</div>
            </div>
          </div>

          <InsetGroup title="Other Ways to Reach Me">
            {contactLinks.map(c => (
              <GroupRow key={c.label} href={c.href} icon={<SymbolTile Glyph={c.Glyph} color={c.color} size={24} />} label={c.label}
                right={<><span className="truncate max-w-[200px]">{c.value}</span><ChevronGlyph size={8} className="opacity-50" /></>} />
            ))}
          </InsetGroup>

          <InsetGroup title="Frequently Asked Questions">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                  <ChevronGlyph dir={openFaq === i ? 'down' : 'right'} size={9} className="opacity-45" />
                  {f.q}
                </button>
                {openFaq === i && <p className="pl-[34px] pr-4 pb-3 text-[12px] leading-relaxed text-black/60 dark:text-white/60">{f.a}</p>}
              </div>
            ))}
          </InsetGroup>

          <div className="flex justify-center">
            <PushButton href="/MUGISHA PACIFIQUE.pdf" download><IoDownloadOutline /> Download CV / Resume</PushButton>
          </div>
        </div>
      </div>
    </WindowLayout>
  );
}
