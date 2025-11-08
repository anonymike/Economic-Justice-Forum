import { Resend } from 'resend';

// Initialize rate limiting map
const rateLimit = new Map();
const RATE_LIMIT_DURATION = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS = 5; // Maximum 5 requests per hour per IP

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Message validation constants
const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 1000;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

const resend = new Resend(process.env.RESEND_API_KEY);

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  
  // Clean up old requests
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_DURATION);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

function validateEmail(email) {
  return emailRegex.test(email);
}

function validateMessage(message) {
  return message && 
    message.length >= MESSAGE_MIN_LENGTH && 
    message.length <= MESSAGE_MAX_LENGTH;
}

function validateName(name) {
  return name && 
    name.length >= NAME_MIN_LENGTH && 
    name.length <= NAME_MAX_LENGTH &&
    /^[a-zA-Z\s-']+$/.test(name); // Only letters, spaces, hyphens, and apostrophes
}

// Branded email template
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
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #003a63;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f6f5f2;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .field {
          margin-bottom: 20px;
        }
        .field-label {
          font-weight: bold;
          color: #003a63;
        }
        .message-box {
          background: white;
          padding: 15px;
          border-radius: 6px;
          margin-top: 8px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 0.9em;
          color: #666;
        }
        .highlight {
          color: #d9a21c;
        }
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: RATE_LIMIT_DURATION / 1000 // seconds
    });
  }

  try {
    const { name, email, message } = req.body;

    // Enhanced validation
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

    // Send email using Resend with branded template
    const data = await resend.emails.send({
      from: 'EJF Contact Form <contact@economicjustice.org>', // Update with your verified domain
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
}