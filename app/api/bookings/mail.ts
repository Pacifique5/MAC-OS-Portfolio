// Sends the "new call booked" email through Resend's HTTP API (no SDK needed).
// Without RESEND_API_KEY, local development prints the email to the server console instead.
//
// The HTML uses tables and inline styles on purpose: Gmail and Outlook ignore most modern CSS.

import { CALL_MINUTES, TZ_LABEL, slotId, slotStart } from '../../components/booking-config';

const KEY = process.env.RESEND_API_KEY;
// Lowercase: Resend's testing mode matches the account address exactly, case included.
const TO = (process.env.BOOKING_EMAIL_TO ?? 'pacifiquem58@gmail.com').trim().toLowerCase();
// onboarding@resend.dev works without a domain, but only delivers to the Resend account's own email.
const FROM = process.env.BOOKING_EMAIL_FROM ?? 'Portfolio Bookings <onboarding@resend.dev>';
const SITE = 'https://mfique5.vercel.app';

export const mailConfigured = Boolean(KEY);

export interface Booking { date: string; time: string; name: string; email: string; topic: string }

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const kigali = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleString('en-GB', { ...opts, timeZone: 'Africa/Kigali' });
const gcalDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function details(b: Booking) {
  const start = slotStart(b.date, b.time);
  const end = new Date(start.getTime() + CALL_MINUTES * 60_000);
  const firstName = b.name.split(/\s+/)[0];
  const day = kigali(start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const endTime = kigali(end, { hour: '2-digit', minute: '2-digit', hour12: false });
  const daysAway = Math.round((start.getTime() - Date.now()) / 86_400_000);
  const when = daysAway <= 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `In ${daysAway} days`;

  const reply = `mailto:${b.email}?subject=${encodeURIComponent(`Our call on ${day} at ${b.time}`)}&body=${encodeURIComponent(
    `Hi ${firstName},\n\nThanks for booking a call. Here is the meeting link:\n\n\n\nTalk soon,\nPacifique`,
  )}`;
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Call with ${b.name}`)}&dates=${gcalDate(start)}/${gcalDate(end)}&details=${encodeURIComponent(`${b.topic || 'Intro call'}\n\nBooked through ${SITE}`)}&add=${encodeURIComponent(b.email)}`;

  return {
    start, firstName, day, when, reply, gcal,
    weekdayShort: kigali(start, { weekday: 'short' }).toUpperCase(),
    dayNumber: kigali(start, { day: 'numeric' }),
    range: `${b.time} – ${endTime}`,
  };
}

function html(b: Booking) {
  const d = details(b);
  const font = `-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-top:1px solid #ececf0;width:88px;vertical-align:top;font-size:13px;color:#86868b">${label}</td>
      <td style="padding:12px 0;border-top:1px solid #ececf0;font-size:15px;color:#1d1d1f">${value}</td>
    </tr>`;
  const button = (href: string, label: string, primary: boolean) => `
    <td style="padding:0 6px 8px 0">
      <a href="${esc(href)}" style="display:inline-block;padding:11px 20px;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;${
        primary ? 'background:#0a7aff;color:#ffffff' : 'background:#f2f2f7;color:#0a7aff'}">${label}</a>
    </td>`;

  return `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>New call booked</title></head>
<body style="margin:0;padding:0;background:#f5f5f7">
  <div style="display:none;max-height:0;overflow:hidden">${esc(`${b.name} · ${d.day}, ${d.range}`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;font-family:${font}">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">

        <!-- Brand -->
        <tr><td style="padding:0 4px 14px;font-size:13px;color:#86868b">
          <b style="color:#1d1d1f">Mugisha Pacifique</b> &nbsp;·&nbsp; Portfolio bookings
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:20px;padding:28px 28px 22px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">

          <!-- Calendar badge + heading -->
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:top;padding-right:16px">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:64px;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px #e5e5ea">
                <tr><td align="center" style="background:#ff3b30;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:4px 0">${d.weekdayShort}</td></tr>
                <tr><td align="center" style="background:#ffffff;color:#1d1d1f;font-size:30px;font-weight:300;line-height:1;padding:8px 0 10px">${d.dayNumber}</td></tr>
              </table>
            </td>
            <td style="vertical-align:middle">
              <div style="display:inline-block;padding:3px 10px;border-radius:999px;background:#e8f8ee;color:#1f9d55;font-size:12px;font-weight:600">● New booking · ${d.when}</div>
              <div style="font-size:24px;line-height:1.25;font-weight:700;color:#1d1d1f;margin-top:8px">${esc(b.name)} booked a call</div>
            </td>
          </tr></table>

          <!-- When -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;background:#f5f8ff;border-radius:14px">
            <tr><td style="padding:16px 18px">
              <div style="font-size:13px;color:#0a7aff;font-weight:600">${esc(d.day)}</div>
              <div style="font-size:28px;font-weight:700;color:#1d1d1f;letter-spacing:-0.5px;margin-top:2px">${d.range}</div>
              <div style="font-size:13px;color:#6e6e73;margin-top:2px">${CALL_MINUTES}-minute video call · ${TZ_LABEL}</div>
            </td></tr>
          </table>

          <!-- Details -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px">
            ${row('Name', esc(b.name))}
            ${row('Email', `<a href="mailto:${esc(b.email)}" style="color:#0a7aff;text-decoration:none">${esc(b.email)}</a>`)}
            ${row('Topic', b.topic
              ? `<div style="padding:10px 14px;border-left:3px solid #0a7aff;background:#fafafc;border-radius:0 10px 10px 0;white-space:pre-wrap;line-height:1.5">${esc(b.topic)}</div>`
              : '<span style="color:#86868b">No topic given</span>')}
          </table>

          <!-- Actions -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
            ${button(d.reply, `Reply to ${esc(d.firstName)}`, true)}
            ${button(d.gcal, 'Add to Google Calendar', false)}
          </tr></table>
          <div style="font-size:12px;color:#86868b;margin-top:6px;line-height:1.5">
            Reply to send ${esc(d.firstName)} the meeting link. The invite is also attached as <b>call.ics</b>.
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:16px 4px 0;font-size:12px;line-height:1.6;color:#86868b">
          Booked through <a href="${SITE}" style="color:#86868b">${SITE.replace('https://', '')}</a>.
          To cancel, delete <code style="font-size:11px">${slotId(b.date, b.time)}</code> from <code style="font-size:11px">bookings:${b.date.slice(0, 7)}</code> in Upstash, then let ${esc(d.firstName)} know.
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function text(b: Booking) {
  const d = details(b);
  return [
    `${b.name} booked a ${CALL_MINUTES}-minute call with you (${d.when.toLowerCase()}).`,
    '',
    `When:  ${d.day}, ${d.range} (${TZ_LABEL})`,
    `Name:  ${b.name}`,
    `Email: ${b.email}`,
    `Topic: ${b.topic || '(not given)'}`,
    '',
    'Reply to this email to send them the meeting link. The attached invite adds it to your calendar.',
  ].join('\n');
}

export async function sendBookingEmail(b: Booking, ics: string) {
  const d = details(b);
  const subject = `📅 ${b.name} · ${d.day}, ${d.range}`;

  if (!KEY) {
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY is not set');
    console.info(`\n[booking] Email not sent (no RESEND_API_KEY). It would go to ${TO}:\n${subject}\n${text(b)}\n`);
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
      text: text(b),
      html: html(b),
      attachments: [{ filename: 'call.ics', content: Buffer.from(ics).toString('base64') }],
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

