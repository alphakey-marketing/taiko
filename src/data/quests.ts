import type { Quest } from '../types/game'

export const QUESTS: Quest[] = [
  // ─── Castle Quests ─────────────────────────────────────────────────────
  {
    id: 'quest_supply_001',
    title: '替主家採買軍糧',
    description: '加藤大人より、近隣の市場で軍糧を調達してくるよう命じられた。商才と交渉力が問われる。',
    locationId: 'loc_castle',
    requirements: { fame: 5, relations: { npc_lord_kato: 10 } },
    cost: { days: 3, stamina: 25 },
    checks: ['commerce', 'charm'],
    rewards: {
      gold: 120,
      fame: 5,
      relations: { npc_lord_kato: 8 },
      flags: ['flag_first_lord_quest'],
    },
    failConsequences: {
      fame: -3,
      relations: { npc_lord_kato: -6 },
    },
  },
  {
    id: 'quest_lord_favor_001',
    title: '主君の信頼を得よ',
    description: '加藤大人に忠誠を示し、家臣として認められるための試練を乗り越えよ。',
    locationId: 'loc_castle',
    requirements: { fame: 15, completedQuests: ['quest_supply_001'] },
    cost: { days: 2, stamina: 20 },
    checks: ['charm', 'wisdom'],
    rewards: {
      fame: 10,
      relations: { npc_lord_kato: 15 },
      flags: ['flag_lord_trusted'],
    },
    failConsequences: {
      fame: -5,
      relations: { npc_lord_kato: -10 },
    },
  },

  // ─── Dojo Quests ───────────────────────────────────────────────────────
  {
    id: 'quest_dojo_trial_001',
    title: '道場の試練',
    description: '林先生より試練を与えられた。基礎の型を完璧に披露せよ。武藝の真価が問われる。',
    locationId: 'loc_dojo',
    requirements: {},
    cost: { days: 2, stamina: 30 },
    checks: ['martial'],
    rewards: {
      stats: { martial: 2, wisdom: 1 },
      fame: 3,
      relations: { npc_mentor_hayashi: 10 },
      flags: ['flag_dojo_trial_passed'],
    },
    failConsequences: {
      stats: { stamina: -10 },
      relations: { npc_mentor_hayashi: -3 },
    },
  },
  {
    id: 'quest_rival_duel_001',
    title: '宿敵との勝負',
    description: '伊藤猛之助が果たし合いを申し込んできた。正々堂々と勝負し、道場での地位を確立せよ。',
    locationId: 'loc_dojo',
    requirements: { completedQuests: ['quest_dojo_trial_001'] },
    cost: { days: 1, stamina: 40 },
    checks: ['martial', 'wisdom'],
    rewards: {
      stats: { martial: 1 },
      fame: 8,
      relations: { npc_rival_ito: 15, npc_mentor_hayashi: 5 },
      flags: ['flag_rival_defeated'],
    },
    failConsequences: {
      stats: { stamina: -20 },
      fame: -2,
      relations: { npc_rival_ito: -5 },
    },
  },

  // ─── Market Quests ─────────────────────────────────────────────────────
  {
    id: 'quest_market_deal_001',
    title: '市場の取引',
    description: '鈴木宗兵衛との商談。有利な条件を引き出せるか、商才と交渉力が試される。',
    locationId: 'loc_market',
    requirements: {},
    cost: { days: 1, stamina: 15 },
    checks: ['commerce'],
    rewards: {
      gold: 80,
      relations: { npc_merchant_suzuki: 8 },
      flags: ['flag_merchant_ally'],
    },
    failConsequences: {
      gold: -20,
      relations: { npc_merchant_suzuki: -5 },
    },
  },

  // ─── Tavern Quests ─────────────────────────────────────────────────────
  {
    id: 'quest_tavern_info_001',
    title: '酒場の情報収集',
    description: '影の六から敵対勢力についての情報を集めよ。魅力で人を引き付け、秘密を聞き出せ。',
    locationId: 'loc_tavern',
    requirements: { flags: ['flag_tavern_visited'] },
    cost: { days: 2, stamina: 20, gold: 30 },
    checks: ['charm', 'wisdom'],
    rewards: {
      stats: { wisdom: 1 },
      fame: 4,
      relations: { npc_spy_kage: 10 },
      flags: ['flag_intel_gathered'],
    },
    failConsequences: {
      gold: -30,
      relations: { npc_spy_kage: -8 },
    },
  },

  // ─── Personal Growth Quests ────────────────────────────────────────────
  {
    id: 'quest_shrine_omen_001',
    title: '神社の御告げ',
    description: '神社で祈願を続け、天命の御告げを受け取れ。天命が高い者ほど深い啓示を得られる。',
    locationId: 'loc_shrine',
    requirements: { stats: { omen: 20 } },
    cost: { days: 3, stamina: 15 },
    checks: ['omen', 'wisdom'],
    rewards: {
      stats: { omen: 15, wisdom: 2 },
      flags: ['flag_omen_revealed'],
    },
    failConsequences: {
      stats: { omen: -5 },
    },
  },
  {
    id: 'quest_study_001',
    title: '書物の研究',
    description: '難解な書物を読み解き、新たな智識を得よ。集中力と知恵が必要だ。',
    locationId: 'loc_home',
    requirements: {},
    cost: { days: 2, stamina: 20 },
    checks: ['wisdom'],
    rewards: {
      stats: { wisdom: 2 },
    },
    failConsequences: {
      stats: { stamina: -10 },
    },
  },

  // ─── Advanced Quest (unlocked after progress) ──────────────────────────
  {
    id: 'quest_identity_promotion_001',
    title: '仕官への道',
    description: '十分な名声と信頼を積み重ね、主君から正式な家臣として認められよ。これが立志の第一歩だ。',
    locationId: 'loc_castle',
    requirements: {
      fame: 30,
      relations: { npc_lord_kato: 30 },
      completedQuests: ['quest_supply_001', 'quest_lord_favor_001'],
      flags: ['flag_lord_trusted'],
    },
    cost: { days: 5, stamina: 30 },
    checks: ['charm', 'wisdom', 'martial'],
    rewards: {
      fame: 20,
      gold: 200,
      relations: { npc_lord_kato: 20 },
      flags: ['flag_official_retainer'],
    },
    failConsequences: {
      fame: -10,
      relations: { npc_lord_kato: -15 },
    },
  },
]
