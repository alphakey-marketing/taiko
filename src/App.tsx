import { useGameStore } from './store/gameStore'
import { TitleScreen } from './screens/TitleScreen'
import { CharacterCreation } from './screens/CharacterCreation'
import { GameScreen } from './screens/GameScreen'
import './App.css'

function App() {
  const screen = useGameStore((s) => s.screen)

  switch (screen) {
    case 'TITLE':
      return <TitleScreen />
    case 'CHARACTER_CREATION':
      return <CharacterCreation />
    case 'GAME':
    case 'GAME_OVER':
      return <GameScreen />
    default:
      return <TitleScreen />
  }
}

export default App
