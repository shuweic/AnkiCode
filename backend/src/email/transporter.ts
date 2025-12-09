import nodemailer from 'nodemailer';

export function createTransporter() {
  // Read environment variables at function call time (after dotenv.config() has been called)
  const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
  const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS must be set in environment variables');
  }

  // Use SMTP_SECURE if explicitly set, otherwise default to port 465 check
  const smtpSecureEnv = process.env.SMTP_SECURE;
  const secure = smtpSecureEnv !== undefined 
    ? (smtpSecureEnv === 'true' || smtpSecureEnv === 'True') 
    : SMTP_PORT === 465;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: secure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export function getEmailFrom(): string {
  const SMTP_USER = process.env.SMTP_USER;
  return process.env.EMAIL_FROM || SMTP_USER || '';
}

