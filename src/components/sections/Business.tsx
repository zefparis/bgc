import { SectionHead } from '@/components/shared/SectionHead';
import { companiesBySlug } from '@/content/companies';
import { sectorGroups } from '@/content/sectors';

/**
 * The six sector groups, each card naming its member operating companies —
 * aligned with the corporate profile's "Six sector groups, connected through
 * one platform." Visual structure preserved from the reference site.
 */
export function Business() {
  return (
    <section className="business" id="business">
      <div className="wrap">
        <SectionHead
          kicker="Our Business"
          title="Six sector groups, connected through one platform."
          description="We build and operate businesses that connect Africa, the GCC and international markets."
        />
        <div className="biz-grid">
          {sectorGroups.map((sector) => {
            const names = sector.companies
              .map((slug) => companiesBySlug.get(slug)?.name)
              .filter(Boolean)
              .join(' · ');
            return (
              <div className="biz-card reveal" key={sector.id}>
                <div className="tag" />
                <h3>{sector.name}</h3>
                <div className="biz-companies">{names}</div>
                <p>{sector.summary}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
