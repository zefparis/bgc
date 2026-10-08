import { SectionHead } from '@/components/shared/SectionHead';
import { networkCategories } from '@/content/partners';

export function Network() {
  return (
    <section id="network">
      <div className="wrap">
        <SectionHead
          kicker="Our Network"
          title="International relationships, local execution."
          description="Our businesses operate through a network spanning Africa, the GCC, Europe and other strategic markets."
          style={{ marginBottom: 22 }}
        />
        <div className="network-tags">
          {networkCategories.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
