/**
 * Site-wide corporate facts — BGC_Holding_Corporate_Profile.pdf, page 07.
 */
export const site = {
  name: 'BGC Holding',
  legalName: 'BGC HOLDING',
  /** Cover headline — PDF page 01. */
  tagline: 'Eleven operating companies. One execution platform.',
  motto: 'Origination. Partnership. Execution.',
  /** Cover descriptor — PDF page 01, verbatim. */
  description:
    'BGC Holding builds and operates businesses across aviation, automotive, contracting, energy, trade, commodities, healthcare, security, drones, data and artificial intelligence, linking African markets with capital, technology and partners worldwide.',
  contact: {
    email: 'info@bgcholding.com',
    phone: '+27 11 245 5900',
    phoneHref: 'tel:+27112455900',
  },
  address: {
    lines: [
      '114 West Street c/o Katherine and West',
      '6th Floor, Suite 43',
      'Sandton 2196, South Africa',
    ],
  },
  copyright: `© ${new Date().getFullYear()} BGC Holding. All rights reserved.`,
  /** Disclaimer carried over from the corporate profile footer. */
  disclaimer:
    'Sector descriptions are indicative of each company\u2019s mandate and do not constitute an offer.',
} as const;

/** Hero footer stats — PDF cover page. */
export const heroStats = [
  { value: '11', label: 'Operating companies' },
  { value: '6', label: 'Sector groups' },
  { value: '4', label: 'Regions: Africa, GCC, Europe, Asia' },
  { value: '3', label: 'Offices: Johannesburg, Madeira, Shanghai' },
] as const;

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#business', label: 'Business' },
  { href: '#approach', label: 'Approach' },
  { href: '#network', label: 'Network' },
] as const;
