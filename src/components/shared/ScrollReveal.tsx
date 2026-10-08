'use client';

import { useEffect } from 'react';

/**
 * Page-level scroll-reveal behavior — direct port of the reference site's
 * IntersectionObserver logic. Observes every `.reveal` element and adds
 * `.in-view` once it enters the viewport. No DOM structure changes.
 */
export function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
