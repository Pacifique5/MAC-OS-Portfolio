import { NextResponse } from 'next/server';
import { RELATIONSHIPS, TEXT_MAX, TEXT_MIN, Relationship, Testimonial } from '../../components/testimonials-data';
import { SITE, EMAIL_FONT, esc, mailConfigured, sendToOwner } from '../mailer';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
const LINKEDIN_RE = /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[A-Za-z0-9_%-]+\/?$/;

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/** The entry Pacifique pastes into testimonials-data.ts to publish it. */
function snippet(t: Testimonial) {
  const lines = [
    '  {',
    `    name: ${JSON.stringify(t.name)},`,
    `    role: ${JSON.stringify(t.role)},`,
    `    organisation: ${JSON.stringify(t.organisation)},`,
    `    relationship: ${JSON.stringify(t.relationship)},`,
    `    date: ${JSON.stringify(t.date)},`,
    `    text: ${JSON.stringify(t.text)},`,
    ...(t.linkedin ? [`    linkedin: ${JSON.stringify(t.linkedin)},`] : []),
    '  },',
  ];
  return lines.join('\n');
}

function html(t: Testimonial, email: string) {
  const first = t.name.split(/\s+/)[0];
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:11px 0;border-top:1px solid #ececf0;width:110px;vertical-align:top;font-size:13px;color:#86868b">${label}</td>
      <td style="padding:11px 0;border-top:1px solid #ececf0;font-size:15px;color:#1d1d1f">${value}</td>
    </tr>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>New recommendation</title></head>
<body style="margin:0;padding:0;background:#f5f5f7">
  <div style="display:none;max-height:0;overflow:hidden">${esc(t.text.slice(0, 120))}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;font-family:${EMAIL_FONT}">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
        <tr><td style="padding:0 4px 14px;font-size:13px;color:#86868b"><b style="color:#1d1d1f">Mugisha Pacifique</b> &nbsp;·&nbsp; Portfolio recommendations</td></tr>
        <tr><td style="background:#ffffff;border-radius:20px;padding:28px 28px 24px;box-shadow:0 1px 3px rgba(0,0,0,0.06)">
          <div style="display:inline-block;padding:3px 10px;border-radius:999px;background:#fff4e5;color:#b25e00;font-size:12px;font-weight:600">● Waiting for your approval</div>
          <div style="font-size:24px;line-height:1.25;font-weight:700;color:#1d1d1f;margin-top:10px">${esc(t.name)} wrote you a recommendation</div>
          <div style="font-size:14px;color:#6e6e73;margin-top:4px">${esc(t.role)} · ${esc(t.organisation)}</div>

          <!-- The quote, as a message bubble -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px">
            <tr><td style="background:#e9e9eb;border-radius:20px 20px 20px 6px;padding:16px 18px;font-size:16px;line-height:1.55;color:#1d1d1f;white-space:pre-wrap">“${esc(t.text)}”</td></tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px">
            ${row('Relationship', esc(t.relationship))}
            ${row('Email', `<a href="mailto:${esc(email)}" style="color:#0a7aff;text-decoration:none">${esc(email)}</a> <span style="color:#86868b;font-size:12px">(not published)</span>`)}
            ${row('LinkedIn', t.linkedin ? `<a href="${esc(t.linkedin)}" style="color:#0a7aff;text-decoration:none">${esc(t.linkedin.replace('https://', ''))}</a>` : '<span style="color:#86868b">Not given</span>')}
            ${row('Consent', 'Agreed to publish name, role and organisation')}
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
            <td style="padding:0 6px 8px 0"><a href="mailto:${esc(email)}?subject=${encodeURIComponent('Thank you for the recommendation')}&body=${encodeURIComponent(`Hi ${first},\n\nThank you so much for the recommendation. It means a lot.\n\nPacifique`)}" style="display:inline-block;padding:11px 20px;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;background:#0a7aff;color:#ffffff">Thank ${esc(first)}</a></td>
          </tr></table>

          <!-- How to publish -->
          <div style="margin-top:18px;padding-top:16px;border-top:1px solid #ececf0">
            <div style="font-size:14px;font-weight:600;color:#1d1d1f">To publish it</div>
            <div style="font-size:13px;color:#6e6e73;margin-top:4px;line-height:1.5">Check it really came from ${esc(first)}, then paste this at the top of <code>TESTIMONIALS</code> in <code>app/components/testimonials-data.ts</code> and push. Ignore this email to leave it unpublished.</div>
            <pre style="margin:10px 0 0;padding:14px;border-radius:12px;background:#1d1d1f;color:#f5f5f7;font-size:12px;line-height:1.5;white-space:pre-wrap;word-break:break-word;font-family:SFMono-Regular,Menlo,Consolas,monospace">${esc(snippet(t))}</pre>
          </div>
        </td></tr>
        <tr><td style="padding:16px 4px 0;font-size:12px;line-height:1.6;color:#86868b">Sent from the Testimonials app on <a href="${SITE}" style="color:#86868b">${SITE.replace('https://', '')}</a>.</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** POST /api/recommendations -> emails Pacifique a recommendation to review. Nothing is published automatically. */
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production' && !mailConfigured) return json({ error: 'not-configured' }, 503);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const str = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');
  const line = (k: string) => str(k).replace(/[\r\n]+/g, ' ');

  // Honeypot: real visitors never see this field. Pretend it worked so bots move on.
  if (str('website')) return json({ ok: true }, 201);

  const relationship = str('relationship') as Relationship;
  const email = str('email');
  const linkedin = str('linkedin');
  const t: Testimonial = {
    name: line('name'),
    role: line('role'),
    organisation: line('organisation'),
    relationship,
    date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'Africa/Kigali' }),
    text: str('text').replace(/\n{3,}/g, '\n\n'),
    ...(linkedin ? { linkedin } : {}),
  };

  if (t.name.length < 2 || t.name.length > 80) return json({ error: 'Please enter your full name.' }, 400);
  if (t.role.length < 2 || t.role.length > 80) return json({ error: 'Please enter your role or title.' }, 400);
  if (t.organisation.length < 2 || t.organisation.length > 100) return json({ error: 'Please enter your school or company.' }, 400);
  if (!RELATIONSHIPS.includes(relationship)) return json({ error: 'Please choose how you know Pacifique.' }, 400);
  if (!EMAIL_RE.test(email) || email.length > 120) return json({ error: 'Please enter a valid email address.' }, 400);
  if (linkedin && !LINKEDIN_RE.test(linkedin)) return json({ error: 'Please enter a LinkedIn profile link like https://www.linkedin.com/in/your-name' }, 400);
  if (t.text.length < TEXT_MIN || t.text.length > TEXT_MAX) return json({ error: `Please write between ${TEXT_MIN} and ${TEXT_MAX} characters.` }, 400);
  if (body.consent !== true) return json({ error: 'Please agree to your recommendation being published.' }, 400);

  try {
    await sendToOwner({
      subject: `💬 Recommendation from ${t.name} (${t.role}, ${t.organisation})`,
      replyTo: email,
      html: html(t, email),
      text: [
        `${t.name} (${t.role}, ${t.organisation}) wrote you a recommendation. Relationship: ${t.relationship}.`,
        '', `"${t.text}"`, '',
        `Email: ${email}${t.linkedin ? `\nLinkedIn: ${t.linkedin}` : ''}`, '',
        'To publish it, paste this into TESTIMONIALS in app/components/testimonials-data.ts:', '', snippet(t),
      ].join('\n'),
    });
    return json({ ok: true }, 201);
  } catch (e) {
    console.error('[recommendation] email failed', e);
    return json({ error: 'Your recommendation could not be sent. Please try again.' }, 502);
  }
}
