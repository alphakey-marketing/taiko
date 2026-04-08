import type { Background } from '../types/game'

export const BACKGROUNDS: Background[] = [
  {
    id: 'onmyoji_apprentice',
    name: '陰陽師見習',
    description:
      '郊外の小屋に住む陰陽師見習い。占術の才があり、天命を読む力を磨いている。武より知と魅力で世を渡る。',
    statBonuses: {
      wisdom: 3,
      charm: 2,
      omen: 20,
    },
    startingGold: 40,
    startingFame: 0,
    startingRelations: {
      priestess: 10,
      ronin: 0,
    },
  },
  {
    id: 'samurai_apprentice',
    name: '武士見習い',
    description:
      '道場で剣の道を歩む武士の卵。師と主君への忠義を胸に、武藝を磨いて立身出世を目指す。道場クエストで頭角を現す。',
    statBonuses: {
      martial: 3,
      wisdom: -1,
    },
    startingGold: 60,
    startingFame: 2,
    startingRelations: {
      mentor: 10,
      lord: 5,
    },
  },
  {
    id: 'fallen_merchant',
    name: '没落商家の子',
    description:
      'かつて栄えた商家が没落し、一から出直す商人の子。金勘定と話術に長け、港で新たな商機を探している。',
    statBonuses: {
      commerce: 3,
      charm: 2,
      martial: -1,
    },
    startingGold: 100,
    startingFame: 0,
    startingRelations: {
      merchant: 10,
    },
  },
]
