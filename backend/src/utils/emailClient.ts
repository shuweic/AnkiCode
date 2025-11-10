import nodemailer, { Transporter } from 'nodemailer';

export interface EmailClientConfig {
  host: string;
  port: number;
  user?: string;
  pass?: string;
  from: string;
  secure?: boolean;
}

let cachedTransporter: Transporter | null = null;

export const createEmailTransporter = (config: EmailClientConfig): Transporter => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure ?? config.port === 465,
    auth: config.user
      ? {
          user: config.user,
          pass: config.pass,
        }
      : undefined,
  });

  return cachedTransporter;
};

export const getDefaultEmailConfig = (): EmailClientConfig => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, SMTP_SECURE } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !EMAIL_FROM) {
    throw new Error('Missing email configuration. Please set SMTP_HOST, SMTP_PORT, and EMAIL_FROM.');
  }

  const port = Number.parseInt(SMTP_PORT, 10);
  if (Number.isNaN(port)) {
    throw new Error('Invalid SMTP_PORT value. It must be a number.');
  }

  return {
    host: SMTP_HOST,
    port,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: EMAIL_FROM,
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : undefined,
  };
};

