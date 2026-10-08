import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { env, isEmailConfigured, isTurnstileConfigured } from '@/lib/env';
import { contactSchema, type ContactApiResponse } from '@/lib/validation';

export const runtime = 'nodejs';

/**
 * Sliding-window per-IP rate limiter.
 *
 * Limits: 5 submissions per IP per 10 minutes. Defense-in-depth — Turnstile
 * remains the primary bot control. Caveat: this map lives in the function
 * instance's memory, so on serverless platforms (Vercel) it is per-warm-
 * instance and resets on cold start. That makes it a best-effort throttle,
 * not a global guarantee. If abuse becomes a real concern, move to
 * Vercel WAF rate-limit rules or Upstash Ratelimit (no infra added yet —
 * see SECURITY_REVIEW.md).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX_PER_WINDOW) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

function json(body: ContactApiResponse, status: number) {
  return NextResponse.json(body, { status });
}

/**
 * Verify a Cloudflare Turnstile token against the siteverify endpoint.
 * Only called when TURNSTILE_SECRET_KEY is configured.
 */
async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const form = new URLSearchParams();
  form.set('secret', env.turnstileSecretKey!);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest) {
  // Honeypot and field validation first — cheap rejection before any
  // external calls.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid request body.' }, 400);
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json({ ok: false, error: 'Please check the form fields and try again.' }, 400);
  }

  const data = parsed.data;

  // Honeypot filled → bot. Respond OK to avoid tipping off the sender.
  if (data.hp && data.hp.length > 0) {
    return json({ ok: true }, 200);
  }

  // Rate limit — per IP, evaluated before any external calls.
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  if (rateLimited(clientIp)) {
    return json(
      { ok: false, error: 'Too many requests — please try again later.' },
      429,
    );
  }

  // Turnstile verification — required when configured. When the secret is
  // absent the endpoint reports unconfigured (503) instead of silently
  // skipping bot protection.
  if (isTurnstileConfigured) {
    if (!data.turnstileToken) {
      return json({ ok: false, error: 'Security check failed — please try again.' }, 400);
    }
    const valid = await verifyTurnstile(
      data.turnstileToken,
      clientIp === 'unknown' ? null : clientIp,
    );
    if (!valid) {
      return json({ ok: false, error: 'Security check failed — please try again.' }, 403);
    }
  }

  // Email delivery — gated until RESEND_API_KEY + CONTACT_* are configured.
  // Until then: 503, and the client falls back to mailto:.
  if (!isEmailConfigured) {
    return json({ ok: false, error: 'Contact service is not configured.' }, 503);
  }

  const resend = new Resend(env.resendApiKey);
  const { error } = await resend.emails.send({
    from: env.contactFrom!,
    to: env.contactTo!,
    replyTo: data.email,
    subject: `Website enquiry from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '-'}\n\n${data.message}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(data.company || '-')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    console.error('[contact] email send failed:', error);
    return json({ ok: false, error: 'Something went wrong — please try again.' }, 502);
  }

  return json({ ok: true }, 200);
}
