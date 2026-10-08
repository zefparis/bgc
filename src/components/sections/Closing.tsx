import { AfricaMap } from '@/components/shared/AfricaMap';
import { site } from '@/content/site';
import { offices } from '@/content/locations';

export function Closing() {
  return (
    <section className="closing" id="contact">
      <div className="closing-map" aria-hidden="true">
        <AfricaMap />
      </div>
      <div className="wrap">
        <h2>Built to deliver.</h2>
        <p>
          Whether the requirement is a transaction, a technology partnership, an
          infrastructure project, a new company or an operational assignment,
          BGC HOLDING provides the structure, expertise and execution required
          to move forward.
        </p>
        <div className="line">{site.motto}</div>
        <div className="locations">
          {offices.map((o) => `${o.city}, ${o.country}`).join(' · ')}
        </div>
      </div>
    </section>
  );
}
