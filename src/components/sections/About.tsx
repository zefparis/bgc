import { SectionHead } from '@/components/shared/SectionHead';
import {
  governance,
  governanceIntro,
  groupStructure,
} from '@/content/locations';

export function About() {
  return (
    <section id="about">
      <div className="wrap">
        <div className="about">
        <div>
          <SectionHead
            kicker="The Group"
            title="A holding company built to originate, structure and deliver."
            style={{ marginBottom: 26 }}
          />
          <p>
            BGC HOLDING is a diversified holding group, headquartered in
            Sandton, South Africa. The group holds and directs eleven operating
            companies, each focused on a defined sector, and provides the shared
            capital, governance, partnerships and project capability they draw
            on.
          </p>
          <p>
            Our activities bring together established technologies, specialist
            expertise and access to capital, with a particular focus on
            opportunities linking Africa, the GCC and international markets.
          </p>
          <p>
            Our approach is practical and execution-focused. We work alongside
            governments, state enterprises, corporate partners, technology
            providers, resource operators and investors to turn opportunities
            into operating businesses and sustainable ventures.
          </p>
        </div>
        <div className="about-list">
          {groupStructure.pillars.map((p) => (
            <div key={p.label}>
              <b>{p.label}</b>
              <span>{p.text}</span>
            </div>
          ))}
        </div>
        </div>

        <div className="about-gov">
          <h3>Disciplined ownership. Accountable delivery.</h3>
          <p className="gov-intro">{governanceIntro}</p>
          <div className="about-list gov-list">
            {governance.map((item) => (
              <div key={item.title}>
                <b>{item.title}</b>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
