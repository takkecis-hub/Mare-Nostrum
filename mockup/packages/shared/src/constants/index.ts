export const DEFAULT_PLAYER_ID = 'player-1';
export const DEFAULT_PLAYER_NAME = 'Kaptan Leyla';
export const GOOD_PURCHASE_COST = 40;

// --- Price bands (basePrice → gold cost) ---

/** Purchase cost for goods with basePrice 'ucuz'. */
export const PRICE_BAND_UCUZ = 30;
/** Purchase cost for goods with basePrice 'normal'. */
export const PRICE_BAND_NORMAL = 40;
/** Purchase cost for goods with basePrice 'pahali'. */
export const PRICE_BAND_PAHALI = 50;

/** Maps a PriceBand string to its gold cost. */
export const PRICE_BAND_MAP: Record<string, number> = {
  ucuz: PRICE_BAND_UCUZ,
  normal: PRICE_BAND_NORMAL,
  pahali: PRICE_BAND_PAHALI,
};

// --- Season economy modifiers ---

/** Sell-price multiplier for yemek goods in kış (winter demand). */
export const SEASON_YEMEK_BONUS_KIS = 1.3;
/** Sell-price multiplier for lüks goods in yaz (summer luxury demand). */
export const SEASON_LUKS_BONUS_YAZ = 1.2;
/** Sell-price multiplier for yemek goods in yaz (summer surplus). */
export const SEASON_YEMEK_MALUS_YAZ = 0.85;
/** Sell-price multiplier for lüks goods in kış (winter austerity). */
export const SEASON_LUKS_MALUS_KIS = 0.85;
export const REPAIR_COST_PER_POINT = 4;
export const TERSANE_DISCOUNT = 0.75;
export const EXPERIENCE_LABELS = {
  meltem: 'Meltem',
  terazi: 'Terazi',
  murekkep: 'Mürekkep',
  simsar: 'Simsar',
} as const;
export const RENOWN_THRESHOLDS = {
  altinParmak: 0.35,
  demirPruva: 0.35,
  ipekDil: 0.35,
  hayaletPala: 0.3,
  muhurluSoz: 0.3,
  akrep: 0.35,
  acikEl: 0.3,
  deliRuzgar: 0.3,
};

// --- Port saturation (economy balance) ---

/** Each delivery of a good to a port reduces the sell price by this fraction. */
export const SATURATION_PRICE_STEP = 0.15;
/** Sell price never drops below this fraction of its base. */
export const SATURATION_PRICE_FLOOR = 0.4;
/** Saturation decays by 1 count every N turns. */
export const SATURATION_DECAY_INTERVAL = 3;

// --- Combat ---

/** Minimum value for the combat die roll (d6). */
export const COMBAT_DICE_MIN = 1;
/** Maximum value for the combat die roll (d6). */
export const COMBAT_DICE_MAX = 6;
/** Upper cap on the Meltem experience bonus in combat. */
export const MELTEM_BONUS_CAP = 1.0;

/** Base gold lost on combat defeat. */
export const COMBAT_LOSS_GOLD = 30;
/** Base durability lost on combat defeat. */
export const COMBAT_LOSS_DURABILITY = 15;
/** Base gold gained on combat win (loot). */
export const COMBAT_LOOT_GOLD = 20;
/** Gold the player respawns with after shipwreck. */
export const SHIPWRECK_RESPAWN_GOLD = 50;

// --- Renown decay ---

/** Turns without a relevant action before a renown-loss warning fires. */
export const RENOWN_WARNING_TURNS = 5;
/** Turns without a relevant action before the renown title is removed. */
export const RENOWN_LOSS_TURNS = 8;

/** Map of renown titles to intents that contradict them. */
export const RENOWN_CONTRADICTIONS: Record<string, string[]> = {
  'Altın Parmak': ['kara_bayrak'],
  'Demir Pruva': ['duman'],
  'İpek Dil': ['kara_bayrak'],
  'Hayalet Pala': ['kervan'],
  'Mühürlü Söz': ['kara_bayrak'],
  Akrep: ['pusula'],
  'Açık El': ['duman'],
  'Deli Rüzgâr': ['kervan'],
};

// --- Renown gates ---

/**
 * Minimum total experience points before any renown title can be granted.
 * Prevents instant renown on turn 1 — at +2 per turn, a focused player
 * reaches this threshold in ~6 turns of consistent play.
 */
export const RENOWN_MIN_TOTAL_EXPERIENCE = 12;

// --- Kabotaj trade bonus ---

/**
 * Sell-price multiplier bonus for goods delivered via a kabotaj route.
 * Compensates for the 2-turn travel time with a better price, making kabotaj
 * a viable alternative to faster but riskier fortuna/tramontana routes.
 */
export const KABOTAJ_TRADE_BONUS = 1.25;

// --- Victory scoring ---

/** Points per port that carries an active rumor about the player. */
export const SCORE_RUMOR_SPREAD = 2;
/** Points per renown title held. */
export const SCORE_RENOWN = 15;
/** Points per unique port the player has visited. */
export const SCORE_PORT_VISITED = 3;
/** Score threshold to achieve Efsane (Legend) status in a 30-turn game. */
export const EFSANE_SCORE_THRESHOLD = 100;

// --- Bulk purchase discounts ---

/** Minimum quantity for the first discount tier. */
export const BULK_DISCOUNT_TIER1_MIN = 4;
/** Minimum quantity for the second discount tier. */
export const BULK_DISCOUNT_TIER2_MIN = 8;
/** Discount multiplier for tier 1 (4-7 units). */
export const BULK_DISCOUNT_TIER1 = 0.9;
/** Discount multiplier for tier 2 (8+ units). */
export const BULK_DISCOUNT_TIER2 = 0.8;

// --- Smuggling ---

/** Base detection probability for smuggling with low Simsar (40 %). */
export const SMUGGLING_DETECT_BASE = 0.4;
/** Minimum detection probability for smuggling with max Simsar (3 %). */
export const SMUGGLING_DETECT_FLOOR = 0.03;
/** Fine in gold when caught smuggling. */
export const SMUGGLING_FINE_GOLD = 200;
/** Number of turns locked out of the port after smuggling capture. */
export const SMUGGLING_LOCKOUT_TURNS = 2;

// --- City contracts ---

/** Default number of turns to deliver a city contract. */
export const CONTRACT_DEFAULT_TURNS = 30;
/** Sell-price bonus multiplier when fulfilling a city contract. */
export const CONTRACT_PRICE_BONUS = 1.3;
/** Gold penalty for breaking a city contract. */
export const CONTRACT_BREAK_PENALTY = 100;
/** Default quantity requested by a generated city contract. */
export const CONTRACT_DEFAULT_QUANTITY = 2;
/** Gold reward baseline for a generated city contract. */
export const CONTRACT_DEFAULT_REWARD = 90;

// --- First arrival bonus ---

/** Sell-price bonus multiplier for the first delivery of a good to a port in a turn. */
export const FIRST_ARRIVAL_BONUS = 1.15;
/** Gold paid for a successful Pusula discovery. */
export const PUSULA_DISCOVERY_GOLD = 15;
/** Multiplier when the player discovers a port for the first time. */
export const PUSULA_FIRST_VISIT_MULTIPLIER = 2;

// --- Price visibility ---

/** Terazi ratio threshold for seeing local market hunger levels. */
export const PRICE_VISIBILITY_LOCAL = 0.2;
/** Terazi ratio threshold for seeing connected port hunger levels. */
export const PRICE_VISIBILITY_NETWORK = 0.35;
/** Terazi ratio threshold for full market map (1-turn delayed). */
export const PRICE_VISIBILITY_FULL = 0.5;

// --- Active rumors ---

/** Gold cost to actively spread a rumor from the kahvehane. */
export const RUMOR_SPREAD_COST = 25;
/** Maximum player-initiated rumors counted in the anti-spam window before backlash. */
export const RUMOR_SPREAD_SPAM_THRESHOLD = 3;
/** Number of turns tracked for rumor-spam backlash. */
export const RUMOR_SPREAD_SPAM_WINDOW = 5;
/** Starting strength for player-initiated rumors. */
export const RUMOR_SPREAD_INITIAL_STRENGTH = 90;

// --- Conflict spectrum ---

/** Base success probability for debunking a rumor (Ateşe Su). */
export const DEBUNK_BASE_SUCCESS = 0.3;
/** Maximum success probability for debunking (high Mürekkep). */
export const DEBUNK_MAX_SUCCESS = 0.85;
/** Base success probability for tracing a rumor source (İzi Sürmek). */
export const TRACE_BASE_SUCCESS = 0.2;
/** Maximum success probability for tracing (high Simsar). */
export const TRACE_MAX_SUCCESS = 0.8;
/** Counter-rumor backfire probability when experience is low. */
export const COUNTER_RUMOR_BACKFIRE = 0.25;

// --- Economic warfare (Kuşatma) ---

/** Saturation increase when a player performs stock monopoly (Stok Ablukası). */
export const KUSATMA_STOCK_SATURATION = 3;
/** Price reduction multiplier from price sabotage (Fiyat Sabotajı). */
export const KUSATMA_PRICE_SABOTAGE = 0.7;
/** Turns that route scare (Rota Korkutması) increases encounter chance. */
export const KUSATMA_ROUTE_SCARE_TURNS = 3;
/** Encounter chance increase from route scare. */
export const KUSATMA_ROUTE_SCARE_BONUS = 0.25;

// --- Escape mechanic ---

/** Base escape success probability. */
export const ESCAPE_BASE_SUCCESS = 0.3;
/** Feluka escape bonus (fast ship). */
export const ESCAPE_FELUKA_BONUS = 0.25;
/** Kadirga escape penalty (slow ship). */
export const ESCAPE_KADIRGA_PENALTY = -0.15;
/** Attacker bonus when escape attempt fails. */
export const ESCAPE_FAIL_ATTACKER_BONUS = 1;

// --- Tactic-specific loot ---

/** Cargo capture rate for pruva (boarding) wins. */
export const LOOT_PRUVA_CARGO_RATE = 1.0;
/** Cargo capture rate for ates (ranged) wins. */
export const LOOT_ATES_CARGO_RATE = 0.7;
/** Manevra wins grant intelligence instead of cargo. */
export const LOOT_MANEVRA_INTEL = true;

// --- Quest system ---

/** Number of stages in each origin quest chain. */
export const QUEST_STAGES = 5;
/** Number of turns per quest stage. */
export const QUEST_STAGE_TURNS = 5;

// --- LLM budget guardrails ---

/** Maximum LLM API calls allowed per game session. */
export const LLM_MAX_CALLS_PER_SESSION = 8;
/** LLM call timeout in milliseconds before falling back to static pool. */
export const LLM_TIMEOUT_MS = 5000;
/** Semantic cache TTL in turns (same context returns cached result within this window). */
export const LLM_CACHE_TTL_TURNS = 3;
/** Daily LLM spend ceiling in cents (e.g. 5000 = $50.00). */
export const LLM_DAILY_BUDGET_CENTS = 5000;

// --- Data grounding ---

/** Minimum encounter chance treated as "elevated" for chokepoint routes. */
export const CHOKEPOINT_ELEVATED_ENCOUNTER_CHANCE = 0.35;
/** Minimum size of each static whisper bank; runtime still selects only 3 lines. */
export const STATIC_WHISPER_POOL_MIN_LINES = 10;
/**
 * Required fallback whisper categories.
 * Social lines are optional because runtime always prioritizes economy/security/politics,
 * and only uses social when the experience focus calls for it.
 */
export const REQUIRED_WHISPER_CATEGORIES = ['economy', 'security', 'politics'] as const;
/** Minimum trivia entries expected per port in the static trivia catalog. */
export const STATIC_TRIVIA_MIN_LINES = 3;
/** Canonical design authority path for grounding validation. */
export const DESIGN_AUTHORITY_PATH = 'mare_nostrum_master_v3.md';
