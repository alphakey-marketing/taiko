import { useState } from 'react'
import { BACKGROUNDS } from '../data/backgrounds'
import { useGameStore } from '../store/gameStore'
import styles from './CharacterCreation.module.css'

export function CharacterCreation() {
  const [name, setName] = useState('')
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0].id)
  const { startNewGame } = useGameStore()

  const bg = BACKGROUNDS.find((b) => b.id === selectedBg) ?? BACKGROUNDS[0]

  const handleStart = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    startNewGame(trimmed, selectedBg)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className={styles.gameTitle}>戦国立志録</h1>
        <p className={styles.subtitle}>Sengoku Rising</p>
        <div className={styles.divider} />

        <h2 className={styles.sectionLabel}>── 建立你的人生 ──</h2>

        {/* Name input */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="player-name">
            名前
          </label>
          <input
            id="player-name"
            className={styles.input}
            type="text"
            placeholder="名前を入力..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />
        </div>

        {/* Background selection */}
        <div className={styles.field}>
          <span className={styles.label}>出身を選べ</span>
          <div className={styles.bgGrid}>
            {BACKGROUNDS.map((b) => (
              <button
                key={b.id}
                className={`${styles.bgCard} ${selectedBg === b.id ? styles.selected : ''}`}
                onClick={() => setSelectedBg(b.id)}
              >
                <span className={styles.bgName}>{b.name}</span>
                <p className={styles.bgDesc}>{b.description}</p>
                <div className={styles.bgBonuses}>
                  {Object.entries(b.statBonuses).map(([stat, val]) => (
                    <span key={stat} className={styles.bonus}>
                      {STAT_JP[stat]} +{val}
                    </span>
                  ))}
                  <span className={styles.bonus}>初期金：{b.startingGold}貫</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected background detail */}
        <div className={styles.bgDetail}>
          <span className={styles.bgDetailTitle}>{bg.name}として始まる</span>
          <p className={styles.bgDetailDesc}>{bg.description}</p>
        </div>

        <button
          className={styles.startBtn}
          onClick={handleStart}
          disabled={!name.trim()}
        >
          出陣する
        </button>
      </div>
    </div>
  )
}

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
