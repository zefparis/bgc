'use client';

import { useEffect, useRef, useState } from 'react';
import { navLinks } from '@/content/site';

/**
 * Fixed site navigation — ports the reference site's behaviors:
 *  - `.scrolled` class on scroll > 40px
 *  - burger menu toggle with aria-expanded
 *  - active section highlighting on scroll
 *  - logo image sized to match the "BGC HOLDING" wordmark width
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      let current: string | null = null;
      const pos = window.scrollY + 140;
      navLinks.forEach(({ href }) => {
        const sec = document.querySelector<HTMLElement>(href);
        if (sec && sec.offsetTop <= pos) current = sec.id;
      });
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const size = () => {
      const w = markRef.current?.getBoundingClientRect().width ?? 0;
      if (w > 0 && logoRef.current) logoRef.current.style.width = `${w}px`;
    };
    size();
    window.addEventListener('resize', size);
    document.fonts?.ready.then(size);
    return () => window.removeEventListener('resize', size);
  }, []);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-mark-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo is a small static asset sized to the wordmark */}
          <img
            ref={logoRef}
            className="nav-logo-mark"
            src="/images/bgc-logo.png"
            alt=""
            width={304}
            height={89}
          />
          <div className="nav-mark" ref={markRef}>
            {`BGC HOLDING`}
          </div>
        </div>
        <nav className="nav-links" aria-label="Primary">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={activeId === href.slice(1) ? 'active' : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="#contact">
          Contact us
        </a>
        <button
          className="nav-burger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className={`nav-mobile${menuOpen ? ' open' : ''}`} aria-label="Mobile">
        {navLinks.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <a
          href="#contact"
          className="nav-mobile-cta"
          onClick={() => setMenuOpen(false)}
        >
          Contact us
        </a>
      </nav>
    </header>
  );
}
