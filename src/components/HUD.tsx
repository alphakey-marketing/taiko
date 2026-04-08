import { useGameStore } from '../store/gameStore'
import { BACKGROUNDS } from '../data/backgrounds'
import styles from './HUD.module.css'

const STAT_LABELS: Record<string, string> = {
  martial: '武藝',
  wisdom: '智略',
  charm: '魅力',
  commerce: '商才',
  fame: '名聲',
  gold: '金',
  stamina: '體力',
  omen: '天命',
}

const SEASON_LABELS: Record<string, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
}

const RANK_LABELS: Record<string, string> = {
  none: '無位',
  apprentice: '見習',
  retainer: '家臣',
  advisor: '軍師',
}

export function HUD() {
  const { player, turn, maxTurns, world, actionsThisTurn, maxActionsPerTurn } = useGameStore()
  const { stats } = player
  const bg = BACKGROUNDS.find((b) => b.id === player.backgroundId)

  return (
    <header className={styles.hud}>
      <div className={styles.identity}>
        <span className={styles.name}>{player.name}</span>
        <span className={styles.badge}>{bg?.name ?? '陰陽師見習'}</span>
        <span className={styles.badge} title="官職">{RANK_LABELS[player.rank] ?? player.rank}</span>
        <span className={styles.season}>{SEASON_LABELS[world.currentSeason]}</span>
      </div>

      <div className={styles.turn}>
        第<strong>{turn}</strong>回 / {maxTurns}回
        <span className={styles.actions}>
          行動: {actionsThisTurn}/{maxActionsPerTurn}
        </span>
      </div>

      <div className={styles.stats}>
        {(['martial', 'wisdom', 'charm', 'commerce'] as const).map((key) => (
          <div key={key} className={styles.stat}>
            <span className={styles.statLabel}>{STAT_LABELS[key]}</span>
            <span className={styles.statValue}>{stats[key]}</span>
          </div>
        ))}
        <div className={styles.divider} />
        <div className={styles.stat}>
          <span className={styles.statLabel}>{STAT_LABELS.fame}</span>
          <span className={styles.statValue}>{stats.fame}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{STAT_LABELS.gold}</span>
          <span className={`${styles.statValue} ${styles.gold}`}>{stats.gold}貫</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{STAT_LABELS.stamina}</span>
          <span className={styles.statValue}>
            <span
              className={styles.staminaBar}
              style={{ '--pct': `${stats.stamina}%` } as React.CSSProperties}
            />
            {stats.stamina}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>{STAT_LABELS.omen}</span>
          <span className={`${styles.statValue} ${styles.omen}`}>{stats.omen}</span>
        </div>
      </div>
    </header>
  )
}
