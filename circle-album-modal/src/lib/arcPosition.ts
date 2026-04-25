export type ArcLayoutInput = {
  itemCount: number
  activeIndex: number
  dragOffset?: number
  viewportWidth: number
  viewportHeight: number
  angleStepDeg?: number
  radius?: number
  centerYOffset?: number
}

export type ArcCardLayout = {
  index: number
  relativeIndex: number
  angleDeg: number
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  zIndex: number
}

export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

function shortestRelativeIndex(index: number, activeIndex: number, total: number): number {
  const raw = index - activeIndex
  if (total <= 0) return raw
  const half = total / 2
  if (raw > half) return raw - total
  if (raw < -half) return raw + total
  return raw
}

export function calculateArcLayout(input: ArcLayoutInput): ArcCardLayout[] {
  const {
    itemCount,
    activeIndex,
    dragOffset = 0,
    viewportWidth,
    viewportHeight,
    angleStepDeg = viewportWidth < 700 ? 16 : 12,
    radius = viewportWidth < 700 ? 420 : 720,
    centerYOffset = viewportWidth < 700 ? 300 : 520,
  } = input

  const centerX = viewportWidth / 2
  const centerY = viewportHeight + centerYOffset

  return Array.from({ length: itemCount }, (_, index) => {
    const relativeIndex = shortestRelativeIndex(index, activeIndex, itemCount) + dragOffset
    const angleDeg = relativeIndex * angleStepDeg
    const angleRad = (angleDeg * Math.PI) / 180
    const distance = Math.abs(relativeIndex)

    return {
      index,
      relativeIndex,
      angleDeg,
      x: centerX + radius * Math.sin(angleRad),
      y: centerY - radius * Math.cos(angleRad),
      rotation: angleDeg,
      scale: Math.max(0.84, 1.06 - distance * 0.035),
      opacity: Math.max(0.48, 1 - distance * 0.08),
      zIndex: Math.max(1, Math.round(100 - distance * 10)),
    }
  })
}
