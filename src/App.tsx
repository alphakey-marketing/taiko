import { useGameStore } from './store/gameStore'
import { TitleScreen } from './screens/TitleScreen'
import { CharacterCreation } from './screens/CharacterCreation'
import { GameScreen } from './screens/GameScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import './App.css'

function App() {
  const screen = useGameStore((s) => s.screen)

  switch (screen) {
    case 'TITLE':
      return <TitleScreen />
    case 'CHARACTER_CREATION':
      return <CharacterCreation />
    case 'GAME':
      return <GameScreen />
    case 'GAME_OVER':
      return <GameOverScreen />
    default:
      return <TitleScreen />
  }
}

export default App
