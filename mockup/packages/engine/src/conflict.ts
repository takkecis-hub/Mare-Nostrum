import type {
  HiddenExperience,
  Rumor,
  Route,
  RumorDefenseAction,
  RumorDefenseResult,
  KusatmaAction,
  KusatmaResult,
  EscapeResult,
  Ship,
} from '../../shared/src/types/index.js';
import {
  DEBUNK_BASE_SUCCESS,
  DEBUNK_MAX_SUCCESS,
  TRACE_BASE_SUCCESS,
  TRACE_MAX_SUCCESS,
  COUNTER_RUMOR_BACKFIRE,
  KUSATMA_STOCK_SATURATION,
  KUSATMA_PRICE_SABOTAGE,
  KUSATMA_ROUTE_SCARE_TURNS,
  KUSATMA_ROUTE_SCARE_BONUS,
  ESCAPE_BASE_SUCCESS,
  ESCAPE_FELUKA_BONUS,
  ESCAPE_KADIRGA_PENALTY,
  ESCAPE_FAIL_ATTACKER_BONUS,
} from '../../shared/src/constants/index.js';
import { getExperienceRatios } from '../../shared/src/formulas/index.js';

// ─────────────────────────────────────────────────────────────
// Rumor Defense System
// ─────────────────────────────────────────────────────────────

/**
 * Ateşe Su (Debunk): Attempt to disprove a rumor.
 * Success rate scales with Mürekkep experience ratio.
 */
export function debunkSuccessRate(experience: HiddenExperience): number {
  const ratios = getExperienceRatios(experience);
  const range = DEBUNK_MAX_SUCCESS - DEBUNK_BASE_SUCCESS;
  return Math.min(DEBUNK_MAX_SUCCESS, DEBUNK_BASE_SUCCESS + ratios.murekkep * range * 2);
}

/**
 * İzi Sürmek (Trace Source): Attempt to trace who started a rumor.
 * Success rate scales with Simsar experience ratio.
 */
export function traceSuccessRate(experience: HiddenExperience): number {
  const ratios = getExperienceRatios(experience);
  const range = TRACE_MAX_SUCCESS - TRACE_BASE_SUCCESS;
  return Math.min(TRACE_MAX_SUCCESS, TRACE_BASE_SUCCESS + ratios.simsar * range * 2);
}

/**
 * Karşı Söylenti (Counter-Rumor): Attempt to spread a counter-rumor.
 * Can backfire if Mürekkep is low.
 */
export function counterRumorBackfireRate(experience: HiddenExperience): number {
  const ratios = getExperienceRatios(experience);
  // Low murekkep → high backfire. murekkep ≥ 0.35 → backfire goes to 0.
  return Math.max(0, COUNTER_RUMOR_BACKFIRE * (1 - ratios.murekkep / 0.35));
}

/**
 * Execute a rumor defense action.
 */
export function executeRumorDefense(
  action: RumorDefenseAction,
  targetRumor: Rumor,
  experience: HiddenExperience,
  rng: () => number = Math.random,
): RumorDefenseResult {
  if (action === 'atese_su') {
    const successRate = debunkSuccessRate(experience);
    const success = rng() < successRate;
    return {
      action,
      success,
      targetRumorId: targetRumor.id,
    };
  }

  if (action === 'izi_surmek') {
    const successRate = traceSuccessRate(experience);
    const success = rng() < successRate;
    return {
      action,
      success,
      targetRumorId: targetRumor.id,
      tracedPlayerId: success ? targetRumor.aboutPlayerId : undefined,
    };
  }

  // karsi_soylenti
  const backfireRate = counterRumorBackfireRate(experience);
  const backfired = rng() < backfireRate;
  return {
    action,
    success: !backfired,
    targetRumorId: targetRumor.id,
    backfired,
  };
}

/**
 * Apply the effects of a successful rumor defense.
 * - Debunk: reduce rumor strength to 0 (kill it).
 * - Trace: no state change (info only).
 * - Counter-rumor success: reduce rumor strength by 50.
 * - Counter-rumor backfire: increase rumor strength by 30.
 */
export function applyRumorDefenseEffect(
  rumors: Rumor[],
  result: RumorDefenseResult,
): Rumor[] {
  return rumors.map((rumor) => {
    if (rumor.id !== result.targetRumorId) return rumor;

    if (result.action === 'atese_su' && result.success) {
      return { ...rumor, strength: 0 };
    }

    if (result.action === 'karsi_soylenti') {
      if (result.backfired) {
        return { ...rumor, strength: Math.min(100, rumor.strength + 30) };
      }
      if (result.success) {
        return { ...rumor, strength: Math.max(0, rumor.strength - 50) };
      }
    }

    return rumor;
  }).filter((rumor) => rumor.strength > 0);
}

// ─────────────────────────────────────────────────────────────
// Economic Warfare (Kuşatma)
// ─────────────────────────────────────────────────────────────

/**
 * Execute an economic warfare (Kuşatma) action against a target port.
 */
export function executeKusatma(
  action: KusatmaAction,
  targetPortId: string,
): KusatmaResult {
  switch (action) {
    case 'stok_ablukasi':
      return {
        action,
        targetPortId,
        saturationDelta: KUSATMA_STOCK_SATURATION,
      };
    case 'fiyat_sabotaji':
      return {
        action,
        targetPortId,
        priceMultiplier: KUSATMA_PRICE_SABOTAGE,
      };
    case 'rota_korkutmasi':
      return {
        action,
        targetPortId,
        scareTurns: KUSATMA_ROUTE_SCARE_TURNS,
      };
    case 'bilgi_blokaji':
      return {
        action,
        targetPortId,
        blocked: true,
      };
  }
}

/**
 * Apply stock monopoly (Stok Ablukası) to port saturation.
 * Floods the port with goods to crash prices for a target good.
 */
export function applyStockMonopoly(
  saturation: Record<string, number>,
  targetPortId: string,
  targetGoodId: string,
): Record<string, number> {
  const key = `${targetPortId}:${targetGoodId}`;
  return {
    ...saturation,
    [key]: (saturation[key] ?? 0) + KUSATMA_STOCK_SATURATION,
  };
}

/**
 * Apply route scare (Rota Korkutması) to a route.
 * Increases the encounter chance on routes to/from the target port.
 */
export function applyRouteScare(
  routes: Route[],
  targetPortId: string,
): Route[] {
  return routes.map((route) => {
    if (route.from === targetPortId || route.to === targetPortId) {
      return {
        ...route,
        encounterChance: Math.min(1, route.encounterChance + KUSATMA_ROUTE_SCARE_BONUS),
      };
    }
    return route;
  });
}

// ─────────────────────────────────────────────────────────────
// Escape Mechanic
// ─────────────────────────────────────────────────────────────

/**
 * Calculate escape success probability based on ship type and Meltem experience.
 */
export function escapeSuccessRate(
  ship: Ship,
  experience: HiddenExperience,
): number {
  const ratios = getExperienceRatios(experience);
  let prob = ESCAPE_BASE_SUCCESS;

  // Ship speed bonus/penalty
  if (ship.type === 'feluka') prob += ESCAPE_FELUKA_BONUS;
  if (ship.type === 'kadirga') prob += ESCAPE_KADIRGA_PENALTY;

  // Meltem bonus (cap contribution at 0.2)
  prob += Math.min(0.2, ratios.meltem * 0.4);

  return Math.max(0, Math.min(1, prob));
}

/**
 * Attempt to escape combat. Returns success and attacker bonus if failed.
 */
export function attemptEscape(
  ship: Ship,
  experience: HiddenExperience,
  rng: () => number = Math.random,
): EscapeResult {
  const successRate = escapeSuccessRate(ship, experience);
  const escaped = rng() < successRate;

  return {
    escaped,
    attackerBonus: escaped ? 0 : ESCAPE_FAIL_ATTACKER_BONUS,
  };
}
