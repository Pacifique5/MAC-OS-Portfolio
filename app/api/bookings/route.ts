import { NextResponse } from 'next/server';
import { buildIcs, isBookable, slotId } from '../../components/booking-config';
import { bookedSlots, claimSlot, releaseSlot, countHit, storeConfigured, NotConfiguredError } from './store';
import { sendBookingEmail, mailConfigured } from './mail';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };
const MAX_BOOKINGS_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: NO_STORE });

/** Online booking needs both storage and email in production. */
const ready = () => process.env.NODE_ENV !== 'production' || (storeConfigured && mailConfigured);

/** GET /api/bookings?month=YYYY-MM -> slot ids already taken that month. */
export async function GET(req: Request) {
  const month = new URL(req.url).searchParams.get('month') ?? '';
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return json({ error: 'Invalid month' }, 400);
  if (!ready()) {
    // Say which service is missing (never the values) so setup problems are easy to spot
    const missing = [!storeConfigured && 'storage (KV_REST_API_URL / KV_REST_API_TOKEN)', !mailConfigured && 'email (RESEND_API_KEY)'].filter(Boolean);
    return json({ configured: false, missing, booked: [] });
  }
  try {
    return json({ configured: true, booked: await bookedSlots(month) });
  } catch (e) {
    console.error('[booking] availability failed', e);
    return json({ error: 'Could not load availability' }, 502);
  }
}

/** POST /api/bookings { date, time, name, email, topic, website } -> books the slot and emails Pacifique. */
export async function POST(req: Request) {
  if (!ready()) return json({ error: 'not-configured' }, 503);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');

  // Honeypot: real visitors never see this field. Pretend it worked so bots move on.
  if (str('website')) return json({ ok: true }, 201);

  const booking = {
    date: str('date'),
    time: str('time'),
    name: str('name').replace(/[\r\n]+/g, ' '),
    email: str('email'),
    topic: str('topic'),
  };

  if (booking.name.length < 2 || booking.name.length > 80) return json({ error: 'Please enter your name.' }, 400);
  if (!EMAIL_RE.test(booking.email) || booking.email.length > 120) return json({ error: 'Please enter a valid email address.' }, 400);
  if (booking.topic.length > 600) return json({ error: 'Please keep the topic under 600 characters.' }, 400);
  if (!isBookable(booking.date, booking.time)) return json({ error: 'That time is no longer available. Please pick another.' }, 400);

  try {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
    if (await countHit(`ratelimit:booking:${ip}`, 3600) > MAX_BOOKINGS_PER_HOUR) {
      return json({ error: 'Too many bookings from your network. Please try again later.' }, 429);
    }

    const id = slotId(booking.date, booking.time);
    const claimed = await claimSlot(id, JSON.stringify({ ...booking, createdAt: new Date().toISOString() }));
    if (!claimed) return json({ error: 'Someone just booked that time. Please pick another.' }, 409);

    try {
      await sendBookingEmail(booking, buildIcs(booking));
    } catch (e) {
      // No email means Pacifique would never know, so don't keep a silent booking.
      await releaseSlot(id).catch(() => {});
      console.error('[booking] email failed', e);
      return json({ error: 'Your booking could not be sent. Please try again or email me directly.' }, 502);
    }

    return json({ ok: true, id }, 201);
  } catch (e) {
    if (e instanceof NotConfiguredError) return json({ error: 'not-configured' }, 503);
    console.error('[booking] failed', e);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
}
