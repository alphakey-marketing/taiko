// ─── Web Audio API sound utilities ───────────────────────────────────────
// All sounds are generated procedurally; no audio files needed.

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.25,
  detune = 0,
  startOffset = 0
) {
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.value = freq
    osc.detune.value = detune
    const start = ac.currentTime + startOffset
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(gainPeak, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
    osc.start(start)
    osc.stop(start + duration + 0.05)
  } catch {
    // Silently ignore if audio is unavailable
  }
}

/** Short UI click beep */
export function playClick() {
  playTone(660, 0.06, 'square', 0.12)
}

/** Positive / success chime */
export function playSuccess() {
  playTone(523, 0.15, 'sine', 0.2, 0, 0)      // C5
  playTone(659, 0.15, 'sine', 0.2, 0, 0.1)    // E5
  playTone(784, 0.25, 'sine', 0.22, 0, 0.2)   // G5
}

/** Negative / fail sound */
export function playFail() {
  playTone(330, 0.18, 'sawtooth', 0.15, 0, 0)
  playTone(247, 0.25, 'sawtooth', 0.13, 0, 0.12)
}

/** Turn end soft chime */
export function playTurnEnd() {
  playTone(392, 0.12, 'sine', 0.15, 0, 0)     // G4
  playTone(523, 0.2, 'sine', 0.14, 0, 0.1)    // C5
}

/** Rank-up fanfare */
export function playLevelUp() {
  playTone(523, 0.1, 'sine', 0.2, 0, 0)
  playTone(659, 0.1, 'sine', 0.2, 0, 0.1)
  playTone(784, 0.1, 'sine', 0.2, 0, 0.2)
  playTone(1047, 0.35, 'sine', 0.22, 0, 0.3)
}

/** Duel hit sound */
export function playHit() {
  playTone(200, 0.08, 'square', 0.18, -200)
  playTone(150, 0.12, 'square', 0.1, 0, 0.05)
}

/** Event / modal appear */
export function playEventOpen() {
  playTone(440, 0.08, 'sine', 0.12, 0, 0)
  playTone(550, 0.14, 'sine', 0.1, 0, 0.06)
}
