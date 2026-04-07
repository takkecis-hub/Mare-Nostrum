import whisperPoolJson from '../../../../data/whispers.json' with { type: 'json' };
import type { HiddenExperience } from '../../../shared/src/types/index.js';

const whisperPool = whisperPoolJson as Record<string, string[]>;

function getDominantExperienceKey(experience: HiddenExperience) {
  const entries = Object.entries(experience).sort(
    ([, valueA], [, valueB]) => Number(valueB) - Number(valueA),
  );
  return entries[0]?.[0] ?? 'terazi';
}

export function getMockWhispers(portId: string, experience: HiddenExperience) {
  const whispers = whisperPool[portId as keyof typeof whisperPool] ?? whisperPool.default;
  const focus = getDominantExperienceKey(experience);

  return whispers.map((line: string, index: number) => {
    if (index === 0) {
      return `${line} (${focus} hissin bunu daha net seçiyor.)`;
    }

    return line;
  });
}
