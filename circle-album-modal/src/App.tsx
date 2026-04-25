import { ArcCarousel } from './components/ArcCarousel'
import './styles/circle-album.css'

export default function App() {
  return (
    <main className="page-shell" aria-label="Circle Album">
      <header className="hero-copy">
        <p className="hero-copy__kicker">Interactive Photo Image List</p>
        <h1>Circle Album</h1>
        <p>Drag, scroll, or use arrow keys to rotate the image cards along the lower arc.</p>
      </header>
      <ArcCarousel />
    </main>
  )
}
