import { AfricaMap } from '@/components/shared/AfricaMap';
import { heroStats, site } from '@/content/site';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-map" aria-hidden="true">
        <AfricaMap />
      </div>
      <div className="wrap hero-inner">
        <div className="hero-eyebrow">
          A diversified holding group · Africa — GCC — Europe — Asia
        </div>
        <h1>{site.tagline}</h1>
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
