// Sends the "new call booked" email through Resend's HTTP API (no SDK needed).
// Without RESEND_API_KEY, local development prints the email to the server console instead.

import { CALL_MINUTES, TZ_LABEL, slotStart } from '../../components/booking-config';

const KEY = process.env.RESEND_API_KEY;
// Lowercase: Resend's testing mode matches the account address exactly, case included.
const TO = (process.env.BOOKING_EMAIL_TO ?? 'pacifiquem58@gmail.com').trim().toLowerCase();
// onboarding@resend.dev works without a domain, but only delivers to the Resend account's own email.
const FROM = process.env.BOOKING_EMAIL_FROM ?? 'Portfolio Bookings <onboarding@resend.dev>';

export const mailConfigured = Boolean(KEY);

export interface Booking { date: string; time: string; name: string; email: string; topic: string }

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function describeSlot(b: Booking) {
  const start = slotStart(b.date, b.time);
  const day = start.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Kigali' });
  return `${day}, ${b.time} (${TZ_LABEL})`;
}

export async function sendBookingEmail(b: Booking, ics: string) {
  const when = describeSlot(b);
  const subject = `New call booked: ${b.name} on ${when}`;
  const text = [
    `${b.name} booked a ${CALL_MINUTES}-minute call with you.`,
    '',
    `When:  ${when}`,
    `Name:  ${b.name}`,
    `Email: ${b.email}`,
    `Topic: ${b.topic || '(not given)'}`,
    '',
    'Reply to this email to send them the meeting link. The attached invite adds it to your calendar.',
  ].join('\n');
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;color:#1d1d1f;max-width:520px">
      <h2 style="margin:0 0 4px">New call booked</h2>
      <p style="margin:0 0 16px;color:#6e6e73">${CALL_MINUTES}-minute call from your portfolio</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 16px 4px 0;color:#6e6e73">When</td><td style="padding:4px 0"><b>${esc(when)}</b></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6e6e73">Name</td><td style="padding:4px 0">${esc(b.name)}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6e6e73">Email</td><td style="padding:4px 0"><a href="mailto:${esc(b.email)}">${esc(b.email)}</a></td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6e6e73;vertical-align:top">Topic</td><td style="padding:4px 0;white-space:pre-wrap">${esc(b.topic || '(not given)')}</td></tr>
      </table>
      <p style="margin:16px 0 0;color:#6e6e73">Reply to this email to send them the meeting link. The attached invite adds the call to your calendar.</p>
    </div>`;

  if (!KEY) {
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY is not set');
    console.info(`\n[booking] Email not sent (no RESEND_API_KEY). It would go to ${TO}:\n${subject}\n${text}\n`);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: b.email,
      subject,
      text,
      html,
      attachments: [{ filename: 'call.ics', content: Buffer.from(ics).toString('base64') }],
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
