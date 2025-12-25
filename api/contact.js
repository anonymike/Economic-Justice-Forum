// Vercel Serverless Function: /api/contact
// Uses Resend to send contact form submissions.

import { Resend } from '@resend/node';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      return res.status(400).json({ error: 'Invalid content type. Use application/json.' });
    }

    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, message.' });
    }

    // Basic sanitization
    const esc = (str) => String(str).replace(/[<>]/g, (m) => (m === '<' ? '&lt;' : '&gt;'));

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#222">
        <h2 style="margin:0 0 8px 0;">New Contact Form Submission</h2>
        <p style="margin:0 0 12px 0;">You received a new message from the website contact form.</p>
        <table cellpadding="6" style="border-collapse:collapse;background:#f7f7f7;border-radius:8px;">
          <tr><td><strong>Name:</strong></td><td>${esc(name)}</td></tr>
          <tr><td><strong>Email:</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        </table>
        <div style="margin-top:12px;padding:12px;border-left:4px solid #d9a21c;background:#fff;">
          <div style="font-weight:bold;margin-bottom:6px;">Message:</div>
          <div>${esc(message).replace(/\n/g,'<br/>')}</div>
        </div>
      </div>
    `;

    // Configure sender and recipient
    const from = 'Economic Justice Forum <no-reply@economicjusticeforum.org>'; // must be a verified sender/domain in Resend
    const to = ['economicsjusticeforums@gmail.com']; // primary inbox

    const subject = 'New contact form submission';

    const sendResult = await resend.emails.send({
      from,
      to,
      subject,
      reply_to: email,
      html,
    });

    if (sendResult?.error) {
      return res.status(500).json({ error: sendResult.error?.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
