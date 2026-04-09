import whisperPoolJson from '../../../../data/whispers.json' with { type: 'json' };
import { parseWhisperPool } from '../../../shared/src/validators/index.js';
import type { HiddenExperience, WhisperCategory, WhisperLine, WhisperPool } from '../../../shared/src/types/index.js';

const whisperPool = parseWhisperPool(whisperPoolJson);
const FOCUS_CATEGORY: Record<keyof HiddenExperience, WhisperCategory> = {
  meltem: 'security',
  terazi: 'economy',
  murekkep: 'politics',
  simsar: 'social',
};

function getDominantExperienceKey(experience: HiddenExperience) {
  const entries = Object.entries(experience).sort(
    ([, valueA], [, valueB]) => Number(valueB) - Number(valueA),
  );
  return entries[0]?.[0] ?? 'terazi';
}

function hashSeed(seed: string) {
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function pickWhisperText(lines: WhisperLine[], category: WhisperCategory, seed: string) {
  const pool = lines.filter((line) => line.category === category);
  const candidates =
    pool.length > 0 ? pool : category === 'social' ? lines : [];
  if (candidates.length === 0) {
    return undefined;
  }
  return candidates[hashSeed(seed) % candidates.length]?.text;
}

function pickCategories(focus: keyof HiddenExperience): WhisperCategory[] {
  const preferred = FOCUS_CATEGORY[focus];
  const ordered: WhisperCategory[] = [preferred, 'economy', 'security', 'politics', 'social'];
  return [...new Set(ordered)].slice(0, 3);
}

export function getMockWhispers(portId: string, experience: HiddenExperience) {
  const focus = getDominantExperienceKey(experience) as keyof HiddenExperience;
  const pool: WhisperLine[] = (whisperPool[portId as keyof WhisperPool] ?? whisperPool.default) as WhisperLine[];
  const selected = pickCategories(focus).map((category) =>
    pickWhisperText(pool, category, `${portId}:${focus}:${category}`),
  );

  return selected
    .filter((line): line is string => typeof line === 'string')
    .map((line, index) => (index === 0 ? `${line} (${focus} hissin burada daha keskin.)` : line));
}
