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

const bg = BACKGROUNDS[0]

export function CharacterCreation() {
  const [name, setName] = useState('')
  const { startNewGame } = useGameStore()

  const handleStart = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    startNewGame(trimmed, bg.id)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className={styles.gameTitle}>陰陽立志録</h1>
        <p className={styles.subtitle}>Onmyoji Rising</p>
        <div className={styles.divider} />

        <h2 className={styles.sectionLabel}>── 陰陽師見習として立志せよ ──</h2>

        {/* Origin card */}
        <div className={styles.bgDetail}>
          <span className={styles.bgDetailTitle}>{bg.name}</span>
          <p className={styles.bgDetailDesc}>{bg.description}</p>
          <div className={styles.bgBonuses}>
            {Object.entries(bg.statBonuses).map(([stat, val]) => (
              <span key={stat} className={styles.bonus}>
                {STAT_JP[stat]} +{val}
              </span>
            ))}
            <span className={styles.bonus}>初期金：{bg.startingGold}貫</span>
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
