import { describe, expect, it } from 'vitest';
import { companiesBySlug, operatingCompanies } from '@/content/companies';
import { sectorGroups } from '@/content/sectors';
import { approachSteps } from '@/content/approach';
import { governance, offices, regions } from '@/content/locations';
import { networkCategories, partners } from '@/content/partners';

/**
 * Content integrity — the corporate PDF is the source of truth:
 * 11 operating companies, 6 sector groups, 3 offices, 4 regions,
 * 9 lifecycle steps. No fabricated or missing entries.
 */
describe('corporate content integrity', () => {
  it('lists exactly 11 operating companies', () => {
    expect(operatingCompanies).toHaveLength(11);
    const names = operatingCompanies.map((c) => c.name);
    expect(names).toEqual([
      'BGC Aviation',
      'BGC Automotive',
      'BGC Contracting',
      'BGC Energy',
      'BGC General Trading',
      'BGC Commodities',
      'BGC Pharma',
      'BGC Security',
      'BGC Drone Technologies',
      'BGC Data Analytics',
      'BGC AI Center of Excellence',
    ]);
  });

  it('has unique slugs', () => {
    const slugs = operatingCompanies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(11);
  });

  it('lists exactly 6 sector groups covering all 11 companies', () => {
    expect(sectorGroups).toHaveLength(6);
    const covered = sectorGroups.flatMap((s) => s.companies);
    expect(new Set(covered).size).toBe(11);
  });

  it('every sector-group company slug resolves', () => {
    for (const group of sectorGroups) {
      for (const slug of group.companies) {
        expect(companiesBySlug.has(slug)).toBe(true);
      }
    }
  });

  it('every company belongs to exactly one sector group', () => {
    for (const c of operatingCompanies) {
      const group = sectorGroups.find((g) => g.id === c.sectorGroup);
      expect(group, `${c.slug} → ${c.sectorGroup}`).toBeDefined();
      expect(group!.companies).toContain(c.slug);
    }
  });

  it('has 3 offices and 4 regions', () => {
    expect(offices.map((o) => o.city)).toEqual([
      'Johannesburg',
      'Madeira',
      'Shanghai',
    ]);
    expect(regions).toHaveLength(4);
  });

  it('has the full 9-step lifecycle', () => {
    expect(approachSteps).toHaveLength(9);
    expect(approachSteps[7]!.title).toBe('Advisory');
    expect(approachSteps[8]!.title).toBe('Exit & Succession');
  });

  it('includes all 5 governance items from the profile', () => {
    expect(governance.map((g) => g.title)).toEqual([
      'Capital',
      'Mandates',
      'Compliance',
      'Partnership model',
      'Risk',
    ]);
  });

  it('lists named partners and network categories from the profile', () => {
    expect(partners.map((p) => p.name)).toEqual([
      'African Energy Chamber',
      'CLG Global',
    ]);
    for (const p of partners) {
      expect(p.url).toMatch(/^https:\/\//);
    }
    expect(networkCategories).toContain('Governments & state enterprises');
    expect(networkCategories).toContain('Legal & compliance advisers');
  });
});
