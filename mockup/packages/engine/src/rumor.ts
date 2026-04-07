import type { Route, Rumor } from '../../shared/src/types/index.js';
import { DEFAULT_PLAYER_ID } from '../../shared/src/constants/index.js';

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

export function createRumor(action: string, currentPort: string, playerId = DEFAULT_PLAYER_ID): Rumor {
  return {
    id: `${action}-${Date.now()}`,
    aboutPlayerId: playerId,
    text: buildRumorText(action),
    tone: action === 'kara_bayrak' ? 'olumsuz' : 'notr',
    currentPorts: [currentPort],
    strength: 100,
    age: 0,
    sourceAction: action,
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
