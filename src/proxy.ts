import { NextRequest, NextResponse } from 'next/server';

/**
 * Content Security Policy with per-request nonce (Next.js 16 "proxy" file
 * convention — formerly middleware.ts).
 * Next.js reads the nonce from this header and applies it to the inline
 * framework/bootstrap scripts it generates, so 'strict-dynamic' covers them.
 * In development, React refresh + dev overlays require 'unsafe-eval'.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    "default-src 'self'",
    // Next.js applies the nonce to its own inline scripts; 'strict-dynamic'
    // lets nonce-verified scripts load additional chunks. Turnstile iframe
    // script is loaded from challenges.cloudflare.com.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''} https://challenges.cloudflare.com`,
    // style-src needs 'unsafe-inline' for React inline style attributes and
    // nonced server-rendered styles; CSS injection risk is low and accepted.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    // Turnstile widget iframe
    'frame-src https://challenges.cloudflare.com',
    // Turnstile verification + API calls from the page are same-origin;
    // Turnstile's own network calls happen inside its iframe.
    "connect-src 'self' https://challenges.cloudflare.com",
    'upgrade-insecure-requests',
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
}

export const config = {
  matcher: [
    // Apply CSP everywhere except pure static assets and Next internals.
    {
      source: '/((?!_next/static|_next/image|favicon.ico|images/).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
