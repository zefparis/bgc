import type { GovernanceItem, Office, Region } from '@/types/content';

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

/**
 * The four operating regions — PDF page 04 ("OUR NETWORK"), verbatim.
 * `office` marks regions with a physical office; GCC has regional activity
 * but no office, per the profile.
 */
export const regionCards: Region[] = [
  {
    name: 'Africa',
    description:
      'Head office in Johannesburg; active across Southern, Central, East and West Africa.',
    office: 'Head office — Johannesburg, South Africa',
  },
  {
    name: 'GCC',
    description: 'Origination, trade flows and capital partners.',
  },
  {
    name: 'Europe',
    description:
      'European base in Madeira, Portugal; technology, OEM and capital partners.',
    office: 'European office — Madeira, Portugal',
  },
  {
    name: 'Asia',
    description:
      'Shanghai office covering China and wider Asia; OEM, EPC and capital partners.',
    office: 'Asia office — Shanghai, China',
  },
];

/** Operating regions as listed on the PDF cover. */
export const regions = ['Africa', 'GCC', 'Europe', 'Asia'] as const;

/**
 * Group structure — PDF page 03 ("One holding company. Eleven sector-focused
 * operating companies.") plus the page-02 structure panel.
 */
export const groupStructure = {
  headline: 'One holding company. Eleven sector-focused operating companies.',
  intro:
    'Each operating company carries a clear sector mandate and draws on the group for capital, governance, partnerships and execution support.',
  footnote:
    'Operating companies are shown by sector; legal entity structure is available on request.',
  pillars: [
    {
      label: 'Holding',
      text: 'Capital allocation, governance and group services',
    },
    {
      label: 'Operating companies',
      text: 'Sector-focused delivery vehicles with their own mandates',
    },
    {
      label: 'Partnerships',
      text: 'OEMs, financiers, legal and local operating partners',
    },
    {
      label: 'Footprint',
      text: 'Johannesburg head office · Madeira European base · Shanghai Asia office',
    },
  ],
} as const;

/**
 * Governance & execution — PDF page 03
 * ("Disciplined ownership. Accountable delivery.").
 * `governanceIntro` is the section's introductory paragraph, verbatim.
 */
export const governanceIntro =
  'The holding company sets strategy, allocates capital and holds each operating company to a clear mandate. Projects are structured to be bankable and legally executable before capital is committed, and are managed through a defined lifecycle with qualified advisers in every jurisdiction.';

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
