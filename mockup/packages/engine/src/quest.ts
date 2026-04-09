import type {
  QuestId,
  QuestState,
  QuestChain,
  QuestStage,
  PlayerState,
} from '../../shared/src/types/index.js';
import { QUEST_STAGES, QUEST_STAGE_TURNS } from '../../shared/src/constants/index.js';

// ─────────────────────────────────────────────────────────────
// Quest Chain Definitions
// ─────────────────────────────────────────────────────────────

const KAYIP_HAZINE_STAGES: QuestStage[] = [
  {
    stage: 1,
    title: 'Fısıltı',
    description: 'Kahvehanede sarhoş bir denizci batık bir gemi efsanesinden bahseder.',
    turnRange: [3, 6],
    triggerPorts: ['venedik', 'ragusa', 'cenova'],
  },
  {
    stage: 2,
    title: 'Antikacı',
    description: 'İstanbul\'da bir antikacı harita parçasını elinde tutuyor. Karşılığında bir Murano ikonunu istiyor.',
    turnRange: [7, 12],
    triggerPorts: ['istanbul'],
    conditions: { requiredGood: 'murano_cami' },
  },
  {
    stage: 3,
    title: 'Araştırma',
    description: 'Diğer harita parçalarının izini sürmek için İskenderiye ve Beyrut kütüphanelerini tarayın.',
    turnRange: [13, 18],
    triggerPorts: ['iskenderiye', 'beyrut'],
  },
  {
    stage: 4,
    title: 'Harita Tamamlandı',
    description: 'Gavdos yakınlarındaki batığı keşfedin ve hazineyi çıkarın.',
    turnRange: [19, 24],
    triggerPorts: ['girit'],
    conditions: { minGold: 100 },
  },
  {
    stage: 5,
    title: 'Hazineyle Ne Yaparsın?',
    description: 'Hazineyi sat, bağışla, gizle veya politik koz olarak kullan.',
    turnRange: [25, 30],
    triggerPorts: ['venedik', 'istanbul', 'iskenderiye', 'cenova'],
  },
];

const BABANIN_SEREFI_STAGES: QuestStage[] = [
  {
    stage: 1,
    title: 'Hayalet',
    description: 'Yaşlı bir tersaneci, babanızın iftiraya uğradığını söyler.',
    turnRange: [3, 6],
    triggerPorts: ['venedik', 'cenova', 'ragusa'],
  },
  {
    stage: 2,
    title: 'Ortağın İzi',
    description: 'Babanızın eski ortağını araştırın.',
    turnRange: [7, 12],
    triggerPorts: ['istanbul', 'iskenderiye'],
  },
  {
    stage: 3,
    title: 'Soruşturma',
    description: 'Gümrük kayıtları, eski mürettebat ve ortağın sırlarını toplayın.',
    turnRange: [13, 18],
    triggerPorts: ['ragusa', 'beyrut', 'tunus'],
  },
  {
    stage: 4,
    title: 'Karşılaşma',
    description: 'Ortakla yüzleşin: diplomatik çözüm veya kılıç.',
    turnRange: [19, 24],
    triggerPorts: ['venedik', 'cenova', 'istanbul'],
  },
  {
    stage: 5,
    title: 'Şerefe',
    description: 'Aile adını temizleyin veya intikam alın.',
    turnRange: [25, 30],
    triggerPorts: ['venedik', 'ragusa', 'cenova'],
  },
];

const INTIKAM_STAGES: QuestStage[] = [
  {
    stage: 1,
    title: 'Yara İzi',
    description: 'Hayatınızı mahveden korsanın adını ilk kez duyarsınız.',
    turnRange: [3, 6],
    triggerPorts: ['cezayir', 'tunus', 'trablus'],
  },
  {
    stage: 2,
    title: 'İz Sürme',
    description: 'Korsanın geçmiş baskınlarını araştırın, rotasını çözün.',
    turnRange: [7, 12],
    triggerPorts: ['palermo', 'ragusa', 'girit'],
  },
  {
    stage: 3,
    title: 'Tuzak',
    description: 'Korsanı çekmek için bir tuzak kurun.',
    turnRange: [13, 18],
    triggerPorts: ['tunus', 'palermo', 'cezayir'],
  },
  {
    stage: 4,
    title: 'Yüzleşme',
    description: 'Korsanla karşı karşıya gelin. Ama gerçek düşündüğünüzden farklı.',
    turnRange: [19, 24],
    triggerPorts: ['cezayir', 'trablus'],
  },
  {
    stage: 5,
    title: 'Karar',
    description: 'Af mı, intikam mı? Gerçeği öğrendiğinizde seçim size kalıyor.',
    turnRange: [25, 30],
    triggerPorts: ['venedik', 'istanbul', 'cezayir', 'iskenderiye'],
  },
];

const SAF_MERAK_STAGES: QuestStage[] = [
  {
    stage: 1,
    title: 'Merak Kıvılcımı',
    description: 'Eski bir haritada bilinmeyen bir ada işareti fark edersiniz.',
    turnRange: [3, 6],
    triggerPorts: ['iskenderiye', 'istanbul', 'cenova'],
  },
  {
    stage: 2,
    title: 'Bilgi Toplama',
    description: 'Kütüphaneler ve denizciler arasında antik kaynaklara erişin.',
    turnRange: [7, 12],
    triggerPorts: ['istanbul', 'iskenderiye', 'beyrut'],
  },
  {
    stage: 3,
    title: 'Keşif Yolculuğu',
    description: 'Bilinmeyen sulara yelken açın.',
    turnRange: [13, 18],
    triggerPorts: ['girit', 'kibris', 'trablus'],
  },
  {
    stage: 4,
    title: 'Keşif',
    description: 'Antik bir liman kalıntısı veya batık bir medeniyet izine ulaşın.',
    turnRange: [19, 24],
    triggerPorts: ['girit', 'kibris'],
  },
  {
    stage: 5,
    title: 'Bilimin Bedeli',
    description: 'Keşfinizi dünyayla paylaşın ya da sır olarak saklayın.',
    turnRange: [25, 30],
    triggerPorts: ['istanbul', 'iskenderiye', 'venedik', 'cenova'],
  },
];

/** All quest chain definitions. */
export const QUEST_CHAINS: Record<QuestId, QuestChain> = {
  kayip_hazine: {
    id: 'kayip_hazine',
    name: 'Kayıp Hazine',
    description: 'Denizin altındaki miras — batık bir geminin efsanevi hazinesinin peşine düşün.',
    stages: KAYIP_HAZINE_STAGES,
  },
  babanin_serefi: {
    id: 'babanin_serefi',
    name: 'Baba\'nın Şerefi',
    description: 'Lekelenen bir aile adını aklamak için ticaret, diplomasi veya kuvvet kullan.',
    stages: BABANIN_SEREFI_STAGES,
  },
  intikam: {
    id: 'intikam',
    name: 'İntikam',
    description: 'Hayatınızı mahveden korsanı avlayın. Ama gerçek sandığınızdan karmaşık.',
    stages: INTIKAM_STAGES,
  },
  saf_merak: {
    id: 'saf_merak',
    name: 'Saf Merak',
    description: 'Bir bilgin olarak Akdeniz\'in bilinmeyen kenarlarını haritalayın.',
    stages: SAF_MERAK_STAGES,
  },
};

// ─────────────────────────────────────────────────────────────
// Quest State Machine
// ─────────────────────────────────────────────────────────────

/**
 * Create an initial quest state for the given quest chain.
 */
export function createQuestState(questId: QuestId): QuestState {
  return {
    questId,
    currentStage: 1,
    completed: false,
    stageFlags: {},
    evidence: [],
  };
}

/**
 * Check if the current game conditions trigger the next quest stage.
 */
export function checkQuestTrigger(
  quest: QuestState,
  currentTurn: number,
  currentPortId: string,
  player: PlayerState,
): boolean {
  if (quest.completed) return false;

  const chain = QUEST_CHAINS[quest.questId];
  if (!chain) return false;

  const stage = chain.stages[quest.currentStage - 1];
  if (!stage) return false;

  // Check turn range
  if (currentTurn < stage.turnRange[0] || currentTurn > stage.turnRange[1]) return false;

  // Check port
  if (!stage.triggerPorts.includes(currentPortId)) return false;

  // Check conditions
  if (stage.conditions) {
    if (stage.conditions.minGold !== undefined && player.gold < (stage.conditions.minGold as number)) {
      return false;
    }
    if (stage.conditions.requiredGood !== undefined) {
      const hasGood = player.cargo.some(
        (item) => item.goodId === (stage.conditions!.requiredGood as string),
      );
      if (!hasGood) return false;
    }
  }

  return true;
}

/**
 * Advance the quest to the next stage.
 * Returns updated QuestState and a description of what happened.
 */
export function advanceQuest(
  quest: QuestState,
  evidence?: string,
): { quest: QuestState; stageTitle: string; stageDescription: string } {
  const chain = QUEST_CHAINS[quest.questId];
  const currentStage = chain.stages[quest.currentStage - 1];

  const nextStage = quest.currentStage + 1;
  const isComplete = nextStage > QUEST_STAGES;

  const updatedQuest: QuestState = {
    ...quest,
    currentStage: isComplete ? quest.currentStage : nextStage,
    completed: isComplete,
    stageFlags: { ...quest.stageFlags, [`stage_${quest.currentStage}`]: true },
    evidence: evidence ? [...quest.evidence, evidence] : [...quest.evidence],
  };

  return {
    quest: updatedQuest,
    stageTitle: currentStage.title,
    stageDescription: currentStage.description,
  };
}

/**
 * Get the current quest stage details for display.
 */
export function getCurrentStageInfo(quest: QuestState): QuestStage | null {
  if (quest.completed) return null;
  const chain = QUEST_CHAINS[quest.questId];
  if (!chain) return null;
  return chain.stages[quest.currentStage - 1] ?? null;
}

/**
 * Generate quest-related whisper text for the tavern.
 */
export function getQuestWhisper(quest: QuestState, currentTurn: number): string | null {
  if (quest.completed) return null;

  const chain = QUEST_CHAINS[quest.questId];
  if (!chain) return null;

  const stage = chain.stages[quest.currentStage - 1];
  if (!stage) return null;

  // Only hint at quest during the stage's turn range
  if (currentTurn < stage.turnRange[0] - 1 || currentTurn > stage.turnRange[1]) return null;

  const hints: Record<QuestId, string[]> = {
    kayip_hazine: [
      'Bir denizci fısıldıyor: "Gavdos açıklarında altın ışıldıyor derler..."',
      'Antik bir harita parçası el değiştirmiş. İstanbul\'da bir antikacıda olabilir.',
      'Batık gemiler hakkında söylentiler her liman kahvehanesinde dönüyor.',
      'Haritanın son parçası İskenderiye kütüphanesinde saklı olabilir.',
      'Hazineyi buldunuz. Şimdi ne yapacaksınız?',
    ],
    babanin_serefi: [
      'Yaşlı bir tersaneci babanızın adını anıyor...',
      'Ortağın izi Doğu\'ya uzanıyor.',
      'Gümrük kayıtlarında babanızın adı geçiyor.',
      'Ortakla yüzleşme zamanı yaklaşıyor.',
      'Aile şerefi elinizde.',
    ],
    intikam: [
      'O korsanın adı: Kara Mustafa.',
      'Kara Mustafa\'nın rotası bir düzen izliyor.',
      'Tuzak kurmak için cesarete ihtiyacınız var.',
      'Yüzleşme anı geldi.',
      'Gerçeği biliyorsunuz artık. Ne yapacaksınız?',
    ],
    saf_merak: [
      'Eski bir haritada garip bir işaret...',
      'Antik kaynaklar bilinmeyen sulardan söz ediyor.',
      'Keşfe çıkma zamanı.',
      'Antik kalıntılar gün yüzüne çıkıyor.',
      'Bilgi paylaşılmalı mı, saklanmalı mı?',
    ],
  };

  const questHints = hints[quest.questId] ?? [];
  return questHints[quest.currentStage - 1] ?? null;
}
