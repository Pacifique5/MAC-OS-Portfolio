'use client';
import { useState } from 'react';
import { IoPaperPlane, IoMail, IoCall, IoLogoGithub, IoLogoLinkedin, IoDownloadOutline, IoCheckmarkCircle, IoCopyOutline } from 'react-icons/io5';
import { FaXTwitter, FaSlack } from 'react-icons/fa6';
import { WindowLayout } from '../MacWindow';
import { CV_URL, SOCIAL_LINKS } from '../apps';
import { InsetGroup, GroupRow, SymbolTile, ToolbarButton, PushButton } from '../ui/mac';
import { ChevronGlyph } from '../icons/SystemIcons';

const EMAIL = 'Pacifiquem58@gmail.com';

const contactLinks = [
  { Glyph: IoMail, color: '#007aff', label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
  { Glyph: IoCall, color: '#34c759', label: 'Phone', value: '+250 795 653 123', href: 'tel:+250795653123' },
  { Glyph: IoLogoGithub, color: '#1d1d1f', label: 'GitHub', value: 'github.com/Pacifique5', href: SOCIAL_LINKS.github },
  { Glyph: IoLogoLinkedin, color: '#0a66c2', label: 'LinkedIn', value: 'pacifique-mugisha', href: SOCIAL_LINKS.linkedin },
  { Glyph: FaXTwitter, color: '#1d1d1f', label: 'X', value: '@_fiquem', href: SOCIAL_LINKS.x },
  { Glyph: FaSlack, color: '#4a154b', label: 'Slack', value: 'codewithpacifique', href: SOCIAL_LINKS.slack },
];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const faqs = [
  { q: 'Are you available for freelance work?', a: 'Yes! I am open to freelance projects, especially in web development and AI integration.' },
  { q: 'What is your typical response time?', a: 'I usually respond within 24 hours on business days.' },
  { q: 'Do you work with international clients?', a: 'Absolutely. I have experience working remotely with teams across multiple continents.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const emailInvalid = form.email.length > 0 && !isEmail(form.email);
  const canSend = Boolean(form.name.trim() && isEmail(form.email) && form.subject.trim() && form.message.trim());

  /** Opens the visitor's email app with the message pre-filled, so it really reaches me. */
  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSend) return;
    const body = `${form.message.trim()}\n\n— ${form.name.trim()}\nReply to: ${form.email.trim()}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(form.subject.trim())}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const copyEmail = () => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }, () => {});
  };

  const reset = () => {
    setSent(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const field = 'flex-1 bg-transparent outline-none text-[13px] placeholder:text-black/30 dark:placeholder:text-white/30';

  return (
    <WindowLayout
      title="New Message"
      subtitle="To: Mugisha Pacifique"
      toolbar={
        <>
          <ToolbarButton title={copied ? 'Copied' : 'Copy email address'} onClick={copyEmail}>
            {copied ? <IoCheckmarkCircle className="text-[16px] text-[#34c759]" /> : <IoCopyOutline className="text-[15px]" />}
          </ToolbarButton>
          <ToolbarButton title={canSend ? 'Send' : 'Fill in every field to send'} onClick={() => send()}>
            <IoPaperPlane className={`text-[16px] ${canSend ? 'text-macblue' : 'opacity-40'}`} />
          </ToolbarButton>
        </>
      }
    >
      {/* Compose */}
      <form onSubmit={send} className="border-b border-(--hairline)">
        {sent ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-2">
            <IoCheckmarkCircle className="text-[44px] text-[#34c759]" />
            <p className="text-[15px] font-semibold">Your email is ready to send</p>
            <p className="text-[13px] text-black/55 dark:text-white/55 max-w-90">
              Your email app opened with the message filled in — just press Send there. Nothing opened? Email me directly at{' '}
              <a href={`mailto:${EMAIL}`} className="text-macblue hover:underline">{EMAIL}</a>.
            </p>
            <div className="flex gap-2 mt-2">
              <PushButton onClick={copyEmail}><IoCopyOutline /> {copied ? 'Copied' : 'Copy Email'}</PushButton>
              <PushButton onClick={reset}>New Message</PushButton>
            </div>
          </div>
        ) : (
          <>
            {[
              { label: 'To:', node: <span className="inline-flex items-center px-2 h-5 rounded-full bg-macblue/15 text-macblue text-[12px]">Mugisha Pacifique</span> },
              { label: 'From:', node: <input required placeholder="Your name" className={field} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /> },
              { label: 'Reply-To:', node: (
                <>
                  <input required type="email" placeholder="your@email.com" aria-invalid={emailInvalid} className={field} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  {emailInvalid && <span className="text-[11px] text-[#ff3b30] shrink-0">Enter a valid email</span>}
                </>
              ) },
              { label: 'Subject:', node: <input required placeholder="What’s this about?" className={`${field} font-medium`} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /> },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2 mx-5 h-8.5 border-b border-(--hairline)">
                <span className="w-17 text-right text-[13px] text-black/45 dark:text-white/45 shrink-0">{r.label}</span>
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
            <div className="flex items-center justify-between gap-3 px-5 pb-3">
              <span className="text-[11px] text-black/40 dark:text-white/40">Opens your email app with this message addressed to me.</span>
              <PushButton primary type="submit" disabled={!canSend}>
                <IoPaperPlane /> Send
              </PushButton>
            </div>
          </>
        )}
      </form>

      <div className="bg-(--content-bg) px-6 py-6">
        <div className="max-w-140 mx-auto">
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
                right={<><span className="truncate max-w-50">{c.value}</span><ChevronGlyph size={8} className="opacity-50" /></>} />
            ))}
          </InsetGroup>

          <InsetGroup title="Frequently Asked Questions">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-[13px] hover:bg-black/2 dark:hover:bg-white/3">
                  <ChevronGlyph dir={openFaq === i ? 'down' : 'right'} size={9} className="opacity-45" />
                  {f.q}
                </button>
                {openFaq === i && <p className="pl-8.5 pr-4 pb-3 text-[12px] leading-relaxed text-black/60 dark:text-white/60">{f.a}</p>}
              </div>
            ))}
          </InsetGroup>

          <div className="flex justify-center">
            <PushButton href={CV_URL} download><IoDownloadOutline /> Download CV / Resume</PushButton>
          </div>
        </div>
      </div>
    </WindowLayout>
  );
}
