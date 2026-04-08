import type { Item } from '../types/game'

export const ITEMS: Item[] = [
  {
    id: 'item_tengu_fan',
    name: '天狗の羽根扇',
    slot: 'accessory',
    statBonus: { omen: 15 },
    description: '古い神社の奥に眠っていた天狗の羽根でできた扇。天命の流れを大きく高める。',
    flavorText: '「風が変わった——天命もまた変わる」',
  },
  {
    id: 'item_old_blade',
    name: '古い太刀',
    slot: 'weapon',
    statBonus: { martial: 3 },
    description: '道場の師から授けられた古い太刀。刃こぼれがあるが、重みに確かな魂が宿る。',
    flavorText: '「剣は力ではなく、意志で切る」',
  },
  {
    id: 'item_merchant_abacus',
    name: '商人の算盤',
    slot: 'accessory',
    statBonus: { commerce: 4 },
    description: '早坂彌兵衛が長年使い込んだ算盤。商才を磨いた者だけが贈られる一品。',
    flavorText: '「数が正直なのは、人より正直だからだ」',
  },
  {
    id: 'item_star_grimoire',
    name: '星見の書',
    slot: 'scroll',
    statBonus: { wisdom: 2, omen: 10 },
    description: '霧岬港の行商人が持ち込んだ異国の星座書。智略と天命の両方を深める稀品。',
    flavorText: '「星の言葉は、国境を知らない」',
  },
  {
    id: 'item_shichifuku_seal',
    name: '七福腰印',
    slot: 'accessory',
    statBonus: {},
    description: '七福神を彫り込んだ金の腰印。装備しているだけで金運が驚くほど上がると言われる。',
    flavorText: '「富は、求めた者より、待てた者に来る」',
  },
]
