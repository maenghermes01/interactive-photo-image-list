import { useEffect, useState } from 'react'
import { albums } from '../data/albums'
import { useArcCarousel } from '../hooks/useArcCarousel'
import { AlbumCard } from './AlbumCard'
import { AlbumDetailModal } from './AlbumDetailModal'

function useViewportSize() {
  const [size, setSize] = useState(() => ({
    width: typeof window === 'undefined' ? 1200 : window.innerWidth,
    height: typeof window === 'undefined' ? 800 : window.innerHeight,
  }))

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

export function ArcCarousel() {
  const { width, height } = useViewportSize()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const carousel = useArcCarousel({ itemCount: albums.length, viewportWidth: width, viewportHeight: height })
  const activeItem = albums[carousel.activeIndex]
  const selectedItem = albums.find((item) => item.id === selectedId)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section
      aria-label="Interactive circular image carousel"
      className={`arc-carousel ${carousel.isDragging ? 'is-dragging' : ''}`}
      onPointerDown={carousel.onPointerDown}
      onPointerMove={carousel.onPointerMove}
      onPointerUp={carousel.onPointerUp}
      onPointerCancel={carousel.onPointerUp}
      onWheel={carousel.onWheel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') carousel.next()
        if (event.key === 'ArrowLeft') carousel.previous()
        if (event.key === 'Enter') setSelectedId(activeItem.id)
      }}
      role="region"
      tabIndex={0}
    >
      <div className="active-meta" aria-live="polite">
        <span>{activeItem.artist}</span>
        <strong>{activeItem.country}</strong>
      </div>

      <div className="arc-carousel__cards" aria-hidden={false}>
        {albums.map((item) => {
          const layout = carousel.layout.find((entry) => entry.index === albums.indexOf(item))
          if (!layout) return null
          const isActive = albums[carousel.activeIndex].id === item.id
          return (
            <div key={item.id}>
              <AlbumCard
                item={item}
                layout={layout}
                isActive={isActive}
                isDragging={carousel.isDragging}
                onClick={() => {
                  if (isActive) setSelectedId(item.id)
                  else carousel.goTo(albums.indexOf(item))
                }}
              />
              <span
                className="album-label"
                style={{
                  transform: `translate3d(${layout.x}px, ${layout.y - 178}px, 0) translate(-50%, -50%) rotate(${layout.rotation}deg)`,
                  opacity: Math.max(0.2, layout.opacity - 0.1),
                  zIndex: layout.zIndex,
                }}
              >
                {item.artist}<br />{item.country}
              </span>
            </div>
          )
        })}
      </div>

      <div
        className="arc-controls"
        aria-label="Carousel controls"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={carousel.previous}>←</button>
        <span>{carousel.activeIndex + 1} / {albums.length}</span>
        <button type="button" onClick={carousel.next}>→</button>
      </div>

      {selectedItem && <AlbumDetailModal item={selectedItem} onClose={() => setSelectedId(null)} />}
    </section>
  )
}
