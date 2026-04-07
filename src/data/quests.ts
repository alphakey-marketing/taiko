import type { Quest } from '../types/game'

export const QUESTS: Quest[] = [
  // ─── Q1. 初次占兆 ────────────────────────────────────────────────────────
  {
    id: 'quest_first_omen',
    title: '初次占兆',
    description: '千代に頼まれ、神社で村民の初めての正式な占いを行う。陰陽師としての第一歩だ。',
    locationId: 'loc_shrine',
    requirements: {},
    cost: { days: 2, stamina: 15 },
    checks: ['wisdom', 'charm'],
    threshold: 8,
    rewards: {
      gold: 30,
      fame: 3,
      relations: { priestess: 5 },
      flags: ['flag_first_omen_done'],
    },
    failConsequences: {
      fame: -1,
      stats: { stamina: -10 },
    },
  },

  // ─── Q2. 小藩主の不安之夢 ────────────────────────────────────────────────
  {
    id: 'quest_lord_nightmare',
    title: '小藩主の不安な夢',
    description: '直家が連日悪夢を見ているという。解夢し、心の安定を取り戻す策を伝えよ。',
    locationId: 'loc_castle',
    requirements: { relations: { lord: 10 } },
    cost: { days: 2, stamina: 20 },
    checks: ['wisdom', 'charm'],
    threshold: 10,
    rewards: {
      fame: 6,
      relations: { lord: 8 },
      flags: ['flag_lord_dream_solved', 'flag_lord_promotion_open'],
    },
    failConsequences: {
      relations: { lord: -5, retainer: -3 },
    },
  },

  // ─── Q3. 道場試煉 ────────────────────────────────────────────────────────
  {
    id: 'quest_dojo_trial',
    title: '道場の試煉',
    description: '師父・片桐宗真が試煉を課した。道場の弟子と対決し、陰陽師にも武の素養があることを証明せよ。',
    locationId: 'loc_dojo',
    requirements: { stats: { stamina: 40 } },
    cost: { days: 1, stamina: 30 },
    checks: ['martial'],
    threshold: 9,
    duelConfig: {
      enemyName: '道場の弟子',
      enemyHp: 20,
      enemyMartial: 5,
      rounds: 3,
    },
    rewards: {
      stats: { martial: 2 },
      relations: { mentor: 5 },
      fame: 2,
      flags: ['flag_dojo_trial_passed'],
    },
    failConsequences: {
      stats: { stamina: -20 },
      relations: { mentor: 1 },
    },
  },

  // ─── Q4. 軍糧採買 ────────────────────────────────────────────────────────
  {
    id: 'quest_supply_run',
    title: '軍糧採買',
    description: '榊原兵庫より命令。軍備の糧食を市場で調達し、コストを抑えよ。',
    locationId: 'loc_market',
    requirements: { fame: 3 },
    cost: { days: 2, stamina: 20 },
    checks: ['commerce', 'charm'],
    threshold: 10,
    rewards: {
      gold: 80,
      fame: 4,
      relations: { retainer: 6 },
    },
    failConsequences: {
      gold: -20,
      relations: { retainer: -6 },
    },
  },

  // ─── Q5. 商人の試探 ────────────────────────────────────────────────────
  {
    id: 'quest_merchant_test',
    title: '商人の試探',
    description: '早坂彌兵衛から話が来た。一批の荷物を転売し、判断力を見せてほしいという。',
    locationId: 'loc_market',
    requirements: { stats: { gold: 50 } },
    cost: { days: 2, stamina: 15, gold: 50 },
    checks: ['commerce'],
    threshold: 10,
    rewards: {
      gold: 120,
      relations: { merchant: 10 },
      flags: ['flag_merchant_trusted'],
    },
    failConsequences: {
      gold: -40,
      relations: { merchant: -4 },
    },
  },

  // ─── Q6. 黒夜中の影 ────────────────────────────────────────────────────
  {
    id: 'quest_night_watch',
    title: '黒夜に潜む影',
    description: '城下で夜に不審者が出没している。主君と榊原の命により夜回りに向かう。戦うか、説得するか。',
    locationId: 'loc_castle',
    requirements: { stats: { stamina: 30 } },
    cost: { days: 1, stamina: 30 },
    checks: ['martial', 'charm'],
    threshold: 10,
    rewards: {
      fame: 5,
      relations: { retainer: 5 },
      flags: ['flag_night_watch_done', 'flag_informant_open'],
    },
    failConsequences: {
      fame: -3,
      stats: { stamina: -15 },
      flags: ['flag_security_low'],
    },
  },

  // ─── Q7. 酒館の流言 ────────────────────────────────────────────────────
  {
    id: 'quest_tavern_rumors',
    title: '酒館の流言蜚語',
    description: '鴉一に頼まれ、酒場で隣国動向の流言を収集せよ。魅力で人を引きつけ、智略で真偽を見極めよ。',
    locationId: 'loc_tavern',
    requirements: { stats: { charm: 9 }, flags: ['flag_tavern_visited'] },
    cost: { days: 2, stamina: 20 },
    checks: ['charm', 'wisdom'],
    threshold: 9,
    rewards: {
      relations: { informant: 8 },
      flags: ['flag_war_intel', 'flag_neighbors_restless'],
    },
    failConsequences: {
      fame: -2,
    },
  },

  // ─── Q8. 村の厄払い ────────────────────────────────────────────────────
  {
    id: 'quest_village_curse',
    title: '村の厄払い',
    description: '隣村の子供が病に倒れ、妖異の仕業と噂される。陰陽師として調査し、解決せよ。',
    locationId: 'loc_shrine',
    requirements: { fame: 5 },
    cost: { days: 3, stamina: 25 },
    checks: ['wisdom', 'omen'],
    threshold: 11,
    rewards: {
      fame: 8,
      relations: { priestess: 5 },
      flags: ['flag_fate_awakened', 'flag_village_saved'],
    },
    failConsequences: {
      fame: -5,
      relations: { priestess: -5 },
      flags: ['flag_village_failed'],
    },
  },

  // ─── Q9. 浪人の挑戦 ────────────────────────────────────────────────────
  {
    id: 'quest_rival_duel',
    title: '浪人の挑戦',
    description: '朧雨之介が挑戦状を叩きつけてきた。「言葉と占いで出世した貴様に、刀で勝てるか」と問う。',
    locationId: 'loc_dojo',
    requirements: { fame: 8 },
    cost: { days: 1, stamina: 40 },
    checks: ['martial', 'wisdom'],
    threshold: 10,
    duelConfig: {
      enemyName: '朧 雨之介',
      enemyHp: 30,
      enemyMartial: 8,
      rounds: 4,
    },
    rewards: {
      fame: 6,
      relations: { rival: 4 },
      flags: ['flag_rival_respected'],
    },
    failConsequences: {
      fame: -4,
      stats: { stamina: -25 },
    },
  },

  // ─── Q10. 密談の夜 ───────────────────────────────────────────────────────
  {
    id: 'quest_secret_meeting',
    title: '密談の夜',
    description: '商人と情報屋に秘密の会合に招かれた。知略と魅力で場を仕切り、有利な情報か資金を得よ。',
    locationId: 'loc_tavern',
    requirements: {
      relations: { merchant: 10, informant: 10 },
    },
    cost: { days: 2, stamina: 20 },
    checks: ['wisdom', 'charm'],
    threshold: 12,
    rewards: {
      gold: 200,
      flags: ['flag_secret_route', 'flag_independent_open'],
    },
    failConsequences: {
      relations: { merchant: -5, informant: -5 },
      flags: ['flag_unreliable'],
    },
  },

  // ─── Q11. 直家の試問 ─────────────────────────────────────────────────────
  {
    id: 'quest_lord_exam',
    title: '直家の試問',
    description: '直家から総合試問が課された。計策・人物観察・胆力を三段階で試される。成功すれば正式に仕官できる。',
    locationId: 'loc_castle',
    requirements: {
      fame: 10,
      relations: { lord: 15 },
      completedQuests: ['quest_lord_nightmare'],
    },
    cost: { days: 3, stamina: 30 },
    checks: ['wisdom', 'charm', 'martial'],
    threshold: 11,
    rewards: {
      fame: 10,
      rankUp: 'advisor',
      relations: { lord: 12 },
      flags: ['flag_official_advisor', 'flag_merit_ending_open'],
    },
    failConsequences: {
      relations: { lord: -8 },
    },
  },

  // ─── Q12. 命運の交差点 ───────────────────────────────────────────────────
  {
    id: 'quest_fate_crossroads',
    title: '命運の交差点',
    description: '月讀婆婆が告げた——「近く、あなたは一度だけ命運を変える選択ができる」。その時が来た。',
    locationId: 'loc_home',
    requirements: { flags: ['flag_fate_awakened'] },
    cost: { days: 1, stamina: 10 },
    checks: [],
    threshold: 0,
    rewards: {
      flags: ['flag_fate_crossroads_done'],
    },
    failConsequences: {},
  },
]
