import { describe, expect, it } from 'vitest';
import type { Rumor } from '../../shared/src/types/index.js';
import { rumorSpreadWidth, calculateScore, isEfsane } from './scoring.js';

function makeRumor(aboutPlayerId: string, ports: string[]): Rumor {
  return {
    id: 'test-rumor',
    aboutPlayerId,
    text: 'Test rumor',
    tone: 'notr',
    currentPorts: ports,
    strength: 80,
    age: 1,
    sourceAction: 'kervan',
  };
}

describe('rumorSpreadWidth', () => {
  it('returns 0 when no rumors about the player', () => {
    expect(rumorSpreadWidth([], 'player-1')).toBe(0);
  });

  it('counts unique ports across all rumors about the player', () => {
    const rumors = [
      makeRumor('player-1', ['venedik', 'istanbul']),
      makeRumor('player-1', ['istanbul', 'girit']),
    ];
    // unique ports: venedik, istanbul, girit = 3
    expect(rumorSpreadWidth(rumors, 'player-1')).toBe(3);
  });

  it('ignores rumors about other players', () => {
    const rumors = [
      makeRumor('player-1', ['venedik']),
      makeRumor('player-2', ['istanbul', 'girit', 'beyrut']),
    ];
    expect(rumorSpreadWidth(rumors, 'player-1')).toBe(1);
  });
});

describe('calculateScore', () => {
  it('returns 0 with no rumors and no renown', () => {
    expect(calculateScore([], 'player-1', [])).toBe(0);
  });

  it('scores rumor spread at 2 points per port', () => {
    const rumors = [makeRumor('player-1', ['venedik', 'istanbul', 'girit'])];
    // spread = 3, renown = 0 → score = 3 * 2 = 6
    expect(calculateScore(rumors, 'player-1', [])).toBe(6);
  });

  it('scores renown at 15 points per title', () => {
    // no rumors, 2 renown titles → 0 + 2*15 = 30
    expect(calculateScore([], 'player-1', ['Altın Parmak', 'Demir Pruva'])).toBe(30);
  });

  it('combines rumor and renown scores', () => {
    const rumors = [makeRumor('player-1', ['venedik', 'istanbul'])];
    // spread = 2, renown = 1 → 2*2 + 1*15 = 19
    expect(calculateScore(rumors, 'player-1', ['İpek Dil'])).toBe(19);
  });
});

describe('isEfsane', () => {
  it('returns true when score >= 100', () => {
    expect(isEfsane(100)).toBe(true);
    expect(isEfsane(150)).toBe(true);
  });

  it('returns false when score < 100', () => {
    expect(isEfsane(99)).toBe(false);
    expect(isEfsane(0)).toBe(false);
  });
});
