export type Region = 'bati' | 'orta' | 'dogu' | 'guney';
export type GoodCategory = 'yemek' | 'luks' | 'savas';
export type PriceBand = 'ucuz' | 'normal' | 'pahali';
export type RouteType = 'tramontana' | 'kabotaj' | 'fortuna' | 'uzun_kabotaj';
export type Intent = 'kervan' | 'kara_bayrak' | 'pusula' | 'duman';
export type Tactic = 'pruva' | 'ates' | 'manevra' | 'kacis';
export type RumorTone = 'olumlu' | 'olumsuz' | 'notr';
export type WhisperCategory = 'economy' | 'security' | 'politics' | 'social';
export type RumorTemplateId = 'gozdagi' | 'suclama' | 'karalama' | 'ovgu' | 'ifsa' | 'piyasa';
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
  produces: PortTradeSlot;
  desires: PortTradeSlot;
  bonusProduces?: PortTradeSlot[];
  bonusDesires?: PortTradeSlot[];
  special: string[];
  trivia: string[];
  x: number;
  y: number;
  lat?: number;
  lon?: number;
}

export interface PortTradeSlot {
  good: string;
  category: GoodCategory;
  basePrice: PriceBand;
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
  /** Unique ports the player has visited so far. */
  visitedPortIds?: string[];
  /** Recent turns when the player actively spread a rumor. */
  rumorSpreadTurns?: number[];
  /** Active personal quest progress. */
  questState?: QuestState;
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
  exploration?: {
    trivia?: string;
    goldBonus: number;
    intel?: string[];
    stealthSuccess?: boolean;
  };
  rumor?: {
    text: string;
    counterRumorTriggered: boolean;
  };
  contracts?: {
    fulfilled: string[];
    expired: string[];
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
  /** Derived market-visibility tier from Terazi experience. */
  priceVisibility?: PriceVisibilityTier;
  /** Standing city contracts available in the current game. */
  cityContracts?: CityContract[];
}

export interface BootstrapPayload {
  ports: Port[];
  routes: Route[];
  goods: Good[];
  gameState: GameState;
}

// --- Kaçakçılık (Smuggling) ---

export interface SmuggleResult {
  detected: boolean;
  fineGold: number;
  goodsConfiscated: CargoItem[];
  lockoutTurns: number;
}

// --- Şehir Kontratları (City Contracts) ---

export interface CityContract {
  id: string;
  portId: string;
  goodId: string;
  quantity: number;
  rewardGold: number;
  deadlineTurn: number;
  breakPenalty: number;
  accepted: boolean;
  completed: boolean;
}

// --- Fiyat Görünürlüğü (Price Visibility) ---

export type PriceVisibilityTier = 'none' | 'local' | 'network' | 'full';

// --- Çatışma Spektrumu (Conflict Spectrum) ---

export type RumorDefenseAction = 'atese_su' | 'izi_surmek' | 'karsi_soylenti';

export interface RumorDefenseResult {
  action: RumorDefenseAction;
  success: boolean;
  /** The rumor that was targeted. */
  targetRumorId: string;
  /** If izi_surmek succeeded, the original player who created the rumor. */
  tracedPlayerId?: string;
  /** If karsi_soylenti backfired, the counter-rumor hurt the defender. */
  backfired?: boolean;
}

// --- Kuşatma (Economic Warfare) ---

export type KusatmaAction = 'stok_ablukasi' | 'fiyat_sabotaji' | 'bilgi_blokaji' | 'rota_korkutmasi';

export interface KusatmaResult {
  action: KusatmaAction;
  targetPortId: string;
  /** For stok_ablukasi: saturation increase applied. */
  saturationDelta?: number;
  /** For fiyat_sabotaji: price multiplier applied. */
  priceMultiplier?: number;
  /** For rota_korkutmasi: turns of increased encounter chance. */
  scareTurns?: number;
  /** For bilgi_blokaji: target port's visibility blocked. */
  blocked?: boolean;
}

// --- Kaçış Mekaniği (Escape Mechanic) ---

export interface EscapeResult {
  escaped: boolean;
  /** Bonus granted to attacker if escape failed. */
  attackerBonus: number;
}

// --- Görev Sistemi (Quest System) ---

export type QuestId = 'kayip_hazine' | 'babanin_serefi' | 'intikam' | 'saf_merak';

export interface QuestStage {
  stage: number;
  title: string;
  description: string;
  /** Turn range when this stage is available. */
  turnRange: [number, number];
  /** Port(s) where this stage can be triggered. */
  triggerPorts: string[];
  /** Conditions that must be met (e.g. cargo, gold, renown). */
  conditions?: Record<string, unknown>;
}

export interface QuestState {
  questId: QuestId;
  currentStage: number;
  completed: boolean;
  stageFlags: Record<string, boolean>;
  /** Evidence or items collected during the quest. */
  evidence: string[];
}

export interface QuestChain {
  id: QuestId;
  name: string;
  description: string;
  stages: QuestStage[];
}
