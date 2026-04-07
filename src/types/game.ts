// ─── Enums ────────────────────────────────────────────────────────────────

export type Screen = 'TITLE' | 'CHARACTER_CREATION' | 'GAME' | 'GAME_OVER'

export type NpcRole = 'lord' | 'mentor' | 'rival' | 'merchant' | 'spy' | 'ally'

export type EventType = 'personal' | 'interpersonal' | 'world' | 'identity' | 'special'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type LogEntryType = 'action' | 'quest' | 'event' | 'system'

// ─── Player Stats ─────────────────────────────────────────────────────────

export interface PlayerStats {
  martial: number // 武藝
  wisdom: number // 智略
  charm: number // 魅力
  commerce: number // 商才
  fame: number // 名聲
  gold: number // 金錢
  stamina: number // 體力 (0–100)
  omen: number // 天命/運勢 (0–100)
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
  questIds?: string[]
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
}

export interface QuestRewards {
  gold?: number
  fame?: number
  stats?: Partial<PlayerStats>
  relations?: Record<string, number>
  flags?: string[]
}

export interface QuestConsequences {
  gold?: number
  fame?: number
  stats?: Partial<PlayerStats>
  relations?: Record<string, number>
}

export interface Quest {
  id: string
  title: string
  description: string
  locationId: string
  requirements: QuestRequirements
  cost: { days: number; stamina: number; gold?: number }
  checks: StatKey[]
  rewards: QuestRewards
  failConsequences: QuestConsequences
}

// ─── Game Event ───────────────────────────────────────────────────────────

export interface EventOutcome {
  text: string
  statChanges?: Partial<PlayerStats>
  relationChanges?: Record<string, number>
  flagsSet?: string[]
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

// ─── World State ──────────────────────────────────────────────────────────

export interface WorldState {
  currentSeason: Season
  omenLevel: number
  factionPowers: Record<string, number>
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
  currentLocationId: string
  activeQuestIds: string[]
  completedQuestIds: string[]
  flags: string[]
  relations: Record<string, number> // npcId → affection
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
  pendingQuestResult: { quest: Quest; success: boolean } | null
  log: LogEntry[]
}
