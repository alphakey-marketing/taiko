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
]
