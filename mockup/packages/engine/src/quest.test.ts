import { describe, expect, it } from 'vitest';
import type { PlayerState } from '../../shared/src/types/index.js';
import {
  QUEST_CHAINS,
  createQuestState,
  checkQuestTrigger,
  advanceQuest,
  getCurrentStageInfo,
  getQuestWhisper,
} from './quest.js';

const basePlayer: PlayerState = {
  id: 'player-1',
  name: 'Kaptan Leyla',
  gold: 200,
  currentPortId: 'venedik',
  ship: { type: 'karaka', cargoCapacity: 4, power: 3, durability: 100 },
  cargo: [],
  experience: { meltem: 5, terazi: 5, murekkep: 5, simsar: 5 },
  renown: [],
};

// ─────────────────────────────────────────────────────────────
// Quest Chain Definitions
// ─────────────────────────────────────────────────────────────

describe('QUEST_CHAINS', () => {
  it('defines 4 quest chains', () => {
    expect(Object.keys(QUEST_CHAINS)).toHaveLength(4);
  });

  it('each quest has 5 stages', () => {
    for (const chain of Object.values(QUEST_CHAINS)) {
      expect(chain.stages).toHaveLength(5);
    }
  });

  it('stages have sequential numbers 1-5', () => {
    for (const chain of Object.values(QUEST_CHAINS)) {
      chain.stages.forEach((stage, idx) => {
        expect(stage.stage).toBe(idx + 1);
      });
    }
  });

  it('each stage has valid turn range', () => {
    for (const chain of Object.values(QUEST_CHAINS)) {
      for (const stage of chain.stages) {
        expect(stage.turnRange[0]).toBeLessThanOrEqual(stage.turnRange[1]);
        expect(stage.turnRange[0]).toBeGreaterThan(0);
      }
    }
  });

  it('each stage has at least one trigger port', () => {
    for (const chain of Object.values(QUEST_CHAINS)) {
      for (const stage of chain.stages) {
        expect(stage.triggerPorts.length).toBeGreaterThan(0);
      }
    }
  });

  it('kayip_hazine is properly defined', () => {
    const chain = QUEST_CHAINS.kayip_hazine;
    expect(chain.name).toBe('Kayıp Hazine');
    expect(chain.stages[0].title).toBe('Fısıltı');
    expect(chain.stages[4].title).toBe('Hazineyle Ne Yaparsın?');
  });

  it('babanin_serefi is properly defined', () => {
    const chain = QUEST_CHAINS.babanin_serefi;
    expect(chain.name).toBe("Baba'nın Şerefi");
    expect(chain.stages[0].title).toBe('Hayalet');
  });

  it('intikam is properly defined', () => {
    const chain = QUEST_CHAINS.intikam;
    expect(chain.name).toBe('İntikam');
    expect(chain.stages[0].title).toBe('Yara İzi');
  });

  it('saf_merak is properly defined', () => {
    const chain = QUEST_CHAINS.saf_merak;
    expect(chain.name).toBe('Saf Merak');
    expect(chain.stages[0].title).toBe('Merak Kıvılcımı');
  });
});

// ─────────────────────────────────────────────────────────────
// Quest State Machine
// ─────────────────────────────────────────────────────────────

describe('createQuestState', () => {
  it('creates quest at stage 1', () => {
    const state = createQuestState('kayip_hazine');
    expect(state.questId).toBe('kayip_hazine');
    expect(state.currentStage).toBe(1);
    expect(state.completed).toBe(false);
  });

  it('starts with empty evidence and flags', () => {
    const state = createQuestState('intikam');
    expect(state.evidence).toHaveLength(0);
    expect(Object.keys(state.stageFlags)).toHaveLength(0);
  });
});

describe('checkQuestTrigger', () => {
  it('triggers stage 1 of kayip_hazine at venedik on turn 3', () => {
    const quest = createQuestState('kayip_hazine');
    expect(checkQuestTrigger(quest, 3, 'venedik', basePlayer)).toBe(true);
  });

  it('does not trigger before the turn range', () => {
    const quest = createQuestState('kayip_hazine');
    expect(checkQuestTrigger(quest, 1, 'venedik', basePlayer)).toBe(false);
  });

  it('does not trigger after the turn range', () => {
    const quest = createQuestState('kayip_hazine');
    expect(checkQuestTrigger(quest, 7, 'venedik', basePlayer)).toBe(false);
  });

  it('does not trigger at wrong port', () => {
    const quest = createQuestState('kayip_hazine');
    expect(checkQuestTrigger(quest, 3, 'istanbul', basePlayer)).toBe(false);
  });

  it('does not trigger completed quests', () => {
    const quest = { ...createQuestState('kayip_hazine'), completed: true };
    expect(checkQuestTrigger(quest, 3, 'venedik', basePlayer)).toBe(false);
  });

  it('checks minGold condition', () => {
    const quest = {
      ...createQuestState('kayip_hazine'),
      currentStage: 4,
      evidence: ['harita_parcasi_1', 'harita_parcasi_2'],
    };
    const poorPlayer = { ...basePlayer, gold: 50 };
    expect(checkQuestTrigger(quest, 19, 'girit', poorPlayer)).toBe(false);
    expect(checkQuestTrigger(quest, 19, 'girit', basePlayer)).toBe(true);
  });

  it('checks requiredGood condition', () => {
    const quest = { ...createQuestState('kayip_hazine'), currentStage: 2 };
    const playerWithGood = {
      ...basePlayer,
      cargo: [{ goodId: 'murano_cami', name: 'Murano Camı', quantity: 1, originPort: 'venedik', purchasePrice: 50 }],
    };
    expect(checkQuestTrigger(quest, 7, 'istanbul', basePlayer)).toBe(false);
    expect(checkQuestTrigger(quest, 7, 'istanbul', playerWithGood)).toBe(true);
  });
});

describe('advanceQuest', () => {
  it('advances from stage 1 to stage 2', () => {
    const quest = createQuestState('kayip_hazine');
    const { quest: updated, stageTitle } = advanceQuest(quest);
    expect(updated.currentStage).toBe(2);
    expect(updated.completed).toBe(false);
    expect(stageTitle).toBe('Fısıltı');
    expect(updated.stageFlags['stage_1']).toBe(true);
  });

  it('adds evidence when provided', () => {
    const quest = createQuestState('kayip_hazine');
    const { quest: updated } = advanceQuest(quest, 'harita_parcasi_1');
    expect(updated.evidence).toContain('harita_parcasi_1');
  });

  it('completes quest after stage 5', () => {
    let quest = createQuestState('kayip_hazine');
    for (let i = 0; i < 5; i++) {
      const result = advanceQuest(quest);
      quest = result.quest;
    }
    expect(quest.completed).toBe(true);
    expect(quest.currentStage).toBe(5); // stays at last stage
  });

  it('accumulates stage flags', () => {
    let quest = createQuestState('intikam');
    quest = advanceQuest(quest).quest;
    quest = advanceQuest(quest).quest;
    expect(quest.stageFlags['stage_1']).toBe(true);
    expect(quest.stageFlags['stage_2']).toBe(true);
  });
});

describe('getCurrentStageInfo', () => {
  it('returns stage 1 info for new quest', () => {
    const quest = createQuestState('kayip_hazine');
    const info = getCurrentStageInfo(quest);
    expect(info).not.toBeNull();
    expect(info!.stage).toBe(1);
    expect(info!.title).toBe('Fısıltı');
  });

  it('returns null for completed quest', () => {
    const quest = { ...createQuestState('kayip_hazine'), completed: true };
    expect(getCurrentStageInfo(quest)).toBeNull();
  });

  it('returns correct stage after advancement', () => {
    let quest = createQuestState('babanin_serefi');
    quest = advanceQuest(quest).quest;
    const info = getCurrentStageInfo(quest);
    expect(info!.stage).toBe(2);
    expect(info!.title).toBe('Ortağın İzi');
  });
});

describe('getQuestWhisper', () => {
  it('returns hint for active stage within turn range', () => {
    const quest = createQuestState('kayip_hazine');
    const whisper = getQuestWhisper(quest, 3);
    expect(whisper).not.toBeNull();
    expect(whisper).toContain('Gavdos');
  });

  it('returns null for completed quests', () => {
    const quest = { ...createQuestState('kayip_hazine'), completed: true };
    expect(getQuestWhisper(quest, 3)).toBeNull();
  });

  it('returns null outside turn range', () => {
    const quest = createQuestState('kayip_hazine');
    expect(getQuestWhisper(quest, 20)).toBeNull();
  });

  it('returns hint one turn before the range starts (preview)', () => {
    const quest = createQuestState('kayip_hazine');
    // Stage 1 turnRange is [3, 6], so turn 2 should still show hint
    const whisper = getQuestWhisper(quest, 2);
    expect(whisper).not.toBeNull();
  });

  it('returns different hints for different quests', () => {
    const hazine = createQuestState('kayip_hazine');
    const intikam = createQuestState('intikam');
    const w1 = getQuestWhisper(hazine, 3);
    const w2 = getQuestWhisper(intikam, 3);
    expect(w1).not.toBe(w2);
  });
});
