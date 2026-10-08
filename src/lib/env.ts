import { z } from 'zod';

/**
 * Centralised environment validation.
 *
 * Secrets are server-only. Features degrade safely when unset:
 *  - RESEND_API_KEY / CONTACT_* absent → POST /api/contact returns 503 and the
 *    client falls back to mailto: (contact is never silently dropped).
 *  - TURNSTILE_SECRET_KEY absent → verification treated as unconfigured (503),
 *    never silently bypassed.
 *  - NEXT_PUBLIC_TURNSTILE_SITE_KEY absent → widget is not rendered.
 *
 * All values validated lazily via the helpers below so `next build` never
 * fails on missing optional configuration.
 */

const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_FROM_EMAIL: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('https://bgcholding.com'),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
});

function parseOrWarn<T>(schema: z.ZodType<T>, raw: unknown, scope: string): T | null {
  const result = schema.safeParse(raw);
  if (!result.success) {
    console.warn(`[env] invalid ${scope} configuration:`, z.treeifyError(result.error));
    return null;
  }
  return result.data;
}

const server = parseOrWarn(serverSchema, {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
}, 'server');

const client = parseOrWarn(clientSchema, {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
}, 'client');

export const env = {
  siteUrl: client?.NEXT_PUBLIC_SITE_URL ?? 'https://bgcholding.com',
  turnstileSiteKey: client?.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  resendApiKey: server?.RESEND_API_KEY,
  contactFrom: server?.CONTACT_FROM_EMAIL,
  contactTo: server?.CONTACT_TO_EMAIL,
  turnstileSecretKey: server?.TURNSTILE_SECRET_KEY,
};

export const isEmailConfigured = Boolean(
  env.resendApiKey && env.contactFrom && env.contactTo,
);

export const isTurnstileConfigured = Boolean(env.turnstileSecretKey);
export const isTurnstileClientConfigured = Boolean(env.turnstileSiteKey);
