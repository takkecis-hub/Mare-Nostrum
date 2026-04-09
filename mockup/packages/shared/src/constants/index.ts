export const DEFAULT_PLAYER_ID = 'player-1';
export const DEFAULT_PLAYER_NAME = 'Kaptan Leyla';
export const GOOD_PURCHASE_COST = 40;
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

// --- LLM budget guardrails ---

/** Maximum LLM API calls allowed per game session. */
export const LLM_MAX_CALLS_PER_SESSION = 8;
/** LLM call timeout in milliseconds before falling back to static pool. */
export const LLM_TIMEOUT_MS = 5000;
/** Semantic cache TTL in turns (same context returns cached result within this window). */
export const LLM_CACHE_TTL_TURNS = 3;
/** Daily LLM spend ceiling in cents (e.g. 5000 = $50.00). */
export const LLM_DAILY_BUDGET_CENTS = 5000;

