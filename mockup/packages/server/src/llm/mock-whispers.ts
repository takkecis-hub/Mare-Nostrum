import whisperPoolJson from '../../../../data/whispers.json' with { type: 'json' };
import type { HiddenExperience } from '../../../shared/src/types/index.js';

const whisperPool = whisperPoolJson as Record<string, string[]>;

function dominantKey(experience: HiddenExperience) {
  const entries = Object.entries(experience).sort(
    ([, firstValue], [, secondValue]) => Number(secondValue) - Number(firstValue),
  );
  return entries[0]?.[0] ?? 'terazi';
}

export function getMockWhispers(portId: string, experience: HiddenExperience) {
  const whispers = whisperPool[portId as keyof typeof whisperPool] ?? whisperPool.default;
  const focus = dominantKey(experience);

  return whispers.map((line: string, index: number) => {
    if (index === 0) {
      return `${line} (${focus} hissin bunu daha net seçiyor.)`;
    }

    return line;
  });
}
