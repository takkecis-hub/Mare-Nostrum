import type { Route, Rumor } from '../../shared/src/types/index.js';

export function createRumor(action: string, currentPort: string): Rumor {
  return {
    id: `${action}-${Date.now()}`,
    aboutPlayerId: 'player-1',
    text:
      action === 'kara_bayrak'
        ? 'Kaptanın adı denizde kılıç kadar hızlı yayılıyor.'
        : action === 'duman'
          ? 'Bir gemi sessiz geçti; kim gördü, kim emin değil.'
          : 'Yeni bir seferin kokusu kahve dumanına karıştı.',
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
          .slice(0, 2)
          .forEach((route) => nextPorts.add(route.from === portId ? route.to : route.from));
      });

      return {
        ...rumor,
        age: rumor.age + 1,
        strength: Math.max(rumor.strength - 15, 0),
        currentPorts: Array.from(nextPorts),
      };
    })
    .filter((rumor) => rumor.strength > 0);
}
