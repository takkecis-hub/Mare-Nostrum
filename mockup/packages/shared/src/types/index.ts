export type Region = 'bati' | 'orta' | 'dogu' | 'guney';
export type GoodCategory = 'yemek' | 'luks' | 'savas';
export type PriceBand = 'ucuz' | 'normal' | 'pahali';
export type RouteType = 'tramontana' | 'kabotaj' | 'fortuna' | 'uzun_kabotaj';
export type Intent = 'kervan' | 'kara_bayrak' | 'pusula' | 'duman';
export type Tactic = 'pruva' | 'ates' | 'manevra' | 'kacis';
export type RumorTone = 'olumlu' | 'olumsuz' | 'notr';
export type WhisperCategory = 'economy' | 'security' | 'politics' | 'social';
export type GroundingCategory =
  | 'factual_world_data'
  | 'derived_game_data'
  | 'narrative_flavor'
  | 'implementation_logic'
  | 'documentation';
export type GroundingRisk = 'high' | 'medium' | 'low';
export type GroundingAuthority = 'design' | 'implementation' | 'secondary';
export type ProvenanceSourceType =
  | 'design_doc'
  | 'implementation_data'
  | 'derived_from_game_data'
  | 'manual_audit';
export type ProvenanceConfidence = 'high' | 'medium' | 'low';
export type ProvenanceDisposition = 'exact' | 'inferred' | 'fictionalized' | 'pending_verification';

export interface WhisperLine {
  id: string;
  category: WhisperCategory;
  text: string;
  provenanceRef: string;
}

export interface TriviaEntry {
  id: string;
  portId: string;
  text: string;
  provenanceRef: string;
}

export type PortGeoMap = Record<string, { lat: number; lon: number }>;
export type WhisperPool = Record<string, WhisperLine[]>;
export type TriviaCatalog = Record<string, TriviaEntry[]>;

export interface GroundingHierarchyEntry {
  tier: number;
  path: string;
  role: string;
}

export interface GroundingManifestFileEntry {
  path: string;
  category: GroundingCategory;
  risk: GroundingRisk;
  authority: GroundingAuthority;
  notes: string;
}

export interface GroundingManifest {
  schemaVersion: number;
  sourceHierarchy: GroundingHierarchyEntry[];
  fileDeclarations: GroundingManifestFileEntry[];
}

export interface ProvenanceSource {
  type: ProvenanceSourceType;
  title: string;
  locator: string;
  periodCovered: string;
  confidence: ProvenanceConfidence;
  disposition: ProvenanceDisposition;
}

export interface ProvenanceRecord {
  id: string;
  subjectPath: string;
  category: GroundingCategory;
  summary: string;
  sources: ProvenanceSource[];
  notes: string;
}

export interface ProvenanceCatalog {
  schemaVersion: number;
  records: Record<string, ProvenanceRecord>;
}

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
  /** Turn number when each renown title was last supported by a relevant action. */
  renownLastAction?: Partial<Record<string, number>>;
  /** 'at_port' when docked, 'in_transit' when travelling multi-turn routes. */
  transitStatus?: 'at_port' | 'in_transit';
  /** Turns remaining before arriving at destination (0 or undefined = arrived). */
  transitTurnsRemaining?: number;
  /** Port the player is travelling toward while in transit. */
  transitDestination?: string;
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

export interface CombatResult {
  result: 'kazandi' | 'kaybetti' | 'kacti';
  tactic: Tactic;
  enemyTactic: Tactic;
  playerPower: number;
  enemyPower: number;
  /** Gold looted on win, or gold lost on defeat. */
  goldDelta: number;
  /** Durability change (negative on defeat). */
  durabilityDelta: number;
  /** True when durability reached 0 — player is shipwrecked. */
  shipwrecked: boolean;
  /** True when the winning tactic was Manevra counter — grants intel bonus. */
  manevraIntel: boolean;
}

export interface TurnResolution {
  nextState: GameState;
  log: TurnLogEntry[];
  whispers: string[];
  combat?: CombatResult;
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
  /** Tracks how many times each good has been sold at each port: "portId:goodId" → count. */
  portSaturation?: Record<string, number>;
}

export interface BootstrapPayload {
  ports: Port[];
  routes: Route[];
  goods: Good[];
  gameState: GameState;
}
