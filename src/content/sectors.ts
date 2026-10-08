import type { SectorGroup } from '@/types/content';

/**
 * The six sector groups — BGC_Holding_Corporate_Profile.pdf, page 02 ("SECTORS").
 * Summaries are quoted from the PDF. Member company slugs resolve against
 * `operatingCompanies` in ./companies.ts.
 */
export const sectorGroups: SectorGroup[] = [
  {
    id: 'aviation-mobility',
    name: 'Aviation & Mobility',
    summary:
      'Moving people, fleets and assets: aircraft, vehicles, financing and the services that keep them operating.',
    companies: ['bgc-aviation', 'bgc-automotive'],
  },
  {
    id: 'infrastructure-energy',
    name: 'Infrastructure & Energy',
    summary:
      'Building and powering: EPC delivery, power and renewables, petroleum storage and oil and gas services.',
    companies: ['bgc-contracting', 'bgc-energy'],
  },
  {
    id: 'trade-commodities',
    name: 'Trade & Commodities',
    summary:
      'Origination, structuring and delivery of physical goods and commodities into African destination markets.',
    companies: ['bgc-general-trading', 'bgc-commodities'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    summary:
      'Pharmaceutical supply chains with public and private partners, from import and packaging to local production.',
    companies: ['bgc-pharma'],
  },
  {
    id: 'security-defence',
    name: 'Security & Defence',
    summary:
      'Surveillance, command and control, unmanned systems and sovereign technology for governments and critical infrastructure.',
    companies: ['bgc-security', 'bgc-drone-technologies'],
  },
  {
    id: 'data-ai',
    name: 'Data & Artificial Intelligence',
    summary:
      'Institutional data, analytics and applied AI, delivered under models where the state keeps ownership of its data and infrastructure.',
    companies: ['bgc-data-analytics', 'bgc-ai-center-of-excellence'],
  },
];
