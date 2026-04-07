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
