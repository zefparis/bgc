import type { ApproachStep } from '@/types/content';

/**
 * The nine-step group lifecycle — BGC_Holding_Corporate_Profile.pdf, page 06
 * ("OUR APPROACH"). Includes Advisory and Exit & Succession, which were absent
 * from the legacy site.
 */
export const approachSteps: ApproachStep[] = [
  {
    number: '01',
    title: 'Strategy & Origination',
    description:
      'Identifying opportunities, assessing commercial potential and defining the path to market.',
  },
  {
    number: '02',
    title: 'Planning & Structuring',
    description:
      'Building the commercial, financial, legal and operational framework for the venture.',
  },
  {
    number: '03',
    title: 'Project Management',
    description:
      'Coordinating stakeholders, specialists and suppliers through a clearly defined lifecycle.',
  },
  {
    number: '04',
    title: 'Joint Venture Development',
    description:
      'Identifying partners and establishing the governance and operating model for sustainable ventures.',
  },
  {
    number: '05',
    title: 'Implementation & Incubation',
    description:
      'Moving projects into execution: establishing teams, systems and operational capabilities.',
  },
  {
    number: '06',
    title: 'Legal & Regulatory Coordination',
    description:
      'Managing corporate, contractual and compliance workstreams with qualified advisers.',
  },
  {
    number: '07',
    title: 'Operational Management',
    description:
      'Remaining involved beyond launch to manage and optimise the business to maturity.',
  },
  {
    number: '08',
    title: 'Advisory',
    description:
      'Advising international companies on market entry, local content and on-the-ground partnerships in Africa.',
  },
  {
    number: '09',
    title: 'Exit & Succession',
    description:
      'Preparing ventures for the next stage: strategic partners, recapitalisation or long-term group ownership.',
  },
];
