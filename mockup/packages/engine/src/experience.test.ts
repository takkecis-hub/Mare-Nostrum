import { describe, expect, it } from 'vitest';
import type { HiddenExperience } from '../../shared/src/types/index.js';
import { applyExperienceGain, determineRenown, dominantExperienceLabel } from './experience.js';

const baseExperience: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };

describe('applyExperienceGain', () => {
  it('adds 2 to terazi on kervan intent', () => {
    const result = applyExperienceGain(baseExperience, 'kervan');
    expect(result.terazi).toBe(3);
    expect(result.meltem).toBe(1);
    expect(result.murekkep).toBe(1);
    expect(result.simsar).toBe(1);
  });

  it('adds 2 to meltem on kara_bayrak intent', () => {
    const result = applyExperienceGain(baseExperience, 'kara_bayrak');
    expect(result.meltem).toBe(3);
    expect(result.terazi).toBe(1);
  });

  it('adds 1 to murekkep on pusula intent', () => {
    const result = applyExperienceGain(baseExperience, 'pusula');
    expect(result.murekkep).toBe(2);
    expect(result.meltem).toBe(1);
  });

  it('adds 2 to simsar on duman intent', () => {
    const result = applyExperienceGain(baseExperience, 'duman');
    expect(result.simsar).toBe(3);
    expect(result.terazi).toBe(1);
  });

  it('does not mutate the original experience object', () => {
    const original = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
    applyExperienceGain(original, 'kervan');
    expect(original.terazi).toBe(1);
  });
});

describe('determineRenown', () => {
  it('grants Altın Parmak when terazi >= 35% and active rumors exist', () => {
    // terazi = 10, total = 14 → ratio = ~0.71
    const exp: HiddenExperience = { meltem: 1, terazi: 10, murekkep: 2, simsar: 1 };
    const renown = determineRenown(exp, 1);
    expect(renown).toContain('Altın Parmak');
  });

  it('does not grant Altın Parmak without active rumors', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 10, murekkep: 2, simsar: 1 };
    const renown = determineRenown(exp, 0);
    expect(renown).not.toContain('Altın Parmak');
  });

  it('grants Demir Pruva when meltem >= 35% and active rumors exist', () => {
    const exp: HiddenExperience = { meltem: 10, terazi: 1, murekkep: 1, simsar: 1 };
    const renown = determineRenown(exp, 1);
    expect(renown).toContain('Demir Pruva');
  });

  it('grants İpek Dil when murekkep >= 35% without requiring rumors', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 10, simsar: 1 };
    const renown = determineRenown(exp, 0);
    expect(renown).toContain('İpek Dil');
  });

  it('grants Hayalet Pala when simsar >= 30%', () => {
    // simsar = 5, total = 8 → ratio = 0.625
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 5 };
    const renown = determineRenown(exp, 0);
    expect(renown).toContain('Hayalet Pala');
  });

  it('returns no renown when all ratios are below threshold', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
    const renown = determineRenown(exp, 0);
    expect(renown).toHaveLength(0);
  });
});

describe('dominantExperienceLabel', () => {
  it('returns the key with the highest ratio', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 10, murekkep: 1, simsar: 1 };
    expect(dominantExperienceLabel(exp)).toBe('terazi');
  });

  it('returns meltem when meltem is highest', () => {
    const exp: HiddenExperience = { meltem: 8, terazi: 1, murekkep: 1, simsar: 1 };
    expect(dominantExperienceLabel(exp)).toBe('meltem');
  });

  it('returns murekkep when murekkep is highest', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 6, simsar: 1 };
    expect(dominantExperienceLabel(exp)).toBe('murekkep');
  });

  it('returns simsar when simsar is highest', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 9 };
    expect(dominantExperienceLabel(exp)).toBe('simsar');
  });
});
