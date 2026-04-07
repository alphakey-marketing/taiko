# State Schema Draft — 戰國立志錄

## Core GameState

```ts
GameState {
  screen: 'TITLE' | 'CHARACTER_CREATION' | 'GAME' | 'GAME_OVER'
  turn: number                   // current turn (week)
  maxTurns: number               // 24 for MVP
  player: Player
  world: WorldState
  activeEvent: GameEvent | null  // currently displayed event
  log: LogEntry[]                // action history
}
```

## Player

```ts
Player {
  name: string
  background: Background         // starting archetype
  stats: PlayerStats
  currentLocationId: string
  activeQuestIds: string[]
  completedQuestIds: string[]
  flags: Set<string>             // world/event flags player has triggered
  relations: Record<string, number>  // npcId → affection value
}
```

## PlayerStats

```ts
PlayerStats {
  // Combat/social attributes
  martial: number       // 武藝 — combat, intimidation
  wisdom: number        // 智略 — tactics, negotiation, quest success
  charm: number         // 魅力 — social, recruit, events
  commerce: number      // 商才 — trade, income, prices

  // Resources
  fame: number          // 名聲 — gates quests and identities
  gold: number          // 金錢 — universal currency
  stamina: number       // 體力 — limits consecutive actions (0–100)

  // Mysticism (unique to this game)
  omen: number          // 天命/運勢 — affects random event outcomes
}
```

## Background (起點)

```ts
Background {
  id: string
  name: string           // e.g. '武士見習', '商人學徒'
  description: string
  statBonuses: Partial<PlayerStats>
  startingGold: number
  startingFame: number
  startingRelations: Record<string, number>
}
```

## Location

```ts
Location {
  id: string
  name: string           // e.g. '道場', '市場'
  description: string
  actions: LocationAction[]   // available actions at this location
  npcIds: string[]            // NPCs who appear here
  requiredFame: number        // min fame to enter (0 for open)
}

LocationAction {
  id: string
  label: string
  staminaCost: number
  daysCost: number
  checks: (keyof PlayerStats)[]   // attributes checked
  questIds?: string[]             // quests that can be picked up here
}
```

## NPC

```ts
NPC {
  id: string
  name: string
  faction: string
  role: 'lord' | 'mentor' | 'rival' | 'merchant' | 'spy' | 'ally'
  locationId: string       // home location
  affectionDefault: number
  trustDefault: number
  unlockFlags: string[]    // flags required to meet this NPC
  eventPool: string[]      // event IDs associated with this NPC
  portrait?: string        // asset path (optional in MVP)
}
```

## Quest

```ts
Quest {
  id: string
  title: string
  description: string
  locationId: string          // where to pick up / complete
  requirements: {
    fame?: number
    stats?: Partial<PlayerStats>
    relations?: Record<string, number>
    flags?: string[]
    completedQuests?: string[]
  }
  cost: { days: number; stamina: number; gold?: number }
  checks: (keyof PlayerStats)[]
  rewards: {
    gold?: number
    fame?: number
    stats?: Partial<PlayerStats>
    relations?: Record<string, number>
    flags?: string[]
  }
  failConsequences: {
    gold?: number
    fame?: number
    relations?: Record<string, number>
  }
}
```

## GameEvent

```ts
GameEvent {
  id: string
  type: 'personal' | 'interpersonal' | 'world' | 'identity' | 'special'
  title: string
  body: string
  trigger: EventTrigger
  choices: EventChoice[]
}

EventTrigger {
  turn?: number
  locationId?: string
  stats?: Partial<PlayerStats>
  relations?: Record<string, number>
  flags?: string[]
  completedQuests?: string[]
  probability?: number      // 0–1 for random events
}

EventChoice {
  label: string
  check?: keyof PlayerStats
  threshold?: number
  successOutcome: EventOutcome
  failOutcome?: EventOutcome
}

EventOutcome {
  text: string
  statChanges?: Partial<PlayerStats>
  relationChanges?: Record<string, number>
  flagsSet?: string[]
  nextEventId?: string
}
```

## WorldState

```ts
WorldState {
  currentSeason: 'spring' | 'summer' | 'autumn' | 'winter'
  omenLevel: number         // 0–100 — affects random event probability
  factionPowers: Record<string, number>   // future expansion
}
```

## LogEntry

```ts
LogEntry {
  turn: number
  text: string
  type: 'action' | 'quest' | 'event' | 'system'
}
```
