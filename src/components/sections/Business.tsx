import { SectionHead } from '@/components/shared/SectionHead';
import { companiesBySlug } from '@/content/companies';
import { groupStructure } from '@/content/locations';
import { sectorGroups } from '@/content/sectors';
import type { OperatingCompany } from '@/types/content';

/**
 * The six sector groups, each card presenting its member operating companies
 * with their official mandate label, description and capabilities —
 * aligned with the corporate profile's group structure (pages 02–05).
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
        <div className="structure-head reveal">
          <h3>{groupStructure.headline}</h3>
          <p>{groupStructure.intro}</p>
        </div>
        <div className="biz-sectors">
          {sectorGroups.map((sector, index) => {
            const members = sector.companies
              .map((slug) => companiesBySlug.get(slug))
              .filter((c): c is OperatingCompany => Boolean(c));
            return (
              <div className="biz-sector reveal" key={sector.id}>
                <div className="biz-sector-head">
                  <span className="biz-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="tag" />
                  <h3>{sector.name}</h3>
                  <p>{sector.summary}</p>
                </div>
                <div className="biz-companies">
                  {members.map((company) => (
                    <div className="biz-company" key={company.slug}>
                      <div className="biz-company-head">
                        <b>{company.name}</b>
                        <span className="biz-sector-label">
                          {company.sectorLabel}
                        </span>
                      </div>
                      <p>{company.description}</p>
                      <div className="biz-caps">
                        {company.capabilities.map((cap) => (
                          <span key={cap}>{cap}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <p className="biz-footnote">{groupStructure.footnote}</p>
      </div>
    </section>
  );
}
