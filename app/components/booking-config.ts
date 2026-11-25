// Booking rules shared by the Calendar app (browser) and /api/bookings (server).
// All slot times are in Kigali time (CAT, UTC+2, no daylight saving).

export const TZ_OFFSET_HOURS = 2;
export const TZ_LABEL = 'Kigali time (UTC+2)';

/** Start times offered each working day, in Kigali time. */
export const SLOT_TIMES = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
export const CALL_MINUTES = 30;
/** 0 = Sunday … 6 = Saturday */
const WORK_DAYS = [1, 2, 3, 4, 5];
/** How far ahead people can book. */
const HORIZON_DAYS = 60;
/** Slots starting sooner than this can't be booked. */
const MIN_NOTICE_HOURS = 3;
/** "Few left" threshold for the calendar dots. */
export const FEW_LEFT = 2;

const DAY_MS = 86_400_000;

export const slotId = (date: string, time: string) => `${date}T${time}`;

function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d };
}

/** True for a real calendar date written as YYYY-MM-DD. */
function isValidDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const { y, m, d } = parts(date);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** The instant a slot starts. */
export function slotStart(date: string, time: string) {
  const { y, m, d } = parts(date);
  const [h, min] = time.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, h - TZ_OFFSET_HOURS, min));
}

/** Today's date in Kigali, as YYYY-MM-DD. */
export function todayInKigali(now = new Date()) {
  return new Date(now.getTime() + TZ_OFFSET_HOURS * 3_600_000).toISOString().slice(0, 10);
}

function addDays(date: string, n: number) {
  const { y, m, d } = parts(date);
  return new Date(Date.UTC(y, m - 1, d) + n * DAY_MS).toISOString().slice(0, 10);
}

export function weekday(date: string) {
  const { y, m, d } = parts(date);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

type SlotState = 'open' | 'booked' | 'past';

export function slotState(date: string, time: string, booked: Set<string>, now = new Date()): SlotState {
  if (booked.has(slotId(date, time))) return 'booked';
  return slotStart(date, time).getTime() - now.getTime() < MIN_NOTICE_HOURS * 3_600_000 ? 'past' : 'open';
}

export type DayStatus =
  | { kind: 'unavailable'; reason: string }
  | { kind: 'full' }
  | { kind: 'available'; free: number };

export function dayStatus(date: string, booked: Set<string>, now = new Date()): DayStatus {
  const today = todayInKigali(now);
  if (date < today) return { kind: 'unavailable', reason: 'This day has passed.' };
  if (date > addDays(today, HORIZON_DAYS)) return { kind: 'unavailable', reason: `Bookings open ${HORIZON_DAYS} days ahead.` };
  if (!WORK_DAYS.includes(weekday(date))) return { kind: 'unavailable', reason: 'I don’t take calls at weekends.' };
  const free = SLOT_TIMES.filter(t => slotState(date, t, booked, now) === 'open').length;
  if (free > 0) return { kind: 'available', free };
  const anyBooked = SLOT_TIMES.some(t => booked.has(slotId(date, t)));
  return anyBooked ? { kind: 'full' } : { kind: 'unavailable', reason: 'No times left today.' };
}

/** Server-side check that a requested slot is one we actually offer. */
export function isBookable(date: string, time: string, now = new Date()) {
  if (!isValidDate(date) || !SLOT_TIMES.includes(time)) return false;
  const status = dayStatus(date, new Set(), now);
  return status.kind === 'available' && slotState(date, time, new Set(), now) === 'open';
}

/* ---------------------------- calendar invite ---------------------------- */

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\r?\n/g, '\\n');

/** An .ics invite for the call, used for the email attachment and the visitor's download. */
export function buildIcs(b: { date: string; time: string; name: string; email: string; topic: string }) {
  const start = slotStart(b.date, b.time);
  const end = new Date(start.getTime() + CALL_MINUTES * 60_000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mugisha Pacifique//Portfolio Booking//EN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${slotId(b.date, b.time)}@mfique5.vercel.app`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(`Call: ${b.name} × Mugisha Pacifique`)}`,
    `DESCRIPTION:${icsText(`${b.topic || 'Intro call'}\n\nBooked by ${b.name} (${b.email}).`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
