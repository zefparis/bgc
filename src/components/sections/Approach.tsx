import { SectionHead } from '@/components/shared/SectionHead';
import { approachSteps } from '@/content/approach';

export function Approach() {
  return (
    <section id="approach">
      <div className="wrap">
        <SectionHead
          kicker="Our Approach"
          title="From opportunity to operation."
          description="Our expertise spans the full lifecycle of a project, transaction, joint venture or company — from concept through to maturation."
        />
        <div className="approach-list">
          {approachSteps.map((step) => (
            <div className="step reveal" key={step.number}>
              <div className="n">{step.number}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
