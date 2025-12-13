import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Resend } from 'resend';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting
const rateLimit = new Map();
const RATE_LIMIT_DURATION = 3600000; // 1 hour
const MAX_REQUESTS = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_DURATION);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

// Validation functions
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 1000;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

function validateEmail(email) {
  return emailRegex.test(email);
}

function validateMessage(message) {
  return message && message.length >= MESSAGE_MIN_LENGTH && message.length <= MESSAGE_MAX_LENGTH;
}

function validateName(name) {
  return name && name.length >= NAME_MIN_LENGTH && name.length <= NAME_MAX_LENGTH && /^[a-zA-Z\s-']+$/.test(name);
}

// Email template
function getEmailTemplate(name, email, message) {
  const formattedMessage = message.replace(/\n/g, '<br>');
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003a63; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f6f5f2; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #003a63; }
        .message-box { background: white; padding: 15px; border-radius: 6px; margin-top: 8px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #666; }
        .highlight { color: #d9a21c; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Economic Justice Forum</h1>
          <p>New Contact Form Submission</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="field-label">From:</div>
            ${name} (${email})
          </div>
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="message-box">
              ${formattedMessage}
            </div>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent via the EJF contact form.</p>
          <p>Economic Justice Forum &copy; ${new Date().getFullYear()}</p>
          <p><span class="highlight">Equity</span> • <span class="highlight">Justice</span> • <span class="highlight">Prosperity</span></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: RATE_LIMIT_DURATION / 1000
    });
  }

  try {
    const { name, email, message } = req.body;
    const errors = [];

    if (!name || !validateName(name)) {
      errors.push('Please provide a valid name (2-100 characters, letters only)');
    }

    if (!email || !validateEmail(email)) {
      errors.push('Please provide a valid email address');
    }

    if (!message || !validateMessage(message)) {
      errors.push(`Message must be between ${MESSAGE_MIN_LENGTH} and ${MESSAGE_MAX_LENGTH} characters`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const data = await resend.emails.send({
      from: 'economicsjusticeforums@gmail.com',
      to: [
        'mbingu@economicjusticeforum.org',
        'moses@economicjusticeforum.org',
        'egwaarnold@economicjusticeforum.org',
        'amriyajuma@economicjusticeforum.org'
      ],
      reply_to: email,
      subject: `New Contact Form Submission from ${name}`,
      html: getEmailTemplate(name, email, message),
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully',
      data 
    });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ 
      error: 'Error sending message',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
