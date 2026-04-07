// ─── Enums ────────────────────────────────────────────────────────────────

export type Screen = 'TITLE' | 'CHARACTER_CREATION' | 'GAME' | 'GAME_OVER'

export type NpcRole = 'lord' | 'priestess' | 'retainer' | 'mentor' | 'merchant' | 'informant' | 'rival' | 'ronin' | 'ally'

export type EventType = 'personal' | 'social' | 'world' | 'career' | 'rare' | 'fate'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type LogEntryType = 'action' | 'quest' | 'event' | 'duel' | 'system'

export type PlayerRank = 'none' | 'apprentice' | 'retainer' | 'advisor'

export type DuelActionType = 'attack' | 'defend' | 'gambit'

// ─── Player Stats ─────────────────────────────────────────────────────────

export interface PlayerStats {
  martial: number    // 武藝
  wisdom: number     // 智略 / strategy
  charm: number      // 魅力
  commerce: number   // 商才
  fame: number       // 名聲
  gold: number       // 金錢
  stamina: number    // 體力 (0–100)
  omen: number       // 天命/運勢 (0–100)
}

export type StatKey = keyof PlayerStats

// ─── Background ───────────────────────────────────────────────────────────

export interface Background {
  id: string
  name: string
  description: string
  statBonuses: Partial<PlayerStats>
  startingGold: number
  startingFame: number
  startingRelations: Record<string, number>
}

// ─── Location ─────────────────────────────────────────────────────────────

export interface LocationAction {
  id: string
  label: string
  description: string
  staminaCost: number
  daysCost: number
  checks: StatKey[]
}

export interface Location {
  id: string
  name: string
  description: string
  actions: LocationAction[]
  npcIds: string[]
  requiredFame: number
}

// ─── NPC ──────────────────────────────────────────────────────────────────

export interface Npc {
  id: string
  name: string
  faction: string
  role: NpcRole
  locationId: string
  affectionDefault: number
  trustDefault: number
  unlockFlags: string[]
  eventPool: string[]
}

// ─── Quest ────────────────────────────────────────────────────────────────

export interface QuestRequirements {
  fame?: number
  stats?: Partial<PlayerStats>
  relations?: Record<string, number>
  flags?: string[]
  completedQuests?: string[]
  rank?: PlayerRank
}

export interface QuestRewards {
  gold?: number
  fame?: number
  stats?: Partial<PlayerStats>
  relations?: Record<string, number>
  flags?: string[]
  rankUp?: PlayerRank
}

export interface QuestConsequences {
  gold?: number
  fame?: number
  stats?: Partial<PlayerStats>
  relations?: Record<string, number>
  flags?: string[]
}

export interface DuelConfig {
  enemyName: string
  enemyHp: number
  enemyMartial: number
  rounds: number
}

export interface Quest {
  id: string
  title: string
  description: string
  locationId: string
  requirements: QuestRequirements
  cost: { days: number; stamina: number; gold?: number }
  /** Primary stat to check */
  checks: StatKey[]
  /** Explicit success threshold (stat + 1d6 >= threshold). Defaults to 10 if omitted. */
  threshold?: number
  /** If set, completing this quest opens the duel modal */
  duelConfig?: DuelConfig
  rewards: QuestRewards
  failConsequences: QuestConsequences
}

// ─── Game Event ───────────────────────────────────────────────────────────

export interface EventOutcome {
  text: string
  statChanges?: Partial<PlayerStats>
  relationChanges?: Record<string, number>
  flagsSet?: string[]
  rankUp?: PlayerRank
  nextEventId?: string
}

export interface EventChoice {
  label: string
  check?: StatKey
  threshold?: number
  successOutcome: EventOutcome
  failOutcome?: EventOutcome
}

export interface EventTrigger {
  turn?: number
  minTurn?: number
  locationId?: string
  minFame?: number
  minStat?: Partial<PlayerStats>
  relations?: Record<string, number>
  flags?: string[]
  completedQuests?: string[]
  probability?: number // 0–1
}

export interface GameEvent {
  id: string
  type: EventType
  title: string
  body: string
  trigger: EventTrigger
  choices: EventChoice[]
}

// ─── Duel System ──────────────────────────────────────────────────────────

export interface DuelState {
  questId: string
  enemyName: string
  enemyHp: number
  enemyMaxHp: number
  playerHp: number
  playerMaxHp: number
  round: number
  maxRounds: number
  roundLog: string[]
  result: 'pending' | 'win' | 'lose'
}

// ─── Ending ───────────────────────────────────────────────────────────────

export interface EndingCondition {
  minFame?: number
  maxFame?: number
  minGold?: number
  minRank?: PlayerRank
  maxRank?: PlayerRank
  /** npcId → minimum relation value */
  relations?: Record<string, number>
  flags?: string[]
  /** Any of these flags present → condition fails */
  failureFlags?: string[]
  priority: number
}

export interface Ending {
  id: string
  title: string
  subtitle: string
  description: string
  condition: EndingCondition
}

// ─── World State ──────────────────────────────────────────────────────────

export interface WorldState {
  currentSeason: Season
  omenLevel: number
  warTension: number   // 0–100, affects world events
}

// ─── Log Entry ────────────────────────────────────────────────────────────

export interface LogEntry {
  turn: number
  text: string
  type: LogEntryType
}

// ─── Player ───────────────────────────────────────────────────────────────

export interface Player {
  name: string
  backgroundId: string
  stats: PlayerStats
  rank: PlayerRank
  currentLocationId: string
  activeQuestIds: string[]
  completedQuestIds: string[]
  failedQuestIds: string[]
  flags: string[]
  relations: Record<string, number> // npcId → affection value
}

// ─── Game State ───────────────────────────────────────────────────────────

export interface GameState {
  screen: Screen
  turn: number
  maxTurns: number
  actionsThisTurn: number
  maxActionsPerTurn: number
  player: Player
  world: WorldState
  activeEvent: GameEvent | null
  activeDuel: DuelState | null
  pendingQuestResult: { quest: Quest; success: boolean } | null
  achievedEndingId: string | null
  log: LogEntry[]
}
