import { describe, expect, it } from 'vitest';
import { getExperienceRatios, indicatorToDots } from '../../shared/src/formulas/index.js';
import { isOrderReachable } from '../../shared/src/validators/index.js';
import { projectToSVG } from '../../shared/src/geo/projection.js';
import type { HiddenExperience, Order, Route } from '../../shared/src/types/index.js';

// ─── getExperienceRatios ────────────────────────────────────────────────────

describe('getExperienceRatios', () => {
  it('returns correct ratios for uniform experience', () => {
    const exp: HiddenExperience = { meltem: 1, terazi: 1, murekkep: 1, simsar: 1 };
    const ratios = getExperienceRatios(exp);
    expect(ratios.meltem).toBeCloseTo(0.25);
    expect(ratios.terazi).toBeCloseTo(0.25);
    expect(ratios.murekkep).toBeCloseTo(0.25);
    expect(ratios.simsar).toBeCloseTo(0.25);
  });

  it('returns correct ratios when one value dominates', () => {
    const exp: HiddenExperience = { meltem: 8, terazi: 0, murekkep: 0, simsar: 0 };
    const ratios = getExperienceRatios(exp);
    expect(ratios.meltem).toBeCloseTo(1);
    expect(ratios.terazi).toBe(0);
    expect(ratios.murekkep).toBe(0);
    expect(ratios.simsar).toBe(0);
  });

  it('returns sum of all ratios equal to 1', () => {
    const exp: HiddenExperience = { meltem: 3, terazi: 5, murekkep: 2, simsar: 2 };
    const ratios = getExperienceRatios(exp);
    const sum = ratios.meltem + ratios.terazi + ratios.murekkep + ratios.simsar;
    expect(sum).toBeCloseTo(1);
  });

  it('treats all-zero experience as total=1 (avoids division by zero)', () => {
    const exp: HiddenExperience = { meltem: 0, terazi: 0, murekkep: 0, simsar: 0 };
    const ratios = getExperienceRatios(exp);
    // total is clamped to 1, so all ratios are 0/1 = 0
    expect(ratios.meltem).toBe(0);
    expect(ratios.terazi).toBe(0);
    expect(ratios.murekkep).toBe(0);
    expect(ratios.simsar).toBe(0);
  });
});

// ─── indicatorToDots ────────────────────────────────────────────────────────

describe('indicatorToDots', () => {
  it('returns 1 filled dot for value=1', () => {
    expect(indicatorToDots(1)).toBe('●○○○○');
  });

  it('returns 3 filled dots for value=3', () => {
    expect(indicatorToDots(3)).toBe('●●●○○');
  });

  it('returns 5 filled dots for value=5', () => {
    expect(indicatorToDots(5)).toBe('●●●●●');
  });

  it('clamps to 1 for value=0', () => {
    expect(indicatorToDots(0)).toBe('●○○○○');
  });

  it('clamps to 5 for value=10', () => {
    expect(indicatorToDots(10)).toBe('●●●●●');
  });

  it('always returns 5 characters total', () => {
    for (const v of [0, 1, 2, 3, 4, 5, 6]) {
      const result = indicatorToDots(v);
      expect(result.length).toBe(5);
    }
  });
});

// ─── isOrderReachable ───────────────────────────────────────────────────────

const sampleRoutes: Route[] = [
  { id: 'r1', from: 'venedik', to: 'istanbul', type: 'fortuna', isChokepoint: null, encounterChance: 0.3, turnsRequired: 2 },
  { id: 'r2', from: 'istanbul', to: 'beyrut', type: 'uzun_kabotaj', isChokepoint: null, encounterChance: 0.2, turnsRequired: 3 },
];

describe('isOrderReachable', () => {
  it('returns true when route type and direction match (from→to)', () => {
    const order: Order = { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' };
    expect(isOrderReachable(order, 'venedik', sampleRoutes)).toBe(true);
  });

  it('returns true when route type and direction match (to→from)', () => {
    const order: Order = { destinationPort: 'venedik', routeType: 'fortuna', intent: 'kervan' };
    expect(isOrderReachable(order, 'istanbul', sampleRoutes)).toBe(true);
  });

  it('returns false when route type does not match', () => {
    const order: Order = { destinationPort: 'istanbul', routeType: 'tramontana', intent: 'kervan' };
    expect(isOrderReachable(order, 'venedik', sampleRoutes)).toBe(false);
  });

  it('returns false when no direct route connects the ports', () => {
    const order: Order = { destinationPort: 'beyrut', routeType: 'fortuna', intent: 'kervan' };
    expect(isOrderReachable(order, 'venedik', sampleRoutes)).toBe(false);
  });

  it('returns false for empty routes list', () => {
    const order: Order = { destinationPort: 'istanbul', routeType: 'fortuna', intent: 'kervan' };
    expect(isOrderReachable(order, 'venedik', [])).toBe(false);
  });
});

// ─── projectToSVG ───────────────────────────────────────────────────────────

describe('projectToSVG', () => {
  it('projects the western bound (lon=-1) to x near left padding', () => {
    const { x } = projectToSVG(38, -1);
    expect(x).toBe(40);
  });

  it('projects the eastern bound (lon=37) to x near right edge', () => {
    const { x } = projectToSVG(38, 37);
    expect(x).toBe(820); // VW - PADDING = 860 - 40
  });

  it('projects the northern bound (lat=46) to y near top padding', () => {
    const { y } = projectToSVG(46, 18);
    expect(y).toBe(40);
  });

  it('projects the southern bound (lat=30) to y near bottom edge', () => {
    const { y } = projectToSVG(30, 18);
    expect(y).toBe(480); // VH - PADDING = 520 - 40
  });

  it('returns integer pixel coordinates', () => {
    const { x, y } = projectToSVG(38, 15);
    expect(Number.isInteger(x)).toBe(true);
    expect(Number.isInteger(y)).toBe(true);
  });

  it('places a mid-Mediterranean point inside the viewport', () => {
    const { x, y } = projectToSVG(38, 18);
    expect(x).toBeGreaterThan(40);
    expect(x).toBeLessThan(820);
    expect(y).toBeGreaterThan(40);
    expect(y).toBeLessThan(480);
  });
});
