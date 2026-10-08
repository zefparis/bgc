import type { OperatingCompany } from '@/types/content';

/**
 * The eleven operating companies — BGC_Holding_Corporate_Profile.pdf, pages 04–05.
 * Descriptions and capabilities are quoted/paraphrased verbatim from the PDF.
 * "Sector descriptions are indicative of each company's mandate and do not
 * constitute an offer." (PDF footer)
 */
export const operatingCompanies: OperatingCompany[] = [
  {
    slug: 'bgc-aviation',
    name: 'BGC Aviation',
    sectorLabel: 'Aviation & Aerospace',
    sectorGroup: 'aviation-mobility',
    description:
      'Aircraft sourcing, leasing structures, flight training and simulation, and aviation services for airlines, operators and government customers in growth markets.',
    capabilities: [
      'Aircraft sourcing',
      'Leasing & finance',
      'Training & simulation',
      'Operator services',
    ],
  },
  {
    slug: 'bgc-automotive',
    name: 'BGC Automotive',
    sectorLabel: 'Automotive & Mobility',
    sectorGroup: 'aviation-mobility',
    description:
      'Vehicle supply, fleet solutions, parts and aftersales support, connecting manufacturers and distributors with operators across Africa and international markets.',
    capabilities: [
      'Vehicle supply',
      'Fleet solutions',
      'Parts & after-sales',
      'Distribution',
    ],
  },
  {
    slug: 'bgc-contracting',
    name: 'BGC Contracting',
    sectorLabel: 'Construction, EPC & Infrastructure',
    sectorGroup: 'infrastructure-energy',
    description:
      'Engineering, procurement and construction delivery, project management and site execution for infrastructure, industrial and technology deployments.',
    capabilities: [
      'EPC delivery',
      'Project management',
      'Site execution',
      'Technology integration',
    ],
  },
  {
    slug: 'bgc-energy',
    name: 'BGC Energy',
    sectorLabel: 'Energy, Power & Oil and Gas',
    sectorGroup: 'infrastructure-energy',
    description:
      'Power generation and transmission, renewable projects, petroleum storage and oil and gas services, structured through PPP, concession and build-operate models.',
    capabilities: [
      'Power generation',
      'Renewables',
      'Storage & logistics',
      'Oil & gas services',
    ],
  },
  {
    slug: 'bgc-general-trading',
    name: 'BGC General Trading',
    sectorLabel: 'Trade & Distribution',
    sectorGroup: 'trade-commodities',
    description:
      'Sourcing, import and export, and supply agreements for industrial, commercial and institutional buyers across Africa, the GCC and Asia.',
    capabilities: [
      'Sourcing',
      'Import & export',
      'Supply agreements',
      'Institutional buyers',
    ],
  },
  {
    slug: 'bgc-commodities',
    name: 'BGC Commodities',
    sectorLabel: 'Commodities & Natural Resources',
    sectorGroup: 'trade-commodities',
    description:
      'Origination and structuring of bitumen, petroleum products, coal, sulphur and mineral transactions for destination markets across the continent.',
    capabilities: [
      'Bitumen & petroleum',
      'Coal & sulphur',
      'Minerals',
      'Trade structuring',
    ],
  },
  {
    slug: 'bgc-pharma',
    name: 'BGC Pharma',
    sectorLabel: 'Healthcare & Pharmaceuticals',
    sectorGroup: 'healthcare',
    description:
      'Pharmaceutical import, packaging and distribution programmes with public and private health partners, with a path to local production.',
    capabilities: [
      'Import & registration',
      'Packaging',
      'Distribution',
      'Local production',
    ],
  },
  {
    slug: 'bgc-security',
    name: 'BGC Security',
    sectorLabel: 'Security & Defence',
    sectorGroup: 'security-defence',
    description:
      'Integrated security, surveillance, command and control, drone and sovereign technology solutions for government, infrastructure and corporate clients.',
    capabilities: [
      'Surveillance & C2',
      'Drones',
      'Critical infrastructure',
      'Sovereign technology',
    ],
  },
  {
    slug: 'bgc-drone-technologies',
    name: 'BGC Drone Technologies',
    sectorLabel: 'Drones & Unmanned Systems',
    sectorGroup: 'security-defence',
    description:
      'Unmanned aerial systems for surveillance, inspection, mapping, emergency response and drone-as-a-service programmes, with command and control integration and local pilot training.',
    capabilities: [
      'UAS supply',
      'Drone-as-a-service',
      'Inspection & mapping',
      'C2 integration & training',
    ],
  },
  {
    slug: 'bgc-data-analytics',
    name: 'BGC Data Analytics',
    sectorLabel: 'Data & Digital',
    sectorGroup: 'data-ai',
    description:
      'Data governance, analytics platforms and state data mandates: cleaning, valuing and monetising institutional data under models where the state keeps ownership.',
    capabilities: [
      'Data governance',
      'Analytics platforms',
      'State data mandates',
      'Digital economy',
    ],
  },
  {
    slug: 'bgc-ai-center-of-excellence',
    name: 'BGC AI Center of Excellence',
    sectorLabel: 'Artificial Intelligence & Innovation',
    sectorGroup: 'data-ai',
    description:
      'Applied AI research, product development, talent and partnerships, building sovereign AI capability for African institutions and group companies.',
    capabilities: [
      'Applied AI',
      'Research & development',
      'Talent & training',
      'Sovereign AI',
    ],
  },
];

export const companiesBySlug = new Map(
  operatingCompanies.map((c) => [c.slug, c]),
);
