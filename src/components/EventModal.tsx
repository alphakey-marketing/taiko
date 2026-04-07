import { useGameStore } from '../store/gameStore'
import { getNpc } from '../store/gameStore'
import { playSuccess, playFail, playEventOpen } from '../utils/sound'
import type { QuestRewards, QuestConsequences } from '../types/game'
import styles from './EventModal.module.css'

// Build reward/consequence tag list from quest outcome
function buildQuestTags(outcome: QuestRewards | QuestConsequences, isSuccess: boolean): string[] {
  const tags: string[] = []
  if (outcome.gold) tags.push(`金 ${isSuccess && outcome.gold > 0 ? '+' : ''}${outcome.gold}貫`)
  if (outcome.fame) tags.push(`名聲 ${isSuccess && outcome.fame > 0 ? '+' : ''}${outcome.fame}`)
  if (outcome.stats) {
    for (const [stat, val] of Object.entries(outcome.stats)) {
      if (val) tags.push(`${STAT_JP[stat] ?? stat} ${(val as number) > 0 ? '+' : ''}${val}`)
    }
  }
  if (outcome.relations) {
    for (const [npcId, val] of Object.entries(outcome.relations)) {
      if (val) {
        const npc = getNpc(npcId)
        const name = npc ? npc.name : npcId
        tags.push(`${name} ${(val as number) > 0 ? '+' : ''}${val}`)
      }
    }
  }
  if (isSuccess) {
    const rewards = outcome as QuestRewards
    if (rewards.rankUp) tags.push(`官職昇進: ${RANK_JP[rewards.rankUp] ?? rewards.rankUp}`)
    if (rewards.flags && rewards.flags.length > 0) {
      rewards.flags.forEach((f) => {
        const label = FLAG_SHORT[f]
        if (label) tags.push(`✦ ${label}`)
      })
    }
  }
  return tags
}

export function EventModal() {
  const { activeEvent, pendingQuestResult, resolveEvent, dismissQuestResult } = useGameStore()

  if (pendingQuestResult) {
    const { quest, success } = pendingQuestResult
    const outcome = success ? quest.rewards : quest.failConsequences
    const tags = buildQuestTags(outcome, success)

    return (
      <div className={styles.overlay}>
        <div className={`${styles.modal} ${success ? styles.success : styles.failure}`}>
          <div className={styles.tag}>{success ? '✓ 成功' : '✗ 失敗'}</div>
          <h2 className={styles.title}>{quest.title}</h2>
          <p className={styles.body}>
            {success
              ? `任務を見事に完遂した！報酬を受け取った。`
              : `任務に失敗してしまった。諦めず再挑戦しよう。`}
          </p>
          {tags.length > 0 && (
            <div className={success ? styles.rewards : styles.consequences}>
              {tags.map((t, i) => <span key={i}>{t}</span>)}
            </div>
          )}
          <button
            className={styles.closeBtn}
            onClick={() => {
              if (success) playSuccess(); else playFail()
              dismissQuestResult()
            }}
          >
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
              onClick={() => {
                playEventOpen()
                resolveEvent(choice)
              }}
            >
              <span className={styles.choiceLabel}>{choice.label}</span>
              {choice.check && (
                <span className={styles.choiceCheck}>
                  {STAT_JP[choice.check]}判定
                  {choice.threshold ? ` (難易度${choice.threshold})` : ''}
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
  stamina: '体力',
  omen: '天命',
  gold: '金',
}

const RANK_JP: Record<string, string> = {
  none: '無位',
  apprentice: '見習',
  retainer: '家臣',
  advisor: '軍師',
}

const FLAG_SHORT: Record<string, string> = {
  flag_first_omen_done: '初次占兆完了',
  flag_lord_dream_solved: '主君の夢を解いた',
  flag_lord_promotion_open: '昇進の道が開けた',
  flag_dojo_trial_passed: '道場試練クリア',
  flag_rival_respected: '浪人に認められた',
  flag_merchant_trusted: '商人の信頼獲得',
  flag_independent_open: '独立の道が開けた',
  flag_fate_awakened: '天命が目覚めた',
  flag_village_saved: '村を救った',
  flag_official_advisor: '正式に軍師となった',
}

