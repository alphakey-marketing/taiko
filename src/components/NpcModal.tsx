import { useGameStore, getNpc } from '../store/gameStore'
import { playEventOpen } from '../utils/sound'
import styles from './NpcModal.module.css'

const ROLE_JP: Record<string, string> = {
  lord: '藩主',
  priestess: '巫女',
  retainer: '家臣',
  mentor: '師',
  merchant: '商人',
  informant: '情報屋',
  rival: 'ライバル',
  ronin: '浪人',
  ally: '友人',
}

function relBar(val: number): string {
  const clamped = Math.max(-30, Math.min(50, val))
  const pct = Math.round(((clamped + 30) / 80) * 100)
  return pct + '%'
}

function relLabel(val: number): string {
  if (val >= 30) return '深い信頼'
  if (val >= 20) return '信頼'
  if (val >= 10) return '好意'
  if (val >= 0) return '中立'
  if (val >= -10) return '警戒'
  return '敵意'
}

export function NpcModal() {
  const { activeNpcId, player, closeNpcModal, activeEvent, activeDuel, pendingQuestResult } = useGameStore()

  if (!activeNpcId) return null

  const npc = getNpc(activeNpcId)
  if (!npc) return null

  const rel = player.relations[npc.id] ?? 0
  const blocked = !!activeEvent || !!activeDuel || !!pendingQuestResult

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) closeNpcModal() }}>
      <div className={styles.modal}>
        <button className={styles.closeX} onClick={closeNpcModal} aria-label="閉じる">×</button>

        <div className={styles.header}>
          <span className={styles.roleTag}>{ROLE_JP[npc.role] ?? npc.role}</span>
          <h2 className={styles.name}>{npc.name}</h2>
        </div>

        <div className={styles.relSection}>
          <div className={styles.relHeader}>
            <span className={styles.relTitle}>関係値</span>
            <span className={styles.relValue}>
              {rel >= 0 ? '+' : ''}{rel}　<span className={styles.relLabel}>{relLabel(rel)}</span>
            </span>
          </div>
          <div className={styles.relBarBg}>
            <div className={styles.relBarFill} style={{ width: relBar(rel) }} />
          </div>
          {rel >= 10 && rel < 20 && (
            <p className={styles.relHint}>関係値20になると、さらなる打ち明け話が聞けるかもしれない。</p>
          )}
          {rel >= 20 && rel < 30 && (
            <p className={styles.relHint}>関係値30になると、特別なイベントが解放される。</p>
          )}
          {rel >= 30 && (
            <p className={styles.relHint}>深い信頼を得た。この縁は物語の分岐を変えるかもしれない。</p>
          )}
        </div>

        <button
          className={styles.closeBtn}
          onClick={() => {
            if (!blocked) playEventOpen()
            closeNpcModal()
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  )
}
