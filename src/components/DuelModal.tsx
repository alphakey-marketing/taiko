import { useGameStore } from '../store/gameStore'
import type { DuelActionType } from '../types/game'
import { playHit, playClick } from '../utils/sound'
import styles from './DuelModal.module.css'

const ACTIONS: { type: DuelActionType; icon: string; label: string; desc: string }[] = [
  { type: 'attack', icon: '⚔️', label: '攻撃', desc: '武藝で正面突破' },
  { type: 'defend', icon: '🛡️', label: '防御', desc: '被ダメージを半減' },
  { type: 'gambit', icon: '🌀', label: '奇策', desc: '智略で奇打を狙う' },
]

export function DuelModal() {
  const { activeDuel, performDuelAction, dismissDuel } = useGameStore()

  if (!activeDuel) return null

  const { enemyName, enemyHp, enemyMaxHp, playerHp, playerMaxHp, round, maxRounds, roundLog, result } =
    activeDuel

  const playerHpPct = Math.max(0, (playerHp / playerMaxHp) * 100)
  const enemyHpPct = Math.max(0, (enemyHp / enemyMaxHp) * 100)
  const isDone = result !== 'pending'

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          第 {Math.min(round, maxRounds)} / {maxRounds} 回戦
        </div>
        <h2 className={styles.title}>⚔ 対決：{enemyName}</h2>

        {/* HP bars */}
        <div className={styles.hpBars}>
          {/* Player side */}
          <div className={styles.hpSide}>
            <span className={styles.hpLabel}>君</span>
            <div className={styles.hpBar}>
              <div
                className={`${styles.hpFill} ${styles.hpFillPlayer}`}
                style={{ width: `${playerHpPct}%` }}
              />
            </div>
            <span className={styles.hpText}>{playerHp} / {playerMaxHp}</span>
          </div>

          {/* VS */}
          <div style={{ display: 'flex', alignItems: 'center', color: '#8b6914', fontSize: '1rem' }}>VS</div>

          {/* Enemy side */}
          <div className={styles.hpSide}>
            <span className={styles.hpLabel}>{enemyName}</span>
            <div className={styles.hpBar}>
              <div
                className={`${styles.hpFill} ${styles.hpFillEnemy}`}
                style={{ width: `${enemyHpPct}%` }}
              />
            </div>
            <span className={styles.hpText}>{enemyHp} / {enemyMaxHp}</span>
          </div>
        </div>

        {/* Round log */}
        <div className={styles.roundLog}>
          {roundLog.length === 0 ? (
            <span className={styles.roundLogEmpty}>行動を選べ……</span>
          ) : (
            roundLog.map((line, i) => <span key={i}>{line}</span>)
          )}
        </div>

        {/* Result banner + Continue button */}
        {isDone && (
          <>
            <div className={`${styles.resultBanner} ${result === 'win' ? styles.resultWin : styles.resultLose}`}>
              {result === 'win' ? '🏆 勝利！' : '💀 敗北…'}
            </div>
            <button className={styles.continueBtn} onClick={() => { playClick(); dismissDuel() }}>
              続ける →
            </button>
          </>
        )}

        {/* Action buttons */}
        {!isDone && (
          <div className={styles.actions}>
            {ACTIONS.map((a) => (
              <button
                key={a.type}
                className={styles.actionBtn}
                onClick={() => { playHit(); performDuelAction(a.type) }}
              >
                <span className={styles.actionIcon}>{a.icon}</span>
                <span>{a.label}</span>
                <span className={styles.actionDesc}>{a.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
