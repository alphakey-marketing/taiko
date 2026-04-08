import { useGameStore, getLocation, getAvailableQuestsAt, getQuest, getNpc } from '../store/gameStore'
import { playClick, playTurnEnd, playSuccess, playEventOpen } from '../utils/sound'
import { TutorialHint } from './TutorialHint'
import styles from './ActionPanel.module.css'

export function ActionPanel() {
  const {
    player,
    actionsThisTurn,
    maxActionsPerTurn,
    activeEvent,
    activeDuel,
    pendingQuestResult,
    performAction,
    acceptQuest,
    completeQuest,
    endTurn,
    openNpcModal,
  } = useGameStore()

  const loc = getLocation(player.currentLocationId)
  const availableQuests = loc ? getAvailableQuestsAt(loc.id, player) : []
  const actionsLeft = maxActionsPerTurn - actionsThisTurn
  const blocked = !!activeEvent || !!pendingQuestResult || !!activeDuel

  if (!loc) return null

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {loc.name} <span className={styles.subtitle}>での行動</span>
        </h2>
        <span className={styles.actionsLeft}>残り {actionsLeft} 行動</span>
      </div>

      {/* Location Actions */}
      <div className={styles.actionList}>
        {loc.actions.map((action) => {
          const notEnoughStamina = player.stats.stamina < action.staminaCost
          const disabled = blocked || actionsLeft === 0 || notEnoughStamina

          return (
            <button
              key={action.id}
              className={`${styles.actionBtn} ${disabled ? styles.disabled : ''}`}
              onClick={() => { playClick(); performAction(action.id) }}
              disabled={disabled}
              title={action.description}
            >
              <span className={styles.actionLabel}>{action.label}</span>
              <span className={styles.actionCost}>
                {action.staminaCost > 0 && `体力 -${action.staminaCost}`}
                {action.staminaCost > 0 && action.daysCost > 0 && ' · '}
                {action.daysCost > 0 && `${action.daysCost}日`}
              </span>
            </button>
          )
        })}
      </div>

      {/* NPCs at this location */}
      {loc.npcIds.length > 0 && (
        <div className={styles.npcSection}>
          {loc.npcIds.map((npcId) => {
            const npc = getNpc(npcId)
            if (!npc) return null
            const rel = player.relations[npcId] ?? 0
            return (
              <button
                key={npcId}
                className={styles.npcBtn}
                onClick={() => { playEventOpen(); openNpcModal(npcId) }}
                title={`${npc.name}との関係値: ${rel}`}
              >
                <span className={styles.npcName}>{npc.name}</span>
                <span className={styles.npcRel}>{rel >= 0 ? '+' : ''}{rel}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Available Quests at this location */}
      {availableQuests.length > 0 && (
        <div className={styles.questSection}>
          <h3 className={styles.questTitle}>受けられる任務</h3>
          {availableQuests.map((quest) => (
            <div key={quest.id} className={styles.questCard}>
              <div className={styles.questName}>{quest.title}</div>
              <div className={styles.questDesc}>{quest.description}</div>
              <div className={styles.questMeta}>
                判定: {quest.checks.length > 0
                  ? `${quest.checks.map((c) => STAT_JP[c]).join(' / ')} (難易度 ${quest.threshold ?? 10})`
                  : '自動成功'}
              </div>
              <div className={styles.questCost}>
                体力 -{quest.cost.stamina}
                {quest.cost.gold ? ` · 金 -${quest.cost.gold}貫` : ''}
                {' · '}{quest.cost.days}日
              </div>
              <button
                className={styles.acceptBtn}
                onClick={() => { playClick(); acceptQuest(quest.id) }}
                disabled={blocked}
              >
                受ける
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Quests at this location */}
      {player.activeQuestIds.length > 0 && (
        <div className={styles.questSection}>
          <h3 className={styles.questTitle}>進行中の任務</h3>
          {player.activeQuestIds.map((qid) => (
            <ActiveQuestItem
              key={qid}
              questId={qid}
              locationId={loc.id}
              blocked={blocked}
              onComplete={completeQuest}
            />
          ))}
        </div>
      )}

      {/* Contextual tutorial hint */}
      <TutorialHint />

      {/* End Turn */}
      <button
        className={styles.endTurnBtn}
        onClick={() => { playTurnEnd(); endTurn() }}
        disabled={blocked}
      >
        次の回へ進む →
      </button>
    </section>
  )
}

// ─── Sub-component ────────────────────────────────────────────────────────

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

function ActiveQuestItem({
  questId,
  locationId,
  blocked,
  onComplete,
}: {
  questId: string
  locationId: string
  blocked: boolean
  onComplete: (id: string) => void
}) {
  const quest = getQuest(questId)
  if (!quest) return null

  const canComplete = quest.locationId === locationId

  return (
    <div className={styles.questCard}>
      <div className={styles.questName}>{quest.title}</div>
      <div className={styles.questMeta}>
        判定: {quest.checks.map((c) => STAT_JP[c]).join(' / ')}
      </div>
      {canComplete ? (
        <button
          className={styles.completeBtn}
          onClick={() => { playSuccess(); onComplete(quest.id) }}
          disabled={blocked}
        >
          完了する
        </button>
      ) : (
        <span className={styles.questLocation}>→ {getLocation(quest.locationId)?.name ?? quest.locationId}で完了</span>
      )}
    </div>
  )
}
