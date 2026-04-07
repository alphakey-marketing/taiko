import { useGameStore } from '../store/gameStore'
import styles from './EventModal.module.css'

export function EventModal() {
  const { activeEvent, pendingQuestResult, resolveEvent, dismissQuestResult } = useGameStore()

  if (pendingQuestResult) {
    const { quest, success } = pendingQuestResult
    return (
      <div className={styles.overlay}>
        <div className={`${styles.modal} ${success ? styles.success : styles.failure}`}>
          <div className={styles.tag}>{success ? '成功' : '失敗'}</div>
          <h2 className={styles.title}>{quest.title}</h2>
          <p className={styles.body}>
            {success
              ? `任務を見事に完遂した！報酬を受け取った。`
              : `任務に失敗してしまった。次こそは…。`}
          </p>
          {success && (
            <div className={styles.rewards}>
              {quest.rewards.gold && <span>金 +{quest.rewards.gold}貫</span>}
              {quest.rewards.fame && <span>名聲 +{quest.rewards.fame}</span>}
            </div>
          )}
          {!success && (
            <div className={styles.consequences}>
              {quest.failConsequences.fame && <span>名聲 {quest.failConsequences.fame}</span>}
            </div>
          )}
          <button className={styles.closeBtn} onClick={dismissQuestResult}>
            続ける
          </button>
        </div>
      </div>
    )
  }

  if (!activeEvent) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.tag}>{EVENT_TYPE_LABELS[activeEvent.type]}</div>
        <h2 className={styles.title}>【{activeEvent.title}】</h2>
        <p className={styles.body}>{activeEvent.body}</p>

        <div className={styles.choices}>
          {activeEvent.choices.map((choice, i) => (
            <button
              key={i}
              className={styles.choiceBtn}
              onClick={() => resolveEvent(choice)}
            >
              <span className={styles.choiceLabel}>{choice.label}</span>
              {choice.check && (
                <span className={styles.choiceCheck}>
                  {STAT_JP[choice.check]}判定
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  personal: '個人の出来事',
  social: '人間関係',
  world: '世界の動向',
  career: '立身出世',
  fate: '天命の啓示',
}

const STAT_JP: Record<string, string> = {
  martial: '武藝',
  wisdom: '智略',
  charm: '魅力',
  commerce: '商才',
  fame: '名聲',
  omen: '天命',
}
