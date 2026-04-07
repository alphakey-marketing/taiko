import { useGameStore } from '../store/gameStore'
import styles from './GameLog.module.css'

const TYPE_ICONS: Record<string, string> = {
  action: '⚔',
  quest: '📜',
  event: '⚡',
  system: '—',
}

export function GameLog() {
  const { log } = useGameStore()

  return (
    <section className={styles.log}>
      <h3 className={styles.title}>旅の記録</h3>
      <div className={styles.entries}>
        {log.slice(0, 15).map((entry, i) => (
          <div key={i} className={`${styles.entry} ${styles[entry.type]}`}>
            <span className={styles.icon}>{TYPE_ICONS[entry.type]}</span>
            <span className={styles.text}>{entry.text}</span>
          </div>
        ))}
        {log.length === 0 && (
          <div className={styles.empty}>まだ記録はない。</div>
        )}
      </div>
    </section>
  )
}
