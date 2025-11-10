import { Transporter } from 'nodemailer';
import { createEmailTransporter, getDefaultEmailConfig } from './emailClient';

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface EmailSenderOptions {
  transporter?: Transporter;
  from?: string;
}

const ensureTransporter = (
  options?: EmailSenderOptions,
): { transporter: Transporter; from?: string } => {
  if (options?.transporter) {
    return { transporter: options.transporter, from: options.from };
  }

  const config = getDefaultEmailConfig();
  return {
    transporter: createEmailTransporter(config),
    from: config.from,
  };
};

export const sendEmail = async (
  payload: SendEmailPayload,
  options?: EmailSenderOptions,
): Promise<void> => {
  const { transporter, from } = ensureTransporter(options);

  await transporter.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.body,
  });
};

