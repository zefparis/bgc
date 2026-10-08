'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { site } from '@/content/site';
import { contactSchema } from '@/lib/validation';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Contact modal — ports the reference site's UX:
 *  - opens on any `a[href="#contact"]` click (document-level delegation)
 *  - closes on ✕, backdrop click, Escape; locks body scroll
 *  - focuses first field on open
 *  - POST /api/contact; on failure falls back to mailto: so enquiries
 *    are never lost. Turnstile replaces the legacy math captcha.
 */
export function ContactModal() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const openModal = useCallback(() => {
    setSent(false);
    setError('');
    setToken(null);
    formRef.current?.reset();
    turnstileRef.current?.reset();
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  // Open on any #contact anchor — same delegation as the reference site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href="#contact"]',
      );
      if (!link) return;
      e.preventDefault();
      openModal();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [openModal]);

  // Body scroll lock + initial focus
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      formRef.current
        ?.querySelector<HTMLInputElement>('input[name="name"]')
        ?.focus();
    }, 10);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(t);
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  const mailtoFallback = (data: {
    name: string;
    email: string;
    company: string;
    message: string;
  }) => {
    const body = `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '-'}\n\n${data.message}`;
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
      `Enquiry from ${data.name}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setError('');

    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement)
        .value,
      hp: (form.elements.namedItem('hp') as HTMLInputElement).value,
      turnstileToken: token ?? undefined,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setError('Please complete the required fields.');
      return;
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setError('Please complete the security check.');
      return;
    }

    setSending(true);
    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (resp.ok) {
        setSent(true);
      } else if (resp.status === 503) {
        // Backend not configured yet — mailto fallback keeps the enquiry alive.
        mailtoFallback(parsed.data);
        setSent(true);
      } else {
        const err = (await resp.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(err.error || 'Something went wrong — please try again.');
      }
    } catch {
      mailtoFallback(parsed.data);
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className={`modal-backdrop${open ? ' open' : ''}`}
      onClick={(e) => {
        if (e.target === backdropRef.current) closeModal();
      }}
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactModalTitle"
      >
        <button
          className="modal-close"
          aria-label="Close"
          onClick={closeModal}
        >
          &times;
        </button>
        <div hidden={sent}>
          <h3 id="contactModalTitle">Get in touch</h3>
          <p className="modal-sub">
            Tell us a little about your enquiry and we&apos;ll respond shortly.
          </p>
          <form className="contact-form" ref={formRef} onSubmit={onSubmit} noValidate>
            <label>
              Name
              <input type="text" name="name" required autoComplete="name" />
            </label>
            <label>
              Email
              <input type="email" name="email" required autoComplete="email" />
            </label>
            <label>
              Company
              <input type="text" name="company" autoComplete="organization" />
            </label>
            <label>
              Message
              <textarea name="message" rows={4} required />
            </label>
            <div className="hp-field" aria-hidden="true">
              <label>
                Leave this field blank
                <input type="text" name="hp" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            {TURNSTILE_SITE_KEY ? (
              <div className="captcha-label">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setToken}
                  onExpire={() => setToken(null)}
                  options={{ theme: 'light' }}
                />
              </div>
            ) : null}
            <div
              className={`submit-error${error ? ' show' : ''}`}
              role="alert"
            >
              {error}
            </div>
            <button type="submit" className="modal-submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
        <div className="contact-thanks" hidden={!sent}>
          <h3>Thank you.</h3>
          <p>
            Your message has been received. A member of our team will be in
            touch shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
