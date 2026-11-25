'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IoChevronBack, IoChevronForward, IoCheckmarkCircle, IoTimeOutline, IoVideocamOutline, IoMailOutline,
  IoCalendarOutline, IoArrowBack, IoAlertCircle,
} from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { ToolbarButton, PushButton } from '../ui/mac';
import {
  SLOT_TIMES, CALL_MINUTES, TZ_LABEL, TZ_OFFSET_HOURS, FEW_LEFT, slotId, slotStart, slotState, dayStatus, todayInKigali, buildIcs, DayStatus,
} from '../booking-config';

const EMAIL = 'Pacifiquem58@gmail.com';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

const pad = (n: number) => String(n).padStart(2, '0');
const monthOf = (date: string) => date.slice(0, 7);
function shiftMonth(month: string, n: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}
const longDate = (date: string) =>
  slotStart(date, '12:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Africa/Kigali' });

const DOT: Record<string, string> = { many: '#34c759', few: '#ff9500', full: '#ff3b30' };
function dotFor(s: DayStatus) {
  if (s.kind === 'full') return DOT.full;
  if (s.kind === 'available') return s.free <= FEW_LEFT ? DOT.few : DOT.many;
  return null;
}

type Availability = { month: string; booked: Set<string>; configured: boolean; error?: boolean };
type Result = { kind: 'done'; date: string; time: string } | { kind: 'not-configured' } | null;

export default function Calendar({ initialDate }: { initialDate?: string | null }) {
  const [now, setNow] = useState(() => new Date());
  const today = todayInKigali(now);
  const [month, setMonth] = useState(() => monthOf(initialDate ?? today));
  const [data, setData] = useState<Availability | null>(null);
  const [selected, setSelected] = useState<string | null>(initialDate ?? null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', topic: '', website: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [reload, setReload] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Visitors outside Rwanda also see each time in their own timezone
  const showLocal = -now.getTimezoneOffset() !== TZ_OFFSET_HOURS * 60;

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/bookings?month=${month}`, { signal: ctrl.signal, cache: 'no-store' })
      .then(r => r.json())
      .then((j: { booked?: string[]; configured?: boolean }) => {
        setNow(new Date());
        setData({ month, booked: new Set(j.booked ?? []), configured: j.configured !== false });
      })
      .catch(e => { if (e.name !== 'AbortError') setData({ month, booked: new Set(), configured: true, error: true }); });
    return () => ctrl.abort();
  }, [month, reload]);

  const loading = data?.month !== month;
  const booked = useMemo(() => (data && !loading ? data.booked : new Set<string>()), [data, loading]);

  const cells = useMemo(() => {
    const [y, m] = month.split('-').map(Number);
    const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return [...Array<null>(first).fill(null), ...Array.from({ length: days }, (_, i) => `${month}-${pad(i + 1)}`)];
  }, [month]);

  const status = selected ? dayStatus(selected, booked, now) : null;
  const canSend = form.name.trim().length >= 2 && EMAIL_RE.test(form.email.trim()) && !sending;

  const pickDay = (date: string) => {
    setSelected(date);
    setTime(null);
    setError(null);
    setResult(null);
    // On narrow windows the times sit below the calendar
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !time || !canSend) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selected, time, ...form }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        setData(d => (d ? { ...d, booked: new Set([...d.booked, slotId(selected, time)]) } : d));
        setResult({ kind: 'done', date: selected, time });
      } else if (res.status === 503) {
        setResult({ kind: 'not-configured' });
      } else {
        setError(j.error ?? 'Something went wrong. Please try again.');
        if (res.status === 409) { setTime(null); setReload(n => n + 1); }
      }
    } catch {
      setError('You seem to be offline. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const localTime = (date: string, t: string) =>
    slotStart(date, t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [y, m] = month.split('-').map(Number);
  const monthName = new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' });

  const toolbar = (
    <>
      <ToolbarButton title="Previous month" onClick={() => setMonth(shiftMonth(month, -1))}><IoChevronBack /></ToolbarButton>
      <ToolbarButton title="Today" onClick={() => { setMonth(monthOf(today)); }}><span className="text-[12px] px-1">Today</span></ToolbarButton>
      <ToolbarButton title="Next month" onClick={() => setMonth(shiftMonth(month, 1))}><IoChevronForward /></ToolbarButton>
    </>
  );

  /* ------------------------------ side panel ------------------------------ */
  let panel: React.ReactNode;
  if (result?.kind === 'done') {
    const ics = buildIcs({ date: result.date, time: result.time, name: form.name.trim(), email: form.email.trim(), topic: form.topic.trim() });
    panel = (
      <div className="flex flex-col items-center text-center gap-2 py-6 animate-fade-in">
        <IoCheckmarkCircle className="text-[48px] text-[#34c759]" />
        <div className="text-[15px] font-semibold">You’re booked!</div>
        <p className="text-[13px] text-black/65 dark:text-white/65">
          {longDate(result.date)} at {result.time} ({TZ_LABEL}){showLocal ? `, ${localTime(result.date, result.time)} your time` : ''}.
        </p>
        <p className="text-[12px] text-black/50 dark:text-white/50 max-w-64">
          I’ve been notified and will email a meeting link to <b>{form.email.trim()}</b>.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <PushButton primary href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download><IoCalendarOutline /> Add to Calendar</PushButton>
          <PushButton onClick={() => { setResult(null); setTime(null); setSelected(null); setForm(f => ({ ...f, topic: '' })); }}>Book Another</PushButton>
        </div>
      </div>
    );
  } else if (result?.kind === 'not-configured' && selected && time) {
    const body = `Hi Pacifique,\n\nI'd like to book a ${CALL_MINUTES}-minute call on ${longDate(selected)} at ${time} (${TZ_LABEL}).\n\nName: ${form.name}\nTopic: ${form.topic}\n`;
    panel = (
      <div className="flex flex-col items-center text-center gap-2 py-6">
        <IoMailOutline className="text-[40px] text-macblue" />
        <div className="text-[14px] font-semibold">Send your request by email</div>
        <p className="text-[12px] text-black/55 dark:text-white/55 max-w-64">Online booking isn’t switched on yet. Your email app will open with the details filled in.</p>
        <PushButton primary href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Call request: ${longDate(selected)} ${time}`)}&body=${encodeURIComponent(body)}`}>
          <IoMailOutline /> Email Request
        </PushButton>
      </div>
    );
  } else if (!selected || !status) {
    panel = (
      <div className="space-y-3">
        <div className="text-[15px] font-semibold">Book a call with me</div>
        <p className="text-[13px] text-black/60 dark:text-white/60 leading-relaxed">
          Pick a day to see which times are free. Days fill up as people book, so what you see is live.
        </p>
        {[
          [IoTimeOutline, `${CALL_MINUTES} minutes, Monday to Friday`],
          [IoVideocamOutline, 'Video call, link sent by email'],
          [IoCalendarOutline, `Times shown in ${TZ_LABEL}${showLocal ? ' and your time' : ''}`],
        ].map(([Icon, text]) => {
          const I = Icon as typeof IoTimeOutline;
          return <div key={text as string} className="flex items-center gap-2 text-[12px] text-black/65 dark:text-white/65"><I className="text-macblue text-[15px] shrink-0" />{text as string}</div>;
        })}
      </div>
    );
  } else {
    panel = (
      <div className="space-y-3">
        <div>
          <div className="text-[15px] font-semibold">{longDate(selected)}</div>
          <div className="flex items-center gap-1.5 text-[12px] mt-0.5">
            {status.kind === 'available' && <><span className="w-2 h-2 rounded-full" style={{ background: dotFor(status)! }} /><span className="text-black/60 dark:text-white/60">Available · {status.free} of {SLOT_TIMES.length} times free</span></>}
            {status.kind === 'full' && <><span className="w-2 h-2 rounded-full" style={{ background: DOT.full }} /><span className="text-black/60 dark:text-white/60">Fully booked. Please choose another day.</span></>}
            {status.kind === 'unavailable' && <span className="text-black/50 dark:text-white/50">Not available. {status.reason}</span>}
          </div>
        </div>

        {status.kind !== 'unavailable' && (
          <div className="grid grid-cols-2 gap-1.5">
            {SLOT_TIMES.map(t => {
              const st = slotState(selected, t, booked, now);
              const active = time === t;
              return (
                <button key={t} type="button" disabled={st !== 'open'} onClick={() => { setTime(t); setError(null); }}
                  className={`h-11 rounded-lg text-left px-2.5 transition-colors ${
                    active ? 'bg-macblue text-white'
                    : st === 'open' ? 'bg-black/4 dark:bg-white/8 hover:bg-macblue/12'
                    : 'bg-black/2 dark:bg-white/3 text-black/30 dark:text-white/30 cursor-not-allowed'}`}>
                  <div className={`text-[13px] font-semibold tabular-nums ${st === 'booked' ? 'line-through' : ''}`}>{t}</div>
                  <div className={`text-[10px] ${active ? 'text-white/80' : 'opacity-60'}`}>
                    {st === 'booked' ? 'Booked' : st === 'past' ? 'Too soon' : showLocal ? `${localTime(selected, t)} your time` : 'Available'}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {time && status.kind === 'available' && (
          <form onSubmit={submit} className="space-y-2 pt-1 animate-fade-in">
            <div className="text-[12px] font-semibold">Your details</div>
            <input required placeholder="Your name" maxLength={80} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full h-8 px-2.5 rounded-md bg-black/4 dark:bg-white/8 outline-none text-[13px] focus:ring-2 focus:ring-macblue/50" />
            <input required type="email" placeholder="your@email.com" maxLength={120} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full h-8 px-2.5 rounded-md bg-black/4 dark:bg-white/8 outline-none text-[13px] focus:ring-2 focus:ring-macblue/50" />
            <textarea rows={3} placeholder="What would you like to talk about? (optional)" maxLength={600} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
              className="w-full px-2.5 py-2 rounded-md bg-black/4 dark:bg-white/8 outline-none resize-none text-[13px] focus:ring-2 focus:ring-macblue/50" />
            {/* Honeypot for bots: hidden from people and screen readers */}
            <input tabIndex={-1} autoComplete="off" aria-hidden name="website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })}
              className="sr-only" />
            {error && <div className="flex items-start gap-1.5 text-[12px] text-[#ff3b30]"><IoAlertCircle className="mt-0.5 shrink-0" />{error}</div>}
            <PushButton primary type="submit" disabled={!canSend}>{sending ? 'Booking…' : `Book ${time}`}</PushButton>
          </form>
        )}
        {!time && error && <div className="flex items-start gap-1.5 text-[12px] text-[#ff3b30]"><IoAlertCircle className="mt-0.5 shrink-0" />{error}</div>}
      </div>
    );
  }

  return (
    <WindowLayout title="Calendar" subtitle="Book a call" toolbar={toolbar}>
      <div className="flex flex-col @3xl:flex-row min-h-full">
        {/* Month */}
        <section className="flex-1 min-w-0 p-4 @md:p-6">
          <div className="flex items-baseline justify-between gap-3 mb-4">
            <h2 className="text-[24px] @md:text-[28px] leading-none"><b>{monthName}</b> <span className="font-light">{y}</span></h2>
            {loading && <span className="text-[11px] text-black/40 dark:text-white/40">Checking availability…</span>}
            {data?.error && !loading && <button type="button" onClick={() => setReload(n => n + 1)} className="text-[11px] text-[#ff3b30]">Couldn’t load availability. Retry</button>}
          </div>
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-black/45 dark:text-white/45 mb-1">
            {WEEKDAYS.map(d => <div key={d}><span className="@md:hidden">{d[0]}</span><span className="hidden @md:inline">{d}</span></div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`e${i}`} />;
              const s = dayStatus(date, booked, now);
              const dot = loading ? null : dotFor(s);
              const isToday = date === today;
              const isSel = date === selected;
              const off = s.kind === 'unavailable';
              return (
                <button key={date} type="button" onClick={() => pickDay(date)}
                  className={`flex flex-col items-center justify-center gap-1 h-12 @xl:h-16 rounded-lg transition-colors ${isSel ? 'bg-macblue/12 ring-1 ring-macblue/40' : 'hover:bg-black/4 dark:hover:bg-white/6'}`}>
                  <span className={`w-7 h-7 leading-7 rounded-full text-[13px] font-medium ${isToday ? 'bg-[#ff3b30] text-white' : off ? 'text-black/30 dark:text-white/30' : ''}`}>
                    {Number(date.slice(8))}
                  </span>
                  <span className="flex items-center gap-1 h-2.5 text-[10px] text-black/45 dark:text-white/45">
                    {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
                    <span className="hidden @xl:inline">{s.kind === 'available' ? `${s.free} free` : s.kind === 'full' && !loading ? 'Full' : ''}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-black/50 dark:text-white/50">
            {[['Available', DOT.many], ['Few times left', DOT.few], ['Fully booked', DOT.full]].map(([label, c]) => (
              <span key={label} className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: c }} />{label}</span>
            ))}
          </div>
        </section>

        {/* Day panel */}
        <aside ref={panelRef} className="relative @3xl:w-80 shrink-0 border-t @3xl:border-t-0 @3xl:border-l border-(--hairline) p-4 @md:p-5 bg-black/1.5 dark:bg-white/2">
          {selected && !result && (
            <button type="button" onClick={() => { setSelected(null); setTime(null); setError(null); }} className="flex items-center gap-1 text-[12px] text-macblue mb-3">
              <IoArrowBack /> All days
            </button>
          )}
          {panel}
        </aside>
      </div>
    </WindowLayout>
  );
}
