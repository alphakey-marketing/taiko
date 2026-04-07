import type { GameEvent } from '../types/game'

export const EVENTS: GameEvent[] = [
  // ─── Personal Events ───────────────────────────────────────────────────
  {
    id: 'event_omen_sign_001',
    type: 'personal',
    title: '不思議な夢',
    body: '夜、奇妙な夢を見た。炎に包まれた城と、その中で静かに座る老人の姿。これは天命の予兆か、それとも単なる夢か。',
    trigger: { turn: 3, probability: 0.6 },
    choices: [
      {
        label: '深く考える',
        check: 'wisdom',
        threshold: 5,
        successOutcome: {
          text: '夢の意味を考え、何か重要な予兆であると直感する。天命の感覚が研ぎ澄まされた。',
          statChanges: { wisdom: 1, omen: 10 },
          flagsSet: ['flag_omen_dreamed'],
        },
        failOutcome: {
          text: 'よく分からなかったが、何か意味があるような気がした。',
          statChanges: { omen: 5 },
        },
      },
      {
        label: '気にしない',
        successOutcome: {
          text: '夢のことは忘れ、日常に戻った。',
        },
      },
    ],
  },
  {
    id: 'event_injury_001',
    type: 'personal',
    title: '稽古中の怪我',
    body: '道場での激しい稽古中、足を滑らせて転倒してしまった。怪我の程度は大したことないが、体力を消耗した。',
    trigger: { locationId: 'loc_dojo', probability: 0.3 },
    choices: [
      {
        label: '無理して続ける',
        check: 'martial',
        threshold: 8,
        successOutcome: {
          text: '痛みに耐えながら稽古を続けた。その根性を師が認めた。',
          statChanges: { martial: 1, stamina: -15 },
          relationChanges: { npc_mentor_hayashi: 5 },
        },
        failOutcome: {
          text: '無理をして怪我が悪化してしまった。今日の稽古は終わりだ。',
          statChanges: { stamina: -30 },
        },
      },
      {
        label: '今日は休む',
        successOutcome: {
          text: '賢明な判断だ。今日は休んで明日に備えよう。',
          statChanges: { stamina: 10 },
        },
      },
    ],
  },

  // ─── Interpersonal Events ──────────────────────────────────────────────
  {
    id: 'event_mentor_lesson_001',
    type: 'interpersonal',
    title: '師の教え',
    body: '林先生が稽古の後、あなたを呼び止めた。「技の前に、まず心を磨け」と静かに語りかけてきた。',
    trigger: { locationId: 'loc_dojo', relations: { npc_mentor_hayashi: 15 } },
    choices: [
      {
        label: '素直に受け入れる',
        successOutcome: {
          text: '師の言葉を胸に刻んだ。心と技が一体となる感覚が芽生えてきた。',
          statChanges: { wisdom: 2, martial: 1 },
          relationChanges: { npc_mentor_hayashi: 10 },
          flagsSet: ['flag_mentor_teaching'],
        },
      },
      {
        label: '技術論で反論する',
        check: 'wisdom',
        threshold: 10,
        successOutcome: {
          text: '理論的な反論に師は目を細めた。「なかなか面白い考えだ」と評価された。',
          statChanges: { wisdom: 1 },
          relationChanges: { npc_mentor_hayashi: 5 },
        },
        failOutcome: {
          text: '師は静かに首を振った。「まだ分かっていないな」。関係がぎこちなくなった。',
          relationChanges: { npc_mentor_hayashi: -5 },
        },
      },
    ],
  },
  {
    id: 'event_rival_respect_001',
    type: 'interpersonal',
    title: '宿敵の変化',
    body: '道場で伊藤猛之助と目が合った。いつもの挑発的な眼差しではなく、どこか複雑な表情をしている。',
    trigger: {
      locationId: 'loc_dojo',
      completedQuests: ['quest_rival_duel_001'],
    },
    choices: [
      {
        label: '声をかける',
        check: 'charm',
        threshold: 6,
        successOutcome: {
          text: '猛之助は一瞬驚いた表情をしたが、やがて微かに頷いた。「お前は思ったより…」と言いかけて口を閉じた。',
          relationChanges: { npc_rival_ito: 10 },
          flagsSet: ['flag_rival_softened'],
        },
        failOutcome: {
          text: '猛之助はそっぽを向いて立ち去った。まだ心を開くのは難しそうだ。',
        },
      },
      {
        label: '無視する',
        successOutcome: {
          text: 'お互いに視線を外し、それぞれの稽古に戻った。',
        },
      },
    ],
  },

  // ─── World Events ──────────────────────────────────────────────────────
  {
    id: 'event_market_fluctuation_001',
    type: 'world',
    title: '物価の変動',
    body: '近隣の戦乱の影響で、市場の物価が大きく変動している。商人たちは皆、不安そうな顔をしている。',
    trigger: { turn: 6, probability: 0.5 },
    choices: [
      {
        label: '今のうちに買い溜めする',
        check: 'commerce',
        threshold: 6,
        successOutcome: {
          text: '価格が上がる前に物資を確保できた。商才が活きた判断だ。',
          statChanges: { gold: -30 },
          flagsSet: ['flag_supplies_stockpiled'],
        },
        failOutcome: {
          text: '判断が遅れ、よい物資は既に売り切れていた。',
          statChanges: { gold: -20 },
        },
      },
      {
        label: '様子を見る',
        successOutcome: {
          text: '焦らず状況を観察することにした。',
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },
  {
    id: 'event_faction_rumor_001',
    type: 'world',
    title: '勢力の噂',
    body: '酒場で気になる噂を耳にした。某勢力が密かに兵を集めているという。この情報、どう活かすか。',
    trigger: { locationId: 'loc_tavern', probability: 0.4 },
    choices: [
      {
        label: '主君に報告する',
        successOutcome: {
          text: '加藤大人に報告した。「よく知らせてくれた」と褒められ、信頼が増した。',
          statChanges: { fame: 3 },
          relationChanges: { npc_lord_kato: 5 },
          flagsSet: ['flag_faction_intel'],
        },
      },
      {
        label: '情報を売る',
        check: 'commerce',
        threshold: 7,
        successOutcome: {
          text: '情報屋に売り、まとまった金を得た。',
          statChanges: { gold: 50 },
          relationChanges: { npc_spy_kage: 5 },
        },
        failOutcome: {
          text: '相手に値段を叩かれ、思ったより金にならなかった。',
          statChanges: { gold: 20 },
        },
      },
      {
        label: '自分だけの秘密にする',
        successOutcome: {
          text: '情報は力だ。適切な時まで抱え込むことにした。',
          flagsSet: ['flag_faction_intel_hidden'],
        },
      },
    ],
  },

  // ─── Identity Events ───────────────────────────────────────────────────
  {
    id: 'event_lord_promotion_001',
    type: 'identity',
    title: '主君の目',
    body: '加藤大人が城の廊下であなたを呼び止めた。「最近の働き、よく見ておるぞ」と静かに告げた。',
    trigger: {
      relations: { npc_lord_kato: 25 },
      minFame: 20,
      flags: ['flag_first_lord_quest'],
    },
    choices: [
      {
        label: '深々と礼を述べる',
        successOutcome: {
          text: '謙虚な態度に主君は満足そうに頷いた。「引き続き励め」と声をかけられた。',
          statChanges: { fame: 5 },
          relationChanges: { npc_lord_kato: 8 },
        },
      },
      {
        label: 'さらなる任務を志願する',
        check: 'charm',
        threshold: 8,
        successOutcome: {
          text: '積極的な姿勢が評価された。「では、頼みたいことがある」と重要な任務を与えられた。',
          statChanges: { fame: 8 },
          relationChanges: { npc_lord_kato: 12 },
          flagsSet: ['flag_lord_mission_assigned'],
        },
        failOutcome: {
          text: '少々前のめり過ぎたか。主君は苦笑いして立ち去った。',
          statChanges: { fame: 2 },
        },
      },
    ],
  },

  // ─── Special / Mystical Events ─────────────────────────────────────────
  {
    id: 'event_mysterious_stranger_001',
    type: 'special',
    title: '謎の老人',
    body: '酒場の隅に、誰も話しかけない老人が一人座っていた。その目に、どこか不思議な光が宿っている。',
    trigger: {
      locationId: 'loc_tavern',
      minFame: 5,
      probability: 0.25,
    },
    choices: [
      {
        label: '声をかける',
        check: 'wisdom',
        threshold: 5,
        successOutcome: {
          text: '老人は静かに微笑んだ。「天命とは、己が掴み取るものぞ」と謎めいた言葉を残して姿を消した。',
          statChanges: { omen: 20, wisdom: 1 },
          flagsSet: ['flag_stranger_met', 'flag_omen_awakened'],
        },
        failOutcome: {
          text: '老人は何も言わずに立ち去った。機会を逃してしまった。',
          statChanges: { omen: 5 },
        },
      },
      {
        label: '放っておく',
        successOutcome: {
          text: '気にしないことにした。だが、あの老人の目が頭から離れない。',
          statChanges: { omen: 5 },
        },
      },
    ],
  },
  {
    id: 'event_shrine_vision_001',
    type: 'special',
    title: '神社の幻視',
    body: '神社で祈りを捧げていると、突然視界が歪み、見慣れない光景が目に浮かんだ。遠く離れた城が炎に包まれる光景だ。',
    trigger: {
      locationId: 'loc_shrine',
      minStat: { omen: 30 },
      probability: 0.4,
    },
    choices: [
      {
        label: '幻視を受け入れ、意味を探る',
        successOutcome: {
          text: '天命の啓示を受けた。これは単なる幻ではなく、未来への道標だと確信する。',
          statChanges: { omen: 15, wisdom: 2 },
          flagsSet: ['flag_prophecy_received'],
        },
      },
      {
        label: '恐れて神社を去る',
        successOutcome: {
          text: '不安に駆られて神社を後にした。あの幻が現実になりませんように…。',
          statChanges: { omen: -5 },
        },
      },
    ],
  },
]
