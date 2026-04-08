import type { Achievement, GameState } from '../types/game'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_quest',
    title: '最初の一歩',
    description: '初めてのクエストを完了した',
    icon: '🏅',
    check: (s: GameState) => s.player.completedQuestIds.length >= 1,
  },
  {
    id: 'ach_five_quests',
    title: '任務の達人',
    description: '5つのクエストを完了した',
    icon: '📜',
    check: (s: GameState) => s.player.completedQuestIds.length >= 5,
  },
  {
    id: 'ach_duel_winner',
    title: '剣の誇り',
    description: '決闘に勝利した',
    icon: '⚔️',
    check: (s: GameState) => s.player.flags.includes('flag_dojo_trial_passed'),
  },
  {
    id: 'ach_gold_500',
    title: '財の王道',
    description: '金を500貫以上所持した',
    icon: '💰',
    check: (s: GameState) => s.player.stats.gold >= 500,
  },
  {
    id: 'ach_fame_25',
    title: '世に知られた者',
    description: '名声を25以上達成した',
    icon: '🌟',
    check: (s: GameState) => s.player.stats.fame >= 25,
  },
  {
    id: 'ach_advisor',
    title: '軍師の位',
    description: '軍師に昇進した',
    icon: '🏆',
    check: (s: GameState) => s.player.rank === 'advisor',
  },
  {
    id: 'ach_rare_event',
    title: '天の導き',
    description: '稀有イベントを経験した',
    icon: '🌙',
    check: (s: GameState) =>
      ['event_moonlit_visitor', 'event_castle_fire', 'event_assassin_blade', 'event_storm_shipwreck', 'event_twin_fate']
        .some((id) => s.player.flags.includes(`event_seen_${id}`)),
  },
  {
    id: 'ach_three_rare_events',
    title: '奇縁の旅人',
    description: '稀有イベントを3種類以上経験した',
    icon: '✨',
    check: (s: GameState) =>
      ['event_moonlit_visitor', 'event_castle_fire', 'event_assassin_blade', 'event_storm_shipwreck', 'event_twin_fate']
        .filter((id) => s.player.flags.includes(`event_seen_${id}`)).length >= 3,
  },
  {
    id: 'ach_rival_ally',
    title: '好敵手の絆',
    description: 'ライバル・朧と仲間になった',
    icon: '🤝',
    check: (s: GameState) => s.player.flags.includes('flag_rival_ally'),
  },
  {
    id: 'ach_port_unlocked',
    title: '霧岬の先へ',
    description: '霧岬港にたどり着いた',
    icon: '⚓',
    check: (s: GameState) => s.player.currentLocationId === 'loc_port' || s.player.flags.includes('flag_war_intel'),
  },
  {
    id: 'ach_school_founded',
    title: '流派の祖',
    description: '流派を選択した',
    icon: '🎓',
    check: (s: GameState) => s.player.flags.includes('flag_school_selected'),
  },
  {
    id: 'ach_coward',
    title: '保身の哲学',
    description: '城下の火事から逃げた',
    icon: '💔',
    check: (s: GameState) => s.player.flags.includes('flag_coward'),
  },
  {
    id: 'ach_chiyo_secret',
    title: '秘密の守り手',
    description: '千代の家族の秘密を守った',
    icon: '🌸',
    check: (s: GameState) => s.player.flags.includes('flag_chiyo_secret_shared'),
  },
  {
    id: 'ach_all_npcs_trusted',
    title: '人の縁',
    description: '全NPCとの関係値を10以上にした',
    icon: '❤️',
    check: (s: GameState) =>
      ['lord', 'priestess', 'retainer', 'mentor', 'merchant', 'informant', 'rival', 'ronin'].every(
        (npc) => (s.player.relations[npc] ?? 0) >= 10
      ),
  },
  {
    id: 'ach_storm_hero',
    title: '嵐の英雄',
    description: '嵐の難破船から人を救った',
    icon: '🌊',
    check: (s: GameState) => s.player.flags.includes('flag_storm_helped'),
  },
]
