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
    trigger: { turn: 1, locationId: 'loc_home', flags: ['flag_bg_onmyoji'] },
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
    trigger: { maxStat: { stamina: 30 }, probability: 0.4 },
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
    trigger: { maxStat: { gold: 20 }, probability: 0.5 },
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
    trigger: { locationId: 'loc_dojo', minTurn: 5, probability: 0.5, flags: ['flag_bg_onmyoji'] },
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
    trigger: { locationId: 'loc_castle', minTurn: 2, minFame: 3, probability: 0.9 },
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

  // ═══════════════════════════════════════════════════════
  // Category G: NPC Deepening Events (12)
  // ═══════════════════════════════════════════════════════

  // ── 千代（巫女）── relations 10
  {
    id: 'event_chiyo_confide_1',
    type: 'social',
    title: '千代の悩み',
    body: '千代が修行の合間にあなたに打ち明けた。「神の声が聞こえるはずなのに、最近何も聞こえないの」',
    trigger: { locationId: 'loc_shrine', relations: { priestess: 10 } },
    choices: [
      {
        label: '一緒に悩みを探る（共感）',
        check: 'wisdom',
        threshold: 9,
        successOutcome: {
          text: '丁寧に話を聞いた。千代は少し楽になったようだ。',
          relationChanges: { priestess: 5 },
          statChanges: { omen: 5 },
        },
        failOutcome: {
          text: '何も言えなかった。千代は一人で境内へ去った。',
          relationChanges: { priestess: 1 },
        },
      },
      {
        label: '神社の外でも修行はできる（励ます）',
        successOutcome: {
          text: '前向きな言葉に千代の目が輝いた。',
          relationChanges: { priestess: 3 },
        },
      },
    ],
  },

  // ── 千代（巫女）── relations 20
  {
    id: 'event_chiyo_confide_2',
    type: 'social',
    title: '千代の家族の秘密',
    body: '深夜の参道で千代が囁いた。「実は……私の母は陰陽師だった。家族には秘密にしてきたけど、あなたになら話せる」',
    trigger: { locationId: 'loc_shrine', relations: { priestess: 20 } },
    choices: [
      {
        label: '秘密を共に守る',
        successOutcome: {
          text: '千代との絆が深まった。ふたりだけの秘密が生まれた。',
          relationChanges: { priestess: 8 },
          flagsSet: ['flag_chiyo_secret_shared'],
        },
      },
      {
        label: '陰陽師の血は誇りだと伝える',
        check: 'charm',
        threshold: 10,
        successOutcome: {
          text: '千代は初めて笑った——母のことを誇りに思えると言って。',
          relationChanges: { priestess: 6 },
          statChanges: { omen: 8 },
        },
        failOutcome: {
          text: 'うまく伝わらなかったが、千代は少しだけ表情を緩めた。',
          relationChanges: { priestess: 2 },
        },
      },
    ],
  },

  // ── 千代（巫女）── relations 30
  {
    id: 'event_chiyo_school',
    type: 'fate',
    title: '共に流派を',
    body: '千代が真剣な目であなたを見た。「一緒に新しい流派を開きませんか。天命と神職の力を合わせれば、きっと誰も見たことのない道が……」',
    trigger: { locationId: 'loc_shrine', relations: { priestess: 30 }, flags: ['flag_chiyo_secret_shared'] },
    choices: [
      {
        label: '一緒に流派を開く（大きな決断）',
        successOutcome: {
          text: '千代と共に流派を開く誓いを立てた。新たな天命の扉が開いた。',
          flagsSet: ['flag_school_with_chiyo', 'flag_school_selected'],
          relationChanges: { priestess: 10 },
          statChanges: { fame: 5, omen: 10 },
        },
      },
      {
        label: 'まだ時が来ていない',
        successOutcome: {
          text: '千代は少し寂しそうだったが、理解してくれた。',
          relationChanges: { priestess: -2 },
        },
      },
    ],
  },

  // ── 直家（藩主）── relations 10
  {
    id: 'event_lord_confide_1',
    type: 'social',
    title: '直家の迷い',
    body: '直家が月見の縁側で独り言のように語った。「小藩主など、どこへでも替えが利く……それでも守りたいものがある」',
    trigger: { locationId: 'loc_castle', relations: { lord: 10 } },
    choices: [
      {
        label: '守るものを尋ねる',
        check: 'charm',
        threshold: 9,
        successOutcome: {
          text: '直家が珍しく心を開いた。信頼が積み重なった。',
          relationChanges: { lord: 5 },
          statChanges: { fame: 2 },
        },
        failOutcome: {
          text: '直家は苦笑いして話題を変えた。',
          relationChanges: { lord: 1 },
        },
      },
      {
        label: '天命を読んで助言する',
        check: 'omen',
        threshold: 10,
        successOutcome: {
          text: '天命の言葉が直家の心に刺さった。彼の迷いが少し晴れた。',
          relationChanges: { lord: 6 },
          statChanges: { omen: -5, fame: 1 },
        },
        failOutcome: {
          text: '卦が曖昧だった。直家は礼を言い、部屋へ戻った。',
          relationChanges: { lord: 0 },
        },
      },
    ],
  },

  // ── 直家（藩主）── relations 20
  {
    id: 'event_lord_confide_2',
    type: 'career',
    title: '政争の秘密',
    body: '直家が内密に耳打ちした。「隣の領主が我が藩の内通者を買収しようとしている。お前には話しておく」',
    trigger: { locationId: 'loc_castle', relations: { lord: 20 } },
    choices: [
      {
        label: '内通者を探す（智略）',
        check: 'wisdom',
        threshold: 11,
        successOutcome: {
          text: '内通者の尻尾をつかんだ。直家への忠誠が認められた。',
          relationChanges: { lord: 8 },
          flagsSet: ['flag_spy_caught'],
          statChanges: { fame: 3 },
        },
        failOutcome: {
          text: '手がかりをつかめなかった。直家は落胆した様子だった。',
          relationChanges: { lord: -2 },
        },
      },
      {
        label: '知らないふりをする',
        successOutcome: {
          text: '距離を置いた。直家は少し失望した目を向けた。',
          relationChanges: { lord: -3 },
        },
      },
    ],
  },

  // ── 直家（藩主）── relations 30
  {
    id: 'event_lord_conspiracy',
    type: 'fate',
    title: '謀反の計画',
    body: '直家が震える声で囁いた。「……隣国の侵攻が近い。私は先手を打つつもりだ。お前にしか話せない」',
    trigger: { locationId: 'loc_castle', relations: { lord: 30 }, flags: ['flag_spy_caught'] },
    choices: [
      {
        label: '共に謀を担う（忠誠路線）',
        successOutcome: {
          text: '直家の計画を支持した。これであなたは彼の腹心となった。',
          flagsSet: ['flag_lord_conspiracy', 'flag_merit_ending_open'],
          relationChanges: { lord: 12 },
          statChanges: { fame: 5 },
        },
      },
      {
        label: '離れる（中立路線）',
        successOutcome: {
          text: 'あなたは深入りしないことにした。直家の目に複雑な色が浮かんだ。',
          relationChanges: { lord: -5 },
        },
      },
    ],
  },

  // ── 早坂（商人）── relations 10
  {
    id: 'event_merchant_past',
    type: 'social',
    title: '早坂の失敗談',
    body: '早坂が苦笑いで話し始めた。「若い頃、大きな商売に失敗してな……全財産を失った。それでも立ち直れたのは……」',
    trigger: { locationId: 'loc_market', relations: { merchant: 10 } },
    choices: [
      {
        label: '続きを聞く',
        successOutcome: {
          text: '早坂の話に引き込まれた。商才の真髄を少し学んだ気がした。',
          relationChanges: { merchant: 5 },
          statChanges: { commerce: 1 },
        },
      },
      {
        label: '立ち直れた理由を尋ねる',
        check: 'charm',
        threshold: 8,
        successOutcome: {
          text: '早坂が笑って肩を叩いた。「そういうやつが好きだ」',
          relationChanges: { merchant: 7 },
        },
        failOutcome: {
          text: '早坂は少し口をつぐんだ。「……また今度な」',
          relationChanges: { merchant: 2 },
        },
      },
    ],
  },

  // ── 早坂（商人）── relations 20
  {
    id: 'event_merchant_scandal',
    type: 'social',
    title: '偽商品のスキャンダル',
    body: '早坂が顔を赤くして打ち明けた。「実は……以前、粗悪品を高値で売ったことがある。今でも夢に出る」',
    trigger: { locationId: 'loc_market', relations: { merchant: 20 } },
    choices: [
      {
        label: '過去は過去だと励ます',
        successOutcome: {
          text: '早坂の顔が少し明るくなった。信頼がより深まった。',
          relationChanges: { merchant: 6 },
          flagsSet: ['flag_merchant_trusted'],
        },
      },
      {
        label: '正直に謝罪する方がいいと伝える',
        check: 'wisdom',
        threshold: 10,
        successOutcome: {
          text: '早坂は深くうなずいた。「そうだな……お前は本物だ」',
          relationChanges: { merchant: 8 },
          statChanges: { fame: 2 },
        },
        failOutcome: {
          text: 'うまく伝わらなかった。早坂は曖昧に笑った。',
          relationChanges: { merchant: 2 },
        },
      },
    ],
  },

  // ── 早坂（商人）── relations 30
  {
    id: 'event_merchant_smuggle_invite',
    type: 'social',
    title: '港の密輸ルート',
    body: '早坂が声を潜めた。「霧岬港に俺の秘密のルートがある。お前なら信用できる……一緒にやらないか？」',
    trigger: { locationId: 'loc_market', relations: { merchant: 30 }, flags: ['flag_merchant_trusted'] },
    choices: [
      {
        label: '誘いに乗る（商人路線）',
        successOutcome: {
          text: '港の密輸ルートに加わった。大きな商機と危険の両方が近づいた。',
          flagsSet: ['flag_smuggle_route', 'flag_war_intel'],
          relationChanges: { merchant: 10 },
          statChanges: { gold: 50 },
        },
      },
      {
        label: '断る（安全路線）',
        successOutcome: {
          text: '早坂は少し残念そうだったが、理解してくれた。',
          relationChanges: { merchant: -2 },
        },
      },
    ],
  },

  // ── 朧（ライバル）── relations 10 (affection starts negative, so track absolute)
  {
    id: 'event_rival_rematch',
    type: 'personal',
    title: '朧の再挑戦',
    body: '道場で朧が腕を組みながら言った。「……もう一度、稽古をつけてもらえるか。前回は不甲斐なかった」',
    trigger: { locationId: 'loc_dojo', relations: { rival: 5 } },
    choices: [
      {
        label: '喜んで応じる',
        check: 'martial',
        threshold: 9,
        successOutcome: {
          text: '激しい稽古の後、朧が素直に礼を言った。関係が変わった。',
          relationChanges: { rival: 8 },
          statChanges: { martial: 1 },
        },
        failOutcome: {
          text: 'あなたが負けた。朧は少し驚いた顔をして去った。',
          relationChanges: { rival: 3 },
          statChanges: { martial: 0 },
        },
      },
      {
        label: '断る',
        successOutcome: {
          text: '朧は黙って去った。',
          relationChanges: { rival: -2 },
        },
      },
    ],
  },

  // ── 朧（ライバル）── relations 15
  {
    id: 'event_rival_acknowledge',
    type: 'personal',
    title: '朧の本音',
    body: '朧が夕暮れの道場でぽつりと言った。「……お前は強い。俺が認めたくなかったのは、嫉妬だったかもしれない」',
    trigger: { locationId: 'loc_dojo', relations: { rival: 15 } },
    choices: [
      {
        label: 'お互い様だと言う',
        successOutcome: {
          text: '朧が初めて笑った——ぎこちない笑いだったが、確かに笑った。',
          relationChanges: { rival: 8 },
          flagsSet: ['flag_rival_respected'],
        },
      },
      {
        label: '黙って頷く',
        successOutcome: {
          text: '言葉はいらなかった。互いに分かっていた。',
          relationChanges: { rival: 5 },
        },
      },
    ],
  },

  // ── 朧（ライバル）── relations 25
  {
    id: 'event_rival_partner',
    type: 'fate',
    title: '共に修行しよう',
    body: '朧が真剣な目で言った。「……一緒に修行しないか。お前と俺が組めば、もっと高みに行ける気がする」',
    trigger: { locationId: 'loc_dojo', relations: { rival: 25 }, flags: ['flag_rival_respected'] },
    choices: [
      {
        label: '共に修行する（準仲間化）',
        successOutcome: {
          text: 'ライバルが仲間になった。道場に新しい風が吹いた。',
          flagsSet: ['flag_rival_ally'],
          relationChanges: { rival: 10 },
          statChanges: { martial: 2, fame: 2 },
        },
      },
      {
        label: '独りの道を選ぶ',
        successOutcome: {
          text: '朧は少し寂しそうだったが、頷いた。',
          relationChanges: { rival: -3 },
        },
      },
    ],
  },

  // ── 港NPCイベント ──
  {
    id: 'event_smuggler_offer',
    type: 'social',
    title: '浜田の密かな取引',
    body: '浜田宗右衛門が目を細めた。「珍しい荷が入ってきた。表には出せないが……腕のいい商人なら分かるだろう？」',
    trigger: { locationId: 'loc_port' },
    choices: [
      {
        label: '興味を示す（商才）',
        check: 'commerce',
        threshold: 10,
        successOutcome: {
          text: '取引成立。かなりの利益を得た。浜田との信頼も深まった。',
          relationChanges: { sea_merchant: 8 },
          statChanges: { gold: 60, commerce: 1 },
        },
        failOutcome: {
          text: '交渉が決裂した。浜田が苦い顔をした。',
          relationChanges: { sea_merchant: -3 },
          statChanges: { gold: -10 },
        },
      },
      {
        label: '断る',
        successOutcome: {
          text: '浜田は肩をすくめた。「真面目だね、あんたは」',
          relationChanges: { sea_merchant: 2 },
        },
      },
    ],
  },

  {
    id: 'event_merchant_past_failure',
    type: 'social',
    title: '浜田の過去',
    body: '浜田が夕暮れに語り始めた。「若い頃、商売に失敗して借金まみれになった。港が俺を救ってくれた……」',
    trigger: { locationId: 'loc_port', relations: { sea_merchant: 10 } },
    choices: [
      {
        label: '話の続きを聞く',
        successOutcome: {
          text: '浜田の商才の源を知った。商才が上がった。',
          relationChanges: { sea_merchant: 5 },
          statChanges: { commerce: 2 },
        },
      },
    ],
  },

  {
    id: 'event_smuggle_route_invite',
    type: 'social',
    title: '密輸ルートへの誘い',
    body: '浜田が声を潜めた。「本当に信用できる奴だけに教える話がある……港の抜け道だ」',
    trigger: { locationId: 'loc_port', relations: { sea_merchant: 20 } },
    choices: [
      {
        label: 'ルートに加わる',
        successOutcome: {
          text: '秘密のルートを知った。大きなビジネスが動き出した。',
          flagsSet: ['flag_smuggle_route', 'flag_secret_route'],
          relationChanges: { sea_merchant: 10 },
          statChanges: { gold: 80 },
        },
      },
      {
        label: '断る',
        successOutcome: {
          text: '浜田はため息をついた。',
          relationChanges: { sea_merchant: -2 },
        },
      },
    ],
  },

  {
    id: 'event_traveler_gift',
    type: 'rare',
    title: '異国人の贈り物',
    body: 'ルカスが革の袋を差し出した。「あの嵐の夜、助けてもらった恩返しだ。故郷から持ってきた星見の書だ」',
    trigger: { locationId: 'loc_port', flags: ['flag_storm_helped'] },
    choices: [
      {
        label: '礼を言って受け取る',
        successOutcome: {
          text: '「星見の書」を手に入れた。知識と天命が広がった。',
          statChanges: { wisdom: 2, omen: 10 },
          flagsSet: ['flag_item_star_grimoire'],
        },
      },
    ],
  },

  {
    id: 'event_guard_warning',
    type: 'social',
    title: '鉄次の警告',
    body: '港の用心棒・鉄次が低い声で言った。「お前のことは悪く思ってない。だが……深入りするな。港には見えない力がある」',
    trigger: { locationId: 'loc_port' },
    choices: [
      {
        label: '警告を受け入れる',
        successOutcome: {
          text: '鉄次を信頼することにした。',
          relationChanges: { port_guard: 5 },
          flagsSet: ['flag_port_warned'],
        },
      },
      {
        label: '気にせず突き進む',
        successOutcome: {
          text: '鉄次は何も言わず肩をすくめた。',
          relationChanges: { port_guard: -2 },
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Category H: Rare Events (5)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_moonlit_visitor',
    type: 'rare',
    title: '🌕 満月の夜の来訪者',
    body: '満月の夜、神社の境内に見知らぬ老人が立っていた。「この月夜を読める者を探しておった……お主は面白い」',
    trigger: {
      locationId: 'loc_shrine',
      minTurn: 12,
      probability: 0.06,
    },
    choices: [
      {
        label: '老人の話を聞く',
        successOutcome: {
          text: '老人は懐から天狗の羽根扇を取り出し、あなたに渡した。姿が消えた。',
          statChanges: { omen: 15 },
          flagsSet: ['flag_item_tengu_fan', 'flag_moonlit_visitor_met'],
        },
      },
      {
        label: '怪しんで追い払う',
        successOutcome: {
          text: '老人は静かに笑い、霧の中に消えた。何かを失った気がした。',
          statChanges: { omen: -5 },
        },
      },
    ],
  },

  {
    id: 'event_castle_fire',
    type: 'rare',
    title: '🔥 城下の火事',
    body: '突然、城下から黒煙が上がった。火の手が広がり、住民たちが逃げ惑っている。',
    trigger: {
      minStat: { omen: 0 },
      probability: 0.05,
    },
    choices: [
      {
        label: '救助に向かう（英雄的行為）',
        check: 'martial',
        threshold: 9,
        successOutcome: {
          text: '命がけで人々を助けた。城下中に名が轟いた。',
          statChanges: { fame: 15, stamina: -20 },
          flagsSet: ['flag_fire_hero'],
        },
        failOutcome: {
          text: '助けようとしたが力及ばず、自身も傷を負った。',
          statChanges: { stamina: -30, fame: 3 },
        },
      },
      {
        label: '安全な場所へ避難する',
        successOutcome: {
          text: '自分の身を守った。しかし保身の評判が立った。',
          flagsSet: ['flag_coward'],
          statChanges: { fame: -3 },
        },
      },
    ],
  },

  {
    id: 'event_assassin_blade',
    type: 'rare',
    title: '⚔️ 暗殺者の刃',
    body: '夜道で覆面の男に囲まれた。「直家の腹心め……消えてもらう」',
    trigger: {
      minFame: 20,
      flags: ['flag_lord_conspiracy'],
      probability: 0.08,
    },
    choices: [
      {
        label: '迎え撃つ（武藝）',
        check: 'martial',
        threshold: 12,
        successOutcome: {
          text: '刺客を退けた。直家への忠誠が証明された。',
          flagsSet: ['flag_loyalty_proven'],
          statChanges: { fame: 5, martial: 1 },
        },
        failOutcome: {
          text: '傷を負いながらも逃げ延びた。しかし恐怖が残った。',
          statChanges: { stamina: -30, fame: -2 },
        },
      },
      {
        label: '逃げる',
        successOutcome: {
          text: '命からがら逃げた。直家の前に立てる顔がない。',
          flagsSet: ['flag_path_escaped'],
          statChanges: { fame: -5 },
        },
      },
    ],
  },

  {
    id: 'event_storm_shipwreck',
    type: 'rare',
    title: '🌊 嵐と難破船',
    body: '霧岬港に猛烈な嵐が来た。沖に難破した船が見える。乗客の叫び声が聞こえてくる。',
    trigger: {
      locationId: 'loc_port',
      probability: 0.07,
    },
    choices: [
      {
        label: '助けに行く',
        check: 'martial',
        threshold: 10,
        successOutcome: {
          text: '荒波を越えて乗客を救出した。異国人の命を救った。',
          flagsSet: ['flag_storm_helped'],
          statChanges: { fame: 8, stamina: -25 },
          relationChanges: { foreign_traveler: 20 },
        },
        failOutcome: {
          text: '波に飲まれそうになりながらも辛うじて岸に戻った。',
          statChanges: { stamina: -30 },
        },
      },
      {
        label: '見届けるだけ',
        successOutcome: {
          text: '何もできなかった。嵐が去り、浜に流れ着いた荷物を見た。',
          statChanges: { omen: -5 },
        },
      },
    ],
  },

  {
    id: 'event_twin_fate',
    type: 'rare',
    title: '🌑 双子の天命',
    body: '深夜の占いの最中、卦に見たことのないパターンが現れた。二つの命運が重なっている——双子の天命だ。',
    trigger: {
      minStat: { omen: 60 },
      probability: 0.04,
    },
    choices: [
      {
        label: '占いを続ける',
        check: 'omen',
        threshold: 14,
        successOutcome: {
          text: 'ふたつの天命が見えた。隠された存在がこの世に現れる予感がした。',
          flagsSet: ['flag_twin_fate_read', 'flag_hidden_npc_unlock'],
          statChanges: { omen: 10 },
        },
        failOutcome: {
          text: '卦が崩れた。天命の力が一時的に乱れた。',
          statChanges: { omen: -15 },
        },
      },
      {
        label: '占いを止める',
        successOutcome: {
          text: '直感に従って止めた。何かが静かに過ぎ去った気がした。',
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Category I: Samurai Path Events (5)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_samurai_first_day',
    type: 'career',
    title: '武士としての第一歩',
    body: '道場に通い始めた最初の夜、片桐宗真が問いかけた。「武士の道に入ったか。何のために剣を握る？」',
    trigger: { turn: 1, flags: ['flag_bg_samurai'] },
    choices: [
      {
        label: '「主君への忠義のため」',
        successOutcome: {
          text: '宗真は頷いた。「ならば今日から命を懸けよ」。直家への思いが固まった。',
          statChanges: { martial: 1, fame: 1 },
          relationChanges: { mentor: 4, lord: 4 },
          flagsSet: ['flag_samurai_path_loyalty'],
        },
      },
      {
        label: '「己の強さを証明するため」',
        successOutcome: {
          text: '宗真は少し間を置いた。「自分と向き合う道か——それもよかろう」。',
          statChanges: { martial: 1 },
          relationChanges: { mentor: 4 },
          flagsSet: ['flag_samurai_path_self'],
        },
      },
    ],
  },

  {
    id: 'event_mentor_philosophy',
    type: 'social',
    title: '師父の言葉',
    body: '誓いを立てた後の稽古で、宗真が珍しく口を開いた。「剣客の半生は剣に捧げられる。それを知ってなお、続けるか？」',
    trigger: { flags: ['flag_sword_vow'], locationId: 'loc_dojo', probability: 0.8 },
    choices: [
      {
        label: '「覚悟の上です」と答える',
        successOutcome: {
          text: '宗真の目が少し和らいだ。「ならばこの技を見せてやろう」。深い技を学んだ。',
          statChanges: { martial: 1, omen: 5 },
          relationChanges: { mentor: 6 },
          flagsSet: ['flag_mentor_teaching'],
        },
      },
      {
        label: '「まだ迷いがあります」と正直に言う',
        successOutcome: {
          text: '宗真は「正直さも武士の道だ」と言った。迷いが智略へと変わった。',
          statChanges: { wisdom: 2 },
          relationChanges: { mentor: 3 },
        },
      },
    ],
  },

  {
    id: 'event_war_draft',
    type: 'world',
    title: '徴兵の令',
    body: '戦の気配が漂い始めた。直家が「武士の者、申し出よ」と令を出した。あなたは武士見習い——選択が迫られている。',
    trigger: { minTurn: 10, flags: ['flag_bg_samurai'], probability: 0.7 },
    choices: [
      {
        label: '志願して出陣する',
        successOutcome: {
          text: '直家の軍に加わった。血と汗の中で、武士としての魂が研ぎ澄まされた。',
          statChanges: { martial: 2, stamina: -20, fame: 4 },
          relationChanges: { lord: 5, retainer: 3 },
          flagsSet: ['flag_samurai_war_volunteer'],
        },
      },
      {
        label: '「まだ技が未熟」と辞退する',
        successOutcome: {
          text: '正直な判断だ。ただし直家の視線が少し冷たくなった気がした。',
          statChanges: { wisdom: 1 },
          relationChanges: { lord: -4 },
        },
      },
    ],
  },

  {
    id: 'event_rival_past',
    type: 'social',
    title: '朧の過去',
    body: '朧雨之介が珍しく真剣な表情で語り始めた。「俺が浪人になった理由を聞かせてやろう——お前は俺に似ているから」。',
    trigger: { flags: ['flag_bg_samurai', 'flag_rival_respected'], locationId: 'loc_dojo', probability: 0.75 },
    choices: [
      {
        label: '「聞かせてくれ」と座る',
        successOutcome: {
          text: '朧は主君に裏切られ浪人になった経緯を話した。その目に同志への信頼が宿った。',
          statChanges: { wisdom: 1 },
          relationChanges: { rival: 8 },
          flagsSet: ['flag_rival_story_heard'],
        },
      },
      {
        label: '「過去より今を見る」と返す',
        successOutcome: {
          text: '朧は一瞬驚き、それから笑った。「剣客らしい返しだ」。',
          statChanges: { charm: 1 },
          relationChanges: { rival: 3 },
        },
      },
    ],
  },

  {
    id: 'event_samurai_path_choice',
    type: 'fate',
    title: '武士の岐路',
    body: '武士として歩んできた道の先に、二つの岐路がある——主君・直家に仕えて国を守るか、己の刀一本で自由に生きるか。',
    trigger: { minTurn: 16, flags: ['flag_bg_samurai', 'flag_sword_vow'], probability: 0.9 },
    choices: [
      {
        label: '主君への忠義を貫く',
        successOutcome: {
          text: '心が決まった。この刀は直家のために振るう。それが武士の本懐だ。',
          statChanges: { fame: 5 },
          relationChanges: { lord: 8 },
          flagsSet: ['flag_samurai_serve_lord'],
        },
      },
      {
        label: '己の剣道を極める独立の道',
        successOutcome: {
          text: '誰にも縛られず、ただ剣と向き合う——それが本当の自分の道だと気づいた。',
          statChanges: { martial: 2, fame: 3 },
          relationChanges: { rival: 5 },
          flagsSet: ['flag_samurai_independent'],
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // Category J: Merchant Path Events (5)
  // ═══════════════════════════════════════════════════════

  {
    id: 'event_merchant_origin',
    type: 'personal',
    title: '没落の記憶',
    body: '夜、目を閉じると父の算盤、母の涙、燃える蔵の匂いが蘇る。「一からやり直す」——そう誓ったあの日が、今も胸に焼きついている。',
    trigger: { turn: 1, flags: ['flag_bg_merchant'] },
    choices: [
      {
        label: '過去を力に変える（商売の復讐）',
        successOutcome: {
          text: '怒りと悲しみを商才に変えた。どんな逆境でも諦めない心が宿った。',
          statChanges: { commerce: 1, gold: 10 },
          flagsSet: ['flag_path_revenge_commerce'],
        },
      },
      {
        label: '新しい自分を作る（誇りある再出発）',
        successOutcome: {
          text: '過去は過去だ。今日から新しい物語を書く——そう心に刻んだ。',
          statChanges: { charm: 1, omen: 5 },
          flagsSet: ['flag_path_new_self'],
        },
      },
    ],
  },

  {
    id: 'event_debt_collector',
    type: 'personal',
    title: '取立人の影',
    body: '家の古い債権者が現れた。「親父の借金、利子込みで80貫残っているぞ」。冷たい目で金を要求している。',
    trigger: { minTurn: 2, flags: ['flag_bg_merchant'], probability: 0.85 },
    choices: [
      {
        label: '今すぐ全額払う（50貫）',
        successOutcome: {
          text: '毅然と払った。商人として筋を通した。彌兵衛もその噂を聞いた。',
          statChanges: { gold: -50 },
          relationChanges: { merchant: 4 },
          flagsSet: ['flag_debt_paid_early'],
        },
      },
      {
        label: '交渉して先延ばしにする',
        check: 'charm',
        threshold: 8,
        successOutcome: {
          text: '話術で返済を分割させることに成功した。商人としての弁舌が光った。',
          relationChanges: { merchant: 3 },
          flagsSet: ['flag_debt_negotiated'],
        },
        failOutcome: {
          text: '交渉は失敗。取立人は怒り、噂が広まった。',
          statChanges: { fame: -2, gold: -20 },
        },
      },
    ],
  },

  {
    id: 'event_trade_rival',
    type: 'world',
    title: '新参商人の台頭',
    body: '「黒田屋」という新参商人が城下市場で客を奪い始めた。彌兵衛も苦い顔をしている。「どう出るつもりだ？」',
    trigger: { minTurn: 8, flags: ['flag_bg_merchant', 'flag_merchant_trusted'], probability: 0.7 },
    choices: [
      {
        label: '正面から価格と品質で競争する',
        check: 'commerce',
        threshold: 10,
        successOutcome: {
          text: '品質と速さで黒田屋を押しのけた。城下での評判が上がった。',
          statChanges: { commerce: 2, gold: 50 },
          relationChanges: { merchant: 4 },
          flagsSet: ['flag_commerce_won'],
        },
        failOutcome: {
          text: '黒田屋の資金力に太刀打ちできず、一時的に客を失った。',
          statChanges: { gold: -20 },
          relationChanges: { merchant: -2 },
        },
      },
      {
        label: '黒田屋と手を組む（同業提携）',
        check: 'charm',
        threshold: 9,
        successOutcome: {
          text: '競争より協力を選んだ。黒田屋は信頼できるパートナーになった。',
          statChanges: { gold: 30, commerce: 1 },
          flagsSet: ['flag_merchant_ally'],
        },
        failOutcome: {
          text: '提携交渉が失敗した。商人同士の信頼は薄い。',
          statChanges: { fame: -2 },
        },
      },
    ],
  },

  {
    id: 'event_port_opportunity',
    type: 'career',
    title: '港の好機',
    body: '浜田宗右衛門が耳打ちした。「異国からの香辛料が入ってくる。今のうちに先物で仕込めば倍になる——ただし20貫の元手が要る」。',
    trigger: { locationId: 'loc_port', flags: ['flag_bg_merchant'], probability: 0.75 },
    choices: [
      {
        label: '投資する（20貫を賭ける）',
        check: 'commerce',
        threshold: 10,
        successOutcome: {
          text: '相場が読み通り動いた。80貫の利益が手に入った。',
          statChanges: { gold: 80 },
          relationChanges: { sea_merchant: 5 },
          flagsSet: ['flag_port_invested'],
        },
        failOutcome: {
          text: '相場が読み外れ、追加で20貫を失った。',
          statChanges: { gold: -20 },
          relationChanges: { sea_merchant: -2 },
        },
      },
      {
        label: '見送って様子を見る',
        successOutcome: {
          text: '慎重な一手だ。焦りは禁物——賢明だと宗右衛門も認めた。',
          statChanges: { wisdom: 1 },
        },
      },
    ],
  },

  {
    id: 'event_merchant_path_choice',
    type: 'fate',
    title: '商人の岐路',
    body: '商売人として立ってきた。今、選択の時が来た——港を拠点に海外交易へ乗り出すか、城下の商圏を固めて盤石の地盤を築くか。',
    trigger: { minTurn: 16, flags: ['flag_bg_merchant', 'flag_debt_cleared'], probability: 0.9 },
    choices: [
      {
        label: '海外交易に乗り出す（高リスク高リターン）',
        successOutcome: {
          text: '霧岬港から異国へ——商人としての最大の賭けに出た。',
          statChanges: { commerce: 2, fame: 3 },
          relationChanges: { sea_merchant: 5 },
          flagsSet: ['flag_sea_trade_route'],
        },
      },
      {
        label: '城下商圏を固める（安定路線）',
        successOutcome: {
          text: '焦らず、城下に根を張ることを選んだ。信頼と財が積み重なった。',
          statChanges: { gold: 100 },
          relationChanges: { merchant: 5 },
          flagsSet: ['flag_merchant_stronghold'],
        },
      },
    ],
  },
]

