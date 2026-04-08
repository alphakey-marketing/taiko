import { useState } from 'react'
import { BACKGROUNDS } from '../data/backgrounds'
import { useGameStore } from '../store/gameStore'
import styles from './CharacterCreation.module.css'

const STAT_JP: Record<string, string> = {
  martial: '武藝',
  wisdom: '智略',
  charm: '魅力',
  commerce: '商才',
  fame: '名聲',
  gold: '金',
  stamina: '體力',
  omen: '天命',
}

export function CharacterCreation() {
  const [name, setName] = useState('')
  const [selectedBgId, setSelectedBgId] = useState(BACKGROUNDS[0].id)
  const { startNewGame, newGamePlusBonusId } = useGameStore()

  const selectedBg = BACKGROUNDS.find((b) => b.id === selectedBgId) ?? BACKGROUNDS[0]

  const handleStart = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    startNewGame(trimmed, selectedBgId)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className={styles.gameTitle}>陰陽立志録</h1>
        <p className={styles.subtitle}>Onmyoji Rising</p>
        <div className={styles.divider} />

        {newGamePlusBonusId && (
          <div className={styles.ngPlusBanner}>
            🔁 前回の立志伝の記憶を持って再び立志する
          </div>
        )}

        <h2 className={styles.sectionLabel}>── 出自を選べ ──</h2>

        {/* Background selection tabs */}
        <div className={styles.bgTabs}>
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              className={`${styles.bgTab} ${bg.id === selectedBgId ? styles.bgTabActive : ''}`}
              onClick={() => setSelectedBgId(bg.id)}
            >
              {bg.name}
            </button>
          ))}
        </div>

        {/* Selected background card */}
        <div className={styles.bgDetail}>
          <span className={styles.bgDetailTitle}>{selectedBg.name}</span>
          <p className={styles.bgDetailDesc}>{selectedBg.description}</p>
          <div className={styles.bgBonuses}>
            {Object.entries(selectedBg.statBonuses).map(([stat, val]) => (
              <span
                key={stat}
                className={`${styles.bonus} ${(val as number) < 0 ? styles.bonusMinus : ''}`}
              >
                {STAT_JP[stat]} {(val as number) >= 0 ? '+' : ''}{val}
              </span>
            ))}
            <span className={styles.bonus}>初期金：{selectedBg.startingGold}貫</span>
            {selectedBg.startingFame > 0 && (
              <span className={styles.bonus}>初期名声：{selectedBg.startingFame}</span>
            )}
          </div>
        </div>

        {/* Name input */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="player-name">
            名前を入れよ
          </label>
          <input
            id="player-name"
            className={styles.input}
            type="text"
            placeholder="名前を入力…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        <button
          className={styles.startBtn}
          onClick={handleStart}
          disabled={!name.trim()}
        >
          天命の道へ
        </button>
      </div>
    </div>
  )
}

