import { SectionHead } from '@/components/shared/SectionHead';

/**
 * What we bring — PDF page 05 ("Structure, expertise and execution.").
 * The pull-quote is from the profile's group page; the closing line is the
 * Advisory mandate (lifecycle phase 08), verbatim.
 */
export function Execution() {
  return (
    <section className="exec">
      <div className="wrap">
        <SectionHead
          kicker="What we bring"
          title="Structure, expertise and execution."
          style={{ marginBottom: 34 }}
        />
        <blockquote>
          &ldquo;Opportunities create value only when they are properly
          executed.&rdquo;
        </blockquote>
        <p className="body">
          Beyond our own ventures, we advise international companies on market
          entry, local content and on-the-ground partnerships in Africa.
        </p>
      </div>
    </section>
  );
}
