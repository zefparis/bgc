import { SectionHead } from '@/components/shared/SectionHead';

const flow = ['Understand', 'Structure', 'Build', 'Execute', 'Deliver'];

export function Execution() {
  return (
    <section className="exec">
      <div className="wrap">
        <SectionHead
          kicker="Execution Without Complexity"
          title="No two projects are the same."
          style={{ marginBottom: 34 }}
        />
        <blockquote>
          &ldquo;Opportunities create value only when they are properly
          executed.&rdquo;
        </blockquote>
        <p className="body">
          We can assemble and manage multidisciplinary teams across
          jurisdictions and continents, bringing together the expertise
          required at each stage of the project.
        </p>
        <p className="body">
          Beyond our own ventures, we advise international companies on doing
          business in Africa — from market entry and local content strategy to
          the on-the-ground partnerships and know-how needed to operate
          successfully. We work with companies already established in
          international markets, businesses planning international expansion
          or investment, and independent specialists engaged with us on a
          contract basis.
        </p>
        <div className="exec-flow">
          {flow.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
