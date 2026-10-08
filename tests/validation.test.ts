import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/validation';

const valid = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme',
  message: 'Hello',
  hp: '',
};

describe('contactSchema', () => {
  it('accepts a valid submission', () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rejects missing name', () => {
    expect(contactSchema.safeParse({ ...valid, name: '' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: '  ' }).success).toBe(
      false,
    );
  });

  it('rejects invalid email', () => {
    expect(
      contactSchema.safeParse({ ...valid, email: 'not-an-email' }).success,
    ).toBe(false);
  });

  it('rejects missing message', () => {
    expect(contactSchema.safeParse({ ...valid, message: '' }).success).toBe(
      false,
    );
  });

  it('caps message length', () => {
    expect(
      contactSchema.safeParse({ ...valid, message: 'x'.repeat(5001) }).success,
    ).toBe(false);
  });

  it('defaults company and honeypot when absent', () => {
    const r = contactSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hi',
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.company).toBe('');
      expect(r.data.hp).toBe('');
    }
  });
});
