import { useCallback, useMemo, useRef, useState } from 'react'
import { calculateArcLayout, wrapIndex } from '../lib/arcPosition'

type UseArcCarouselOptions = {
  itemCount: number
  viewportWidth: number
  viewportHeight: number
}

export function useArcCarousel({ itemCount, viewportWidth, viewportHeight }: UseArcCarouselOptions) {
  const [activeIndex, setActiveIndex] = useState(3)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(wrapIndex(index, itemCount))
      setDragOffset(0)
    },
    [itemCount],
  )

  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  const layout = useMemo(
    () =>
      calculateArcLayout({
        itemCount,
        activeIndex,
        dragOffset,
        viewportWidth,
        viewportHeight,
      }),
    [activeIndex, dragOffset, itemCount, viewportHeight, viewportWidth],
  )

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    dragStartX.current = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!isDragging) return
      const delta = event.clientX - dragStartX.current
      setDragOffset(delta / 170)
    },
    [isDragging],
  )

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!isDragging) return
      setIsDragging(false)
      event.currentTarget.releasePointerCapture(event.pointerId)
      const movement = Math.round(dragOffset)
      goTo(activeIndex - movement)
    },
    [activeIndex, dragOffset, goTo, isDragging],
  )

  const onWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault()
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (Math.abs(delta) < 8) return
      if (delta > 0) next()
      else previous()
    },
    [next, previous],
  )

  return {
    activeIndex,
    dragOffset,
    isDragging,
    layout,
    goTo,
    next,
    previous,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  }
}
