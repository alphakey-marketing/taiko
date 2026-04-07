import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  GameState,
  Player,
  PlayerStats,
  Background,
  Quest,
  QuestRewards,
  GameEvent,
  EventChoice,
  LogEntryType,
} from '../types/game'
import { BACKGROUNDS } from '../data/backgrounds'
import { LOCATIONS } from '../data/locations'
import { NPCS } from '../data/npcs'
import { QUESTS } from '../data/quests'
import { EVENTS } from '../data/events'

// ─── Helpers ──────────────────────────────────────────────────────────────

function buildInitialRelations(background: Background): Record<string, number> {
  const relations: Record<string, number> = {}
  NPCS.forEach((npc) => {
    relations[npc.id] = npc.affectionDefault
  })
  // Apply background-specific relation bonuses
  Object.entries(background.startingRelations).forEach(([npcId, bonus]) => {
    relations[npcId] = (relations[npcId] ?? 0) + bonus
  })
  return relations
}

function buildInitialStats(background: Background): PlayerStats {
  const base: PlayerStats = {
    martial: 3,
    wisdom: 3,
    charm: 3,
    commerce: 3,
    fame: background.startingFame,
    gold: background.startingGold,
    stamina: 80,
    omen: 10,
  }
  const bonuses = background.statBonuses
  return {
    martial: base.martial + (bonuses.martial ?? 0),
    wisdom: base.wisdom + (bonuses.wisdom ?? 0),
    charm: base.charm + (bonuses.charm ?? 0),
    commerce: base.commerce + (bonuses.commerce ?? 0),
    fame: base.fame + (bonuses.fame ?? 0),
    gold: base.gold + (bonuses.gold ?? 0),
    stamina: Math.min(100, base.stamina + (bonuses.stamina ?? 0)),
    omen: base.omen + (bonuses.omen ?? 0),
  }
}

/** Roll a stat check: returns true if player stat + d6 >= threshold */
function statCheck(statValue: number, threshold: number): boolean {
  const roll = Math.floor(Math.random() * 6) + 1
  return statValue + roll >= threshold
}

/** Get the primary check threshold for a quest/action */
function getCheckThreshold(checks: (keyof PlayerStats)[]): number {
  // Base difficulty — can be adjusted per quest; here we use a reasonable default
  return 8 + checks.length * 2
}

/** Try to trigger a random eligible event for current game state */
function pickTriggeredEvent(state: GameState): GameEvent | null {
  const { player, turn } = state
  const eligible = EVENTS.filter((ev) => {
    const t = ev.trigger
    if (player.flags.includes(`event_seen_${ev.id}`)) return false
    if (t.turn !== undefined && t.turn !== turn) return false
    if (t.locationId && t.locationId !== player.currentLocationId) return false
    if (t.minFame !== undefined && player.stats.fame < t.minFame) return false
    if (t.flags && !t.flags.every((f) => player.flags.includes(f))) return false
    if (t.completedQuests && !t.completedQuests.every((q) => player.completedQuestIds.includes(q)))
      return false
    if (t.relations) {
      for (const [npcId, minVal] of Object.entries(t.relations)) {
        if ((player.relations[npcId] ?? 0) < minVal) return false
      }
    }
    if (t.minStat) {
      for (const [stat, minVal] of Object.entries(t.minStat)) {
        if ((player.stats[stat as keyof PlayerStats] ?? 0) < (minVal ?? 0)) return false
      }
    }
    const prob = t.probability ?? 1
    return Math.random() < prob
  })
  return eligible[0] ?? null
}

// ─── Store Interface ───────────────────────────────────────────────────────

interface GameStore extends GameState {
  // Setup
  startNewGame: (playerName: string, backgroundId: string) => void
  // Navigation
  goToCharacterCreation: () => void
  // Location
  moveToLocation: (locationId: string) => void
  // Actions
  performAction: (actionId: string) => void
  // Quests
  acceptQuest: (questId: string) => void
  completeQuest: (questId: string) => void
  dismissQuestResult: () => void
  // Events
  resolveEvent: (choice: EventChoice) => void
  // Turn
  endTurn: () => void
  // Misc
  addLog: (text: string, type: LogEntryType) => void
}

// ─── Store ────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────
      screen: 'TITLE',
      turn: 1,
      maxTurns: 24,
      actionsThisTurn: 0,
      maxActionsPerTurn: 3,
      player: {
        name: '',
        backgroundId: '',
        stats: {
          martial: 3,
          wisdom: 3,
          charm: 3,
          commerce: 3,
          fame: 0,
          gold: 50,
          stamina: 80,
          omen: 10,
        },
        currentLocationId: 'loc_home',
        activeQuestIds: [],
        completedQuestIds: [],
        flags: [],
        relations: {},
      },
      world: {
        currentSeason: 'spring',
        omenLevel: 0,
        factionPowers: { kato: 50, merchant_guild: 40 },
      },
      activeEvent: null,
      pendingQuestResult: null,
      log: [],

      // ── addLog ─────────────────────────────────────────────────────────
      addLog: (text, type) => {
        set((s) => ({
          log: [{ turn: s.turn, text, type }, ...s.log].slice(0, 50),
        }))
      },

      // ── goToCharacterCreation ──────────────────────────────────────────
      goToCharacterCreation: () => set({ screen: 'CHARACTER_CREATION' }),

      // ── startNewGame ───────────────────────────────────────────────────
      startNewGame: (playerName, backgroundId) => {
        const bg = BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0]
        const stats = buildInitialStats(bg)
        const relations = buildInitialRelations(bg)

        const player: Player = {
          name: playerName,
          backgroundId: bg.id,
          stats,
          currentLocationId: 'loc_home',
          activeQuestIds: [],
          completedQuestIds: [],
          flags: [],
          relations,
        }
        set({
          screen: 'GAME',
          turn: 1,
          actionsThisTurn: 0,
          player,
          world: { currentSeason: 'spring', omenLevel: 10, factionPowers: { kato: 50, merchant_guild: 40 } },
          activeEvent: null,
          pendingQuestResult: null,
          log: [{ turn: 1, text: `${playerName}の立志伝が始まった。`, type: 'system' }],
        })
      },

      // ── moveToLocation ─────────────────────────────────────────────────
      moveToLocation: (locationId) => {
        const state = get()
        const loc = LOCATIONS.find((l) => l.id === locationId)
        if (!loc) return
        if (loc.requiredFame > state.player.stats.fame) return

        const flags = [...state.player.flags]
        if (locationId === 'loc_tavern' && !flags.includes('flag_tavern_visited')) {
          flags.push('flag_tavern_visited')
        }

        set((s) => ({
          player: { ...s.player, currentLocationId: locationId, flags },
        }))

        const locName = loc.name
        get().addLog(`${locName}へ移動した。`, 'action')

        // Try to trigger a location-based event
        const newState = get()
        const event = pickTriggeredEvent(newState)
        if (event) {
          const seenFlag = `event_seen_${event.id}`
          set((s) => ({
            activeEvent: event,
            player: {
              ...s.player,
              flags: [...s.player.flags, seenFlag],
            },
          }))
        }
      },

      // ── performAction ──────────────────────────────────────────────────
      performAction: (actionId) => {
        const state = get()
        if (state.actionsThisTurn >= state.maxActionsPerTurn) return
        if (state.activeEvent) return

        const loc = LOCATIONS.find((l) => l.id === state.player.currentLocationId)
        const action = loc?.actions.find((a) => a.id === actionId)
        if (!action) return

        const player = state.player
        if (player.stats.stamina < action.staminaCost) {
          get().addLog('体力が足りない。休息が必要だ。', 'system')
          return
        }

        // Special: rest action restores stamina
        if (actionId === 'act_rest') {
          set((s) => ({
            actionsThisTurn: s.actionsThisTurn + 1,
            player: {
              ...s.player,
              stats: { ...s.player.stats, stamina: 100 },
            },
          }))
          get().addLog('休息して体力を完全に回復した。', 'action')
          return
        }

        // Special: save action
        if (actionId === 'act_save') {
          get().addLog('旅の記録を残した（自動保存済み）。', 'system')
          return
        }

        // Deduct stamina
        const newStamina = Math.max(0, player.stats.stamina - action.staminaCost)

        // Perform stat checks for the action
        let checkResult = true
        if (action.checks.length > 0) {
          const primaryStat = action.checks[0]
          const threshold = getCheckThreshold(action.checks)
          checkResult = statCheck(player.stats[primaryStat], threshold)
        }

        // Skill gain — small chance of +1 to checked stats
        const statGains: Partial<typeof player.stats> = {}
        action.checks.forEach((stat) => {
          if (Math.random() < 0.3) {
            statGains[stat] = 1
          }
        })

        const newStats: PlayerStats = { ...player.stats, stamina: newStamina }
        for (const [stat, gain] of Object.entries(statGains)) {
          const key = stat as keyof PlayerStats
          newStats[key] = (newStats[key] as number) + (gain as number)
        }

        // Study action wisdom gain
        if (actionId === 'act_study') {
          newStats.wisdom = newStats.wisdom + (checkResult ? 1 : 0)
        }

        // Pray/divination omen gain
        if (actionId === 'act_pray' || actionId === 'act_divination') {
          newStats.omen = Math.min(100, newStats.omen + (checkResult ? 10 : 5))
        }

        const resultText = checkResult
          ? `${action.label}を行った。${action.checks.length > 0 ? '成功！' : ''}`
          : `${action.label}を行ったが、うまくいかなかった。`

        set((s) => ({
          actionsThisTurn: s.actionsThisTurn + 1,
          player: { ...s.player, stats: newStats },
        }))

        get().addLog(resultText, 'action')

        // After action: try to trigger an event
        const newState = get()
        const event = pickTriggeredEvent(newState)
        if (event) {
          const seenFlag = `event_seen_${event.id}`
          set((s) => ({
            activeEvent: event,
            player: {
              ...s.player,
              flags: [...s.player.flags, seenFlag],
            },
          }))
        }
      },

      // ── acceptQuest ────────────────────────────────────────────────────
      acceptQuest: (questId) => {
        const state = get()
        const quest = QUESTS.find((q) => q.id === questId)
        if (!quest) return
        if (state.player.activeQuestIds.includes(questId)) return
        if (state.player.completedQuestIds.includes(questId)) return

        // Check requirements
        const { requirements, cost } = quest
        const { player } = state
        if (requirements.fame !== undefined && player.stats.fame < requirements.fame) return
        if (requirements.flags && !requirements.flags.every((f) => player.flags.includes(f))) return
        if (
          requirements.completedQuests &&
          !requirements.completedQuests.every((q) => player.completedQuestIds.includes(q))
        )
          return
        if (player.stats.stamina < cost.stamina) return
        if (cost.gold && player.stats.gold < cost.gold) return

        set((s) => ({
          player: {
            ...s.player,
            activeQuestIds: [...s.player.activeQuestIds, questId],
          },
        }))
        get().addLog(`任務「${quest.title}」を受けた。`, 'quest')
      },

      // ── completeQuest ──────────────────────────────────────────────────
      completeQuest: (questId) => {
        const state = get()
        const quest = QUESTS.find((q) => q.id === questId)
        if (!quest) return
        if (!state.player.activeQuestIds.includes(questId)) return

        const player = state.player
        const cost = quest.cost

        // Check stamina/gold
        if (player.stats.stamina < cost.stamina) {
          get().addLog('体力が足りず、任務を完遂できなかった。', 'quest')
          return
        }
        if (cost.gold && player.stats.gold < cost.gold) {
          get().addLog('資金が足りず、任務を完遂できなかった。', 'quest')
          return
        }

        // Determine success via stat check
        let success = true
        if (quest.checks.length > 0) {
          const primaryStat = quest.checks[0]
          const threshold = getCheckThreshold(quest.checks)
          success = statCheck(player.stats[primaryStat], threshold)
        }

        // Apply outcome
        const outcome = success ? quest.rewards : quest.failConsequences
        const newStats: PlayerStats = {
          ...player.stats,
          stamina: Math.max(0, player.stats.stamina - cost.stamina),
          gold: player.stats.gold - (cost.gold ?? 0),
        }

        if (outcome.gold !== undefined) newStats.gold = Math.max(0, newStats.gold + outcome.gold)
        if (outcome.fame !== undefined) newStats.fame = Math.max(0, newStats.fame + (outcome.fame ?? 0))

        if ('stats' in outcome && outcome.stats) {
          for (const [stat, change] of Object.entries(outcome.stats)) {
            const key = stat as keyof PlayerStats
            newStats[key] = Math.max(0, (newStats[key] as number) + (change as number)) as never
          }
        }

        const newRelations = { ...player.relations }
        if ('relations' in outcome && outcome.relations) {
          for (const [npcId, change] of Object.entries(outcome.relations)) {
            newRelations[npcId] = (newRelations[npcId] ?? 0) + (change ?? 0)
          }
        }

        const newFlags = [...player.flags]
        if (success) {
          const rewardFlags = (outcome as QuestRewards).flags
          if (rewardFlags) {
            rewardFlags.forEach((f: string) => {
              if (!newFlags.includes(f)) newFlags.push(f)
            })
          }
        }

        const newActiveQuests = player.activeQuestIds.filter((id) => id !== questId)
        const newCompletedQuests = success ? [...player.completedQuestIds, questId] : player.completedQuestIds

        set((s) => ({
          pendingQuestResult: { quest, success },
          player: {
            ...s.player,
            stats: newStats,
            relations: newRelations,
            flags: newFlags,
            activeQuestIds: newActiveQuests,
            completedQuestIds: newCompletedQuests,
          },
        }))

        const logText = success
          ? `任務「${quest.title}」を完遂した！`
          : `任務「${quest.title}」に失敗してしまった。`
        get().addLog(logText, 'quest')
      },

      // ── dismissQuestResult ─────────────────────────────────────────────
      dismissQuestResult: () => set({ pendingQuestResult: null }),

      // ── resolveEvent ───────────────────────────────────────────────────
      resolveEvent: (choice) => {
        const state = get()
        if (!state.activeEvent) return

        const player = state.player
        let outcome = choice.successOutcome

        // Check if this choice has a stat check
        if (choice.check !== undefined && choice.threshold !== undefined) {
          const passed = statCheck(player.stats[choice.check], choice.threshold)
          if (!passed && choice.failOutcome) {
            outcome = choice.failOutcome
          }
        }

        const newStats: PlayerStats = { ...player.stats }
        if (outcome.statChanges) {
          for (const [stat, change] of Object.entries(outcome.statChanges)) {
            const key = stat as keyof PlayerStats
            newStats[key] = Math.max(0, (newStats[key] as number) + (change as number)) as never
          }
        }
        newStats.stamina = Math.min(100, newStats.stamina)
        newStats.omen = Math.min(100, newStats.omen)

        const newRelations = { ...player.relations }
        if (outcome.relationChanges) {
          for (const [npcId, change] of Object.entries(outcome.relationChanges)) {
            newRelations[npcId] = (newRelations[npcId] ?? 0) + change
          }
        }

        const newFlags = [...player.flags]
        if (outcome.flagsSet) {
          outcome.flagsSet.forEach((f) => {
            if (!newFlags.includes(f)) newFlags.push(f)
          })
        }

        set((s) => ({
          activeEvent: null,
          player: {
            ...s.player,
            stats: newStats,
            relations: newRelations,
            flags: newFlags,
          },
        }))

        get().addLog(`【${state.activeEvent.title}】${outcome.text}`, 'event')
      },

      // ── endTurn ────────────────────────────────────────────────────────
      endTurn: () => {
        const state = get()
        if (state.activeEvent) return

        const nextTurn = state.turn + 1

        // Season advancement every 6 turns
        const seasons: GameState['world']['currentSeason'][] = ['spring', 'summer', 'autumn', 'winter']
        const seasonIndex = Math.floor((nextTurn - 1) / 6) % 4
        const currentSeason = seasons[seasonIndex]

        // Stamina partial recovery at turn start
        const recoveredStamina = Math.min(100, state.player.stats.stamina + 20)

        // Check game over
        if (nextTurn > state.maxTurns) {
          set({ screen: 'GAME_OVER' })
          return
        }

        // Check win condition: official retainer
        if (state.player.flags.includes('flag_official_retainer')) {
          set({ screen: 'GAME_OVER' })
          get().addLog('立志伝の第一章が完結した！家臣として認められた。', 'system')
          return
        }

        set((s) => ({
          turn: nextTurn,
          actionsThisTurn: 0,
          world: { ...s.world, currentSeason },
          player: {
            ...s.player,
            stats: { ...s.player.stats, stamina: recoveredStamina },
          },
        }))

        get().addLog(`─── 第${nextTurn}回が始まった ───`, 'system')

        // Check for turn-triggered events
        const newState = get()
        const event = pickTriggeredEvent(newState)
        if (event) {
          const seenFlag = `event_seen_${event.id}`
          set((s) => ({
            activeEvent: event,
            player: {
              ...s.player,
              flags: [...s.player.flags, seenFlag],
            },
          }))
        }
      },
    }),
    {
      name: 'sengoku-rising-save',
    }
  )
)

// ─── Selectors ────────────────────────────────────────────────────────────

export const getBackground = (id: string) => BACKGROUNDS.find((b) => b.id === id)

export const getLocation = (id: string) => LOCATIONS.find((l) => l.id === id)

export const getNpc = (id: string) => NPCS.find((n) => n.id === id)

export const getQuest = (id: string) => QUESTS.find((q) => q.id === id)

/** Quests available to accept at a location given current player state */
export function getAvailableQuestsAt(locationId: string, player: Player): Quest[] {
  return QUESTS.filter((quest) => {
    if (quest.locationId !== locationId) return false
    if (player.activeQuestIds.includes(quest.id)) return false
    if (player.completedQuestIds.includes(quest.id)) return false
    const req = quest.requirements
    if (req.fame !== undefined && player.stats.fame < req.fame) return false
    if (req.flags && !req.flags.every((f) => player.flags.includes(f))) return false
    if (req.completedQuests && !req.completedQuests.every((q) => player.completedQuestIds.includes(q)))
      return false
    if (req.relations) {
      for (const [npcId, minVal] of Object.entries(req.relations)) {
        if ((player.relations[npcId] ?? 0) < minVal) return false
      }
    }
    return true
  })
}

// Re-export data for convenience
export { LOCATIONS, NPCS, QUESTS, BACKGROUNDS }
export type { Player }
