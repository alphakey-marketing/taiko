import type { GameEvent } from '../types/game'

export const EVENTS: GameEvent[] = [
  // ═══════════════════════════════════════════════════════
  // Category A: Personal (6)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_stargazing',
    type: 'personal',
    title: '初夜觀星',
    body: '夜空に無数の星が輝く。陰陽師として、この宇宙の流れをどう読むべきか——あなたは考え始めた。',
    trigger: { turn: 1, locationId: 'loc_home' },
    choices: [
      {
        label: '智略の流れを読む（知を磨く）',
        successOutcome: {
          text: '星の動きから人の心の機微を学んだ。智略が研ぎ澄まされた。',
          statChanges: { wisdom: 1, omen: 5 },
          flagsSet: ['flag_path_wisdom'],
        },
      },
      {
        label: '人の縁を読む（魅力を磨く）',
        successOutcome: {
          text: '命の糸が互いに結びついている様が見えた気がした。魅力が増した。',
          statChanges: { charm: 1, omen: 5 },
          flagsSet: ['flag_path_charm'],
        },
      },
    ],
  },

  {
    id: 'event_exhausted_morning',
    type: 'personal',
    title: '疲弊した朝',
    body: '体がひどく疲れている。それでも今日もやることは山積みだ。どうする？',
    trigger: { minStat: { stamina: 0 }, probability: 0.4 },
    choices: [
      {
        label: '無理して動く',
        check: 'martial',
        threshold: 8,
        successOutcome: {
          text: '根性で動いた。少し名声が上がった気がする。',
          statChanges: { stamina: -10, fame: 1 },
        },
        failOutcome: {
          text: '無理がたたり、ますます消耗した。',
          statChanges: { stamina: -20 },
        },
      },
      {
        label: '今日は休む',
        successOutcome: {
          text: '賢明な選択だ。ゆっくり休んだ。',
          statChanges: { stamina: 30 },
        },
      },
    ],
  },

  {
    id: 'event_dream_voice',
    type: 'personal',
    title: '夢中の声',
    body: '初次占兆の後、夢の中で誰かの声が聞こえた。「見えるか、見えないか。それが問いだ」と。',
    trigger: { completedQuests: ['quest_first_omen'], probability: 0.7 },
    choices: [
      {
        label: '夢を信じる',
        successOutcome: {
          text: '夢示に従い、天命の声に耳を傾けることにした。',
          statChanges: { omen: 10 },
          flagsSet: ['flag_fate_believer'],
        },
      },
      {
        label: '気にしない',
        successOutcome: {
          text: '夢は夢だ。現実に集中しよう。',
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },

  {
    id: 'event_poverty_choice',
    type: 'personal',
    title: '貧困の選択',
    body: '財布がほぼ空だ。このままでは明日の食事にも困る。どうやって乗り切る？',
    trigger: { minStat: { gold: 0 }, probability: 0.5 },
    choices: [
      {
        label: '商人に借りる',
        successOutcome: {
          text: '彌兵衛に借金した。今は助かったが、返済が必要だ。',
          statChanges: { gold: 30 },
          relationChanges: { merchant: -2 },
          flagsSet: ['flag_in_debt'],
        },
      },
      {
        label: '高リスクな仕事を引き受ける',
        check: 'wisdom',
        threshold: 9,
        successOutcome: {
          text: '危険を冒したが、うまく切り抜けた。',
          statChanges: { gold: 50, stamina: -20, fame: 1 },
        },
        failOutcome: {
          text: '無茶が祟り、怪我をして金も稼げなかった。',
          statChanges: { stamina: -30 },
        },
      },
    ],
  },

  {
    id: 'event_dojo_whisper',
    type: 'personal',
    title: '道場の低語',
    body: '数度稽古に通っても武藝は伸びない。師父が静かに言った：「あなたの道は刀だけではないかもしれない」。',
    trigger: { locationId: 'loc_dojo', minTurn: 5, probability: 0.5 },
    choices: [
      {
        label: '師の言葉を素直に受け取る',
        successOutcome: {
          text: '武から離れ、陰陽の智略を深める方向へ舵を切った。',
          statChanges: { wisdom: 2, omen: 5 },
          relationChanges: { mentor: 5 },
        },
      },
      {
        label: '武の道をさらに磨く',
        successOutcome: {
          text: '師の懸念を跳ね除け、修行を続ける。',
          statChanges: { martial: 1, stamina: -10 },
        },
      },
    ],
  },

  {
    id: 'event_lonely_rain',
    type: 'personal',
    title: '孤独な夜雨',
    body: '雨の夜、誰とも話さない時間が続く。孤独の中に何かが見えてくる気がした。',
    trigger: { minTurn: 8, probability: 0.3 },
    choices: [
      {
        label: '孤独と向き合う',
        successOutcome: {
          text: '静けさの中で自分を見つめ直した。魅力と天命が少し増した。',
          statChanges: { charm: 1, omen: 5 },
        },
      },
      {
        label: '誰かに会いに行く',
        successOutcome: {
          text: '酒館に出て人と話した。気持ちが楽になった。',
          statChanges: { charm: 1, stamina: -5 },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Category B: Social (6)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_town_festival',
    type: 'social',
    title: '城下祭禮',
    body: '城下で祭りが開かれた。直家、千代、彌兵衛など多くの顔が集う。誰と時間を過ごす？',
    trigger: { turn: 6 },
    choices: [
      {
        label: '主君・直家と共に過ごす',
        successOutcome: {
          text: '直家と並んで祭りを見た。彼の信頼が深まった。',
          relationChanges: { lord: 6 },
        },
      },
      {
        label: '千代と共に過ごす',
        successOutcome: {
          text: '千代と神社の話をしながら祭りを楽しんだ。',
          relationChanges: { priestess: 6 },
        },
      },
      {
        label: '彌兵衛と商売の話をする',
        successOutcome: {
          text: '彌兵衛から市場の動きを聞けた。有益な情報だった。',
          relationChanges: { merchant: 4 },
          statChanges: { commerce: 1 },
        },
      },
    ],
  },

  {
    id: 'event_tavern_brawl',
    type: 'social',
    title: '酒館の口角',
    body: '酒館で口喧嘩が起きた。朧雨之介と見知らぬ男が一触即発の状態だ。',
    trigger: { locationId: 'loc_tavern', probability: 0.4 },
    choices: [
      {
        label: '仲裁に入る',
        check: 'charm',
        threshold: 8,
        successOutcome: {
          text: 'うまく仲裁できた。酒館の人々に一目置かれた。',
          statChanges: { fame: 2 },
          relationChanges: { rival: 3, informant: 3 },
        },
        failOutcome: {
          text: '仲裁に失敗し、巻き込まれてしまった。',
          statChanges: { stamina: -15 },
        },
      },
      {
        label: '煽り立てる',
        successOutcome: {
          text: '面白くなった。鴉一が楽しそうに笑った。',
          relationChanges: { informant: 5, rival: -3 },
        },
      },
      {
        label: '静かに離れる',
        successOutcome: {
          text: '賢く距離を置いた。',
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },

  {
    id: 'event_shrine_prayer',
    type: 'social',
    title: '神社祈願の方向',
    body: '神社を訪れると、千代が「何を祈るかで、天命の流れが変わる」と告げた。',
    trigger: { locationId: 'loc_shrine', probability: 0.5 },
    choices: [
      {
        label: '武運（武藝）を祈る',
        successOutcome: {
          text: '武の神に祈った。身体が少し引き締まった気がする。',
          statChanges: { martial: 1, omen: 5 },
        },
      },
      {
        label: '智慧を祈る',
        successOutcome: {
          text: '智の神に祈った。頭が冴えてきた。',
          statChanges: { wisdom: 1, omen: 5 },
        },
      },
      {
        label: '財（商才）を祈る',
        successOutcome: {
          text: '富の神に祈った。良い取引の予感がする。',
          statChanges: { commerce: 1, omen: 5 },
        },
      },
      {
        label: '縁（魅力）を祈る',
        successOutcome: {
          text: '縁の神に祈った。人との繋がりが深まりそうだ。',
          statChanges: { charm: 1, omen: 5 },
        },
      },
    ],
  },

  {
    id: 'event_retainer_sigh',
    type: 'social',
    title: '老家臣の嘆息',
    body: '榊原兵庫が珍しく打ち明けた：「私はかつて、大切なものを守るために戦わなかった。それを後悔している」。',
    trigger: { relations: { retainer: 10 }, probability: 0.6 },
    choices: [
      {
        label: '「それでも、あなたは正しかったと思います」',
        successOutcome: {
          text: '老人はゆっくり頷いた。心が少し開いた気がした。',
          relationChanges: { retainer: 8 },
          flagsSet: ['flag_retainer_opened'],
        },
      },
      {
        label: '「後悔が人を強くする」',
        successOutcome: {
          text: '兵庫は苦笑いした。「若者らしい言葉だ」と言った。',
          relationChanges: { retainer: 5 },
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },

  {
    id: 'event_market_child',
    type: 'social',
    title: '市場の迷子',
    body: '市場で泣いている子供を見つけた。親を探してやるべきか、急ぎの用事を優先するか。',
    trigger: { locationId: 'loc_market', probability: 0.4 },
    choices: [
      {
        label: '子供を助ける',
        successOutcome: {
          text: '親が見つかり、感謝された。街の人々に少し名が知れた。',
          statChanges: { fame: 2 },
          relationChanges: { merchant: 3 },
          flagsSet: ['flag_helped_child'],
        },
      },
      {
        label: '無視して通り過ぎる',
        successOutcome: {
          text: '用事を優先した。後味が悪い。',
        },
      },
    ],
  },

  {
    id: 'event_secret_tea',
    type: 'social',
    title: '秘密の茶席',
    body: '千代から茶席に招かれた。「あなたに話したいことがある」と彼女は静かに言った。',
    trigger: { relations: { priestess: 15 }, probability: 0.6 },
    choices: [
      {
        label: '素直に聞く',
        successOutcome: {
          text: '千代は直家の悩みを話してくれた。重要な情報を得た。',
          relationChanges: { priestess: 5, lord: 3 },
          flagsSet: ['flag_chiyo_secret'],
        },
      },
      {
        label: '茶を楽しむだけ',
        successOutcome: {
          text: '穏やかな時間を過ごした。心が落ち着いた。',
          statChanges: { stamina: 15, omen: 5 },
          relationChanges: { priestess: 4 },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Category C: World (4)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_price_surge',
    type: 'world',
    title: '物価の波乱',
    body: '近隣の争いで物価が急上昇している。商人たちは顔を曇らせ、市場は喧騒に包まれた。',
    trigger: { minTurn: 6, probability: 0.4 },
    choices: [
      {
        label: '今のうちに買い溜めする',
        check: 'commerce',
        threshold: 8,
        successOutcome: {
          text: '値が上がる前に確保できた。賢い判断だ。',
          statChanges: { gold: -30 },
          flagsSet: ['flag_stocked_up'],
        },
        failOutcome: {
          text: '良い品は既に売れていた。出遅れた。',
        },
      },
      {
        label: '様子を見る',
        successOutcome: {
          text: '焦らず状況を観察した。',
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },

  {
    id: 'event_neighbors_restless',
    type: 'world',
    title: '隣国の動揺',
    body: '隣国で軍が動き始めたという噂が広まった。直家は焦った表情を見せている。',
    trigger: { flags: ['flag_neighbors_restless'], probability: 0.7 },
    choices: [
      {
        label: '主君に報告し助言する',
        successOutcome: {
          text: '直家に情報を伝えた。信頼が増した。',
          relationChanges: { lord: 5 },
          statChanges: { fame: 3 },
        },
      },
      {
        label: '静観する',
        successOutcome: {
          text: 'まだ動く時ではないと判断した。',
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },

  {
    id: 'event_famine_shadow',
    type: 'world',
    title: '飢饉の影',
    body: '軍糧の失敗が重なり、城下に食糧不足の影が差し始めた。民の不満が高まっている。',
    trigger: { flags: ['flag_security_low'], probability: 0.6 },
    choices: [
      {
        label: '自分の資金で補う',
        successOutcome: {
          text: '私財を投じ、民の不満を和らげた。名声が上がった。',
          statChanges: { gold: -50, fame: 5 },
          flagsSet: ['flag_people_trust'],
        },
      },
      {
        label: '問題を報告するだけにする',
        successOutcome: {
          text: '報告したが、解決策は出なかった。',
          statChanges: { fame: -2 },
        },
      },
    ],
  },

  {
    id: 'event_celestial_anomaly',
    type: 'world',
    title: '天象異変',
    body: '夜空に彗星が現れた。人々は吉兆か凶兆かと噂した。陰陽師として見解を求められている。',
    trigger: { minTurn: 10, probability: 0.35 },
    choices: [
      {
        label: '吉兆と告げる',
        check: 'wisdom',
        threshold: 9,
        successOutcome: {
          text: '民の不安が和らぎ、あなたへの信頼が増した。',
          statChanges: { fame: 4 },
          flagsSet: ['flag_celestial_good'],
        },
        failOutcome: {
          text: '占いが外れ、信頼を失った。',
          statChanges: { fame: -3 },
        },
      },
      {
        label: '凶兆と告げ、備えを促す',
        successOutcome: {
          text: 'もし本当に問題が起きても対応できるよう備えた。慎重な一手。',
          statChanges: { wisdom: 1 },
          flagsSet: ['flag_celestial_prepared'],
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Category D: Career / Rare (4)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_first_audience',
    type: 'career',
    title: '初次謁見',
    body: '朝霧直家と初めて正式に顔を合わせた。「そなたが噂の陰陽師か」と彼は静かに言った。',
    trigger: { locationId: 'loc_castle', turn: 2 },
    choices: [
      {
        label: '「一命をかけてお仕えします」と誓う',
        successOutcome: {
          text: '直家はかすかに微笑んだ。「期待している」。',
          relationChanges: { lord: 8 },
          statChanges: { fame: 2 },
          flagsSet: ['flag_lord_first_met'],
        },
      },
      {
        label: '「天命があなたを支持している」と伝える',
        check: 'wisdom',
        threshold: 8,
        successOutcome: {
          text: '直家は興味深そうに頷いた。陰陽師としての独自性を示した。',
          relationChanges: { lord: 6 },
          statChanges: { fame: 3, omen: 5 },
          flagsSet: ['flag_lord_first_met'],
        },
        failOutcome: {
          text: '直家は眉をひそめた。「大言壮語は信用できない」。',
          relationChanges: { lord: -3 },
          flagsSet: ['flag_lord_first_met'],
        },
      },
    ],
  },

  {
    id: 'event_secret_counsel',
    type: 'career',
    title: '密室の問計',
    body: '数度の任務の後、直家が一対一で話したいと呼んだ。「私の敵と味方を見分けてほしい」と。',
    trigger: {
      completedQuests: ['quest_lord_nightmare'],
      minTurn: 8,
      probability: 0.65,
    },
    choices: [
      {
        label: '確信を持って助言する',
        check: 'wisdom',
        threshold: 11,
        successOutcome: {
          text: '的を射た助言に直家は頷いた。「やはりあなたは必要だ」。',
          relationChanges: { lord: 10 },
          statChanges: { fame: 5 },
          flagsSet: ['flag_lord_counsel_done'],
        },
        failOutcome: {
          text: '助言が外れ、直家は複雑な顔をした。',
          relationChanges: { lord: -3 },
        },
      },
      {
        label: '慎重に「もう少し時間が必要」と答える',
        successOutcome: {
          text: '正直さが信頼を生んだ。直家は「誠実な者だ」と言った。',
          relationChanges: { lord: 4 },
        },
      },
    ],
  },

  {
    id: 'event_tsukuyomi_question',
    type: 'fate',
    title: '月讀の試問',
    body: '月讀婆婆が突然現れ、謎めいた言葉を放った：「未来が見えたとき、人は変えようとするか、受け入れるか——どちらが真の賢者か？」',
    trigger: { flags: ['flag_fate_awakened'], probability: 0.7 },
    choices: [
      {
        label: '「変えようとする者」',
        successOutcome: {
          text: '婆婆は目を細めた。「それが人の業だ。よかろう」。',
          statChanges: { omen: 15, wisdom: 1 },
          flagsSet: ['flag_tsukuyomi_challenger'],
        },
      },
      {
        label: '「受け入れる者」',
        successOutcome: {
          text: '婆婆は深く頷いた。「それが天命の道だ」。',
          statChanges: { omen: 20 },
          flagsSet: ['flag_tsukuyomi_acceptor'],
        },
      },
    ],
  },

  {
    id: 'event_fate_decision',
    type: 'fate',
    title: '命運の抉擇',
    body: '全てが収束しつつある。月讀が言っていた「命運を変える選択」の瞬間が来た。どの道を選ぶ？',
    trigger: {
      flags: ['flag_fate_crossroads_done'],
      probability: 1,
    },
    choices: [
      {
        label: '主君と共に国を守る道（功勳路線）',
        successOutcome: {
          text: 'あなたは主君の軍師として、小国の命運を担う覚悟を決めた。',
          flagsSet: ['flag_path_merit'],
          statChanges: { fame: 5 },
        },
      },
      {
        label: '自分の流派を立てる道（独立路線）',
        successOutcome: {
          text: 'あなたは権力から離れ、自分だけの占術道場を開く決意をした。',
          flagsSet: ['flag_path_independent'],
          statChanges: { fame: 3 },
        },
      },
      {
        label: '全てから逃げる（孤影路線）',
        successOutcome: {
          text: '重荷に耐えられなくなり、あなたは城下を去ることを選んだ。',
          flagsSet: ['flag_path_escaped'],
          statChanges: { fame: -5 },
        },
      },
    ],
  },
]
