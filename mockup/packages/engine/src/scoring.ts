import type { Rumor } from '../../shared/src/types/index.js';
import {
  SCORE_RUMOR_SPREAD,
  SCORE_RENOWN,
  SCORE_PORT_VISITED,
  EFSANE_SCORE_THRESHOLD,
} from '../../shared/src/constants/index.js';

/**
 * Calculate the total spread width of all rumors about a given player.
 * Spread width = sum of unique ports across all active rumors about the player.
 */
export function rumorSpreadWidth(rumors: Rumor[], playerId: string): number {
  const ports = new Set<string>();
  for (const rumor of rumors) {
    if (rumor.aboutPlayerId === playerId) {
      for (const port of rumor.currentPorts) {
        ports.add(port);
      }
    }
  }
  return ports.size;
}

/**
 * Calculate the player's victory score.
 *
 * SCORE = (rumorSpread × SCORE_RUMOR_SPREAD)
 *       + (renownCount × SCORE_RENOWN)
 *       + (portsVisitedCount × SCORE_PORT_VISITED)
 */
export function calculateScore(
  rumors: Rumor[],
  playerId: string,
  renown: string[],
  portsVisited: string[] = [],
): number {
  const spread = rumorSpreadWidth(rumors, playerId);
  return (
    spread * SCORE_RUMOR_SPREAD +
    renown.length * SCORE_RENOWN +
    portsVisited.length * SCORE_PORT_VISITED
  );
}

/** Returns true when the player has reached the Efsane (Legend) threshold. */
export function isEfsane(score: number): boolean {
  return score >= EFSANE_SCORE_THRESHOLD;
}
