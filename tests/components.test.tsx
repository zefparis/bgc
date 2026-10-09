import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Business } from '@/components/sections/Business';
import { Approach } from '@/components/sections/Approach';
import { About } from '@/components/sections/About';
import { Network } from '@/components/sections/Network';
import { Hero } from '@/components/sections/Hero';
import { Execution } from '@/components/sections/Execution';
import { Footer } from '@/components/layout/Footer';
import { SectionHead } from '@/components/shared/SectionHead';
import { operatingCompanies } from '@/content/companies';

describe('Business section', () => {
  it('renders all six sector groups', () => {
    const { container } = render(<Business />);
    const cards = container.querySelectorAll('.biz-sector');
    expect(cards).toHaveLength(6);
    expect(screen.getByText('Aviation & Mobility')).toBeTruthy();
    expect(screen.getByText('Healthcare')).toBeTruthy();
  });

  it('renders all 11 operating-company profiles with mandates and capabilities', () => {
    const { container } = render(<Business />);
    expect(container.querySelectorAll('.biz-company')).toHaveLength(11);
    for (const c of operatingCompanies) {
      // getAllByText: some strings recur (e.g. 'Distribution' is a capability
      // of two companies; 'Security & Defence' is both a group and a label).
      expect(
        screen.getAllByText(c.name).length,
        `company name: ${c.name}`,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(c.sectorLabel).length,
        `sector label: ${c.sectorLabel}`,
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(c.description).length,
        `description: ${c.slug}`,
      ).toBeGreaterThan(0);
      for (const cap of c.capabilities) {
        expect(
          screen.getAllByText(cap).length,
          `capability "${cap}" of ${c.slug}`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('states the holding/subsidiary relationship and legal-entity footnote', () => {
    render(<Business />);
    expect(
      screen.getByText(
        'One holding company. Eleven sector-focused operating companies.',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText(/legal entity structure is available on request/),
    ).toBeTruthy();
  });
});

describe('About section', () => {
  it('renders the complete governance introduction and all five principles', () => {
    render(<About />);
    expect(
      screen.getByText(/bankable and legally executable/),
    ).toBeTruthy();
    for (const t of [
      'Capital',
      'Mandates',
      'Compliance',
      'Partnership model',
      'Risk',
    ]) {
      expect(screen.getByText(t)).toBeTruthy();
    }
  });

  it('renders the group-structure pillars', () => {
    render(<About />);
    expect(screen.getByText('Holding')).toBeTruthy();
    expect(screen.getByText('Operating companies')).toBeTruthy();
    expect(
      screen.getByText(
        'Sector-focused delivery vehicles with their own mandates',
      ),
    ).toBeTruthy();
  });
});

describe('Network section', () => {
  it('renders all four regions including GCC with official descriptions', () => {
    const { container } = render(<Network />);
    expect(container.querySelectorAll('.region-card')).toHaveLength(4);
    expect(
      screen.getByText('Origination, trade flows and capital partners.'),
    ).toBeTruthy();
    expect(
      screen.getByText(/active across Southern, Central, East and West Africa/),
    ).toBeTruthy();
    expect(
      screen.getByText(/Shanghai office covering China and wider Asia/),
    ).toBeTruthy();
  });

  it('does not present a GCC office', () => {
    render(<Network />);
    expect(screen.queryByText(/GCC office/i)).toBeNull();
  });
});

describe('Hero', () => {
  it('uses the corporate-profile cover headline and descriptor', () => {
    render(<Hero />);
    expect(
      screen.getByRole('heading', { level: 1 }).textContent,
    ).toBe('Eleven operating companies. One execution platform.');
    expect(
      screen.getByText(/linking African markets with capital, technology and partners worldwide/),
    ).toBeTruthy();
  });
});

describe('Execution section', () => {
  it('renders the profile quote and no competing five-step flow', () => {
    const { container } = render(<Execution />);
    expect(
      screen.getByText(/properly executed/),
    ).toBeTruthy();
    expect(container.querySelector('.exec-flow')).toBeNull();
    expect(screen.queryByText('No two projects are the same.')).toBeNull();
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

  it('renders the institutional disclaimer', () => {
    render(<Footer />);
    expect(
      screen.getByText(/do not constitute an offer/),
    ).toBeTruthy();
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
