import { z } from 'zod';

/**
 * Contact submission schema — shared between client and /api/contact.
 * `hp` is a honeypot field: bots that fill hidden inputs are rejected.
 * `turnstileToken` is required only when Turnstile is configured server-side.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.email('Please provide a valid email address'),
  company: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().min(1, 'Message is required').max(5000),
  hp: z.string().optional().default(''),
  turnstileToken: z.string().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

/** Shape of the JSON returned by POST /api/contact. */
export interface ContactApiResponse {
  ok: boolean;
  error?: string;
}
