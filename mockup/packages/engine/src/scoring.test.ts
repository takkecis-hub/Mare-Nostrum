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

describe('rumorSpreadWidth – additional cases', () => {
  it('single rumor at single port returns 1', () => {
    const rumors = [makeRumor('player-1', ['venedik'])];
    expect(rumorSpreadWidth(rumors, 'player-1')).toBe(1);
  });

  it('rumor with empty currentPorts array returns 0', () => {
    const rumors = [makeRumor('player-1', [])];
    expect(rumorSpreadWidth(rumors, 'player-1')).toBe(0);
  });

  it('multiple rumors for different players do not interfere', () => {
    const rumors = [
      makeRumor('player-1', ['venedik', 'istanbul']),
      makeRumor('player-2', ['girit', 'beyrut', 'tunus']),
      makeRumor('player-3', ['palermo']),
    ];
    expect(rumorSpreadWidth(rumors, 'player-1')).toBe(2);
    expect(rumorSpreadWidth(rumors, 'player-2')).toBe(3);
    expect(rumorSpreadWidth(rumors, 'player-3')).toBe(1);
  });
});

describe('calculateScore – combined scenarios', () => {
  it('large spread with many renown titles (10 ports + 3 titles = 65)', () => {
    const ports = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10'];
    const rumors = [makeRumor('player-1', ports)];
    const renown = ['Altın Parmak', 'Demir Pruva', 'İpek Dil'];
    // 10 * 2 + 3 * 15 = 20 + 45 = 65
    expect(calculateScore(rumors, 'player-1', renown)).toBe(65);
  });

  it('single rumor single port single renown = 2 + 15 = 17', () => {
    const rumors = [makeRumor('player-1', ['venedik'])];
    // 1 * 2 + 1 * 15 = 17
    expect(calculateScore(rumors, 'player-1', ['Altın Parmak'])).toBe(17);
  });
});

describe('isEfsane – boundary precision', () => {
  it('score=99 returns false', () => {
    expect(isEfsane(99)).toBe(false);
  });

  it('score=100 verified via calculateScore output returns true', () => {
    // 50 ports * 2 = 100 → exactly the threshold
    const ports = Array.from({ length: 50 }, (_, i) => `port-${i}`);
    const rumors = [makeRumor('player-1', ports)];
    const score = calculateScore(rumors, 'player-1', []);
    expect(score).toBe(100);
    expect(isEfsane(score)).toBe(true);
  });

  it('score=0 returns false', () => {
    expect(isEfsane(0)).toBe(false);
  });
});
