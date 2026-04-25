import { useEffect, useState } from 'react'
import { albums } from '../data/albums'
import { useArcCarousel } from '../hooks/useArcCarousel'
import { AlbumCard } from './AlbumCard'

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

function computeMaxImageHeight(width: number, height: number): number {
  const isMobile = width < 700
  // Arc parameters must match arcPosition.ts
  const centerYOffset = isMobile ? 300 : 620
  const arcRadius = isMobile ? 420 : 720
  // Card half-height matches CSS: clamp(165px, min(22vw, 27vh), 315px) / 2
  // Mobile is fixed 214px
  const cardHalfH = isMobile
    ? 107
    : Math.min(157.5, Math.max(82.5, Math.min(0.22 * width, 0.27 * height) / 2))
  const arcActiveY = height + centerYOffset - arcRadius
  const cardTop = arcActiveY - cardHalfH
  const topOffset = Math.max(16, Math.min(height * 0.04, 40))
  return Math.max(100, cardTop - topOffset - 20)
}

export function ArcCarousel() {
  const { width, height } = useViewportSize()
  const carousel = useArcCarousel({ itemCount: albums.length, viewportWidth: width, viewportHeight: height })
  const activeItem = albums[carousel.activeIndex]
  const maxImageHeight = computeMaxImageHeight(width, height)

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
      }}
      role="region"
      tabIndex={0}
    >
      <div
        aria-hidden="true"
        className="active-album-backdrop"
        data-testid="active-album-backdrop"
        style={{ background: activeItem.imageUrl, opacity: 0.36 }}
      />

      <img
        key={activeItem.id}
        src={activeItem.rawUrl}
        alt={activeItem.title}
        aria-hidden="true"
        className="active-image-display"
        style={{ maxHeight: maxImageHeight }}
      />

      <div className="arc-carousel__cards" aria-hidden={false}>
        {albums.map((item) => {
          const layout = carousel.layout.find((entry) => entry.index === albums.indexOf(item))
          if (!layout) return null
          const isActive = albums[carousel.activeIndex].id === item.id
          return (
            <AlbumCard
              key={item.id}
              item={item}
              layout={layout}
              isActive={isActive}
              isDragging={carousel.isDragging}
              onClick={() => {
                if (!isActive) carousel.goTo(albums.indexOf(item))
              }}
            />
          )
        })}
      </div>
    </section>
  )
}