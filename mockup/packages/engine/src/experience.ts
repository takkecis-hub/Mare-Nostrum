import type { HiddenExperience, Intent } from '../../shared/src/types/index.js';
import { getExperienceRatios } from '../../shared/src/formulas/index.js';
import {
  RENOWN_WARNING_TURNS,
  RENOWN_LOSS_TURNS,
  RENOWN_CONTRADICTIONS,
  RENOWN_MIN_TOTAL_EXPERIENCE,
  RENOWN_THRESHOLDS,
} from '../../shared/src/constants/index.js';

export function applyExperienceGain(experience: HiddenExperience, intent: Intent) {
  const next = { ...experience };

  if (intent === 'kervan') next.terazi += 2;
  if (intent === 'kara_bayrak') next.meltem += 2;
  if (intent === 'pusula') next.murekkep += 2;
  if (intent === 'duman') next.simsar += 2;

  return next;
}

/** Map of renown titles to the intent that supports them. */
const RENOWN_SUPPORT_INTENTS: Record<string, Intent> = {
  'Altın Parmak': 'kervan',
  'Demir Pruva': 'kara_bayrak',
  'İpek Dil': 'pusula',
  'Hayalet Pala': 'duman',
  'Mühürlü Söz': 'pusula',
  Akrep: 'duman',
  'Açık El': 'kervan',
  'Deli Rüzgâr': 'kara_bayrak',
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

    // Contradictory actions accelerate decay: count as double the gap
    const contradictions = RENOWN_CONTRADICTIONS[title] ?? [];
    const effectiveGap = contradictions.includes(intent) ? gap + RENOWN_WARNING_TURNS : gap;

    if (effectiveGap >= RENOWN_LOSS_TURNS) {
      losses.push(title);
    } else if (effectiveGap >= RENOWN_WARNING_TURNS) {
      warnings.push(title);
    }
  }

  return { warnings, losses };
}

export function determineRenown(experience: HiddenExperience, activeRumorCount: number) {
  const total = experience.meltem + experience.terazi + experience.murekkep + experience.simsar;

  // Require a minimum investment before any title can be earned
  if (total < RENOWN_MIN_TOTAL_EXPERIENCE) return [];

  const ratios = getExperienceRatios(experience);
  const renown: string[] = [];

  if (ratios.terazi >= RENOWN_THRESHOLDS.altinParmak && activeRumorCount >= 1) renown.push('Altın Parmak');
  if (ratios.meltem >= RENOWN_THRESHOLDS.demirPruva && activeRumorCount >= 1) renown.push('Demir Pruva');
  if (ratios.murekkep >= RENOWN_THRESHOLDS.ipekDil) renown.push('İpek Dil');
  if (ratios.simsar >= RENOWN_THRESHOLDS.hayaletPala) renown.push('Hayalet Pala');
  if (ratios.murekkep >= RENOWN_THRESHOLDS.muhurluSoz && ratios.terazi >= 0.2) renown.push('Mühürlü Söz');
  if (ratios.simsar >= RENOWN_THRESHOLDS.akrep && activeRumorCount >= 2) renown.push('Akrep');
  if (ratios.terazi >= RENOWN_THRESHOLDS.acikEl && ratios.murekkep >= 0.2) renown.push('Açık El');
  if (ratios.meltem >= RENOWN_THRESHOLDS.deliRuzgar && ratios.simsar >= 0.2) renown.push('Deli Rüzgâr');

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
  if (renown.includes('Mühürlü Söz')) parts.push('Sözünüz liman meclislerinde mühür kadar ağır basıyor.');
  if (renown.includes('Akrep')) parts.push('Rakipleriniz sinsi darbelerinizden çekiniyor.');
  if (renown.includes('Açık El')) parts.push('Cömertliğiniz ve ticari vakarınız güven telkin ediyor.');
  if (renown.includes('Deli Rüzgâr')) parts.push('Fırtınayı kışkırtan kaptan diye anılıyor, cesaretinizle ün salıyorsunuz.');

  return parts.join(' ');
}
