import type { Partner } from '@/types/content';

/**
 * Named partners — PDF page 07 ("PARTNERS") and existing footer links.
 * URLs preserved from the reference HTML.
 */
export const partners: Partner[] = [
  {
    name: 'African Energy Chamber',
    url: 'https://www.energychamber.org',
  },
  {
    name: 'CLG Global',
    url: 'https://clgglobal.com',
  },
];

/**
 * "Who we work with" — network categories, PDF page 06.
 * Aligned with the PDF's explicit list; superset of the legacy site's tags.
 */
export const networkCategories = [
  'Governments & state enterprises',
  'OEMs & technology companies',
  'Resource & energy operators',
  'Financial & strategic partners',
  'Legal & compliance advisers',
  'Local operating partners',
  'Manufacturers & suppliers',
  'Infrastructure developers',
] as const;
