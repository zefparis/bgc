import { SectionHead } from '@/components/shared/SectionHead';
import { regionCards } from '@/content/locations';
import { networkCategories } from '@/content/partners';

/**
 * Our Network — the four operating regions from the corporate profile,
 * followed by the "Who we work with" partner categories.
 * Regions describe business activity; `office` marks where a physical
 * office exists (GCC has regional activity but no office).
 */
export function Network() {
  return (
    <section id="network">
      <div className="wrap">
        <SectionHead
          kicker="Our Network"
          title="International relationships, local execution."
          description="A network spanning Africa, the GCC, Europe and Asia."
          style={{ marginBottom: 22 }}
        />
        <div className="region-grid">
          {regionCards.map((r) => (
            <div className="region-card reveal" key={r.name}>
              <h3>{r.name}</h3>
              <p>{r.description}</p>
              {r.office ? <span className="region-office">{r.office}</span> : null}
            </div>
          ))}
        </div>
        <h3 className="network-sub">Who we work with</h3>
        <div className="network-tags">
          {networkCategories.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
