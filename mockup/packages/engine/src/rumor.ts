import type { Route, Rumor, RumorTemplateId } from '../../shared/src/types/index.js';
import {
  DEFAULT_PLAYER_ID,
  RUMOR_SPREAD_INITIAL_STRENGTH,
} from '../../shared/src/constants/index.js';

const MAX_RUMOR_SPREAD_PORTS = 2;

// Decay rate per sourceAction: memorable events linger, covert ones fade fast.
const RUMOR_DECAY: Record<string, number> = {
  kara_bayrak: 10,
  duman: 20,
  kervan: 15,
  pusula: 15,
};

function buildRumorText(action: string): string {
  switch (action) {
    case 'kara_bayrak':
      return 'Kaptanın adı denizde kılıç kadar hızlı yayılıyor. Limanlar ondan söz ediyor, tüccarlar yolunu değiştiriyor.';
    case 'duman':
      return 'Bir gemi sessiz geçti; kim gördü, kim emin değil. Kaçakçılık kokusu limanda hâlâ asılı.';
    case 'kervan':
      return 'Yeni bir seferin kokusu kahve dumanına karıştı. Kervan yolları bu isimle bereketleniyor.';
    case 'pusula':
      return 'Deniz haritaları el değiştiriyor, bilge bir rehberin izi sürülüyor. Pusula doğruyu gösteriyor derler.';
    default:
      return 'Limanlarda fısıltılar dolaşıyor; kimse tam olarak ne olduğunu bilmiyor.';
  }
}

function buildRumorId(parts: string[]): string {
  return parts.join('-').replaceAll(/\s+/g, '-').toLowerCase();
}

export function createRumor(action: string, currentPort: string, playerId = DEFAULT_PLAYER_ID, turnSeed = 0): Rumor {
  return {
    id: buildRumorId([action, currentPort, playerId, String(turnSeed)]),
    aboutPlayerId: playerId,
    text: buildRumorText(action),
    tone: action === 'kara_bayrak' ? 'olumsuz' : 'notr',
    currentPorts: [currentPort],
    strength: 100,
    age: 0,
    sourceAction: action,
  };
}

export function createPlayerRumor(input: {
  templateId: RumorTemplateId;
  sourcePortId: string;
  targetPortId: string;
  playerId?: string;
  turn: number;
}): Rumor {
  const { templateId, sourcePortId, targetPortId, playerId = DEFAULT_PLAYER_ID, turn } = input;
  const templates: Record<RumorTemplateId, { tone: Rumor['tone']; text: string }> = {
    gozdagi: {
      tone: 'olumsuz',
      text: `${targetPortId} üstüne kara yel çöktü derler; tüccarlar rotayı iki kez düşünüyor.`,
    },
    suclama: {
      tone: 'olumsuz',
      text: `${targetPortId} iskelesinde emanete sadakat kalmadığı fısıldanıyor.`,
    },
    karalama: {
      tone: 'olumsuz',
      text: `${targetPortId} kahvehanelerinde bozuk hesap ve kırık söz konuşuluyor.`,
    },
    ovgu: {
      tone: 'olumlu',
      text: `${targetPortId} çarşısında altının eli bol, sözü sağlam deniyor.`,
    },
    ifsa: {
      tone: 'olumsuz',
      text: `${targetPortId} çevresinde saklı ambarların yeri birilerine sızmış olabilir.`,
    },
    piyasa: {
      tone: 'notr',
      text: `${targetPortId} pazarında fiyatların yakında sert oynayacağı konuşuluyor.`,
    },
  };
  const template = templates[templateId];

  return {
    id: buildRumorId(['player-rumor', templateId, sourcePortId, targetPortId, playerId, String(turn)]),
    aboutPlayerId: playerId,
    text: template.text,
    tone: template.tone,
    currentPorts: [sourcePortId],
    strength: RUMOR_SPREAD_INITIAL_STRENGTH,
    age: 0,
    sourceAction: `rumor:${templateId}`,
  };
}

export function spreadRumors(rumors: Rumor[], routes: Route[]) {
  return rumors
    .map((rumor) => {
      const nextPorts = new Set(rumor.currentPorts);
      rumor.currentPorts.forEach((portId) => {
        routes
          .filter((route) => route.from === portId || route.to === portId)
          .slice(0, MAX_RUMOR_SPREAD_PORTS)
          .forEach((route) => nextPorts.add(route.from === portId ? route.to : route.from));
      });

      const decay = RUMOR_DECAY[rumor.sourceAction] ?? 15;

      return {
        ...rumor,
        age: rumor.age + 1,
        strength: Math.max(rumor.strength - decay, 0),
        currentPorts: Array.from(nextPorts),
      };
    })
    .filter((rumor) => rumor.strength > 0);
}
