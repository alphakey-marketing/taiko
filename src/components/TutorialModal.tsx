import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import styles from './TutorialModal.module.css'

interface Slide {
  icon: string
  title: string
  body: string[]
  tip?: string
}

const SLIDES: Slide[] = [
  {
    icon: '🌙',
    title: '陰陽立志録へようこそ',
    body: [
      'あなたは架空戰國時代の陰陽師見習いです。',
      '24ターンの間に名声・人脈・財力を積み重ね、自分だけの人生を切り開いてください。',
      '最終的にどんな結末を迎えるかは、あなたの選択次第です。',
    ],
    tip: '💡 このゲームには複数のエンディングがあります。',
  },
  {
    icon: '⏳',
    title: 'ターンと行動',
    body: [
      '1ターンに最大3回行動できます。行動が終わったら「次の回へ進む」でターンを進めます。',
      'ターン終了時に体力が +20 回復します。全24ターンで物語は終幕します。',
      '右上の「残り N 行動」を常に確認しながら立ち回りましょう。',
    ],
    tip: '💡 まずは自宅で休息し、体力を管理することが大切です。',
  },
  {
    icon: '📊',
    title: '能力値の説明',
    body: [
      '武藝 — 戦闘・体術の強さ。道場で鍛えられる。',
      '智略 — 謀略・占術の深さ。書物を読んで伸ばせる。',
      '魅力 — 人を引きつける力。交流や儀式で上がる。',
      '商才 — 商売・交渉の才。市場での取引で磨かれる。',
      '名聲 — 世の評判。高いと城や特別な場所に入れる。',
      '天命 — 陰陽師の霊力。神社での修行で高まる。',
    ],
    tip: '💡 判定は「能力値 + サイコロ（1〜6）≥ 難易度」で成否が決まります。',
  },
  {
    icon: '📜',
    title: '任務（クエスト）の流れ',
    body: [
      '① 場所を訪れると「受けられる任務」が表示されます。',
      '② 「受ける」を押すと任務が開始されます（体力・金が消費されます）。',
      '③ 同じ場所に戻って「完了する」を押すと結果が判定されます。',
      '成功すれば報酬（金・名聲・関係値など）を獲得できます。',
    ],
    tip: '💡 任務は条件が合えば何度でも挑戦できます。',
  },
  {
    icon: '❤️',
    title: '体力の管理',
    body: [
      '体力は行動や任務で消耗します。0になると何もできなくなります。',
      '自宅の「休息する」で体力を全回復（ただし1行動消費）。',
      'ターン終了時にも +20 自動回復しますが、消耗が激しい局面では意識的に休もう。',
    ],
    tip: '💡 体力が20を下回ったらすぐに休息することをお勧めします。',
  },
  {
    icon: '🏆',
    title: 'エンディングへの道',
    body: [
      '功勳顯赫（軍師の道）— 名聲25・軍師昇進・主君の信頼20以上',
      '自立一隅（独立の道）— 名聲15・金錢250以上・商人と神職の信頼15以上',
      '刀客一道（剣の道）— 武藝18以上・武士見習い出身',
      '財閥の礎（商人の道）— 金錢500以上・商人信頼30以上・没落商家出身',
      '天命の賢者（占術の道）— 天命70以上・流派選択済み',
      '24ターン経過後、達成条件に応じた結末が訪れます。',
    ],
    tip: '💡 最初の一歩は神社の「初次占兆」任務から始めましょう！',
  },
]

export function TutorialModal() {
  const [step, setStep] = useState(0)
  const { player } = useGameStore()

  // Only show on first play (no tutorial flag yet)
  if (player.flags.includes('flag_tutorial_seen')) return null

  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  const handleClose = () => {
    useGameStore.getState().addLog('立志伝の旅が始まった。まず神社の「初次占兆」任務を確認しよう。', 'system')
    useGameStore.setState((s) => ({
      player: {
        ...s.player,
        flags: [...s.player.flags, 'flag_tutorial_seen'],
      },
    }))
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.icon}>{slide.icon}</span>
          <div className={styles.progress}>
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`}
              />
            ))}
          </div>
        </div>

        <h2 className={styles.title}>{slide.title}</h2>

        <ul className={styles.bodyList}>
          {slide.body.map((line, i) => (
            <li key={i} className={styles.bodyItem}>{line}</li>
          ))}
        </ul>

        {slide.tip && (
          <div className={styles.tip}>{slide.tip}</div>
        )}

        <div className={styles.footer}>
          <button
            className={styles.prevBtn}
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            ← 前へ
          </button>
          <span className={styles.stepLabel}>{step + 1} / {SLIDES.length}</span>
          {isLast ? (
            <button className={styles.startBtn} onClick={handleClose}>
              立志を始める ✦
            </button>
          ) : (
            <button className={styles.nextBtn} onClick={() => setStep((s) => s + 1)}>
              次へ →
            </button>
          )}
        </div>

        <button className={styles.skipBtn} onClick={handleClose}>
          スキップ
        </button>
      </div>
    </div>
  )
}
