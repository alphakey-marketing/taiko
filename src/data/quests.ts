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
    threshold: 9,
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
    threshold: 8,
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
    threshold: 8,
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
    threshold: 9,
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

  // ═══════════════════════════════════════════════════════
  // Samurai Path Quests (flag_bg_samurai required)
  // ═══════════════════════════════════════════════════════

  // ─── QS1. 武士の誓い ─────────────────────────────────────────────────────
  {
    id: 'quest_sword_vow',
    title: '武士の誓い',
    description: '師父・片桐宗真の前に立ち、剣の道への誓いを立てる。武士見習いとしての第一歩だ。',
    locationId: 'loc_dojo',
    requirements: { flags: ['flag_bg_samurai'] },
    cost: { days: 1, stamina: 15 },
    checks: ['martial'],
    threshold: 7,
    rewards: {
      stats: { martial: 1 },
      relations: { mentor: 8 },
      flags: ['flag_sword_vow'],
    },
    failConsequences: {
      stats: { stamina: -10 },
    },
  },

  // ─── QS2. 城門の警護 ─────────────────────────────────────────────────────
  {
    id: 'quest_castle_guard',
    title: '城門の警護',
    description: '直家の城門を一晩守る任務。武士の基本——忠実に、静かに、強く。',
    locationId: 'loc_castle',
    requirements: { flags: ['flag_bg_samurai'], fame: 2 },
    cost: { days: 2, stamina: 25 },
    checks: ['martial', 'charm'],
    threshold: 9,
    rewards: {
      gold: 40,
      fame: 5,
      relations: { retainer: 6, lord: 4 },
      flags: ['flag_guard_done'],
    },
    failConsequences: {
      fame: -2,
      stats: { stamina: -15 },
    },
  },

  // ─── QS3. 朧との決着 ─────────────────────────────────────────────────────
  {
    id: 'quest_rival_rematch',
    title: '朧との決着',
    description: '浪人・朧雨之介が再び挑んできた。「前回は手加減した。今度は本気だ」。これが真の決着だ。',
    locationId: 'loc_dojo',
    requirements: { flags: ['flag_bg_samurai', 'flag_rival_respected'] },
    cost: { days: 1, stamina: 40 },
    checks: ['martial'],
    threshold: 11,
    duelConfig: {
      enemyName: '朧 雨之介（本気）',
      enemyHp: 40,
      enemyMartial: 12,
      rounds: 5,
    },
    rewards: {
      stats: { martial: 2 },
      fame: 8,
      relations: { rival: 10 },
      flags: ['flag_rival_ally', 'flag_rival_bond'],
    },
    failConsequences: {
      stats: { stamina: -25 },
      relations: { rival: 2 },
    },
  },

  // ─── QS4. 剣の巡礼 ───────────────────────────────────────────────────────
  {
    id: 'quest_sword_pilgrimage',
    title: '剣の巡礼',
    description: '宗真が課した最後の試練——城下を離れ、山に入り、三日間ひとりで剣と向き合え。これを越えた者だけが「一道の剣士」と呼ばれる。',
    locationId: 'loc_dojo',
    requirements: { flags: ['flag_bg_samurai', 'flag_rival_ally'], stats: { martial: 12 } },
    cost: { days: 3, stamina: 40 },
    checks: ['martial'],
    threshold: 12,
    rewards: {
      stats: { martial: 3 },
      fame: 10,
      relations: { mentor: 8 },
      flags: ['flag_sword_pilgrim_done'],
    },
    failConsequences: {
      stats: { stamina: -30 },
      fame: -2,
    },
  },

  // ═══════════════════════════════════════════════════════
  // Merchant Path Quests (flag_bg_merchant required)
  // ═══════════════════════════════════════════════════════

  // ─── QM1. 家の借金返済 ───────────────────────────────────────────────────
  {
    id: 'quest_repay_family_debt',
    title: '家の借金返済',
    description: '没落した家に残る借金を清算する。彌兵衛の仲介を借りて、正面から解決しよう。商人として最初の大きな節目だ。',
    locationId: 'loc_market',
    requirements: { flags: ['flag_bg_merchant'] },
    cost: { days: 2, stamina: 10, gold: 60 },
    checks: ['commerce', 'charm'],
    threshold: 8,
    rewards: {
      fame: 4,
      relations: { merchant: 8 },
      flags: ['flag_debt_cleared'],
    },
    failConsequences: {
      fame: -2,
      relations: { merchant: -3 },
    },
  },

  // ─── QM2. 港の供給契約 ───────────────────────────────────────────────────
  {
    id: 'quest_port_supply_contract',
    title: '港の軍需供給契約',
    description: '隣国の戦乱で城下の物資需要が急増している。浜田宗右衛門と組んで軍需品の供給契約を結び、大きな利益を得よ。',
    locationId: 'loc_port',
    requirements: { flags: ['flag_bg_merchant', 'flag_war_intel'] },
    cost: { days: 3, stamina: 25 },
    checks: ['commerce', 'charm'],
    threshold: 10,
    rewards: {
      gold: 180,
      relations: { sea_merchant: 8, merchant: 4 },
      flags: ['flag_supply_contract'],
    },
    failConsequences: {
      gold: -30,
      relations: { sea_merchant: -4 },
    },
  },

  // ─── QM3. 市場の一角を占める ─────────────────────────────────────────────
  {
    id: 'quest_market_corner',
    title: '市場の一角を占める',
    description: '彌兵衛の信頼を得た今、城下市場の特定品目を独占する取引を仕掛ける。大きな元手が必要だが、成功すれば商界での地位が確立する。',
    locationId: 'loc_market',
    requirements: { flags: ['flag_bg_merchant', 'flag_merchant_trusted'], stats: { commerce: 8 } },
    cost: { days: 2, stamina: 20, gold: 100 },
    checks: ['commerce'],
    threshold: 11,
    rewards: {
      gold: 350,
      relations: { merchant: 10 },
      flags: ['flag_market_influence'],
    },
    failConsequences: {
      gold: -60,
      relations: { merchant: -5 },
    },
  },

  // ─── QM4. 商人組合への入会 ───────────────────────────────────────────────
  {
    id: 'quest_guild_entry',
    title: '商人組合への入会',
    description: '霧岬の有力商人たちが集う組合への入会試験。財力・商才・人脈の全てが試される。組合に入れば、この城下での商人としての地位が確定する。',
    locationId: 'loc_tavern',
    requirements: { flags: ['flag_bg_merchant', 'flag_market_influence'], stats: { gold: 300 } },
    cost: { days: 2, stamina: 20, gold: 50 },
    checks: ['charm', 'commerce'],
    threshold: 11,
    rewards: {
      gold: 100,
      fame: 8,
      relations: { merchant: 8, sea_merchant: 4 },
      flags: ['flag_guild_member'],
    },
    failConsequences: {
      fame: -3,
      relations: { merchant: -4 },
    },
  },
]
