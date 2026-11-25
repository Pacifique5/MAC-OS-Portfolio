'use client';
import { useMemo, useState } from 'react';
import {
  IoSearch, IoCreateOutline, IoArrowUp, IoChatbubblesOutline, IoLogoLinkedin, IoCheckmarkCircle, IoAlertCircle,
  IoPencil, IoEyeOutline, IoSparkles, IoMailOutline, IoChevronForward,
} from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { Monogram, MessagesIcon } from '../icons/AppIcons';
import { SidebarItem, SidebarSection, ToolbarButton, PushButton } from '../ui/mac';
import { TESTIMONIALS, RELATIONSHIPS, TEXT_MIN, TEXT_MAX, Relationship } from '../testimonials-data';

const EMAIL = 'pacifiquem58@gmail.com';
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const firstName = (name: string) => name.split(/\s+/)[0];

type View = 'wall' | 'write' | number;

const EMPTY_FORM = { name: '', role: '', organisation: '', relationship: '' as Relationship | '', email: '', linkedin: '', text: '', consent: false, website: '' };

/* ------------------------------------------------------------------ */
/* Write a Recommendation                                              */
/* ------------------------------------------------------------------ */

function WriteForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<'sent' | 'not-configured' | null>(null);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const textLen = form.text.trim().length;
  const ready =
    form.name.trim().length >= 2 && form.role.trim().length >= 2 && form.organisation.trim().length >= 2 &&
    form.relationship !== '' && EMAIL_RE.test(form.email.trim()) && textLen >= TEXT_MIN && textLen <= TEXT_MAX && form.consent;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) setResult('sent');
      else if (res.status === 503) setResult('not-configured');
      else setError(j.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('You seem to be offline. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (result === 'sent') {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-2 p-8 animate-fade-in">
        <IoCheckmarkCircle className="text-[56px] text-[#34c759]" />
        <div className="text-[18px] font-semibold">Thank you, {firstName(form.name)}!</div>
        <p className="text-[13px] text-black/55 dark:text-white/55 max-w-80 leading-relaxed">
          Your recommendation is on its way to me. I’ll read it, and once I’ve approved it, it will appear here with your name and role.
        </p>
        <div className="mt-3"><PushButton onClick={onDone}>Back to Recommendations</PushButton></div>
      </div>
    );
  }
  if (result === 'not-configured') {
    const body = `${form.text}\n\n— ${form.name}, ${form.role} at ${form.organisation} (${form.relationship})${form.linkedin ? `\n${form.linkedin}` : ''}`;
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-2 p-8">
        <IoMailOutline className="text-[44px] text-macblue" />
        <div className="text-[15px] font-semibold">Send it by email instead</div>
        <p className="text-[12px] text-black/55 dark:text-white/55 max-w-72">Online submissions aren’t switched on yet. Your email app will open with your recommendation filled in.</p>
        <PushButton primary href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Recommendation from ${form.name}`)}&body=${encodeURIComponent(body)}`}><IoMailOutline /> Email Recommendation</PushButton>
      </div>
    );
  }

  const input = 'w-full h-8.5 px-3 rounded-lg bg-black/4 dark:bg-white/8 outline-none text-[13px] focus:ring-2 focus:ring-macblue/50 placeholder:text-black/35 dark:placeholder:text-white/35';
  const label = 'block text-[11px] font-semibold text-black/50 dark:text-white/50 mb-1';

  return (
    <form onSubmit={submit} className="max-w-160 mx-auto px-4 py-5 @md:px-6 @md:py-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-2 text-[13px] pb-3 border-b border-(--hairline)">
        <span className="text-black/45 dark:text-white/45">To:</span>
        <span className="inline-flex items-center px-2 h-5.5 rounded-full bg-macblue/15 text-macblue text-[12px] font-medium">Mugisha Pacifique</span>
      </div>

      <div>
        <h2 className="text-[20px] font-semibold">Write a recommendation</h2>
        <p className="text-[13px] text-black/55 dark:text-white/55 mt-1 leading-relaxed">
          Taught me, mentored me or built something with me? Share what it was like. I review every recommendation before it’s published.
        </p>
      </div>

      <div className="grid @xl:grid-cols-2 gap-3">
        <div><label className={label} htmlFor="rec-name">Full name</label>
          <input id="rec-name" required maxLength={80} placeholder="e.g. Uwase Aline" className={input} value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div><label className={label} htmlFor="rec-role">Your role or title</label>
          <input id="rec-role" required maxLength={80} placeholder="e.g. Software Engineering Lecturer" className={input} value={form.role} onChange={e => set('role', e.target.value)} /></div>
        <div><label className={label} htmlFor="rec-org">School or company</label>
          <input id="rec-org" required maxLength={100} placeholder="e.g. Rwanda Coding Academy" className={input} value={form.organisation} onChange={e => set('organisation', e.target.value)} /></div>
        <div><label className={label} htmlFor="rec-email">Email <span className="font-normal">(not published)</span></label>
          <input id="rec-email" required type="email" maxLength={120} placeholder="you@example.com" className={input} value={form.email} onChange={e => set('email', e.target.value)} /></div>
      </div>

      <div>
        <span className={label}>How do you know me?</span>
        <div className="flex flex-wrap gap-1.5">
          {RELATIONSHIPS.map(r => (
            <button key={r} type="button" onClick={() => set('relationship', r)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors ${form.relationship === r ? 'bg-macblue text-white' : 'bg-black/5 dark:bg-white/8 hover:bg-black/8 dark:hover:bg-white/12'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={label} htmlFor="rec-text">Your recommendation</label>
        <textarea id="rec-text" required rows={6} maxLength={TEXT_MAX} value={form.text} onChange={e => set('text', e.target.value)}
          placeholder="What was it like working with Pacifique? What did he do well?"
          className="w-full px-3.5 py-3 rounded-[18px] rounded-bl-md bg-black/4 dark:bg-white/8 outline-none resize-none text-[14px] leading-relaxed focus:ring-2 focus:ring-macblue/50 placeholder:text-black/35 dark:placeholder:text-white/35" />
        <div className={`text-right text-[11px] mt-0.5 ${textLen > 0 && textLen < TEXT_MIN ? 'text-[#ff9500]' : 'text-black/40 dark:text-white/40'}`}>
          {textLen < TEXT_MIN ? `${TEXT_MIN - textLen > 0 ? `${TEXT_MIN - textLen} more characters needed` : ''}` : `${textLen} / ${TEXT_MAX}`}
        </div>
      </div>

      <div><label className={label} htmlFor="rec-linkedin">LinkedIn profile <span className="font-normal">(optional, lets visitors verify you)</span></label>
        <input id="rec-linkedin" type="url" placeholder="https://www.linkedin.com/in/your-name" className={input} value={form.linkedin} onChange={e => set('linkedin', e.target.value)} /></div>

      {/* Honeypot for bots: hidden from people and screen readers */}
      <input tabIndex={-1} autoComplete="off" aria-hidden name="website" value={form.website} onChange={e => set('website', e.target.value)} className="sr-only" />

      <label className="flex items-start gap-2.5 text-[12px] text-black/65 dark:text-white/65 cursor-pointer">
        <input type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)} className="mt-0.5 accent-macblue" />
        I agree that my name, role, organisation and recommendation can be published on this portfolio.
      </label>

      {error && <div className="flex items-start gap-1.5 text-[12px] text-[#ff3b30]"><IoAlertCircle className="mt-0.5 shrink-0" />{error}</div>}

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-black/40 dark:text-white/40">Sent privately to me for review.</span>
        <PushButton primary type="submit" disabled={!ready || sending}><IoArrowUp /> {sending ? 'Sending…' : 'Send Recommendation'}</PushButton>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function Testimonials({ onOpen }: { onOpen: (id: string) => void }) {
  const [view, setView] = useState<View>('wall');
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TESTIMONIALS.map((t, i) => ({ t, i })).filter(({ t }) => !q || `${t.name} ${t.role} ${t.organisation} ${t.relationship} ${t.text}`.toLowerCase().includes(q));
  }, [query]);

  const count = TESTIMONIALS.length;
  const current = typeof view === 'number' ? TESTIMONIALS[view] : null;

  const sidebar = (
    <>
      <div className="flex items-center gap-1.5 h-6.5 px-2 mb-2 rounded-md bg-black/6 dark:bg-white/8">
        <IoSearch className="text-[12px] opacity-45" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search"
          className="bg-transparent outline-none text-[13px] w-full placeholder:text-black/40 dark:placeholder:text-white/40" />
      </div>
      <SidebarSection>
        <SidebarItem icon={<IoChatbubblesOutline />} label="All Recommendations" badge={count || undefined} active={view === 'wall'} onClick={() => setView('wall')} />
        <SidebarItem icon={<IoPencil />} label="Write a Recommendation" active={view === 'write'} onClick={() => setView('write')} />
      </SidebarSection>
      {list.length > 0 && (
        <SidebarSection title="Messages">
          <div className="space-y-px">
            {list.map(({ t, i }) => {
              const sel = view === i;
              return (
                <button key={`${t.name}-${i}`} type="button" onClick={() => setView(i)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left ${sel ? 'bg-macblue text-white' : 'hover:bg-black/4 dark:hover:bg-white/5'}`}>
                  <Monogram initials={initials(t.name)} size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{t.name}</div>
                    <div className={`text-[11px] truncate ${sel ? 'text-white/75' : 'text-black/45 dark:text-white/45'}`}>{t.relationship} · {t.organisation}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </SidebarSection>
      )}
      {query && list.length === 0 && count > 0 && <div className="px-2 text-[12px] text-black/45 dark:text-white/45">No matches.</div>}
    </>
  );

  const title = view === 'write' ? 'New Recommendation' : current ? current.name : 'Recommendations';
  const subtitle = view === 'write' ? 'To: Mugisha Pacifique' : current ? `${current.role} · ${current.organisation}` : count ? `${count} ${count === 1 ? 'person' : 'people'}` : 'Be the first';

  return (
    <WindowLayout
      title={title}
      subtitle={subtitle}
      sidebar={sidebar}
      sidebarWidth={250}
      toolbar={<ToolbarButton title="Write a Recommendation" onClick={() => setView('write')}><IoCreateOutline className="text-[17px]" /></ToolbarButton>}
    >
      {view === 'write' ? (
        <WriteForm onDone={() => setView('wall')} />
      ) : current ? (
        /* -------- Conversation -------- */
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto mac-scroll px-5 py-6 animate-fade-in">
            <div className="flex flex-col items-center mb-6 text-center">
              <Monogram initials={initials(current.name)} size={64} />
              <div className="text-[15px] font-semibold mt-2">{current.name}</div>
              <div className="text-[12px] text-black/50 dark:text-white/50">{current.role} · {current.organisation}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-macblue/12 text-macblue font-medium">{current.relationship}</span>
                {current.linkedin && (
                  <a href={current.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[11px] text-macblue hover:underline">
                    <IoLogoLinkedin /> View profile
                  </a>
                )}
              </div>
            </div>
            <div className="text-center text-[11px] text-black/40 dark:text-white/40 mb-3">{current.date}</div>
            <div className="flex items-end gap-2 mb-5">
              <Monogram initials={initials(current.name)} size={26} />
              <div className="max-w-[80%] px-3.5 py-2.5 rounded-[18px] rounded-bl-md bg-[#e9e9eb] dark:bg-[#3a3a3c] text-[14px] leading-relaxed whitespace-pre-line">
                {current.text}
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] px-3.5 py-2 rounded-[18px] rounded-br-md bg-[linear-gradient(180deg,#3d9bff,#0a7aff)] text-white text-[14px]">
                Thank you, {firstName(current.name)}! That means a lot. 🙏
              </div>
            </div>
            <div className="text-right text-[11px] text-black/40 dark:text-white/40 mt-1 pr-1">Delivered</div>
          </div>
          <div className="px-4 py-2.5 border-t border-(--hairline) flex items-center gap-2">
            <button type="button" onClick={() => onOpen('contact')}
              className="flex-1 h-7 px-3 rounded-full border border-(--hairline) flex items-center text-[13px] text-black/40 dark:text-white/40 hover:border-macblue transition-colors text-left">
              Want to work together? Send me a message…
            </button>
            <button type="button" aria-label="Send a message" onClick={() => onOpen('contact')}
              className="w-7 h-7 rounded-full bg-macblue text-white flex items-center justify-center shrink-0 hover:brightness-110">
              <IoArrowUp className="text-[15px]" />
            </button>
          </div>
        </div>
      ) : count === 0 ? (
        /* -------- Empty wall: invite the first recommendation -------- */
        <div className="min-h-full flex flex-col items-center justify-center text-center px-6 py-10 animate-fade-in">
          <MessagesIcon size={76} />
          <h2 className="text-[22px] font-semibold mt-4">Be the first to recommend me</h2>
          <p className="text-[13px] text-black/55 dark:text-white/55 max-w-96 mt-2 leading-relaxed">
            Taught me at Rwanda Coding Academy, mentored me, managed me during an internship or built a project with me? Tell visitors what it was like.
          </p>
          <div className="mt-5"><PushButton primary onClick={() => setView('write')}><IoPencil /> Write a Recommendation</PushButton></div>
          <div className="grid @xl:grid-cols-3 gap-3 mt-9 w-full max-w-160">
            {[
              [IoPencil, 'You write it', 'A few sentences about working with me.'],
              [IoEyeOutline, 'I review it', 'It comes to me privately by email.'],
              [IoSparkles, 'It goes live', 'Shown here with your name and role.'],
            ].map(([Icon, head, sub], n) => {
              const I = Icon as typeof IoPencil;
              return (
                <div key={n} className="rounded-2xl bg-black/3 dark:bg-white/5 px-4 py-4 text-left">
                  <div className="flex items-center gap-2 text-[13px] font-semibold"><I className="text-macblue text-[16px]" />{head as string}</div>
                  <div className="text-[12px] text-black/50 dark:text-white/50 mt-1">{sub as string}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* -------- Wall of recommendations -------- */
        <div className="px-4 py-5 @md:px-6 @md:py-6 animate-fade-in">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[22px] font-semibold">What people say</h2>
              <p className="text-[13px] text-black/50 dark:text-white/50">{count} {count === 1 ? 'person has' : 'people have'} shared what it’s like to work with me.</p>
            </div>
            <PushButton onClick={() => setView('write')}><IoPencil /> Write One</PushButton>
          </div>
          <div className="columns-1 @2xl:columns-2 @5xl:columns-3 gap-3">
            {list.map(({ t, i }) => (
              <button key={`${t.name}-${i}`} type="button" onClick={() => setView(i)}
                className="group w-full break-inside-avoid mb-3 text-left rounded-2xl p-4 bg-black/3 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/8 transition-colors">
                <div className="text-[34px] leading-none font-serif text-macblue/70 -mb-2">“</div>
                <p className="text-[13.5px] leading-relaxed text-black/80 dark:text-white/85 line-clamp-8">{t.text}</p>
                <div className="flex items-center gap-2.5 mt-3.5">
                  <Monogram initials={initials(t.name)} size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{t.name}</div>
                    <div className="text-[11px] text-black/50 dark:text-white/50 truncate">{t.role} · {t.organisation}</div>
                  </div>
                  <IoChevronForward className="text-[12px] opacity-0 group-hover:opacity-40 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </WindowLayout>
  );
}
