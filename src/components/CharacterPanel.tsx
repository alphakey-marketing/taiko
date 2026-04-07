import { useGameStore } from '../store/gameStore'
import { NPCS } from '../store/gameStore'
import styles from './CharacterPanel.module.css'

const STAT_DEFS = [
  { key: 'martial', label: '武藝', color: '#c23b3b' },
  { key: 'wisdom', label: '智略', color: '#3b7ac2' },
  { key: 'charm', label: '魅力', color: '#c28b3b' },
  { key: 'commerce', label: '商才', color: '#3bc2a0' },
  { key: 'fame', label: '名聲', color: '#e8c87a' },
  { key: 'omen', label: '天命', color: '#a06fd4' },
] as const

export function CharacterPanel() {
  const { player } = useGameStore()
  const { stats, relations } = player

  const bgLabel = player.backgroundId === 'samurai_apprentice' ? '武士見習' : '商人學徒'

  return (
    <section className={styles.panel}>
      <div className={styles.identity}>
        <span className={styles.name}>{player.name}</span>
        <span className={styles.bg}>{bgLabel}</span>
      </div>

      {/* Core Stats */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>能力値</h3>
        {STAT_DEFS.map(({ key, label, color }) => {
          const val = stats[key]
          const max = key === 'fame' ? 100 : key === 'omen' ? 100 : 20
          const pct = Math.min(100, (val / max) * 100)
          return (
            <div key={key} className={styles.statRow}>
              <span className={styles.statLabel}>{label}</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className={styles.statVal}>{val}</span>
            </div>
          )
        })}
      </div>

      {/* Resources */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>資源</h3>
        <div className={styles.resources}>
          <div className={styles.resource}>
            <span className={styles.resourceLabel}>金錢</span>
            <span className={styles.resourceVal}>{stats.gold}貫</span>
          </div>
          <div className={styles.resource}>
            <span className={styles.resourceLabel}>體力</span>
            <div className={styles.staminaTrack}>
              <div
                className={styles.staminaFill}
                style={{ width: `${stats.stamina}%` }}
              />
            </div>
            <span className={styles.resourceVal}>{stats.stamina}/100</span>
          </div>
        </div>
      </div>

      {/* Relations */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>関係値</h3>
        <div className={styles.relations}>
          {NPCS.filter((npc) => !npc.unlockFlags.length || npc.unlockFlags.every((f) => player.flags.includes(f))).map(
            (npc) => {
              const val = relations[npc.id] ?? npc.affectionDefault
              const trend = val > npc.affectionDefault ? '↑' : val < npc.affectionDefault ? '↓' : '→'
              return (
                <div key={npc.id} className={styles.relation}>
                  <span className={styles.npcName}>{npc.name}</span>
                  <span className={`${styles.relVal} ${val >= 20 ? styles.high : val <= 0 ? styles.low : ''}`}>
                    [{val}] {trend}
                  </span>
                </div>
              )
            }
          )}
        </div>
      </div>

      {/* Flags / Achievements */}
      {player.flags.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>実績</h3>
          <div className={styles.flags}>
            {player.flags
              .filter((f) => !f.startsWith('event_seen_'))
              .map((f) => (
                <span key={f} className={styles.flag}>
                  {FLAG_LABELS[f] ?? f}
                </span>
              ))}
          </div>
        </div>
      )}
    </section>
  )
}

const FLAG_LABELS: Record<string, string> = {
  flag_tavern_visited: '酒場の常連',
  flag_first_lord_quest: '主家への初任務',
  flag_lord_trusted: '主君の信頼',
  flag_official_retainer: '正式仕官',
  flag_dojo_trial_passed: '道場の試練クリア',
  flag_rival_defeated: '宿敵に勝利',
  flag_rival_softened: '宿敵との和解',
  flag_merchant_ally: '商人の信頼',
  flag_intel_gathered: '情報収集完了',
  flag_omen_dreamed: '天命の夢',
  flag_omen_awakened: '天命の覚醒',
  flag_prophecy_received: '予言を受け取る',
  flag_mentor_teaching: '師の教えを学ぶ',
  flag_supplies_stockpiled: '物資備蓄',
  flag_faction_intel: '勢力情報提供',
  flag_faction_intel_hidden: '秘密の情報',
  flag_stranger_met: '謎の老人との出会い',
  flag_lord_mission_assigned: '重要任務を拝命',
  flag_omen_revealed: '御告げを受ける',
}
