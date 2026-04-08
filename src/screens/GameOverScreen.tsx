import { useGameStore } from '../store/gameStore'
import { ENDINGS } from '../data/endings'
import styles from './GameOverScreen.module.css'

export function GameOverScreen() {
  const { achievedEndingId, goToCharacterCreation } = useGameStore()

  const ending = ENDINGS.find((e) => e.id === achievedEndingId)

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.kamon}>終</p>
        <h1 className={styles.title}>{ending?.title ?? '天命の終わり'}</h1>
        <p className={styles.subtitle}>{ending?.subtitle ?? '——その先に、何があったか——'}</p>
        <div className={styles.divider} />
        <p className={styles.description}>{ending?.description ?? 'こうして、立志伝の幕は静かに下りた。'}</p>
        <div className={styles.divider} />
        <button className={styles.replayBtn} onClick={goToCharacterCreation}>
          もう一度立志を始める
        </button>
      </div>
    </div>
  )
}
