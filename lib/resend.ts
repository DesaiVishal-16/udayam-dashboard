
import { Resend } from 'resend';
import { env } from './env';

export const resend = new Resend(env.RESENT_EMAIL_API_KEY);

