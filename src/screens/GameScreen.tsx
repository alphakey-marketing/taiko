import { useState } from 'react'
import { HUD } from '../components/HUD'
import { LocationPanel } from '../components/LocationPanel'
import { ActionPanel } from '../components/ActionPanel'
import { EventModal } from '../components/EventModal'
import { DuelModal } from '../components/DuelModal'
import { CharacterPanel } from '../components/CharacterPanel'
import { GameLog } from '../components/GameLog'
import { TutorialModal } from '../components/TutorialModal'
import { useGameStore, getEnding } from '../store/gameStore'
import styles from './GameScreen.module.css'

const ENDING_STYLE: Record<string, string> = {
  ending_merit_counselor: '🏆',
  ending_independent_school: '🌸',
  ending_fallen_shadow: '🌑',
}

export function GameScreen() {
  const [showCharPanel, setShowCharPanel] = useState(false)
  const { player, turn, maxTurns, screen, achievedEndingId } = useGameStore()

  const isGameOver = screen === 'GAME_OVER'
  const ending = achievedEndingId ? getEnding(achievedEndingId) : null
  const icon = achievedEndingId ? (ENDING_STYLE[achievedEndingId] ?? '📜') : '📜'

  if (isGameOver) {
    return (
      <div className={styles.gameOver}>
        <div className={styles.gameOverBox}>
          <div className={styles.endingIcon}>{icon}</div>
          <h1 className={styles.gameOverTitle}>
            {ending ? ending.title : '幕引き'}
          </h1>
          {ending && (
            <p className={styles.endingSubtitle}>{ending.subtitle}</p>
          )}
          <div className={styles.endingDescription}>
            {ending
              ? ending.description
              : `${player.name}の${turn}回の立志伝が幕を閉じた。また別の天命を歩もう。`}
          </div>
          <div className={styles.gameOverStats}>
            <div>名聲: <strong>{player.stats.fame}</strong></div>
            <div>金錢: <strong>{player.stats.gold}貫</strong></div>
            <div>武藝: <strong>{player.stats.martial}</strong></div>
            <div>智略: <strong>{player.stats.wisdom}</strong></div>
            <div>魅力: <strong>{player.stats.charm}</strong></div>
            <div>天命: <strong>{player.stats.omen}</strong></div>
          </div>
          <div className={styles.gameOverMeta}>
            <div>経過ターン: <strong>{turn - 1} / {maxTurns}</strong></div>
            <div>完了任務: <strong>{player.completedQuestIds.length}</strong>件</div>
            <div>官職: <strong>{RANK_JP[player.rank]}</strong></div>
          </div>
          {player.completedQuestIds.length > 0 && (
            <div className={styles.questSummary}>
              <div className={styles.questSummaryTitle}>完了した任務</div>
              <div className={styles.questList}>
                {player.completedQuestIds.map((qid) => (
                  <span key={qid} className={styles.questBadge}>
                    {QUEST_NAMES[qid] ?? qid}
                  </span>
                ))}
              </div>
            </div>
          )}
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
      <DuelModal />
      <TutorialModal />
    </div>
  )
}

const RANK_JP: Record<string, string> = {
  none: '無位',
  apprentice: '見習',
  retainer: '家臣',
  advisor: '軍師',
}

const QUEST_NAMES: Record<string, string> = {
  quest_first_omen: '初次占兆',
  quest_lord_nightmare: '小藩主の不安な夢',
  quest_dojo_trial: '道場の試煉',
  quest_supply_run: '軍糧採買',
  quest_merchant_test: '商人の試探',
  quest_night_watch: '黒夜に潜む影',
  quest_tavern_rumors: '酒館の流言蜚語',
  quest_village_curse: '村の厄払い',
  quest_rival_duel: '浪人の挑戦',
  quest_secret_meeting: '密談の夜',
  quest_lord_exam: '直家の試問',
  quest_fate_crossroads: '命運の交差点',
}
