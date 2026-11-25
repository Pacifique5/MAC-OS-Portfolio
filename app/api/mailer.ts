// Shared email sender for the API routes, using Resend's HTTP API (no SDK needed).
// Without RESEND_API_KEY, local development prints emails to the server console instead.

const KEY = process.env.RESEND_API_KEY;
// Lowercase: Resend's testing mode matches the account address exactly, case included.
const TO = (process.env.BOOKING_EMAIL_TO ?? 'pacifiquem58@gmail.com').trim().toLowerCase();
// onboarding@resend.dev works without a domain, but only delivers to the Resend account's own email.
const FROM = process.env.BOOKING_EMAIL_FROM ?? 'Portfolio <onboarding@resend.dev>';

export const SITE = 'https://mfique5.vercel.app';
export const mailConfigured = Boolean(KEY);

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

/** Font stack for email HTML (Gmail and Outlook ignore web fonts). */
export const EMAIL_FONT = `-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

interface Email {
  subject: string;
  html: string;
  text: string;
  replyTo: string;
  attachments?: { filename: string; content: string }[];
}

/** Sends an email to Pacifique. Throws when Resend refuses it. */
export async function sendToOwner(email: Email) {
  if (!KEY) {
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY is not set');
    console.info(`\n[mail] Not sent (no RESEND_API_KEY). It would go to ${TO}:\n${email.subject}\n${email.text}\n`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
      attachments: email.attachments,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
