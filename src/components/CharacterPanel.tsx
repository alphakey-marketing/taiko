import { useGameStore } from '../store/gameStore'
import { NPCS } from '../data/npcs'
import { BACKGROUNDS } from '../data/backgrounds'
import { ITEMS } from '../data/items'
import styles from './CharacterPanel.module.css'

const STAT_DEFS = [
  { key: 'martial', label: '武藝', color: '#c23b3b' },
  { key: 'wisdom', label: '智略', color: '#3b7ac2' },
  { key: 'charm', label: '魅力', color: '#c28b3b' },
  { key: 'commerce', label: '商才', color: '#3bc2a0' },
  { key: 'fame', label: '名聲', color: '#e8c87a' },
  { key: 'omen', label: '天命', color: '#a06fd4' },
] as const

const RANK_LABELS: Record<string, string> = {
  none: '無位',
  apprentice: '見習',
  retainer: '家臣',
  advisor: '軍師',
}

const ITEM_FLAGS: Record<string, string> = {
  flag_item_tengu_fan: 'item_tengu_fan',
  flag_item_old_blade: 'item_old_blade',
  flag_item_merchant_abacus: 'item_merchant_abacus',
  flag_item_star_grimoire: 'item_star_grimoire',
  flag_item_shichifuku_seal: 'item_shichifuku_seal',
}

export function CharacterPanel() {
  const { player } = useGameStore()
  const { stats, relations } = player
  const bg = BACKGROUNDS.find((b) => b.id === player.backgroundId)

  // Collect items the player has acquired (via flag)
  const acquiredItems = Object.entries(ITEM_FLAGS)
    .filter(([flag]) => player.flags.includes(flag))
    .map(([, itemId]) => ITEMS.find((it) => it.id === itemId))
    .filter(Boolean) as typeof ITEMS

  return (
    <section className={styles.panel}>
      <div className={styles.identity}>
        <span className={styles.name}>{player.name}</span>
        <span className={styles.bg}>{bg?.name ?? '陰陽師見習'}</span>
        <span className={styles.rank}>{RANK_LABELS[player.rank] ?? player.rank}</span>
      </div>

      {/* Core Stats */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>能力値</h3>
        {STAT_DEFS.map(({ key, label, color }) => {
          const val = stats[key]
          const max = key === 'fame' ? 50 : key === 'omen' ? 100 : 20
          const pct = Math.min(100, Math.max(0, (val / max) * 100))
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
          {NPCS.filter(
            (npc) =>
              !npc.unlockFlags.length ||
              npc.unlockFlags.every((f) => player.flags.includes(f))
          ).map((npc) => {
            const val = relations[npc.id] ?? npc.affectionDefault
            const trend = val > npc.affectionDefault ? '↑' : val < npc.affectionDefault ? '↓' : '→'
            return (
              <div key={npc.id} className={styles.relation}>
                <span className={styles.npcName}>{npc.name}</span>
                <span
                  className={`${styles.relVal} ${val >= 20 ? styles.high : val <= 0 ? styles.low : ''}`}
                >
                  [{val}] {trend}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Acquired Items */}
      {acquiredItems.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>所持品</h3>
          <div className={styles.flags}>
            {acquiredItems.map((item) => (
              <span key={item.id} className={styles.flag} title={item.description}>
                {SLOT_ICON[item.slot]} {item.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Flags / Achievements */}
      {player.flags.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>実績</h3>
          <div className={styles.flags}>
            {player.flags
              .filter((f) => !f.startsWith('event_seen_'))
              .map((f) => (
                <span key={f} className={styles.flag}>
                  {FLAG_LABELS[f] ?? f.replace(/^flag_/, '').replace(/_/g, ' ')}
                </span>
              ))}
          </div>
        </div>
      )}
    </section>
  )
}

const SLOT_ICON: Record<string, string> = {
  weapon: '⚔️',
  accessory: '✨',
  scroll: '📜',
}

const FLAG_LABELS: Record<string, string> = {
  flag_tavern_visited: '酒場の常連',
  flag_first_omen_done: '初次占兆完了',
  flag_lord_dream_solved: '主君の夢を解いた',
  flag_lord_promotion_open: '昇進の道が開けた',
  flag_dojo_trial_passed: '道場試練クリア',
  flag_rival_respected: '浪人に認められた',
  flag_merchant_trusted: '商人の信頼獲得',
  flag_secret_route: '秘密の道を知る',
  flag_independent_open: '独立の道が開けた',
  flag_fate_awakened: '天命が目覚めた',
  flag_village_saved: '村を救った',
  flag_war_intel: '戦況情報を掴んだ',
  flag_neighbors_restless: '隣国動揺',
  flag_informant_open: '情報屋との縁',
  flag_official_advisor: '正式に軍師となった',
  flag_merit_ending_open: '功勳結局が近い',
  flag_fate_crossroads_done: '命運の交差点を通った',
  flag_fate_believer: '天命を信じる者',
  flag_path_merit: '功勳の道',
  flag_path_independent: '独立の道',
  flag_path_escaped: '逃走の道',
  flag_in_debt: '借金あり',
  flag_chiyo_secret: '千代の秘密を知る',
  flag_retainer_opened: '老家臣の心を開いた',
  flag_people_trust: '民の信頼',
  flag_unreliable: '信頼を失った',
  flag_security_low: '治安悪化',
}
