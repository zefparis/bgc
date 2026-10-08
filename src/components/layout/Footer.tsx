import { site } from '@/content/site';
import { offices } from '@/content/locations';

export function Footer() {
  return (
    <footer>
      <div className="wrap footer-inner">
        <div>
          <div className="footer-mark-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element -- logo is a small static asset sized to the wordmark */}
            <img
              className="footer-logo-mark"
              src="/images/bgc-logo.png"
              alt=""
              width={304}
              height={89}
            />
            <div className="mark">{site.legalName}</div>
          </div>
          <div>
            Locations: {offices.map((o) => `${o.city}, ${o.country}`).join(' | ')}
          </div>
        </div>
        <div className="footer-right">
          <div className="footer-address">
            {site.address.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
            <div>
              Phone: <a href={site.contact.phoneHref}>{site.contact.phone}</a>
            </div>
            <div>
              Email:{' '}
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </div>
          </div>
          <div>{site.copyright}</div>
        </div>
      </div>
    </footer>
  );
}
