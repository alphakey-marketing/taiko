import type { Background } from '../types/game'

export const BACKGROUNDS: Background[] = [
  {
    id: 'samurai_apprentice',
    name: '武士見習',
    description: '主家に仕える武士見習い。武藝に優れ、戦場での名声を夢見る。',
    statBonuses: {
      martial: 3,
      wisdom: 1,
      stamina: 10,
    },
    startingGold: 50,
    startingFame: 5,
    startingRelations: {
      npc_lord_kato: 20,
      npc_mentor_hayashi: 15,
    },
  },
  {
    id: 'merchant_apprentice',
    name: '商人學徒',
    description: '老舗商家の見習い。金勘定と交渉術が得意で、人脈を活かして世渡りする。',
    statBonuses: {
      commerce: 3,
      charm: 1,
      gold: 70,
    },
    startingGold: 120,
    startingFame: 3,
    startingRelations: {
      npc_merchant_suzuki: 25,
      npc_spy_kage: 10,
    },
  },
]
