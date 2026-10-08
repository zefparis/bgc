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
  // 'sent' = server confirmed delivery; 'mailto' = email client opened as a
  // fallback — the message has NOT been delivered server-side and the UI must
  // not claim otherwise.
  const [result, setResult] = useState<'idle' | 'sent' | 'mailto'>('idle');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openModal = useCallback(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setResult('idle');
    setError('');
    setToken(null);
    formRef.current?.reset();
    turnstileRef.current?.reset();
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    // Restore focus to the element that opened the modal.
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, []);

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

  // Escape to close + minimal focus trap (Tab cycles within the card)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key !== 'Tab' || !cardRef.current) return;
      const focusables = cardRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
        setResult('sent');
      } else if (resp.status === 503) {
        // Backend not configured — hand the message to the user's email
        // client instead of pretending it was delivered.
        mailtoFallback(parsed.data);
        setResult('mailto');
      } else {
        const err = (await resp.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(err.error || 'Something went wrong — please try again.');
      }
    } catch {
      mailtoFallback(parsed.data);
      setResult('mailto');
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
        ref={cardRef}
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
        <div hidden={result !== 'idle'}>
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
        {result === 'sent' && (
          <div className="contact-thanks">
            <h3>Thank you.</h3>
            <p>
              Your message has been received. A member of our team will be in
              touch shortly.
            </p>
          </div>
        )}
        {result === 'mailto' && (
          <div className="contact-thanks">
            <h3>Almost done.</h3>
            <p>
              Our online form isn&apos;t available right now, so we&apos;ve
              opened your email client with your message pre-filled — please
              press send there to reach us at {site.contact.email}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
