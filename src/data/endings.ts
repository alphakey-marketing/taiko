import type { Ending } from '../types/game'

export const ENDINGS: Ending[] = [
  {
    id: 'ending_merit_counselor',
    title: '功勳顯赫',
    subtitle: '小國の軍師',
    description:
      'あなたは陰陽師の身でありながら、朝霧直家の最も信頼する軍師となった。幾度もの危機を天命の洞察で乗り越え、小国に深い爪痕を残した。覇主にはなれずとも、その名は長く語り継がれる——天命を読んだ男、と。',
    condition: {
      minFame: 25,
      minRank: 'advisor',
      relations: { lord: 20 },
      priority: 10,
    },
  },
  {
    id: 'ending_independent_school',
    title: '自立一隅',
    subtitle: '風間占家の開祖',
    description:
      '権力の中心を離れたあなたは、城の郊外に自らの占術流派を開いた。武士も庶民も、ここへ来て運命の問いを立てる。あなたの名は「天命を見通す者」として静かに、しかし確かに広まっていった。',
    condition: {
      minFame: 15,
      minGold: 250,
      maxRank: 'retainer',
      relations: { merchant: 15, priestess: 15 },
      failureFlags: ['flag_merit_ending_open'],
      priority: 8,
    },
  },
  {
    id: 'ending_fallen_shadow',
    title: '命運錯位',
    subtitle: '雨夜に消えた孤影',
    description:
      'かつて、天命を変えられると信じられていた者がいた。だがその者は、最大の選択の前で退いた。城下の噂話として残るだけで、その名は誰にも覚えられない。雨の夜、その影は静かに消えた。',
    condition: {
      maxFame: -3,
      flags: ['flag_path_escaped'],
      priority: 5,
    },
  },

  // ── New Endings ───────────────────────────────────────────────────────────

  {
    id: 'ending_oracle_sage',
    title: '天命の賢者',
    subtitle: '土御門流の開祖',
    description:
      '世俗の権力に背を向け、天命の道だけを歩んだあなたは、やがて土御門流の開祖として名を刻んだ。王侯も将軍も、あなたの前では一人の迷える人間に過ぎない。占いの言葉は、千年後の人々にも届いた。',
    condition: {
      minStat: { omen: 70 },
      flags: ['flag_school_selected'],
      failureFlags: ['flag_merit_ending_open'],
      priority: 12,
    },
  },
  {
    id: 'ending_sword_sage',
    title: '刀客一道',
    subtitle: '剣に生きた孤高の剣士',
    description:
      '武士見習いとして生まれ、剣の道を極めた者がいた。巡礼を終えたあなたの太刀筋は師をも超え、「一道の剣聖」と呼ばれるようになった。政には関わらず、ただ剣と向き合い、静かに老いていった。',
    condition: {
      minStat: { martial: 15 },
      flags: ['flag_bg_samurai', 'flag_sword_pilgrim_done'],
      priority: 11,
    },
  },
  {
    id: 'ending_trade_empire',
    title: '財閥の礎',
    subtitle: '霧岬商会の創始者',
    description:
      '没落商家から身を起こし、組合の看板を背負い、霧岬港を拠点に一大商会を築いた。貿易・密輸・情報網——あなたの手が届かぬ場所はなくなった。財は力。あなたは次の世代のための礎を置いた。',
    condition: {
      minGold: 500,
      relations: { merchant: 30 },
      flags: ['flag_bg_merchant', 'flag_guild_member'],
      priority: 11,
    },
  },
  {
    id: 'ending_bond_legacy',
    title: '人縁の絆',
    subtitle: '誰もが信頼した人物',
    description:
      '功績よりも財よりも、あなたが残したのは人との絆だった。巫女も商人も武士も、あなたを「あの人」と呼んだ。名声は高くなくても、関わった全ての人の心に刻まれた——それがあなたの遺産だ。',
    condition: {
      relations: {
        lord: 15,
        priestess: 15,
        merchant: 15,
        mentor: 15,
        rival: 15,
      },
      priority: 9,
    },
  },
  {
    id: 'ending_school_founder',
    title: '流派開祖',
    subtitle: '後世に続く流派を作った者',
    description:
      '流派を選び、その道を極めたあなたは、やがて弟子を集め、自らの名を冠した流派を世に問うた。「師の教えは、弟子の体に生き続ける」——あなたの流派は百年後も語り継がれた。',
    condition: {
      minFame: 20,
      flags: ['flag_school_selected', 'flag_school_with_chiyo'],
      priority: 9,
    },
  },
  {
    id: 'ending_shadow_king',
    title: '陰の支配者',
    subtitle: '表に出ず、裏から操る者',
    description:
      '名前は知られていない。顔も知られていない。だがこの城下のあらゆる動きは、あなたの意志に従って動いていた。鴉一さえも、あなたの手の中だった。——陰に生き、陰に死ぬ者の美学。',
    condition: {
      flags: ['flag_secret_route'],
      relations: { informant: 25 },
      failureFlags: ['flag_merit_ending_open'],
      priority: 7,
    },
  },
]

