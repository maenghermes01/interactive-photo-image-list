import { useCallback, useMemo, useRef, useState } from 'react'
import { albums } from '../data/albums'
import { wrapIndex } from '../lib/arcPosition'

type VisiblePanel = {
  index: number
  relativeIndex: number
  xOffset: number
  rotation: number
  scale: number
  opacity: number
  zIndex: number
}

function shortestRelativeIndex(index: number, activeIndex: number, total: number): number {
  const raw = index - activeIndex
  const half = total / 2
  if (raw > half) return raw - total
  if (raw < -half) return raw + total
  return raw
}

function getVisiblePanels(activeIndex: number, itemCount: number): VisiblePanel[] {
  return Array.from({ length: itemCount }, (_, index) => {
    const relativeIndex = shortestRelativeIndex(index, activeIndex, itemCount)
    const distance = Math.abs(relativeIndex)

    return {
      index,
      relativeIndex,
      xOffset: relativeIndex * 58,
      rotation: relativeIndex * -1.6,
      scale: relativeIndex === 0 ? 1 : Math.max(0.82, 0.94 - distance * 0.055),
      opacity: distance > 4 ? 0 : Math.max(0.18, 0.78 - distance * 0.16),
      zIndex: Math.max(1, 20 - distance),
    }
  })
}

export function VerticalAlbumCarousel() {
  const [activeIndex, setActiveIndex] = useState(3)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const activeItem = albums[activeIndex]

  const panels = useMemo(() => getVisiblePanels(activeIndex, albums.length), [activeIndex])

  const goTo = useCallback((index: number) => setActiveIndex(wrapIndex(index, albums.length)), [])
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    setIsDragging(true)
    dragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isDragging) return
      setIsDragging(false)
      event.currentTarget.releasePointerCapture(event.pointerId)
      const movement = event.clientX - dragStartX.current
      if (Math.abs(movement) < 24) return
      if (movement < 0) next()
      else previous()
    },
    [isDragging, next, previous],
  )

  return (
    <section
      aria-label="Horizontal image carousel"
      className={`vertical-carousel ${isDragging ? 'is-dragging' : ''}`}
      role="region"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={(event) => {
        event.preventDefault()
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
        if (Math.abs(delta) < 8) return
        if (delta > 0) next()
        else previous()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') next()
        if (event.key === 'ArrowLeft') previous()
      }}
    >
      <div className="vertical-carousel__track" aria-hidden="false">
        {panels.map((panel) => {
          const item = albums[panel.index]
          const isActive = panel.index === activeIndex

          return (
            <button
              key={item.id}
              aria-current={isActive ? 'true' : undefined}
              aria-label={item.title}
              className={`vertical-panel ${isActive ? 'vertical-panel--active' : ''}`}
              type="button"
              onClick={() => {
                if (!isActive) goTo(panel.index)
              }}
              style={{
                '--panel-x': `${panel.xOffset}vw`,
                '--panel-rotation': `${panel.rotation}deg`,
                '--panel-scale': panel.scale,
                opacity: panel.opacity,
                zIndex: panel.zIndex,
              } as React.CSSProperties}
            >
              <img
                src={item.rawUrl}
                alt={isActive ? item.title : ''}
                data-testid={isActive ? 'active-vertical-image' : undefined}
                aria-hidden={!isActive}
                className={isActive ? 'active-vertical-image' : undefined}
              />
            </button>
          )
        })}
      </div>

      <div className="vertical-carousel__ambient" aria-hidden="true" style={{ backgroundImage: activeItem.imageUrl }} />
    </section>
  )
}
