import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { albums } from '../data/albums'

type VisiblePanel = {
  index: number
  relativeIndex: number
  xOffset: number
  rotation: number
  scale: number
  opacity: number
  zIndex: number
}

type HeartParticle = {
  id: number
  testIndex: number
  hx: string
  hsize: string
  hdelay: string
}

function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

function shortestRelativeIndex(index: number, activeIndex: number, total: number): number {
  const raw = index - activeIndex
  const half = total / 2
  if (raw > half) return raw - total
  if (raw < -half) return raw + total
  return raw
}

const CARD_SPACING_VW = 58

function getVisiblePanels(
  activeIndex: number,
  itemCount: number,
  dragOffsetPx = 0,
  revealed = true,
): VisiblePanel[] {
  const dragVw = (dragOffsetPx / window.innerWidth) * 100
  const dragStep = dragVw / CARD_SPACING_VW

  return Array.from({ length: itemCount }, (_, index) => {
    const relativeIndex = shortestRelativeIndex(index, activeIndex, itemCount)
    const effectiveRel = relativeIndex + dragStep
    const distance = Math.abs(effectiveRel)

    if (!revealed) {
      return {
        index,
        relativeIndex,
        xOffset: 0,
        rotation: 0,
        scale: relativeIndex === 0 ? 1 : 0.9,
        opacity: relativeIndex === 0 ? 1 : 0,
        zIndex: Math.max(1, 20 - Math.abs(relativeIndex)),
      }
    }

    return {
      index,
      relativeIndex,
      xOffset: relativeIndex * CARD_SPACING_VW + dragVw,
      rotation: effectiveRel * -1.6,
      scale: distance < 0.01 ? 1 : Math.max(0.82, 0.94 - distance * 0.055),
      opacity: distance > 4.5 ? 0 : Math.max(0.18, 0.78 - distance * 0.16),
      zIndex: Math.max(1, 20 - Math.round(distance)),
    }
  })
}

export function VerticalAlbumCarousel() {
  const [activeIndex, setActiveIndex] = useState(3)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [particles, setParticles] = useState<Record<string, HeartParticle[]>>({})
  const isDraggingRef = useRef(false)
  const hasDragged = useRef(false)
  const dragStartX = useRef(0)
  const lastX = useRef(0)
  const lastT = useRef(0)
  const velocity = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const particleId = useRef(0)
  const likesRef = useRef(likes)
  const activeItem = albums[activeIndex]

  const panels = useMemo(
    () => getVisiblePanels(activeIndex, albums.length, dragOffset, isRevealed),
    [activeIndex, dragOffset, isRevealed],
  )

  const goTo = useCallback((index: number) => setActiveIndex(wrapIndex(index, albums.length)), [])
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const scheduleAutoAdvance = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current)
    autoTimer.current = setTimeout(() => next(), 5000)
  }, [next])

  const releaseHeartParticles = useCallback((itemId: string, count: number) => {
    if (count <= 0) return
    const nextParticles = Array.from({ length: count }, (_, index) => {
      const id = particleId.current++
      return {
        id,
        testIndex: id,
        hx: `${(Math.random() - 0.5) * 34}px`,
        hsize: `${22 + Math.floor(Math.random() * 10)}px`,
        hdelay: `${index * 90 + Math.floor(Math.random() * 90)}ms`,
      }
    }) satisfies HeartParticle[]

    setParticles(prev => ({ ...prev, [itemId]: [...(prev[itemId] ?? []), ...nextParticles] }))
    nextParticles.forEach((particle) => {
      setTimeout(() => {
        setParticles(prev => ({
          ...prev,
          [itemId]: (prev[itemId] ?? []).filter(x => x.id !== particle.id),
        }))
      }, 4500)
    })
  }, [])

  const handleLike = useCallback((itemId: string) => {
    scheduleAutoAdvance()
    setLikes(prev => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }))
    releaseHeartParticles(itemId, 1)
  }, [releaseHeartParticles, scheduleAutoAdvance])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsRevealed(true), 150)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    likesRef.current = likes
  }, [likes])

  useEffect(() => {
    if (!isRevealed) return
    const item = albums[activeIndex]
    const likeCount = likesRef.current[item.id] ?? 0
    releaseHeartParticles(item.id, likeCount)
  }, [activeIndex, isRevealed, releaseHeartParticles])

  useEffect(() => {
    if (!isRevealed) return
    scheduleAutoAdvance()
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current)
    }
  }, [activeIndex, isRevealed, scheduleAutoAdvance])

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (isDraggingRef.current) return
    isDraggingRef.current = true
    hasDragged.current = false
    setIsDragging(true)
    dragStartX.current = event.clientX
    lastX.current = event.clientX
    lastT.current = performance.now()
    velocity.current = 0
    if (autoTimer.current) clearTimeout(autoTimer.current)
    sectionRef.current?.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return
    const now = performance.now()
    const dt = now - lastT.current
    if (dt > 0) velocity.current = (event.clientX - lastX.current) / dt
    lastX.current = event.clientX
    lastT.current = now
    const offset = event.clientX - dragStartX.current
    if (Math.abs(offset) > 5) hasDragged.current = true
    setDragOffset(offset)
  }, [])

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setIsDragging(false)
      setDragOffset(0)
      event.currentTarget.releasePointerCapture(event.pointerId)

      const movement = event.clientX - dragStartX.current
      const v = velocity.current
      const VEL = 0.5
      const DIST = 30

      if (Math.abs(movement) > 2) hasDragged.current = true

      const didGoNext = (v < -VEL && movement < 0) || (Math.abs(v) <= VEL && movement < -DIST)
      const didGoPrev = (v > VEL && movement > 0) || (Math.abs(v) <= VEL && movement > DIST)

      if (didGoNext) next()
      else if (didGoPrev) previous()
      else scheduleAutoAdvance()

      setTimeout(() => { hasDragged.current = false }, 0)
    },
    [next, previous, scheduleAutoAdvance],
  )

  const onPointerCancel = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    setDragOffset(0)
    hasDragged.current = false
    event.currentTarget.releasePointerCapture(event.pointerId)
    scheduleAutoAdvance()
  }, [scheduleAutoAdvance])

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      aria-label="Horizontal image carousel"
      className={`vertical-carousel ${isDragging ? 'is-dragging' : ''}`}
      role="region"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onWheel={(event) => {
        if (isDraggingRef.current) return
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
          const likeCount = likes[item.id] ?? 0

          return (
            <div
              key={item.id}
              aria-current={isActive ? 'true' : undefined}
              aria-label={item.title}
              className={`vertical-panel ${isActive ? 'vertical-panel--active' : ''}`}
              role="group"
              onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e) }}
              onClick={() => {
                if (hasDragged.current) return
                if (!isActive) goTo(panel.index)
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isActive) goTo(panel.index)
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
              <div className="heart-area" aria-hidden="false">
                {(particles[item.id] ?? []).map(p => (
                  <span
                    key={p.id}
                    className="heart-particle"
                    data-testid={`floating-heart-${item.title}-${p.testIndex}`}
                    style={{ '--hx': p.hx, '--hsize': p.hsize, '--hdelay': p.hdelay } as React.CSSProperties}
                    aria-hidden="true"
                  >
                    ♡
                  </span>
                ))}
                <button
                  type="button"
                  className={`heart-btn ${likeCount > 0 ? 'heart-btn--liked' : ''}`}
                  aria-label={`${item.title} 좋아요 ${likeCount}개`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); handleLike(item.id) }}
                >
                  <span className="heart-btn__icon" aria-hidden="true">♡</span>
                  {likeCount > 0 && <span className="heart-count" aria-hidden="true">{likeCount}</span>}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="vertical-carousel__ambient" aria-hidden="true" style={{ backgroundImage: activeItem.imageUrl }} />
    </section>
  )
}