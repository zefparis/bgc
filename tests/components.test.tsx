import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Business } from '@/components/sections/Business';
import { Approach } from '@/components/sections/Approach';
import { Footer } from '@/components/layout/Footer';
import { SectionHead } from '@/components/shared/SectionHead';

describe('Business section', () => {
  it('renders all six sector groups with company names', () => {
    const { container } = render(<Business />);
    const cards = container.querySelectorAll('.biz-card');
    expect(cards).toHaveLength(6);
    expect(screen.getByText('Aviation & Mobility')).toBeTruthy();
    expect(screen.getByText('Healthcare')).toBeTruthy();
    expect(
      screen.getByText('BGC Data Analytics · BGC AI Center of Excellence'),
    ).toBeTruthy();
  });
});

describe('Approach section', () => {
  it('renders all nine lifecycle steps', () => {
    const { container } = render(<Approach />);
    expect(container.querySelectorAll('.step')).toHaveLength(9);
    expect(screen.getByText('Advisory')).toBeTruthy();
    expect(screen.getByText('Exit & Succession')).toBeTruthy();
  });
});

describe('Footer', () => {
  it('lists all three office locations and contact details', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Johannesburg, South Africa \| Madeira, Portugal \| Shanghai, China/),
    ).toBeTruthy();
    expect(screen.getByText('+27 11 245 5900')).toBeTruthy();
    expect(screen.getByText('info@bgcholding.com')).toBeTruthy();
  });
});

describe('SectionHead', () => {
  it('renders kicker, title and optional description', () => {
    const { container } = render(
      <SectionHead kicker="About" title="Hello" description="World" />,
    );
    expect(screen.getByText('About')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
    expect(container.querySelector('.reveal')).toBeTruthy();
  });

  it('omits the reveal class when reveal=false', () => {
    const { container } = render(
      <SectionHead kicker="K" title="T" reveal={false} />,
    );
    expect(container.querySelector('.reveal')).toBeNull();
  });
});
