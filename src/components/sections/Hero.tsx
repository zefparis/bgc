import Image from 'next/image';
import { heroStats, site } from '@/content/site';

export function Hero() {
  // Split the approved headline into masked lines for the staged reveal —
  // text stays sourced verbatim from site.tagline.
  const headlineLines = site.tagline
    .split('. ')
    .map((line, i, arr) => (i < arr.length - 1 ? `${line}.` : line));

  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        <Image
          src="/images/hero.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-img"
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-eyebrow">
          A diversified holding group · Africa — GCC — Europe — Asia
        </div>
        <h1>
          {headlineLines.map((line, i) => (
            <span className="h-line" key={line}>
              <span className="h-line-in">
                {i > 0 ? ' ' : ''}
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className="lede">{site.description}</p>
        <div className="hero-foot">
          {heroStats.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
