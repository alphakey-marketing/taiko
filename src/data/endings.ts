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
      minGold: 400,
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
]
