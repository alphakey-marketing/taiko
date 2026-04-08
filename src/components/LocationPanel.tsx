import { useGameStore, getLocation } from '../store/gameStore'
import { LOCATIONS } from '../data/locations'
import { playClick } from '../utils/sound'
import styles from './LocationPanel.module.css'

export function LocationPanel() {
  const { player, moveToLocation } = useGameStore()
  const currentLoc = getLocation(player.currentLocationId)

  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>城下町</h2>
      <div className={styles.grid}>
        {LOCATIONS.map((loc) => {
          const isActive = loc.id === player.currentLocationId
          const fameLocked = loc.requiredFame > player.stats.fame
          const flagUnlocked = loc.unlockFlags?.some((f) => player.flags.includes(f)) ?? false
          const locked = fameLocked && !flagUnlocked

          return (
            <button
              key={loc.id}
              className={`${styles.locationBtn} ${isActive ? styles.active : ''} ${locked ? styles.locked : ''}`}
              onClick={() => { if (!locked) { playClick(); moveToLocation(loc.id) } }}
              disabled={locked}
              title={locked ? `名聲${loc.requiredFame}以上が必要` : loc.description}
            >
              <span className={styles.locName}>{loc.name}</span>
              {locked && <span className={styles.lockIcon}>🔒</span>}
              {isActive && <span className={styles.indicator} />}
            </button>
          )
        })}
      </div>

      {currentLoc && (
        <p className={styles.description}>{currentLoc.description}</p>
      )}
    </section>
  )
}
