/**
 * Shared content types for the BGC Holding site.
 * All facts derive from BGC_Holding_Corporate_Profile.pdf (source of truth).
 */

export type SectorGroupId =
  | 'aviation-mobility'
  | 'infrastructure-energy'
  | 'trade-commodities'
  | 'healthcare'
  | 'security-defence'
  | 'data-ai';

export type CompanySectorLabel =
  | 'Aviation & Aerospace'
  | 'Automotive & Mobility'
  | 'Construction, EPC & Infrastructure'
  | 'Healthcare & Pharmaceuticals'
  | 'Security & Defence'
  | 'Energy, Power & Oil and Gas'
  | 'Trade & Distribution'
  | 'Commodities & Natural Resources'
  | 'Drones & Unmanned Systems'
  | 'Data & Digital'
  | 'Artificial Intelligence & Innovation';

export interface OperatingCompany {
  /** Stable slug, e.g. "bgc-aviation" — usable for future /companies/[slug] routes. */
  slug: string;
  name: string;
  /** Sector label used in the PDF group-structure diagram. */
  sectorLabel: CompanySectorLabel;
  /** The 6-group umbrella this company belongs to. */
  sectorGroup: SectorGroupId;
  /** Short mandate description (from PDF). */
  description: string;
  /** Capability tags (from PDF). */
  capabilities: string[];
}

export interface SectorGroup {
  id: SectorGroupId;
  name: string;
  /** One-line summary from the PDF SECTORS page. */
  summary: string;
  /** Slugs of member operating companies. */
  companies: string[];
}

export interface ApproachStep {
  number: string;
  title: string;
  description: string;
}

export interface Office {
  label: string;
  city: string;
  country: string;
  role: string;
}

export interface GovernanceItem {
  title: string;
  description: string;
}

export interface Partner {
  name: string;
  url: string;
}
