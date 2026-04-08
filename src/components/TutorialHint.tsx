import { useGameStore } from '../store/gameStore'
import styles from './TutorialHint.module.css'

interface Hint {
  id: string
  icon: string
  text: string
  /** Returns true when this hint should be shown */
  when: (s: ReturnType<typeof useGameStore.getState>) => boolean
}

const HINTS: Hint[] = [
  {
    id: 'hint_low_stamina',
    icon: '⚠️',
    text: '体力が20以下です。自宅で「休息する」を使って回復しましょう。',
    when: (s) => s.player.stats.stamina <= 20,
  },
  {
    id: 'hint_first_turns',
    icon: '💡',
    text: '序盤は神社の「初次占兆」任務からスタートするのがおすすめです。',
    when: (s) => s.turn <= 3 && s.player.completedQuestIds.length === 0,
  },
  {
    id: 'hint_fame_locked',
    icon: '🔒',
    text: '城主邸に入るには名声3以上が必要です。まずクエストをこなして名声を上げましょう。',
    when: (s) => s.player.stats.fame < 3 && s.turn >= 4,
  },
  {
    id: 'hint_port_available',
    icon: '⚓',
    text: '霧岬港が解放されています！商才ルートの拠点として活用できます。',
    when: (s) =>
      (s.player.stats.fame >= 10 || s.player.flags.includes('flag_war_intel')) &&
      !s.player.flags.includes('hint_port_seen'),
  },
  {
    id: 'hint_school_hint',
    icon: '🎓',
    text: '流派選択のイベントが近いかもしれません。各能力値を磨いておきましょう。',
    when: (s) =>
      s.turn >= 10 &&
      !s.player.flags.includes('flag_school_selected') &&
      (s.player.stats.omen >= 30 || s.player.stats.martial >= 10 || s.player.stats.commerce >= 10),
  },
  {
    id: 'hint_mid_game',
    icon: '📊',
    text: `折り返しです。エンディング条件を意識して残りのターンを使いましょう。`,
    when: (s) => s.turn === 12,
  },
  {
    id: 'hint_end_near',
    icon: '⏳',
    text: '残り5ターン以下です。最終的な目標に集中しましょう。',
    when: (s) => s.maxTurns - s.turn <= 5 && s.turn > 5,
  },
  {
    id: 'hint_rival_bond',
    icon: '⚔️',
    text: 'ライバル・朧との関係値が上がっています。道場で話しかけてみましょう。',
    when: (s) => (s.player.relations['rival'] ?? -5) >= 5 && !s.player.flags.includes('flag_rival_respected'),
  },
]

export function TutorialHint() {
  const state = useGameStore()

  // Find the first applicable hint (skip tutorial-phase)
  if (!state.player.flags.includes('flag_tutorial_seen')) return null

  const hint = HINTS.find((h) => h.when(state))
  if (!hint) return null

  return (
    <div className={styles.hint}>
      <span className={styles.icon}>{hint.icon}</span>
      <span className={styles.text}>{hint.text}</span>
    </div>
  )
}
