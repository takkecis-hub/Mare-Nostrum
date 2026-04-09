import type { HiddenExperience, Intent } from '../../shared/src/types/index.js';
import { getExperienceRatios } from '../../shared/src/formulas/index.js';
import {
  RENOWN_WARNING_TURNS,
  RENOWN_LOSS_TURNS,
  RENOWN_CONTRADICTIONS,
} from '../../shared/src/constants/index.js';

export function applyExperienceGain(experience: HiddenExperience, intent: Intent) {
  const next = { ...experience };

  if (intent === 'kervan') next.terazi += 2;
  if (intent === 'kara_bayrak') next.meltem += 2;
  if (intent === 'pusula') next.murekkep += 1;
  if (intent === 'duman') next.simsar += 2;

  return next;
}

/** Map of renown titles to the intent that supports them. */
const RENOWN_SUPPORT_INTENTS: Record<string, Intent> = {
  'Altın Parmak': 'kervan',
  'Demir Pruva': 'kara_bayrak',
  'İpek Dil': 'pusula',
  'Hayalet Pala': 'duman',
};

/**
 * Update renownLastAction tracking when a player takes an action.
 * Returns a fresh record with updated turn numbers.
 */
export function updateRenownTracking(
  renown: string[],
  intent: Intent,
  currentTurn: number,
  previous: Partial<Record<string, number>> = {},
): Partial<Record<string, number>> {
  const next = { ...previous };

  for (const title of renown) {
    const supportIntent = RENOWN_SUPPORT_INTENTS[title];
    if (supportIntent === intent) {
      next[title] = currentTurn;
    }
    // Initialize tracking for newly gained titles
    if (next[title] === undefined) {
      next[title] = currentTurn;
    }
  }

  return next;
}

/**
 * Check which renown titles should be lost due to inactivity or contradictory actions.
 * Returns { warnings, losses } — titles approaching loss and titles that must be removed.
 */
export function checkRenownDecay(
  renown: string[],
  intent: Intent,
  currentTurn: number,
  renownLastAction: Partial<Record<string, number>>,
): { warnings: string[]; losses: string[] } {
  const warnings: string[] = [];
  const losses: string[] = [];

  for (const title of renown) {
    const lastAction = renownLastAction[title] ?? 0;
    const gap = currentTurn - lastAction;

    // Check for contradictory action
    const contradictions = RENOWN_CONTRADICTIONS[title] ?? [];
    if (contradictions.includes(intent)) {
      warnings.push(title);
      continue;
    }

    if (gap >= RENOWN_LOSS_TURNS) {
      losses.push(title);
    } else if (gap >= RENOWN_WARNING_TURNS) {
      warnings.push(title);
    }
  }

  return { warnings, losses };
}

export function determineRenown(experience: HiddenExperience, activeRumorCount: number) {
  const ratios = getExperienceRatios(experience);
  const renown: string[] = [];

  if (ratios.terazi >= 0.35 && activeRumorCount >= 1) renown.push('Altın Parmak');
  if (ratios.meltem >= 0.35 && activeRumorCount >= 1) renown.push('Demir Pruva');
  if (ratios.murekkep >= 0.35) renown.push('İpek Dil');
  if (ratios.simsar >= 0.3) renown.push('Hayalet Pala');

  return renown;
}

export function dominantExperienceLabel(experience: HiddenExperience) {
  const ratios = getExperienceRatios(experience);
  const entries = Object.entries(ratios).sort((left, right) => right[1] - left[1]);
  return entries[0]?.[0] ?? 'terazi';
}

/** Returns true if the given skill's ratio meets or exceeds minRatio. */
export function meetsExperienceThreshold(
  experience: HiddenExperience,
  skill: keyof HiddenExperience,
  minRatio: number,
): boolean {
  const ratios = getExperienceRatios(experience);
  return ratios[skill] >= minRatio;
}

/** Returns which skills are above the 25 % minimum threshold (gate open = true). */
export function getThresholdGates(experience: HiddenExperience): Record<keyof HiddenExperience, boolean> {
  const ratios = getExperienceRatios(experience);
  return {
    meltem: ratios.meltem >= 0.25,
    terazi: ratios.terazi >= 0.25,
    murekkep: ratios.murekkep >= 0.25,
    simsar: ratios.simsar >= 0.25,
  };
}

/** Returns a Turkish description that reflects the player's current renown labels. */
export function getRenownDescription(renown: string[]): string {
  if (renown.length === 0) return '';

  const parts: string[] = [];

  if (renown.includes('Altın Parmak')) parts.push('Ticaret yollarında sözü geçen bir tüccar olarak tanınıyorsunuz.');
  if (renown.includes('Demir Pruva')) parts.push('Deniz savaşlarında adınız korku ve saygıyla anılıyor.');
  if (renown.includes('İpek Dil')) parts.push('Diplomatik zekanız limanların dilinde dolaşıyor.');
  if (renown.includes('Hayalet Pala')) parts.push('Gölgelerde hareket eden bir kaçakçı olarak efsaneleşiyorsunuz.');

  return parts.join(' ');
}
