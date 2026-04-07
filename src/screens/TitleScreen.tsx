import { useGameStore } from '../store/gameStore'
import styles from './TitleScreen.module.css'

export function TitleScreen() {
  const { goToCharacterCreation } = useGameStore()

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.kamon}>家</p>
        <h1 className={styles.title}>戦国立志録</h1>
        <p className={styles.subtitle}>SENGOKU RISING</p>
        <div className={styles.divider} />
        <p className={styles.tagline}>
          在架空戰國世界中，從無名之輩起步，<br />
          以武藝、智略、人脈與天命改寫自己的人生——<br />
          走出屬於你的立志傳。
        </p>
        <div className={styles.divider} />
        <button className={styles.startBtn} onClick={goToCharacterCreation}>
          立志を始める
        </button>
        <p className={styles.hint}>Phase 0 &amp; 1 MVP</p>
      </div>
    </div>
  )
}
