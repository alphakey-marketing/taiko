import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  GameState,
  Player,
  PlayerStats,
  PlayerRank,
  Background,
  Quest,
  QuestRewards,
  GameEvent,
  EventChoice,
  LogEntryType,
  DuelState,
  DuelActionType,
} from '../types/game'
import { BACKGROUNDS } from '../data/backgrounds'
import { LOCATIONS } from '../data/locations'
import { NPCS } from '../data/npcs'
import { QUESTS } from '../data/quests'
import { EVENTS } from '../data/events'
import { ENDINGS } from '../data/endings'

// ─── Helpers ──────────────────────────────────────────────────────────────

const RANK_ORDER: PlayerRank[] = ['none', 'apprentice', 'retainer', 'advisor']

function rankGte(a: PlayerRank, b: PlayerRank): boolean {
  return RANK_ORDER.indexOf(a) >= RANK_ORDER.indexOf(b)
}

function rankLte(a: PlayerRank, b: PlayerRank): boolean {
  return RANK_ORDER.indexOf(a) <= RANK_ORDER.indexOf(b)
}

function buildInitialRelations(background: Background): Record<string, number> {
  const relations: Record<string, number> = {}
  NPCS.forEach((npc) => {
    relations[npc.id] = npc.affectionDefault
  })
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
    omen: Math.min(100, base.omen + (bonuses.omen ?? 0)),
  }
}

/** Roll a stat check: returns true if player stat + 1d6 >= threshold */
function statCheck(statValue: number, threshold: number): boolean {
  const roll = Math.floor(Math.random() * 6) + 1
  return statValue + roll >= threshold
}

/** Try to trigger a random eligible event for current game state */
function pickTriggeredEvent(state: GameState): GameEvent | null {
  const { player, turn } = state
  const eligible = EVENTS.filter((ev) => {
    const t = ev.trigger
    if (player.flags.includes(`event_seen_${ev.id}`)) return false
    if (t.turn !== undefined && t.turn !== turn) return false
    if (t.minTurn !== undefined && turn < t.minTurn) return false
    if (t.locationId && t.locationId !== player.currentLocationId) return false
    if (t.minFame !== undefined && player.stats.fame < t.minFame) return false
    if (t.flags && !t.flags.every((f) => player.flags.includes(f))) return false
    if (
      t.completedQuests &&
      !t.completedQuests.every((q) => player.completedQuestIds.includes(q))
    )
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
    if (t.maxStat) {
      for (const [stat, maxVal] of Object.entries(t.maxStat)) {
        if ((player.stats[stat as keyof PlayerStats] ?? 0) > (maxVal ?? 0)) return false
      }
    }
    const prob = t.probability ?? 1
    return Math.random() < prob
  })
  return eligible[0] ?? null
}

/** Evaluate which ending the player has achieved, or null if none yet */
function evaluateEnding(state: GameState): string | null {
  const { player } = state
  const ranked = [...ENDINGS].sort((a, b) => b.condition.priority - a.condition.priority)

  for (const ending of ranked) {
    const c = ending.condition

    if (c.minFame !== undefined && player.stats.fame < c.minFame) continue
    if (c.maxFame !== undefined && player.stats.fame > c.maxFame) continue
    if (c.minGold !== undefined && player.stats.gold < c.minGold) continue
    if (c.minRank !== undefined && !rankGte(player.rank, c.minRank)) continue
    if (c.maxRank !== undefined && !rankLte(player.rank, c.maxRank)) continue

    if (c.relations) {
      const relOk = Object.entries(c.relations).every(
        ([npcId, minVal]) => (player.relations[npcId] ?? 0) >= minVal
      )
      if (!relOk) continue
    }

    if (c.flags && !c.flags.every((f) => player.flags.includes(f))) continue

    if (c.failureFlags && c.failureFlags.some((f) => player.flags.includes(f))) continue

    return ending.id
  }
  return null
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
  // Duels
  startDuel: (duel: DuelState) => void
  performDuelAction: (action: DuelActionType) => void
  dismissDuel: () => void
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
        rank: 'none',
        stats: {
          martial: 3,
          wisdom: 3,
          charm: 3,
          commerce: 3,
          fame: 0,
          gold: 40,
          stamina: 80,
          omen: 10,
        },
        currentLocationId: 'loc_home',
        activeQuestIds: [],
        completedQuestIds: [],
        failedQuestIds: [],
        flags: [],
        relations: {},
      },
      world: {
        currentSeason: 'spring',
        omenLevel: 0,
        warTension: 0,
      },
      activeEvent: null,
      activeDuel: null,
      pendingQuestResult: null,
      achievedEndingId: null,
      log: [],

      // ── addLog ─────────────────────────────────────────────────────────
      addLog: (text, type) => {
        set((s) => ({
          log: [{ turn: s.turn, text, type }, ...s.log].slice(0, 60),
        }))
      },

      // ── goToCharacterCreation ──────────────────────────────────────────
      goToCharacterCreation: () => set({ screen: 'CHARACTER_CREATION', achievedEndingId: null }),

      // ── startNewGame ───────────────────────────────────────────────────
      startNewGame: (playerName, backgroundId) => {
        const bg = BACKGROUNDS.find((b) => b.id === backgroundId) ?? BACKGROUNDS[0]
        const stats = buildInitialStats(bg)
        const relations = buildInitialRelations(bg)

        const player: Player = {
          name: playerName,
          backgroundId: bg.id,
          rank: 'apprentice',
          stats,
          currentLocationId: 'loc_home',
          activeQuestIds: [],
          completedQuestIds: [],
          failedQuestIds: [],
          flags: [],
          relations,
        }
        set({
          screen: 'GAME',
          turn: 1,
          actionsThisTurn: 0,
          player,
          world: { currentSeason: 'spring', omenLevel: 10, warTension: 0 },
          activeEvent: null,
          activeDuel: null,
          pendingQuestResult: null,
          achievedEndingId: null,
          log: [{ turn: 1, text: `${playerName}の立志伝が始まった。陰陽師見習いとして、天命の道を歩め。`, type: 'system' }],
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

        get().addLog(`${loc.name}へ移動した。`, 'action')

        const newState = get()
        const event = pickTriggeredEvent(newState)
        if (event) {
          const seenFlag = `event_seen_${event.id}`
          set((s) => ({
            activeEvent: event,
            player: { ...s.player, flags: [...s.player.flags, seenFlag] },
          }))
        }
      },

      // ── performAction ──────────────────────────────────────────────────
      performAction: (actionId) => {
        const state = get()
        if (state.actionsThisTurn >= state.maxActionsPerTurn) return
        if (state.activeEvent || state.activeDuel) return

        const loc = LOCATIONS.find((l) => l.id === state.player.currentLocationId)
        const action = loc?.actions.find((a) => a.id === actionId)
        if (!action) return

        const player = state.player
        if (player.stats.stamina < action.staminaCost) {
          get().addLog('体力が足りない。休息が必要だ。', 'system')
          return
        }

        if (actionId === 'act_rest') {
          set((s) => ({
            actionsThisTurn: s.actionsThisTurn + 1,
            player: { ...s.player, stats: { ...s.player.stats, stamina: 100 } },
          }))
          get().addLog('休息して体力を完全に回復した。', 'action')
          return
        }

        if (actionId === 'act_save') {
          get().addLog('旅の記録を残した（自動保存済み）。', 'system')
          return
        }

        const newStamina = Math.max(0, player.stats.stamina - action.staminaCost)
        const newStats: PlayerStats = { ...player.stats, stamina: newStamina }

        let checkResult = true
        if (action.checks.length > 0) {
          const primaryStat = action.checks[0]
          checkResult = statCheck(player.stats[primaryStat], 9)
        }

        // Small chance of stat gain on checks
        action.checks.forEach((stat) => {
          if (Math.random() < 0.35) {
            newStats[stat] = Math.min(20, (newStats[stat] as number) + 1)
          }
        })

        if (actionId === 'act_study') {
          newStats.wisdom = Math.min(20, newStats.wisdom + (checkResult ? 1 : 0))
        }
        if (actionId === 'act_pray' || actionId === 'act_divination' || actionId === 'act_cleanse') {
          newStats.omen = Math.min(100, newStats.omen + (checkResult ? 10 : 5))
        }
        if (actionId === 'act_basic_training') {
          newStats.martial = Math.min(20, newStats.martial + (checkResult ? 1 : 0))
        }
        if (actionId === 'act_trade') {
          const earn = checkResult ? 20 : 0
          newStats.gold = newStats.gold + earn
          if (checkResult) newStats.commerce = Math.min(20, newStats.commerce + 1)
        }

        const resultText = checkResult
          ? `${action.label}を行った。${action.checks.length > 0 ? '成功！' : ''}`
          : `${action.label}を試みたが、うまくいかなかった。`

        set((s) => ({
          actionsThisTurn: s.actionsThisTurn + 1,
          player: { ...s.player, stats: newStats },
        }))

        get().addLog(resultText, 'action')

        const newState = get()
        const event = pickTriggeredEvent(newState)
        if (event) {
          const seenFlag = `event_seen_${event.id}`
          set((s) => ({
            activeEvent: event,
            player: { ...s.player, flags: [...s.player.flags, seenFlag] },
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

        const { requirements, cost } = quest
        const { player } = state
        if (requirements.fame !== undefined && player.stats.fame < requirements.fame) return
        if (requirements.flags && !requirements.flags.every((f) => player.flags.includes(f))) return
        if (
          requirements.completedQuests &&
          !requirements.completedQuests.every((q) => player.completedQuestIds.includes(q))
        )
          return
        if (requirements.relations) {
          for (const [npcId, minVal] of Object.entries(requirements.relations)) {
            if ((player.relations[npcId] ?? 0) < minVal) return
          }
        }
        if (requirements.stats) {
          for (const [stat, minVal] of Object.entries(requirements.stats)) {
            if ((player.stats[stat as keyof PlayerStats] ?? 0) < (minVal ?? 0)) return
          }
        }
        if (player.stats.stamina < cost.stamina) return
        if (cost.gold && player.stats.gold < cost.gold) return

        set((s) => ({
          player: { ...s.player, activeQuestIds: [...s.player.activeQuestIds, questId] },
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

        if (player.stats.stamina < cost.stamina) {
          get().addLog('体力が足りず、任務を完遂できなかった。', 'quest')
          return
        }
        if (cost.gold && player.stats.gold < cost.gold) {
          get().addLog('資金が足りず、任務を完遂できなかった。', 'quest')
          return
        }

        // If this is a duel quest, open the duel modal instead of resolving immediately
        if (quest.duelConfig) {
          const cfg = quest.duelConfig
          const playerMaxHp = Math.max(20, player.stats.martial * 4)
          const duelState: DuelState = {
            questId,
            enemyName: cfg.enemyName,
            enemyHp: cfg.enemyHp,
            enemyMaxHp: cfg.enemyHp,
            playerHp: playerMaxHp,
            playerMaxHp,
            round: 1,
            maxRounds: cfg.rounds,
            roundLog: [],
            result: 'pending',
          }
          set({ activeDuel: duelState })
          get().addLog(`対決が始まった——${cfg.enemyName}と!`, 'duel')
          return
        }

        // Normal quest resolution
        let success = true
        if (quest.checks.length > 0) {
          const threshold = quest.threshold ?? 10
          const primaryStat = quest.checks[0]
          success = statCheck(player.stats[primaryStat], threshold)
        }

        const { newPlayer, logText } = computeQuestOutcome(player, quest, success)
        set({ pendingQuestResult: { quest, success }, player: newPlayer })
        get().addLog(logText, 'quest')
      },

      // ── dismissQuestResult ─────────────────────────────────────────────
      dismissQuestResult: () => {
        set({ pendingQuestResult: null })
        // Check for ending after dismissing
        const state = get()
        const endingId = evaluateEnding(state)
        if (endingId) {
          set({ achievedEndingId: endingId, screen: 'GAME_OVER' })
        }
      },

      // ── resolveEvent ───────────────────────────────────────────────────
      resolveEvent: (choice) => {
        const state = get()
        if (!state.activeEvent) return

        const player = state.player
        let outcome = choice.successOutcome

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
        newStats.stamina = Math.min(100, Math.max(0, newStats.stamina))
        newStats.omen = Math.min(100, Math.max(0, newStats.omen))

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

        let newRank = player.rank
        if (outcome.rankUp && !rankGte(player.rank, outcome.rankUp)) {
          newRank = outcome.rankUp
        }

        set((s) => ({
          activeEvent: null,
          player: {
            ...s.player,
            stats: newStats,
            relations: newRelations,
            flags: newFlags,
            rank: newRank,
          },
        }))

        get().addLog(`【${state.activeEvent.title}】${outcome.text}`, 'event')

        // Check ending after major event
        const newState = get()
        const endingId = evaluateEnding(newState)
        if (endingId) {
          set({ achievedEndingId: endingId, screen: 'GAME_OVER' })
        }
      },

      // ── startDuel ──────────────────────────────────────────────────────
      startDuel: (duel) => set({ activeDuel: duel }),

      // ── dismissDuel ────────────────────────────────────────────────────
      dismissDuel: () => set({ activeDuel: null }),

      // ── performDuelAction ──────────────────────────────────────────────
      performDuelAction: (action) => {
        const state = get()
        if (!state.activeDuel) return
        const duel = { ...state.activeDuel }
        const player = state.player
        const quest = QUESTS.find((q) => q.id === duel.questId)
        const enemyMartial = quest?.duelConfig?.enemyMartial ?? 5

        const roundLog: string[] = []
        let playerHp = duel.playerHp
        let enemyHp = duel.enemyHp

        if (action === 'attack') {
          const hit = statCheck(player.stats.martial, 8)
          const dmg = hit ? Math.floor(Math.random() * 6) + 3 + Math.floor(player.stats.martial / 2) : 0
          enemyHp = Math.max(0, enemyHp - dmg)
          roundLog.push(hit ? `君の攻撃が当たった！${dmg}ダメージ！` : `攻撃が外れた！`)
        } else if (action === 'defend') {
          roundLog.push('防御の構えを取った。被ダメージを半減する。')
        } else {
          // gambit / trick
          const hit = statCheck(player.stats.wisdom, 9)
          const dmg = hit ? Math.floor(Math.random() * 8) + 2 : 0
          enemyHp = Math.max(0, enemyHp - dmg)
          roundLog.push(hit ? `奇策が決まった！${dmg}ダメージ！` : `奇策が見破られた！`)
        }

        // Enemy counterattack
        if (enemyHp > 0) {
          const enemyHit = statCheck(enemyMartial, 7)
          const rawDmg = enemyHit ? Math.floor(Math.random() * 6) + 2 : 0
          const dmg = action === 'defend' ? Math.floor(rawDmg / 2) : rawDmg
          playerHp = Math.max(0, playerHp - dmg)
          roundLog.push(enemyHit ? `${duel.enemyName}の反撃！${dmg}ダメージ！` : `${duel.enemyName}の攻撃を躱した！`)
        }

        const nextRound = duel.round + 1
        let result: DuelState['result'] = 'pending'

        if (playerHp <= 0) {
          result = 'lose'
          roundLog.push('倒れた…！')
        } else if (enemyHp <= 0) {
          result = 'win'
          roundLog.push(`${duel.enemyName}を打ち負かした！`)
        } else if (nextRound > duel.maxRounds) {
          // After max rounds, winner is whoever has more HP
          result = playerHp >= enemyHp ? 'win' : 'lose'
          roundLog.push(result === 'win' ? '持久戦に勝利した！' : '時間切れで引き分け——敗北扱い。')
        }

        const updatedDuel: DuelState = {
          ...duel,
          playerHp,
          enemyHp,
          round: nextRound,
          roundLog,
          result,
        }

        if (result !== 'pending') {
          // Keep activeDuel set so the result banner is visible in DuelModal.
          // Apply quest outcome now; the modal's Continue button will dismiss the duel.
          const finalDuel: DuelState = { ...updatedDuel, result }
          set({ activeDuel: finalDuel })
          const success = result === 'win'
          if (quest) {
            const { newPlayer, logText } = computeQuestOutcome(get().player, quest, success)
            set({ pendingQuestResult: { quest, success }, player: newPlayer })
            get().addLog(logText, 'quest')
          }
          get().addLog(success ? `対決勝利！` : `対決敗北…`, 'duel')
        } else {
          set({ activeDuel: updatedDuel })
        }
      },

      // ── endTurn ────────────────────────────────────────────────────────
      endTurn: () => {
        const state = get()
        if (state.activeEvent || state.activeDuel) return

        const nextTurn = state.turn + 1
        const seasons: GameState['world']['currentSeason'][] = ['spring', 'summer', 'autumn', 'winter']
        const seasonIndex = Math.floor((nextTurn - 1) / 6) % 4
        const currentSeason = seasons[seasonIndex]

        const recoveredStamina = Math.min(100, state.player.stats.stamina + 20)

        if (nextTurn > state.maxTurns) {
          // Time limit: evaluate ending
          const endingId = evaluateEnding(state)
          set({
            screen: 'GAME_OVER',
            achievedEndingId: endingId ?? 'ending_fallen_shadow',
          })
          return
        }

        set((s) => ({
          turn: nextTurn,
          actionsThisTurn: 0,
          world: { ...s.world, currentSeason },
          player: { ...s.player, stats: { ...s.player.stats, stamina: recoveredStamina } },
        }))

        get().addLog(`─── 第${nextTurn}回が始まった（${SEASON_JP[currentSeason]}）───`, 'system')

        // Check turn-based ending
        const newState = get()
        const endingId = evaluateEnding(newState)
        if (endingId) {
          set({ achievedEndingId: endingId, screen: 'GAME_OVER' })
          return
        }

        // Try to trigger an event
        const event = pickTriggeredEvent(newState)
        if (event) {
          const seenFlag = `event_seen_${event.id}`
          set((s) => ({
            activeEvent: event,
            player: { ...s.player, flags: [...s.player.flags, seenFlag] },
          }))
        }
      },
    }),
    { name: 'taiko-onmyoji-save' }
  )
)

// ─── Pure Quest Outcome Helper ─────────────────────────────────────────────

function computeQuestOutcome(
  player: Player,
  quest: Quest,
  success: boolean
): { newPlayer: Player; logText: string } {
  const cost = quest.cost
  const outcome = success ? quest.rewards : quest.failConsequences

  const newStats: PlayerStats = {
    ...player.stats,
    stamina: Math.max(0, player.stats.stamina - cost.stamina),
    gold: Math.max(0, player.stats.gold - (cost.gold ?? 0)),
  }

  if (outcome.gold !== undefined) newStats.gold = Math.max(0, newStats.gold + outcome.gold)
  if (outcome.fame !== undefined) newStats.fame = Math.max(-50, newStats.fame + (outcome.fame ?? 0))

  if ('stats' in outcome && outcome.stats) {
    for (const [stat, change] of Object.entries(outcome.stats)) {
      const key = stat as keyof PlayerStats
      newStats[key] = Math.max(0, (newStats[key] as number) + (change as number)) as never
    }
  }
  newStats.stamina = Math.min(100, newStats.stamina)
  newStats.omen = Math.min(100, Math.max(0, newStats.omen))

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

  const newActiveQuests = player.activeQuestIds.filter((id) => id !== quest.id)
  const newCompletedQuests = success ? [...player.completedQuestIds, quest.id] : player.completedQuestIds
  const newFailedQuests = !success ? [...player.failedQuestIds, quest.id] : player.failedQuestIds

  let newRank = player.rank
  if (success) {
    const rankUp = (outcome as QuestRewards).rankUp
    if (rankUp && RANK_ORDER.indexOf(rankUp) > RANK_ORDER.indexOf(player.rank)) {
      newRank = rankUp
    }
  }

  const newPlayer: Player = {
    ...player,
    stats: newStats,
    relations: newRelations,
    flags: newFlags,
    rank: newRank,
    activeQuestIds: newActiveQuests,
    completedQuestIds: newCompletedQuests,
    failedQuestIds: newFailedQuests,
  }

  const logText = success
    ? `任務「${quest.title}」を完遂した！`
    : `任務「${quest.title}」に失敗してしまった。`

  return { newPlayer, logText }
}

const SEASON_JP: Record<string, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
}

// ─── Selectors ────────────────────────────────────────────────────────────

export const getBackground = (id: string) => BACKGROUNDS.find((b) => b.id === id)
export const getLocation = (id: string) => LOCATIONS.find((l) => l.id === id)
export const getNpc = (id: string) => NPCS.find((n) => n.id === id)
export const getQuest = (id: string) => QUESTS.find((q) => q.id === id)
export const getEnding = (id: string) => ENDINGS.find((e) => e.id === id)

/** Quests available to accept at a location given current player state */
export function getAvailableQuestsAt(locationId: string, player: Player): Quest[] {
  return QUESTS.filter((q) => {
    if (q.locationId !== locationId) return false
    if (player.activeQuestIds.includes(q.id)) return false
    if (player.completedQuestIds.includes(q.id)) return false

    const { requirements } = q
    if (requirements.fame !== undefined && player.stats.fame < requirements.fame) return false
    if (requirements.flags && !requirements.flags.every((f) => player.flags.includes(f))) return false
    if (
      requirements.completedQuests &&
      !requirements.completedQuests.every((qid) => player.completedQuestIds.includes(qid))
    )
      return false
    if (requirements.relations) {
      for (const [npcId, minVal] of Object.entries(requirements.relations)) {
        if ((player.relations[npcId] ?? 0) < minVal) return false
      }
    }
    if (requirements.stats) {
      for (const [stat, minVal] of Object.entries(requirements.stats)) {
        if ((player.stats[stat as keyof typeof player.stats] ?? 0) < (minVal ?? 0)) return false
      }
    }
    return true
  })
}
