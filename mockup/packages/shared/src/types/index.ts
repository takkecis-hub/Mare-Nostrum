export type Region = 'bati' | 'orta' | 'dogu' | 'guney';
export type GoodCategory = 'yemek' | 'luks' | 'savas';
export type PriceBand = 'ucuz' | 'normal' | 'pahali';
export type RouteType = 'tramontana' | 'kabotaj' | 'fortuna' | 'uzun_kabotaj';
export type Intent = 'kervan' | 'kara_bayrak' | 'pusula' | 'duman';
export type Tactic = 'pruva' | 'ates' | 'manevra' | 'kacis';
export type RumorTone = 'olumlu' | 'olumsuz' | 'notr';

export interface Port {
  id: string;
  name: string;
  displayName: string;
  region: Region;
  controller: string;
  produces: {
    good: string;
    category: GoodCategory;
    basePrice: PriceBand;
  };
  desires: {
    good: string;
    category: GoodCategory;
    basePrice: PriceBand;
  };
  special: string[];
  trivia: string[];
  x: number;
  y: number;
  lat?: number;
  lon?: number;
}

export interface Route {
  id: string;
  from: string;
  to: string;
  type: RouteType;
  isChokepoint: string | null;
  encounterChance: number;
  turnsRequired: number;
}

export interface Good {
  id: string;
  name: string;
  category: GoodCategory;
  originPort: string;
  priceIndicator: number;
}

export interface CargoItem {
  goodId: string;
  name: string;
  quantity: number;
  originPort: string;
  purchasePrice: number;
}

export interface HiddenExperience {
  meltem: number;
  terazi: number;
  murekkep: number;
  simsar: number;
}

export interface Rumor {
  id: string;
  aboutPlayerId: string;
  text: string;
  tone: RumorTone;
  currentPorts: string[];
  strength: number;
  age: number;
  sourceAction: string;
}

export interface Ship {
  type: 'feluka' | 'karaka' | 'kadirga';
  cargoCapacity: number;
  power: number;
  durability: number;
}

export interface PlayerState {
  id: string;
  name: string;
  gold: number;
  currentPortId: string;
  ship: Ship;
  cargo: CargoItem[];
  experience: HiddenExperience;
  renown: string[];
}

export interface Order {
  destinationPort: string;
  routeType: RouteType;
  intent: Intent;
}

export interface TurnLogEntry {
  label: string;
  detail: string;
}

export interface TurnResolution {
  nextState: GameState;
  log: TurnLogEntry[];
  whispers: string[];
  combat?: {
    result: 'kazandi' | 'kaybetti' | 'kacti';
    tactic: Tactic;
    enemyTactic: Tactic;
    playerPower: number;
    enemyPower: number;
  };
  trade?: {
    sold: string[];
    stars: number;
    goldDelta: number;
  };
}

export interface GameState {
  turn: number;
  season: 'yaz' | 'kis';
  player: PlayerState;
  activeRumors: Rumor[];
  lastWhispers: string[];
}

export interface BootstrapPayload {
  ports: Port[];
  routes: Route[];
  goods: Good[];
  gameState: GameState;
}
