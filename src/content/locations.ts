import type { GovernanceItem, Office } from '@/types/content';

/**
 * Offices and geographic footprint — BGC_Holding_Corporate_Profile.pdf,
 * pages 02 and 07. Three offices across four operating regions.
 */
export const offices: Office[] = [
  {
    label: 'Head office',
    city: 'Johannesburg',
    country: 'South Africa',
    role: 'Head office in Johannesburg; active across Southern, Central, East and West Africa.',
  },
  {
    label: 'European office',
    city: 'Madeira',
    country: 'Portugal',
    role: 'European base in Madeira, Portugal; technology, OEM and capital partners.',
  },
  {
    label: 'Asia office',
    city: 'Shanghai',
    country: 'China',
    role: 'Shanghai office covering China and wider Asia; OEM, EPC and capital partners.',
  },
];

/** Operating regions as listed on the PDF cover. */
export const regions = ['Africa', 'GCC', 'Europe', 'Asia'] as const;

/**
 * Governance & execution — PDF page 03
 * ("Disciplined ownership. Accountable delivery.").
 */
export const governance: GovernanceItem[] = [
  {
    title: 'Capital',
    description:
      'Allocated at group level against defined mandates, milestones and return expectations.',
  },
  {
    title: 'Mandates',
    description:
      'Each operating company carries a written sector mandate, pipeline and accountability for delivery.',
  },
  {
    title: 'Compliance',
    description:
      'Corporate, contractual and regulatory workstreams run with qualified legal and compliance partners across Africa.',
  },
  {
    title: 'Partnership model',
    description:
      'Preference for PPP, concession and build-operate structures where public partners keep ownership of assets and data.',
  },
  {
    title: 'Risk',
    description:
      'Counterparty, title, proof-of-funds and execution-capacity checks before any commitment.',
  },
];
