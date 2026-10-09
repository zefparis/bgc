import { SectionHead } from '@/components/shared/SectionHead';
import { approachSteps } from '@/content/approach';

export function Approach() {
  return (
    <section id="approach">
      <div className="wrap">
        <SectionHead
          kicker="Our Approach"
          title="From opportunity to operation."
          description="Our expertise spans the full lifecycle of a project, transaction, joint venture or company — from concept through to maturity."
        />
        <ol className="flow">
          {approachSteps.map((step) => (
            <li className="step reveal" key={step.number}>
              <div className="step-marker">
                <span className="step-dot" aria-hidden="true" />
                <span className="n">{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
