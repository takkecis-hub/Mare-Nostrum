import { describe, expect, it } from 'vitest';
import type { HiddenExperience } from '../../shared/src/types/index.js';
import {
  applyExperienceGain,
  determineRenown,
  dominantExperienceLabel,
  meetsExperienceThreshold,
  getThresholdGates,
  getRenownDescription,
} from './experience.js';

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

  it('adds 2 to murekkep on pusula intent', () => {
    const result = applyExperienceGain(baseExperience, 'pusula');
    expect(result.murekkep).toBe(3);
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
    // simsar = 5, total = 8 → ratio = 0.625, total = 8 < 12 → must boost total
    // simsar = 10, total = 13 → ratio = ~0.77, total ≥ 12
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 10 };
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

describe('meetsExperienceThreshold', () => {
  it('returns true when skill ratio meets the threshold exactly', () => {
    // terazi = 7, total = 10 → ratio = 0.7 ≥ 0.35
    const exp: HiddenExperience = { meltem: 1, terazi: 7, murekkep: 1, simsar: 1 };
    expect(meetsExperienceThreshold(exp, 'terazi', 0.35)).toBe(true);
  });

  it('returns false when skill ratio is below the threshold', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
    expect(meetsExperienceThreshold(exp, 'meltem', 0.5)).toBe(false);
  });

  it('returns true when threshold is 0 (always passes)', () => {
    const exp: HiddenExperience = { meltem: 0, terazi: 0, murekkep: 0, simsar: 0 };
    expect(meetsExperienceThreshold(exp, 'simsar', 0)).toBe(true);
  });

  it('works for all four skill keys', () => {
    const exp: HiddenExperience = { meltem: 10, terazi: 10, murekkep: 10, simsar: 10 };
    for (const skill of ['meltem', 'terazi', 'murekkep', 'simsar'] as const) {
      expect(meetsExperienceThreshold(exp, skill, 0.25)).toBe(true);
    }
  });
});

describe('getThresholdGates', () => {
  it('returns all true when every skill is at least 25%', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
    const gates = getThresholdGates(exp);
    expect(gates.meltem).toBe(true);
    expect(gates.terazi).toBe(true);
    expect(gates.murekkep).toBe(true);
    expect(gates.simsar).toBe(true);
  });

  it('returns false for skills below 25%', () => {
    // simsar = 0 → ratio 0 < 0.25
    const exp: HiddenExperience = { meltem: 10, terazi: 10, murekkep: 10, simsar: 0 };
    const gates = getThresholdGates(exp);
    expect(gates.simsar).toBe(false);
  });

  it('opens gate when skill just meets 25%', () => {
    // meltem = 1, total = 4 → ratio = 0.25 exactly
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
    const gates = getThresholdGates(exp);
    expect(gates.meltem).toBe(true);
  });
});

describe('getRenownDescription', () => {
  it('returns empty string for empty renown list', () => {
    expect(getRenownDescription([])).toBe('');
  });

  it('includes trade description for Altın Parmak', () => {
    const desc = getRenownDescription(['Altın Parmak']);
    expect(desc).toContain('tüccar');
  });

  it('includes combat description for Demir Pruva', () => {
    const desc = getRenownDescription(['Demir Pruva']);
    expect(desc.toLowerCase()).toContain('deniz');
  });

  it('includes diplomat description for İpek Dil', () => {
    const desc = getRenownDescription(['İpek Dil']);
    expect(desc).toContain('Diplomatik');
  });

  it('includes smuggler description for Hayalet Pala', () => {
    const desc = getRenownDescription(['Hayalet Pala']);
    expect(desc).toContain('kaçakçı');
  });

  it('concatenates multiple renown descriptions', () => {
    const desc = getRenownDescription(['Altın Parmak', 'Demir Pruva']);
    expect(desc).toContain('tüccar');
    expect(desc.toLowerCase()).toContain('deniz');
  });
});

import { updateRenownTracking, checkRenownDecay } from './experience.js';

describe('updateRenownTracking', () => {
  it('updates turn for matching renown+intent', () => {
    const result = updateRenownTracking(['Altın Parmak'], 'kervan', 5, {});
    expect(result['Altın Parmak']).toBe(5);
  });

  it('initializes tracking for newly gained titles', () => {
    const result = updateRenownTracking(['Demir Pruva'], 'pusula', 3, {});
    expect(result['Demir Pruva']).toBe(3);
  });

  it('preserves existing tracking for unrelated intents', () => {
    const result = updateRenownTracking(['Altın Parmak'], 'pusula', 10, { 'Altın Parmak': 2 });
    expect(result['Altın Parmak']).toBe(2);
  });
});

describe('checkRenownDecay', () => {
  it('returns no warnings or losses for fresh titles', () => {
    const result = checkRenownDecay(['Altın Parmak'], 'kervan', 3, { 'Altın Parmak': 1 });
    expect(result.warnings).toHaveLength(0);
    expect(result.losses).toHaveLength(0);
  });

  it('warns when gap reaches 5 turns', () => {
    const result = checkRenownDecay(['Altın Parmak'], 'pusula', 6, { 'Altın Parmak': 1 });
    expect(result.warnings).toContain('Altın Parmak');
  });

  it('marks loss when gap reaches 8 turns', () => {
    const result = checkRenownDecay(['Altın Parmak'], 'pusula', 9, { 'Altın Parmak': 1 });
    expect(result.losses).toContain('Altın Parmak');
  });

  it('warns on contradictory action', () => {
    // Altın Parmak contradicts kara_bayrak
    const result = checkRenownDecay(['Altın Parmak'], 'kara_bayrak', 2, { 'Altın Parmak': 1 });
    expect(result.warnings).toContain('Altın Parmak');
  });

  it('contradictory action causes loss when combined with time gap', () => {
    // gap = 3 turns, but contradiction adds RENOWN_WARNING_TURNS (5) → effective gap = 8 → loss
    const result = checkRenownDecay(['Altın Parmak'], 'kara_bayrak', 4, { 'Altın Parmak': 1 });
    expect(result.losses).toContain('Altın Parmak');
  });

  it('contradictory action on fresh title causes warning (effective gap = 5)', () => {
    // gap = 0, contradiction adds 5 → effective gap = 5 → warning
    const result = checkRenownDecay(['Altın Parmak'], 'kara_bayrak', 1, { 'Altın Parmak': 1 });
    expect(result.warnings).toContain('Altın Parmak');
  });
});

describe('determineRenown – minimum experience gate', () => {
  it('returns no renown when total experience is below RENOWN_MIN_TOTAL_EXPERIENCE', () => {
    // simsar = 5, total = 8 → below 12 threshold
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 5 };
    const renown = determineRenown(exp, 1);
    expect(renown).toHaveLength(0);
  });

  it('grants renown when total experience meets minimum', () => {
    // total = 1 + 1 + 1 + 10 = 13 ≥ 12
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 10 };
    const renown = determineRenown(exp, 1);
    expect(renown).toContain('Hayalet Pala');
  });
});
