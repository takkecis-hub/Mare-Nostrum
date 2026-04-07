import type { HiddenExperience, Intent } from '../../shared/src/types/index.js';
import { getExperienceRatios } from '../../shared/src/formulas/index.js';

export function applyExperienceGain(experience: HiddenExperience, intent: Intent) {
  const next = { ...experience };

  if (intent === 'kervan') next.terazi += 2;
  if (intent === 'kara_bayrak') next.meltem += 2;
  if (intent === 'pusula') next.murekkep += 1;
  if (intent === 'duman') next.simsar += 2;

  return next;
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
