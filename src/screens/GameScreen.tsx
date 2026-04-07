import { useState } from 'react'
import { HUD } from '../components/HUD'
import { LocationPanel } from '../components/LocationPanel'
import { ActionPanel } from '../components/ActionPanel'
import { EventModal } from '../components/EventModal'
import { CharacterPanel } from '../components/CharacterPanel'
import { GameLog } from '../components/GameLog'
import { useGameStore } from '../store/gameStore'
import styles from './GameScreen.module.css'

export function GameScreen() {
  const [showCharPanel, setShowCharPanel] = useState(false)
  const { player, turn, maxTurns, screen } = useGameStore()

  const isGameOver = screen === 'GAME_OVER'
  const isWinner = player.flags.includes('flag_official_retainer')

  if (isGameOver) {
    return (
      <div className={styles.gameOver}>
        <div className={styles.gameOverBox}>
          <h1 className={styles.gameOverTitle}>
            {isWinner ? '立志伝完結' : '幕引き'}
          </h1>
          <p className={styles.gameOverSub}>
            {isWinner
              ? `${player.name}は見事に主君の信頼を勝ち取り、正式な家臣となった。`
              : `${player.name}の${turn}回の人生が幕を閉じた。また別の人生を歩もう。`}
          </p>
          <div className={styles.gameOverStats}>
            <div>名聲: {player.stats.fame}</div>
            <div>金錢: {player.stats.gold}貫</div>
            <div>完了任務: {player.completedQuestIds.length}</div>
          </div>
          <button
            className={styles.restartBtn}
            onClick={() => useGameStore.getState().goToCharacterCreation()}
          >
            もう一度立志する
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.screen}>
      <HUD />

      <div className={styles.body}>
        {/* Left column: Location + Log */}
        <aside className={styles.leftCol}>
          <LocationPanel />
          <GameLog />
        </aside>

        {/* Center: Action Panel */}
        <main className={styles.centerCol}>
          <ActionPanel />
        </main>

        {/* Right: Character Panel (toggle) */}
        <aside className={`${styles.rightCol} ${showCharPanel ? styles.open : ''}`}>
          <button
            className={styles.charToggle}
            onClick={() => setShowCharPanel((v) => !v)}
          >
            {showCharPanel ? '▶ 閉じる' : '◀ 人物'}
          </button>
          {showCharPanel && <CharacterPanel />}
        </aside>
      </div>

      {/* Turn progress bar */}
      <div className={styles.turnBar}>
        <div
          className={styles.turnBarFill}
          style={{ width: `${(turn / maxTurns) * 100}%` }}
        />
      </div>

      <EventModal />
    </div>
  )
}
