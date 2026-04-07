import type { HiddenExperience } from '../types/index.js';

export function getExperienceRatios(experience: HiddenExperience) {
  const total = Math.max(
    experience.meltem + experience.terazi + experience.murekkep + experience.simsar,
    1,
  );

  return {
    meltem: experience.meltem / total,
    terazi: experience.terazi / total,
    murekkep: experience.murekkep / total,
    simsar: experience.simsar / total,
  };
}

export function indicatorToDots(value: number) {
  const clamped = Math.max(1, Math.min(5, value));
  return '●'.repeat(clamped) + '○'.repeat(5 - clamped);
}
