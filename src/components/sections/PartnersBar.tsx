import { partners } from '@/content/partners';

export function PartnersBar() {
  return (
    <div className="partners-bar">
      <div className="wrap partners-bar-inner">
        <span className="partners-label">Partners</span>
        <ul className="partners-list">
          {partners.map((p) => (
            <li key={p.name}>
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
